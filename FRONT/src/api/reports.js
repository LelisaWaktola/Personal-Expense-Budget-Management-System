import client from './client';
export const reportAPI = {
    getMonthly: (month) => client.get(`/reports/monthly/${month}`),
    getByCategory: (category) => client.get(`/reports/category/${category}`),
    getByDateRange: (startDate, endDate) => client.get('/reports/date-range', {
        params: { startDate, endDate }
    }),
};
