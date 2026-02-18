import client from './client'

export interface AlertResponse {
  id: number
  budgetId: number
  alertType: string
  message: string
  createdAt: string
  acknowledgedAt: string | null
}

export const alertAPI = {
  list: () =>
    client.get<any>('/alerts'),

  getUnacknowledged: () =>
    client.get<any>('/alerts/unacknowledged'),

  acknowledge: (id: number) =>
    client.post<any>(`/alerts/${id}/acknowledge`),

  delete: (id: number) =>
    client.delete<any>(`/alerts/${id}`),
}
