// Generated from create-cart.dto.ts
export interface CartItemInterface {
  product: string;
  variant: string | string;
  color: string;
  quantity: number;
  price?: number;
  branch: string;
}
export interface CartInterface {
  user: string | string;
  items: CartItemInterface[];
  totalQuantity?: number;
  totalPrice?: number;
}

// Generated from update-cart.dto.ts
export interface UpdateCartInterface extends Partial<CartInterface> {}
