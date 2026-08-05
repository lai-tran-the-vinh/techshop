import type { ReviewInterface, ReplyInterface, UpdateReviewInterface } from '@/interfaces/review.interface';
import axiosInstance from '@/configs/axios.config';

class ReviewServices {
    static create(data: ReviewInterface) {
        return axiosInstance.post(`/api/v1/review`, data);
    }

    static findByProduct(productId: string) {
        return axiosInstance.get(`/api/v1/review/${productId}`);
    }

    static addReply(data: Partial<ReviewInterface>) {
        return axiosInstance.post(`/api/v1/review/:commentId/reply`, data);
    }

}

export default ReviewServices;
