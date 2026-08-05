import type { RecordInterface } from '@/interfaces/recommendation.interface';
import axiosInstance from '@/configs/axios.config';

class RecommendationServices {
    static getRecommendedProducts(id: string) {
        return axiosInstance.get(`/api/v1/recommend/${id}`);
    }

    static postRecommendRecordViewHistory(data: any) {
        return axiosInstance.post(`/api/v1/recommend/record-view-history`, data);
    }

    static getRecommendationsForUser(userId: string) {
        return axiosInstance.get(`/api/v1/recommend/get-by-user/${userId}`);
    }

    static getPopularProducts() {
        return axiosInstance.get(`/api/v1/recommend/recommendation/get-popular`);
    }

    static getBrandBasedRecommendations() {
        return axiosInstance.get(`/api/v1/recommend/recommendation/get-brand-based`);
    }

    static getCategoryBasedRecommendations(id: string) {
        return axiosInstance.get(`/api/v1/recommend/recommendation/get-category-based/${id}`);
    }

    static get() {
        return axiosInstance.get(`/api/v1`);
    }

}

export default RecommendationServices;
