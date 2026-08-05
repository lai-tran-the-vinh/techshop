import type { PaymentInterface, UpdatePaymentInterface } from '@/interfaces/payment.interface';
import axiosInstance from '@/configs/axios.config';

class PaymentServices {
    static create(data: PaymentInterface) {
        return axiosInstance.post(`/api/v1/payment`, data);
    }

    static createPayment(data: PaymentInterface) {
        return axiosInstance.post(`/api/v1/payment/create-payment`, data);
    }

    static handleMoMoRedirect() {
        return axiosInstance.get(`/api/v1/payment/momo/callback`);
    }

    static postNotify(data: PaymentInterface) {
        return axiosInstance.post(`/api/v1/payment/notify`, data);
    }

}

export default PaymentServices;
