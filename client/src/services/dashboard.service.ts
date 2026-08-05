import type { DashboardStatsInterface, UpdateDashboardStatsInterface, UpdateDashboardInterface } from '@/interfaces/dashboard.interface';
import axiosInstance from '@/configs/axios.config';

class DashboardServices {
    static getStats(period: string) {
        return axiosInstance.get(`/api/v1/dashboard/stats/${period}`);
    }

    static getCurrentStats(period: string) {
        return axiosInstance.get(`/api/v1/dashboard/stats/${period}/current`);
    }

    static getBranchStats(period: string) {
        return axiosInstance.get(`/api/v1/dashboard/branches/stats/${period}`);
    }

    static getHistoricalStats(period: string) {
        return axiosInstance.get(`/api/v1/dashboard/stats/${period}/historical`);
    }

    static getStatsComparison(period: string) {
        return axiosInstance.get(`/api/v1/dashboard/stats/${period}/comparison`);
    }

    static getTopSellingProducts() {
        return axiosInstance.get(`/api/v1/dashboard/products/top-selling`);
    }

    static getMostViewedProducts() {
        return axiosInstance.get(`/api/v1/dashboard/products/most-viewed`);
    }

    static getPaymentMethodStats() {
        return axiosInstance.get(`/api/v1/dashboard/payment-methods`);
    }

    static getDashboardOverview() {
        return axiosInstance.get(`/api/v1/dashboard/overview`);
    }

    static updateDailyStats(data: UpdateDashboardStatsInterface) {
        return axiosInstance.post(`/api/v1/dashboard/update/daily`, data);
    }

    static updateWeeklyStats(data: UpdateDashboardStatsInterface) {
        return axiosInstance.post(`/api/v1/dashboard/update/weekly`, data);
    }

    static updateMonthlyStats(data: UpdateDashboardStatsInterface) {
        return axiosInstance.post(`/api/v1/dashboard/update/monthly`, data);
    }

    static updateYearlyStats(data: UpdateDashboardStatsInterface) {
        return axiosInstance.post(`/api/v1/dashboard/update/yearly`, data);
    }

    static updateAllStats(data: UpdateDashboardStatsInterface) {
        return axiosInstance.post(`/api/v1/dashboard/update/all`, data);
    }

    static getCustomRangeStats() {
        return axiosInstance.get(`/api/v1/dashboard/stats/custom-range`);
    }

    static healthCheck() {
        return axiosInstance.get(`/api/v1/dashboard/health`);
    }

}

export default DashboardServices;
