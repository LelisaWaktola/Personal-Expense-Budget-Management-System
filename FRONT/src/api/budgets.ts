import client from './client'

export interface BudgetRequest {
  category: string
  limitAmount: number
  month: string
}

export interface BudgetResponse {
  id: number
  category: string
  limitAmount: number
  spentAmount: number
  remainingAmount: number
  month: string
  createdAt: string
  updatedAt: string
}

export const budgetAPI = {
  list: () =>
    client.get<any>('/budgets'),

  create: (data: BudgetRequest) =>
    client.post<any>('/budgets', data),

  get: (id: number) =>
    client.get<any>(`/budgets/${id}`),

  update: (id: number, data: BudgetRequest) =>
    client.put<any>(`/budgets/${id}`, data),

  delete: (id: number) =>
    client.delete<any>(`/budgets/${id}`),

  getByMonth: (month: string) =>
    client.get<any>(`/budgets/month/${month}`),

  checkAlerts: (id: number) =>
    client.post<any>(`/budgets/${id}/check-alerts`),
}
