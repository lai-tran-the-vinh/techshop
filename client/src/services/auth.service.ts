import axiosInstance from '@/configs/axios.config';

class AuthServices {
    static login(data: any) {
        return axiosInstance.post(`/api/v1/auth/login`, data);
    }

    static register(data: any) {
        return axiosInstance.post(`/api/v1/auth/register`, data);
    }

    static googleAuth() {
        return axiosInstance.get(`/api/v1/auth/google`);
    }

    static getGoogleCallback() {
        return axiosInstance.get(`/api/v1/auth/google/callback`);
    }

    static findOneByID() {
        return axiosInstance.get(`/api/v1/auth/account`);
    }

    static handleRefreshToken() {
        return axiosInstance.get(`/api/v1/auth/refresh`);
    }

    static logout() {
        return axiosInstance.get(`/api/v1/auth/logout`);
    }

    static postForgotPassword(data: any) {
        return axiosInstance.post(`/api/v1/auth/forgot-password`, data);
    }

    static resetPassword(data: any) {
        return axiosInstance.post(`/api/v1/auth/reset-password`, data);
    }

    static postResendOtp(data: any) {
        return axiosInstance.post(`/api/v1/auth/resend-otp`, data);
    }

    static verifyOtp(data: any) {
        return axiosInstance.post(`/api/v1/auth/verify-otp`, data);
    }

}

export default AuthServices;
