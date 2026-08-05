// Generated from create-order.dto.ts
export interface CartItemInterface {
  product?: string;
  quantity?: number;
  branch?: string;
  price?: number;
  variant?: string;
}
export interface RecipientInterface {
  name: string;
  phone: string;
  address: string;
  note?: string;
}
export interface OrderInterface {
  user?: string;
  recipient: RecipientInterface;
  buyer?: RecipientInterface;
  items?: CartItemInterface[];
  totalPrice?: number;
  branch?: string[];
  status?: string;
  source?: string;
  paymentStatus: string;
  payment: string;
  isReturn: boolean;
  returnStatus?: string;
  returnProcessedBy?: any;
  returnReason?: string;
  paymentMethod: string;
  phone: string;
}

// Generated from update-order.dto.ts
export interface UpdateOrderInterface extends Partial<OrderInterface> {}
