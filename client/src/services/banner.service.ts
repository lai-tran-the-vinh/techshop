import type { BannerInterface, UpdateBannerInterface } from '@/interfaces/banner.interface';
import axiosInstance from '@/configs/axios.config';

class BannerServices {
    static create(data: BannerInterface) {
        return axiosInstance.post(`/api/v1/banners`, data);
    }

    static findAll() {
        return axiosInstance.get(`/api/v1/banners`);
    }

    static findOne(id: string) {
        return axiosInstance.get(`/api/v1/banners/${id}`);
    }

    static update(id: string, data: UpdateBannerInterface) {
        return axiosInstance.patch(`/api/v1/banners/${id}`, data);
    }

    static remove(id: string) {
        return axiosInstance.delete(`/api/v1/banners/${id}`);
    }

}

export default BannerServices;
