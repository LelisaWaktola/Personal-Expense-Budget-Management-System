import client from './client';
export const expenseAPI = {
    list: (page = 0, size = 10, sortBy = 'expenseDate', direction = 'DESC') => client.get('/expenses', {
        params: { page, size, sortBy, direction }
    }),
    create: (data) => client.post('/expenses', data),
    get: (id) => client.get(`/expenses/${id}`),
    update: (id, data) => client.put(`/expenses/${id}`, data),
    delete: (id) => client.delete(`/expenses/${id}`),
    getByDateRange: (startDate, endDate) => client.get('/expenses/date-range', {
        params: { startDate, endDate }
    }),
    getByCategory: (category) => client.get(`/expenses/category/${category}`),
};
