import axiosInstance from '../apis';

class WarrantyService {
  static getAll(categoryId) {
    return axiosInstance.get('/api/v1/benefits/warranties', {
      params: { categoryId },
    });
  }
}

export default WarrantyService;
