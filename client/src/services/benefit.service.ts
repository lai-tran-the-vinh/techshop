import type { BenefitInterface, UpdateBenefitInterface } from '@/interfaces/benefit.interface';
import axiosInstance from '@/configs/axios.config';

class BenefitServices {
    static createPromotion(data: BenefitInterface) {
        return axiosInstance.post(`/api/v1/benefits/promotions`, data);
    }

    static getAllPromotions() {
        return axiosInstance.get(`/api/v1/benefits/promotions`);
    }

    static getPromotionById(id: string) {
        return axiosInstance.get(`/api/v1/benefits/promotions/${id}`);
    }

    static updatePromotion(id: string, data: UpdateBenefitInterface) {
        return axiosInstance.patch(`/api/v1/benefits/promotions/${id}`, data);
    }

    static deletePromotion(id: string) {
        return axiosInstance.delete(`/api/v1/benefits/promotions/${id}`);
    }

    static createWarrantyPolicy(data: BenefitInterface) {
        return axiosInstance.post(`/api/v1/benefits/warranties`, data);
    }

    static getAllWarranties() {
        return axiosInstance.get(`/api/v1/benefits/warranties`);
    }

    static getWarrantyById(id: string) {
        return axiosInstance.get(`/api/v1/benefits/warranties/${id}`);
    }

    static updateWarranty(id: string, data: UpdateBenefitInterface) {
        return axiosInstance.patch(`/api/v1/benefits/warranties/${id}`, data);
    }

    static deleteWarranty(id: string) {
        return axiosInstance.delete(`/api/v1/benefits/warranties/${id}`);
    }

}

export default BenefitServices;
