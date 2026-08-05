import type { VariantInterface, InventoryInterface, StockMovementInterface, TransferInterface, UpdateInventoryInterface, UpdateTransferInterface } from '@/interfaces/inventory.interface';
import axiosInstance from '@/configs/axios.config';

class InventoryServices {
    static create(data: InventoryInterface) {
        return axiosInstance.post(`/api/v1/inventories`, data);
    }

    static findAll() {
        return axiosInstance.get(`/api/v1/inventories`);
    }

    static findOne() {
        return axiosInstance.get(`/api/v1/inventories/check-stock`);
    }

    static update(id: string, data: UpdateInventoryInterface) {
        return axiosInstance.patch(`/api/v1/inventories/${id}`, data);
    }

    static remove(id: string) {
        return axiosInstance.delete(`/api/v1/inventories/${id}`);
    }

    static importStock(data: Partial<InventoryInterface>) {
        return axiosInstance.post(`/api/v1/inventories/import`, data);
    }

    static findImport() {
        return axiosInstance.get(`/api/v1/inventories/getimport`);
    }

    static getImportDetail(id: string) {
        return axiosInstance.get(`/api/v1/inventories/getimport/${id}`);
    }

    static findExport() {
        return axiosInstance.get(`/api/v1/inventories/getexport`);
    }

    static getExportDetail(id: string) {
        return axiosInstance.get(`/api/v1/inventories/getexport/${id}`);
    }

    static postExport(data: InventoryInterface) {
        return axiosInstance.post(`/api/v1/inventories/export`, data);
    }

    static getAllTransfer() {
        return axiosInstance.get(`/api/v1/inventories/transfer`);
    }

    static transferStock(data: Partial<InventoryInterface>) {
        return axiosInstance.post(`/api/v1/inventories/transfer`, data);
    }

    static getTransferDetail(id: string) {
        return axiosInstance.get(`/api/v1/inventories/get_transfer/${id}`);
    }

    static updateTransfer(id: string, data: UpdateInventoryInterface) {
        return axiosInstance.patch(`/api/v1/inventories/transfer/${id}`, data);
    }

}

export default InventoryServices;
