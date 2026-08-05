import type { CloundinaryInterface } from '@/interfaces/cloundinary.interface';
import axiosInstance from '@/configs/axios.config';

class CloundinaryServices {
    static postImage(data: CloundinaryInterface) {
        return axiosInstance.post(`/api/v1/upload/image`, data);
    }

    static getImage() {
        return axiosInstance.get(`/api/v1/upload/image`);
    }

    static deleteImage(data?: CloundinaryInterface) {
        return axiosInstance.delete(`/api/v1/upload/image`, { data });
    }

}

export default CloundinaryServices;
