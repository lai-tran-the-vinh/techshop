// axiosInstance.js
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // npm install jwt-decode

const ACCESS_TOKEN_KEY = 'access_token';

// Tạo axios instance để dùng chung cho toàn bộ app
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue = [];

// Hàm xử lý hàng đợi request khi refresh token xong
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ✅ GIẢI PHÁP 2: Utility functions để check và refresh token
export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime + 300;
  } catch (error) {
    console.error('Token decode error:', error);
    return true;
  }
};

export const callFreshToken = () => {
  return axiosInstance.get(`/api/v1/auth/refresh`, { _skipAuthRefresh: true });
};

export const refreshAccessToken = async () => {
  try {
    const res = await callFreshToken();
    const newAccessToken = res.data?.data?.access_token;

    if (newAccessToken) {
      localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
      return newAccessToken;
    }
    throw new Error('No access token returned');
  } catch (error) {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    // Redirect to login hoặc dispatch logout action
    window.location.href = '/login';
    throw error;
  }
};

// ✅ GIẢI PHÁP 2: Hàm lấy token hợp lệ (auto refresh nếu cần)
export const getValidToken = async () => {
  let token = localStorage.getItem(ACCESS_TOKEN_KEY);

  if (isTokenExpired(token)) {
    console.log('Token expired or about to expire, refreshing...');
    token = await refreshAccessToken();
  }

  return token;
};

