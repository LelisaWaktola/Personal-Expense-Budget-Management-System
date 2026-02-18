import client from './client';
export const alertAPI = {
    list: () => client.get('/alerts'),
    getUnacknowledged: () => client.get('/alerts/unacknowledged'),
    acknowledge: (id) => client.post(`/alerts/${id}/acknowledge`),
    delete: (id) => client.delete(`/alerts/${id}`),
};
