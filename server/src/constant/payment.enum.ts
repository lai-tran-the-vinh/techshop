export enum PaymentMethod {
  CASH = 'cash',
  VNPAY = 'vnpay',
  MOMO = 'momo', // Giữ lại cho các đơn hàng cũ
  BANK_TRANSFER = 'bank_transfer',
}

export enum PaymentStatus {
  PENDING = 'PENDING', // Đang chờ thanh toán
  COMPLETED = 'COMPLETED', // Đã thanh toán
  FAILED = 'FAILED', // Thanh toán thất bại
  CANCELLED = 'CANCELLED', // Đã hủy
  REFUNDED = 'REFUNDED', // Đã hoàn tiền
  EXPIRED = 'EXPIRED', // Hệ thống hủy đơn hàng
}

export enum RefundStatus {
  NONE = 'none',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}
export enum OrderSource {
  ONLINE = 'online',
  POS = 'pos',
}
