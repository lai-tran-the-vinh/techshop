import type { MailInterface } from '@/interfaces/mail.interface';
import axiosInstance from '@/configs/axios.config';

class MailServices {
    static sendResetPasswordEmail(data: MailInterface) {
        return axiosInstance.post(`/api/v1/mail/send`, data);
    }

}

export default MailServices;
