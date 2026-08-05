import type { PermissionInterface, UpdatePermissionInterface } from '@/interfaces/permission.interface';
import axiosInstance from '@/configs/axios.config';

class PermissionServices {
    static create(data: PermissionInterface) {
        return axiosInstance.post(`/api/v1/permissions`, data);
    }

    static findAll() {
        return axiosInstance.get(`/api/v1/permissions`);
    }

    static findOne(id: string) {
        return axiosInstance.get(`/api/v1/permissions/${id}`);
    }

    static patchId(id: string, data: UpdatePermissionInterface) {
        return axiosInstance.patch(`/api/v1/permissions/${id}`, data);
    }

    static deleteId(id: string) {
        return axiosInstance.delete(`/api/v1/permissions/${id}`);
    }

}

export default PermissionServices;
