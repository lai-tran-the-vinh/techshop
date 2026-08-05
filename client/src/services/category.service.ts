import type { CategoryInterface, UpdateCategoryInterface } from '@/interfaces/category.interface';
import axiosInstance from '@/configs/axios.config';

class CategoryServices {
    static create(data: CategoryInterface) {
        return axiosInstance.post(`/api/v1/categories`, data);
    }

    static findAll() {
        return axiosInstance.get(`/api/v1/categories`);
    }

    static findOne(id: string) {
        return axiosInstance.get(`/api/v1/categories/${id}`);
    }

    static update(id: string, data: UpdateCategoryInterface) {
        return axiosInstance.patch(`/api/v1/categories/${id}`, data);
    }

    static remove(id: string) {
        return axiosInstance.delete(`/api/v1/categories/${id}`);
    }

}

export default CategoryServices;
