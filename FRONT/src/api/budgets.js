import client from './client';
export const budgetAPI = {
    list: () => client.get('/budgets'),
    create: (data) => client.post('/budgets', data),
    get: (id) => client.get(`/budgets/${id}`),
    update: (id, data) => client.put(`/budgets/${id}`, data),
    delete: (id) => client.delete(`/budgets/${id}`),
    getByMonth: (month) => client.get(`/budgets/month/${month}`),
    checkAlerts: (id) => client.post(`/budgets/${id}/check-alerts`),
};
