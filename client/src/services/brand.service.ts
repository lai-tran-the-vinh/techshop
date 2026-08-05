import type { BrandInterface, UpdateBrandInterface } from '@/interfaces/brand.interface';
import axiosInstance from '@/configs/axios.config';

class BrandServices {
    static create(data: BrandInterface) {
        return axiosInstance.post(`/api/v1/brands`, data);
    }

    static findAll() {
        return axiosInstance.get(`/api/v1/brands`);
    }

    static findOne(id: string) {
        return axiosInstance.get(`/api/v1/brands/${id}`);
    }

    static update(id: string, data: UpdateBrandInterface) {
        return axiosInstance.patch(`/api/v1/brands/${id}`, data);
    }

    static remove(id: string) {
        return axiosInstance.delete(`/api/v1/brands/${id}`);
    }

}

export default BrandServices;
