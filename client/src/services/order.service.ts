import type { CartItemInterface, RecipientInterface, OrderInterface, UpdateOrderInterface } from '@/interfaces/order.interface';
import axiosInstance from '@/configs/axios.config';

class OrderServices {
    static create(data: OrderInterface) {
        return axiosInstance.post(`/api/v1/orders`, data);
    }

    static findAllByStaff() {
        return axiosInstance.get(`/api/v1/orders`);
    }

    static findLatestTrackingForUser() {
        return axiosInstance.get(`/api/v1/orders/tracking/latest`);
    }

    static getOrderTrackingDetails(id: string) {
        return axiosInstance.get(`/api/v1/orders/tracking/${id}`);
    }

    static findAllByCustomer() {
        return axiosInstance.get(`/api/v1/orders/user`);
    }

    static findOne(id: string) {
        return axiosInstance.get(`/api/v1/orders/${id}`);
    }

    static patchId(id: string, data: UpdateOrderInterface) {
        return axiosInstance.patch(`/api/v1/orders/${id}`, data);
    }

    static remove(id: string) {
        return axiosInstance.delete(`/api/v1/orders/${id}`);
    }

    static cancelOrder(id: string, data: Partial<OrderInterface>) {
        return axiosInstance.patch(`/api/v1/orders/cancel/${id}`, data);
    }

    static refundOrder(id: string, data: Partial<OrderInterface>) {
        return axiosInstance.patch(`/api/v1/orders/refund/${id}`, data);
    }

    static requestReturn(id: string, data: Partial<OrderInterface>) {
        return axiosInstance.patch(`/api/v1/orders/request-return/${id}`, data);
    }

    static confirmReturn(id: string, data: Partial<OrderInterface>) {
        return axiosInstance.patch(`/api/v1/orders/confirm-return/${id}`, data);
    }

}

export default OrderServices;
