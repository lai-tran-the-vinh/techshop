import type { CartItemInterface } from '@/interfaces/cart.interface';
import axiosInstance from '@/configs/axios.config';

class CartServices {
    add(items: CartItemInterface[]) {
        return axiosInstance.post('/api/v1/carts', { items });
    }

    static get() {
        return axiosInstance.get('/api/v1/carts');
    }

    delete(id: string) {
        return axiosInstance.delete(`/api/v1/carts/remove-all?id=${id}`);
    }

    static update(id: string, cartItems: CartItemInterface[]) {
        return axiosInstance.patch(`/api/v1/carts/${id}`, { items: cartItems });
    }

    deleteOne(productId: string, variantId: string) {
        return axiosInstance.delete(`/api/v1/carts/remove-item`, {
            data: {
                productId,
                variantId,
            },
        });
    }
}

export default CartServices;
