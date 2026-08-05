import type { LocationInterface, BranchInterface, UpdateBranchInterface } from '@/interfaces/branch.interface';
import axiosInstance from '@/configs/axios.config';

class BranchServices {
    static create(data: BranchInterface) {
        return axiosInstance.post(`/api/v1/branchs`, data);
    }

    static findAll() {
        return axiosInstance.get(`/api/v1/branchs`);
    }

    static findOne(id: string) {
        return axiosInstance.get(`/api/v1/branchs/${id}`);
    }

    static findOne1(id: string, data: Partial<BranchInterface>) {
        return axiosInstance.patch(`/api/v1/branchs/${id}`, data);
    }

    static deleteId(id: string) {
        return axiosInstance.delete(`/api/v1/branchs/${id}`);
    }

}

export default BranchServices;
