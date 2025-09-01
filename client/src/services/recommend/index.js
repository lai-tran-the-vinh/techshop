import axiosInstance from '@services/apis';

class Recomment {
  static getRecommendedProducts = async (id) => {
    const response = await axiosInstance.get(`/api/v1/recommend/${id}`);
    return response.data.data;
  };
  static recordViewHistory = async (data) => {
    const response = await axiosInstance.post(
      `/api/v1/recommend/record-view-history`,
      data,
    );
    return response.data.data;
  };

  static getRecommendationsByUser = async (id) => {
    const response = await axiosInstance.get(
      `/api/v1/recommend/get-by-user/${id}`,
    );
    return response.data.data;
  };

  static getRecommendationsPopular = async () => {
    const response = await axiosInstance.get(
      `/api/v1/recommend/recommendation/get-popular`,
    );
    return response.data.data;
  };

  static getRecommendedProductsIsFeatured = async (id) => {
    const response = await axiosInstance.get(
      `/api/v1/recommend/featured/${id}`,
    );
    return response.data.data;
  };
}

export default Recomment;
