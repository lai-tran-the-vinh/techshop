import axiosInstance from '../apis';

class InventoryService {
  getAll() {
    return axiosInstance.get('/api/v1/inventories');
  }
}

export default InventoryService;
