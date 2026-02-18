import client from './client'

export interface ExpenseRequest {
  amount: number
  category: string
  paymentMethod: string
  expenseDate: string
  description: string
}

export interface ExpenseResponse {
  id: number
  amount: number
  category: string
  paymentMethod: string
  expenseDate: string
  description: string
  createdAt: string
  updatedAt: string
}

export const expenseAPI = {
  list: (page = 0, size = 10, sortBy = 'expenseDate', direction = 'DESC') =>
    client.get<any>('/expenses', {
      params: { page, size, sortBy, direction }
    }),

  create: (data: ExpenseRequest) =>
    client.post<any>('/expenses', data),

  get: (id: number) =>
    client.get<any>(`/expenses/${id}`),

  update: (id: number, data: ExpenseRequest) =>
    client.put<any>(`/expenses/${id}`, data),

  delete: (id: number) =>
    client.delete<any>(`/expenses/${id}`),

  getByDateRange: (startDate: string, endDate: string) =>
    client.get<any>('/expenses/date-range', {
      params: { startDate, endDate }
    }),

  getByCategory: (category: string) =>
    client.get<any>(`/expenses/category/${category}`),
}
