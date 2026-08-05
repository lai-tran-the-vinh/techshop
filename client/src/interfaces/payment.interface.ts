// Generated from create-payment.dto.ts
export interface PaymentInterface {
  order: string;
  amount: number;
  description: string;
}

// Generated from update-payment.dto.ts
export interface UpdatePaymentInterface extends Partial<PaymentInterface> {}
