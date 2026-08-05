import type { FileInterface } from '@/interfaces/file.interface';
import axiosInstance from '@/configs/axios.config';

class FileServices {
    static deleteDeleteFilename(filename: string) {
        return axiosInstance.delete(`/api/v1/upload/delete/${filename}`);
    }

    static readFile(data: FileInterface) {
        return axiosInstance.post(`/api/v1/upload/excel`, data);
    }

}

export default FileServices;