// ✅ REQUEST INTERCEPTOR: Check token trước khi gửi
axiosInstance.interceptors.request.use(
  async (config) => {
    // Skip kiểm tra cho refresh token endpoint
    if (config._skipAuthRefresh) {
      return config;
    }

    try {
      // GIẢI PHÁP 2: Check và refresh token trước khi gửi request
      const token = await getValidToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Failed to get valid token:', error);
      return Promise.reject(error);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ GIẢI PHÁP 1: RESPONSE INTERCEPTOR (xử lý 401)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu server trả về 401 & không phải refresh token endpoint
    if (
      error.response?.status === 401 &&
      !originalRequest._skipAuthRefresh &&
      !originalRequest._retry // Tránh retry vô hạn
    ) {
      originalRequest._retry = true; // Đánh dấu đã retry

      // Nếu đang refresh token -> đưa request vào queue
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const res = await callFreshToken();
        const newAccessToken = res.data?.data?.access_token;

        if (newAccessToken) {
          localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);
          axiosInstance.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

          processQueue(null, newAccessToken);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        processQueue(refreshError, null);

        // Redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const callLogin = async (email, password) => {
  const response = await axiosInstance.post(`/api/v1/auth/login`, {
    username: email,
    password: password,
  });
  return response.data;
};

export const callLogout = () => {
  return axiosInstance.get(`/api/v1/auth/logout`);
};

export const callRegister = async (value) => {
  const response = await axiosInstance.post(`/api/v1/auth/register`, {
    ...value,
  });
  return response.data;
};

export const callFetchAccount = () => {
  return axiosInstance.get(`/api/v1/auth/account`);
};

export const callFetchUsers = () => {
  return axiosInstance.get(`/api/v1/users`);
};
export const callCreateUser = (value) => {
  return axiosInstance.post(`/api/v1/users`, {
    ...value,
  });
};
export const callDeleteUser = (id) => {
  return axiosInstance.delete(`/api/v1/users/${id}`);
};
export const callUpdateUser = (value) => {
  return axiosInstance.patch(`/api/v1/users/${value._id}`, {
    ...value,
  });
};
export const callUpdateRoleUser = (value) => {
  return axiosInstance.patch(`/api/v1/users/${value.userId}`, {
    role: value.roleId,
    branch: value.branchId,
  });
};
export const callCreateProduct = (value) => {
  return axiosInstance.post(`/api/v1/products`, {
    ...value,
  });
};

export const callSearchProduct = (query) => {
  return axiosInstance.get(`/api/v1/products/search?q=${query}`);
};

export const callFetchProducts = (page, limit, category, brand) => {
  const params = { page, limit };
  if (category) {
    params.category = category;
  }
  if (brand) {
    params.brand = brand;
  }
  return axiosInstance.get(`/api/v1/products`, { params });
};

export const callFetchProductDetail = (id) => {
  return axiosInstance.get(`/api/v1/products/${id}`);
};

export const callUpdateProduct = (value) => {
  return axiosInstance.patch(`/api/v1/products/${value._id}`, {
    ...value,
  });
};
export const callDeleteProduct = (id) => {
  return axiosInstance.delete(`/api/v1/products/${id}`);
};
export const callFetchBranches = () => {
  return axiosInstance.get(`/api/v1/branchs`);
};

export const callCreateBranch = (value) => {
  return axiosInstance.post(`/api/v1/branchs`, {
    ...value,
  });
};

export const callDeleteBranch = (id) => {
  return axiosInstance.delete(`/api/v1/branchs/${id}`);
};

export const callUpdateBranch = (value) => {
  return axiosInstance.patch(`/api/v1/branchs/${value._id}`, {
    ...value,
  });
};
export const callFetchInventories = () => {
  return axiosInstance.get(`/api/v1/inventories`);
};

export const callImportInventory = (value) => {
  return axiosInstance.post(`/api/v1/inventories/import`, {
    ...value,
  });
};

export const callExportInventory = (value) => {
  return axiosInstance.post(`/api/v1/inventories/export`, {
    ...value,
  });
};

export const callFetchInboundHistory = () => {
  return axiosInstance.get(`/api/v1/inventories/getImport`);
};

export const callFetchDetailInbound = (id) => {
  return axiosInstance.get(`/api/v1/inventories/getImport/${id}`);
};

export const callFetchOutboundHistory = () => {
  return axiosInstance.get(`/api/v1/inventories/getExport`);
};

export const callFetchDetailOutbound = (id) => {
  return axiosInstance.get(`/api/v1/inventories/getExport/${id}`);
};

export const callTransferInventory = (value) => {
  return axiosInstance.post(`/api/v1/inventories/transfer`, {
    ...value,
  });
};
export const callFetchTransferHistory = () => {
  return axiosInstance.get(`/api/v1/inventories/transfer`);
};
export const callFetchDetailTransfer = (id) => {
  return axiosInstance.get(`/api/v1/inventories/get_transfer/${id}`);
};

export const callFetchCategories = () => {
  return axiosInstance.get(`/api/v1/categories`);
};

export const callCreateCategory = (value) => {
  return axiosInstance.post(`/api/v1/categories`, {
    ...value,
  });
};

export const callUpdateCategory = (value) => {
  return axiosInstance.patch(`/api/v1/categories/${value._id}`, {
    ...value,
  });
};

export const callDeleteCategory = (id) => {
  return axiosInstance.delete(`/api/v1/categories/${id}`);
};

export const callCreateBrand = (value) => {
  return axiosInstance.post(`/api/v1/brands`, {
    ...value,
  });
};

export const callUpdateBrand = (value) => {
  return axiosInstance.patch(`/api/v1/brands/${value._id}`, {
    ...value,
  });
};

export const callDeleteBrand = (id) => {
  return axiosInstance.delete(`/api/v1/brands/${id}`);
};

export const callFetchBrands = () => {
  return axiosInstance.get(`/api/v1/brands`);
};

export const callFetchOrders = () => {
  return axiosInstance.get(`/api/v1/orders`);
};
export const callFetchOrderByUserId = (userId) => {
  return axiosInstance.get(`/api/v1/orders/user/${userId}`);
};
export const callCreateOrder = (value) => {
  return axiosInstance.post(`/api/v1/orders`, {
    ...value,
  });
};

export const callUpdateOrder = (id, value) => {
  return axiosInstance.patch(`/api/v1/orders/${id}`, {
    ...value,
  });
};

export const callDeleteOrder = (id) => {
  return axiosInstance.delete(`/api/v1/orders/${id}`);
};

export const callFetchCart = () => {
  return axiosInstance.get(`/api/v1/carts`);
};

export const callCreateCart = (value) => {
  return axiosInstance.post(`/api/v1/carts`, {
    products: [
      {
        productId: value.productId,
        variant: value.variant,
        quantity: value.quantity,
      },
    ],
  });
};

export const callUpdateCart = (id, products) => {
  return axiosInstance.patch(`/api/v1/carts/${id}`, {
    ...products,
  });
};

export const callDeleteCart = (id) => {
  return axiosInstance.delete(`/api/v1/carts/${id}`);
};

export const callFetchRoles = () => {
  return axiosInstance.get(`/api/v1/roles`);
};
export const callCreateRole = (value) => {
  return axiosInstance.post(`/api/v1/roles`, {
    ...value,
  });
};

export const callUpdateRole = (value) => {
  return axiosInstance.patch(`/api/v1/roles/${value._id}`, {
    ...value,
  });
};
export const callDeleteRole = (id) => {
  return axiosInstance.delete(`/api/v1/roles/${id}`);
};
export const callCreatePermission = (value) => {
  return axiosInstance.post(`/api/v1/permissions`, {
    ...value,
  });
};
export const callUpdatePermission = (value) => {
  return axiosInstance.patch(`/api/v1/permissions/${value._id}`, {
    ...value,
  });
};
export const callDeletePermission = (id) => {
  return axiosInstance.delete(`/api/v1/permissions/${id}`);
};
export const callFetchPermission = () => {
  return axiosInstance.get(`/api/v1/permissions`);
};

export const callFetchBanners = () => {
  return axiosInstance.get(`/api/v1/banners`);
};
export const callCreateBanners = (value) => {
  return axiosInstance.post(`/api/v1/banners`, {
    ...value,
  });
};
export const callUpdateBanners = (value) => {
  return axiosInstance.patch(`/api/v1/banners/${value._id}`, {
    ...value,
  });
};
export const callDeleteBanners = (id) => {
  return axiosInstance.delete(`/api/v1/banners/${id}`);
};

export const callUploadSingleImage = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axiosInstance.post(`/api/v1/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const callDeleteFile = (url) => {
  return axiosInstance.delete(`/api/v1/upload/image`, {
    params: { url },
  });
};

export const callCreateReview = (value) => {
  return axiosInstance.post(`api/v1/review`, {
    ...value,
  });
};
export const callFetchReviewByProduct = (id, page, limit) => {
  const params = { page, limit };

  return axiosInstance.get(`api/v1/review/${id}`, { params });
};
export const callFetchStats = (id) => {
  return axiosInstance.get(`api/v1/products/${id}/rating-stats`);
};

export const callReplyReview = (commentId, replyData) => {
  return axiosInstance.post(`/api/v1/review/${commentId}/reply`, replyData);
};

export default axiosInstance;
