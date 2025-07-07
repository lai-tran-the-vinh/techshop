import getAll from './getAll';
import axiosInstance from '@services/apis';

class Categories {
  static getAll = getAll;

  async findOne(id) {
    return await axiosInstance.get(`/api/v1/categories/${id}`);
  }
}

export default Categories;
