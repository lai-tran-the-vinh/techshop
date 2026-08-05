import type { ChangePasswordInterface, UserInterface, AddressInterface, RegisterUserInterface, LoginInterface, UpdateUserInterface, VerifyOtpInterface } from '@/interfaces/user.interface';
import axiosInstance from '@/configs/axios.config';

class UserServices {
    static findOne(data: Partial<UserInterface>) {
        return axiosInstance.post(`/api/v1/users`, data);
    }

    static findAll() {
        return axiosInstance.get(`/api/v1/users`);
    }

    static findAllUserHasPermission() {
        return axiosInstance.get(`/api/v1/users/get/all-users-has-permission`);
    }

    static findOne1(id: string) {
        return axiosInstance.get(`/api/v1/users/${id}`);
    }

    static changePassword(data: Partial<UserInterface>) {
        return axiosInstance.patch(`/api/v1/users/change-password`, data);
    }

    static update(id: string, data: UpdateUserInterface) {
        return axiosInstance.patch(`/api/v1/users/${id}`, data);
    }

    static updateRole(id: string, data: UpdateUserInterface) {
        return axiosInstance.patch(`/api/v1/users/update-role/${id}`, data);
    }

    static remove(id: string) {
        return axiosInstance.delete(`/api/v1/users/${id}`);
    }

}

export default UserServices;
