import type { RoleInterface, UpdateRoleInterface } from '@/interfaces/role.interface';
import axiosInstance from '@/configs/axios.config';

class RoleServices {
    static create(data: RoleInterface) {
        return axiosInstance.post(`/api/v1/roles`, data);
    }

    static findAll() {
        return axiosInstance.get(`/api/v1/roles`);
    }

    static findOne(id: string) {
        return axiosInstance.get(`/api/v1/roles/${id}`);
    }

    static patchId(id: string, data: UpdateRoleInterface) {
        return axiosInstance.patch(`/api/v1/roles/${id}`, data);
    }

    static remove(id: string) {
        return axiosInstance.delete(`/api/v1/roles/${id}`);
    }

}

export default RoleServices;
