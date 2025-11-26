import axiosInstance from '../apis';

class PromotionService {
  static getAll(categoryId) {
    return axiosInstance.get('/api/v1/benefits/promotions', {
      params: { categoryId },
    });
  }
}

export default PromotionService;
