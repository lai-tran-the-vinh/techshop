import axiosInstance from '@services/apis';

class BranchService {
  getAll() {
    return axiosInstance.get('api/v1/branchs');
  }
}

export default BranchService;
