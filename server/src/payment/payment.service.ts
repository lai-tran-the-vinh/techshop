import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as querystring from 'querystring';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Payment, PaymentDocument } from './schemas/payment.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/user/interface/user.interface';
import { PaymentMethod, PaymentStatus } from 'src/constant/payment.enum';
import { Order, OrderDocument } from 'src/order/schemas/order.schema';
import { OrderService } from 'src/order/order.service';

@Injectable()
export class PaymentService {
  private readonly vnp_TmnCode = process.env.VNPAY_TMN_CODE || 'MOCK_TMN_CODE';
  private readonly vnp_HashSecret = process.env.VNPAY_HASH_SECRET || 'MOCK_HASH_SECRET';
  private readonly vnp_Url = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
  private readonly vnp_ReturnUrl = 'http://localhost:8080/api/v1/payment/vnpay/callback';

  constructor(
    @InjectModel(Payment.name)
    private readonly paymentModel: SoftDeleteModel<PaymentDocument>,
    @InjectModel(Order.name)
    private readonly orderModel: SoftDeleteModel<OrderDocument>,
    private readonly orderService: OrderService,
  ) {}

  private formatVNPayDate(date: Date): string {
    const pad = (n: number) => (n < 10 ? `0${n}` : n.toString());
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hour = pad(date.getHours());
    const minute = pad(date.getMinutes());
    const second = pad(date.getSeconds());
    return `${year}${month}${day}${hour}${minute}${second}`;
  }

  private sortObject(obj: any) {
    let sorted: any = {};
    let str = [];
    let key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
      }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
    }
    return sorted;
  }

  async createPayment(dto: CreatePaymentDto, user: IUser) {
    if (!dto.amount || dto.amount <= 0) {
      throw new Error('Invalid amount');
    }
    if (!dto.order) {
      throw new Error('Order ID is required');
    }

    const existingOrder = await this.orderModel.findById(dto.order);
    if (!existingOrder) throw new Error('Order not found');

    let existingPayment = await this.paymentModel.findOne({
      user: user._id,
      order: dto.order,
    });

    if (!existingPayment) {
      existingPayment = await this.paymentModel.create({
        user: user._id,
        order: dto.order,
        amount: dto.amount,
        payType: PaymentMethod.VNPAY, // Mongoose schema may use payType
        status: PaymentStatus.PENDING,
      });
    }

    if (existingPayment.status === PaymentStatus.COMPLETED) {
      return {
        resultCode: 9001,
        message: 'Đơn hàng đã thanh toán trước đó',
      };
    }

    if (existingPayment.payUrl) {
      const now = new Date();
      const diffMinutes = (now.getTime() - new Date(existingPayment.updatedAt).getTime()) / (1000 * 60);
      if (diffMinutes < 15) {
        return {
          resultCode: 9000,
          message: 'Payment đã được tạo trước đó',
          payUrl: existingPayment.payUrl,
        };
      }
    }

    const ipAddr = '127.0.0.1'; // Mock IP
    const createDate = new Date();
    const expireDate = new Date(createDate.getTime() + 15 * 60000);
    
    const vnp_CreateDate = this.formatVNPayDate(createDate);
    const vnp_ExpireDate = this.formatVNPayDate(expireDate);

    const orderId = `${dto.order}-${createDate.getTime()}`;
    const amount = dto.amount * 100;
    const orderInfo = `Thanh toan don hang ${dto.order}`;

    let vnp_Params: any = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: this.vnp_TmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: 'other',
      vnp_Amount: amount,
      vnp_ReturnUrl: this.vnp_ReturnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: vnp_CreateDate,
      vnp_ExpireDate: vnp_ExpireDate
    };

    vnp_Params = this.sortObject(vnp_Params);

    const signData = querystring.stringify(vnp_Params, '&', '=', { encodeURIComponent: (str) => str });
    const hmac = crypto.createHmac('sha512', this.vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    
    vnp_Params['vnp_SecureHash'] = signed;
    const payUrl = this.vnp_Url + '?' + querystring.stringify(vnp_Params, '&', '=', { encodeURIComponent: (str) => str });

    await this.paymentModel.findByIdAndUpdate(existingPayment._id, {
      vnpayTxnRef: orderId,
      payUrl: payUrl,
      updatedAt: new Date(),
    });

    return { payUrl };
  }

  async handleVNPayRedirect(query: any) {
    try {
      let vnp_Params = { ...query };
      const secureHash = vnp_Params['vnp_SecureHash'];

      delete vnp_Params['vnp_SecureHash'];
      delete vnp_Params['vnp_SecureHashType'];

      vnp_Params = this.sortObject(vnp_Params);

      const signData = querystring.stringify(vnp_Params, '&', '=', { encodeURIComponent: (str) => str });
      const hmac = crypto.createHmac('sha512', this.vnp_HashSecret);
      const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

      const isSuccess = secureHash === signed && vnp_Params['vnp_ResponseCode'] === '00';

      const payment = await this.paymentModel.findOne({
        vnpayTxnRef: vnp_Params['vnp_TxnRef'],
      });

      if (!payment) {
        const baseOrderId = vnp_Params['vnp_TxnRef'].split('-')[0];
        const fallbackPayment = await this.paymentModel.findOne({ order: baseOrderId });
        if (!fallbackPayment) throw new Error('Không tìm thấy giao dịch tương ứng');
        return this.processPaymentResult(fallbackPayment, isSuccess, vnp_Params);
      }

      if (payment.status === PaymentStatus.COMPLETED) {
        return { success: true, message: 'Giao dịch đã hoàn tất trước đó' };
      }

      return this.processPaymentResult(payment, isSuccess, vnp_Params);
    } catch (error) {
      console.error('VNPay Redirect Error:', error);
      return { success: false, message: (error as Error).message || 'Lỗi xử lý redirect VNPay' };
    }
  }

  private async processPaymentResult(payment: any, isSuccess: boolean, query: any) {
    try {
      if (isSuccess) {
        await this.paymentModel.findByIdAndUpdate(payment._id, {
          status: PaymentStatus.COMPLETED,
          completedAt: new Date(),
          vnpayTransactionNo: query.vnp_TransactionNo,
          redirectData: query,
        });

        const order = await this.orderModel.findById(payment.order);
        await this.orderService.update(
          payment.order,
          { paymentStatus: PaymentStatus.COMPLETED },
          order.user,
        );

        return { success: true, message: 'Thanh toán thành công' };
      } else {
        await this.paymentModel.findByIdAndUpdate(payment._id, {
          status: PaymentStatus.FAILED,
          failedAt: new Date(),
          failureReason: 'Thanh toán thất bại',
          redirectData: query,
        });
        return { success: false, message: 'Thanh toán thất bại' };
      }
    } catch (error) {
      console.error('Process payment result error:', error);
      throw new Error('Lỗi khi xử lý kết quả thanh toán');
    }
  }

  create(createPaymentDto: CreatePaymentDto) {
    return this.paymentModel.create(createPaymentDto);
  }

  async findAll() {
    return this.paymentModel.find().populate('user').populate('order');
  }

  async findOne(id: string) {
    return this.paymentModel.findById(id).exec();
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto) {
    return this.paymentModel.findByIdAndUpdate(id, updatePaymentDto, { new: true }).exec();
  }

  async remove(id: string) {
    return this.paymentModel.softDelete({ _id: id });
  }
}
