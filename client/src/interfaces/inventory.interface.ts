// Generated from create-inventory.dto.ts
export interface VariantInterface {
  variantId: string;
  stock: number;
  cost: number;
}
export interface InventoryInterface {
  branch: string;
  product: string;
  variants: VariantInterface[];
}
export interface StockMovementInterface {
  branchId: string; // id chi nhánh
  productId: string; // id sản phẩm
  variants: {
    variantId: string; // id biến thể sản phẩm
    variantColor: string;
    quantity: number; // số lượng tương ứng
    cost?: number; // giá vốn của biến thể (tùy chọn)
  }[]; // danh sách biến thể và số lượng tương ứng
  note?: string; // ghi chú chuyển kho (tùy chọn)
  source?: string;
}
export interface TransferInterface {
  fromBranchId: string; // chi nhánh gửi
  toBranchId: string; // chi nhánh nhận
  items: {
    productId: string; // id sản phẩm
    variantId: string; // id biến thể sản phẩm
    variantColor: string;
    quantity: number; // số lượng chuyển
    unit?: string;
  }[]; // danh sách sản phẩm và số lượng tương ứng
  approvedBy?: string;
  approvedAt?: Date;
  rejectNote?: string;
  status: string;
  note?: string; // ghi chú chuyển kho (tùy chọn)
}

// Generated from update-inventory.dto.ts
export interface UpdateInventoryInterface extends Partial<InventoryInterface> {}
export interface UpdateTransferInterface extends Partial<TransferInterface> {}
