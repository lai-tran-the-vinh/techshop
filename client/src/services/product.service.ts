import type { CommentInterface, ReplyInterface, VariantColorInterface, VariantInterface, ProductInterface, UpdateProductInterface } from '@/interfaces/product.interface';
import axiosInstance from '@/configs/axios.config';

class ProductServices {
    static create(data: CommentInterface) {
        return axiosInstance.post(`/api/v1/products`, data);
    }

    static insertManyProduct(data: CommentInterface) {
        return axiosInstance.post(`/api/v1/products/insert`, data);
    }

    static postImportCsv(data: CommentInterface) {
        return axiosInstance.post(`/api/v1/products/import-csv`, data);
    }

    static findAll() {
        return axiosInstance.get(`/api/v1/products`);
    }

    static findOneById(id: string) {
        return axiosInstance.get(`/api/v1/products/${id}`);
    }

    static autocompleteSearch() {
        return axiosInstance.get(`/api/v1/products/search/autocomplete`);
    }

    static getProductRatingStats(productId: string) {
        return axiosInstance.get(`/api/v1/products/${productId}/rating-stats`);
    }

    static update(id: string, data: UpdateProductInterface) {
        return axiosInstance.patch(`/api/v1/products/${id}`, data);
    }

    static remove(id: string) {
        return axiosInstance.delete(`/api/v1/products/${id}`);
    }

    static countViews(id: string, data: Partial<CommentInterface>) {
        return axiosInstance.patch(`/api/v1/products/${id}/view-count`, data);
    }

    static countOrders(id: string, data: Partial<CommentInterface>) {
        return axiosInstance.patch(`/api/v1/products/${id}/order-count`, data);
    }

}

export default ProductServices;
