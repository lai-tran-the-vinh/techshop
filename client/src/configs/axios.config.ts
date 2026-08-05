// @ts-nocheck
// axiosInstance.js
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // npm install jwt-decode

const ACCESS_TOKEN_KEY = 'access_token';

// Tạo axios instance để dùng chung cho toàn bộ app
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL, // URL gốc của server
  withCredentials: true, // Cho phép gửi cookie trong request
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false; // Tránh gọi refresh token nhiều lần cùng lúc
let failedQueue: Array<{resolve: Function, reject: Function}> = []; // Hàng đợi chứa các request bị treo khi token hết hạn

// Hàm xử lý hàng đợi request khi refresh token xong
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error); // Nếu refresh thất bại → trả lỗi cho request trong queue
    } else {
      prom.resolve(token); // Nếu refresh thành công → cung cấp token mới
    }
  });
  failedQueue = []; // Xóa queue sau khi xử lý
};
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export const callFreshToken = () => {
  return axiosInstance.get(`/api/v1/auth/refresh`, { _skipAuthRefresh: true });
};

//Thêm interceptor cho RESPONSE (xử lý lỗi sau khi nhận response)
axiosInstance.interceptors.response.use(
  (response) => response, // Nếu response OK → trả về luôn
  async (error) => {
    const originalRequest = error.config; // Lưu lại request gốc bị lỗi

    //Nếu server trả về 401 (Unauthorized) & request này không phải refresh token
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._skipAuthRefresh
    ) {
      // Nếu đang refresh token -> đưa request này vào hàng đợi chờ
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject }); // Lưu request bị lỗi để xử lý sau
        })
          .then((token) => {
            // Khi refresh xong, gắn token mới vào request và gọi lại
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }
      // Nếu chưa refresh token → tiến hành refresh
      isRefreshing = true;

      try {
        const res = await callFreshToken();
        const newAccessToken = res.data?.data?.access_token;

        if (newAccessToken) {
          localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);

          // Cập nhật Authorization cho axios instance
          axiosInstance.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

          // Xử lý tất cả request đang chờ trong hàng đợi
          processQueue(null, newAccessToken);

          // Gắn token mới vào request cũ và gửi lại
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token thất bại -> Xóa token và đưa user về chủ
        localStorage.removeItem(ACCESS_TOKEN_KEY);

        processQueue(refreshError, null); // Thông báo lỗi cho tất cả request đang chờ
        return Promise.reject(refreshError);
      } finally {
        // Dù thành công hay thất bại → đánh dấu đã refresh xong
        isRefreshing = false;
      }
    }

    // Nếu lỗi khác 401 → trả lỗi về cho client xử lý
    return Promise.reject(error);
  },
);


export default axiosInstance;
