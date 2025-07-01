import axiosInstance from '@services/apis';

class CartServices {
  add(items) {
    return axiosInstance.post('/api/v1/carts', { items });
  }
}

export default CartServices;
