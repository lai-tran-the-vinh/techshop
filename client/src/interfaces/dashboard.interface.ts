export type ProductStats = any;
export type PaymentMethodStats = any;
// Generated from create-dashboard.dto.ts
export interface DashboardStatsInterface {
  date: Date;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  totalRevenue?: number;
  totalProfit: number;
  totalOrders?: number;
  averageOrderValue?: number;
  topSellingProducts?: ProductStats[];
  mostViewedProducts?: ProductStats[];
  totalReturns?: number;
  returnRate?: number;
  paymentMethods?: PaymentMethodStats[];
  branchOverview: any;
}
export interface UpdateDashboardStatsInterface {
  totalRevenue?: number;
  totalOrders?: number;
  totalProfit: number;
  averageOrderValue?: number;
  topSellingProducts?: ProductStats[];
  mostViewedProducts?: ProductStats[];
  lowStockProducts?: ProductStats[];
  totalReturns?: number;
  returnRate?: number;
  paymentMethods?: PaymentMethodStats[];
  branchOverview?: any;
}

// Generated from update-dashboard.dto.ts
export interface UpdateDashboardInterface extends Partial<DashboardStatsInterface> {}
