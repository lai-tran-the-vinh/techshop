import type { TfidfModeInterface, UpdateTfidfModeInterface } from '@/interfaces/tfidf-mode.interface';
import axiosInstance from '@/configs/axios.config';

class TfidfModeServices {
    static create(data: TfidfModeInterface) {
        return axiosInstance.post(`/tfidf-mode`, data);
    }

    static findAll() {
        return axiosInstance.get(`/tfidf-mode`);
    }

    static findOne(id: string) {
        return axiosInstance.get(`/tfidf-mode/${id}`);
    }

    static update(id: string, data: UpdateTfidfModeInterface) {
        return axiosInstance.patch(`/tfidf-mode/${id}`, data);
    }

    static remove(id: string) {
        return axiosInstance.delete(`/tfidf-mode/${id}`);
    }

}

export default TfidfModeServices;
