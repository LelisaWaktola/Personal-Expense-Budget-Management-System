import client from './client'

export const reportAPI = {
  getMonthly: (month: string) =>
    client.get<any>(`/reports/monthly/${month}`),

  getByCategory: (category: string) =>
    client.get<any>(`/reports/category/${category}`),

  getByDateRange: (startDate: string, endDate: string) =>
    client.get<any>('/reports/date-range', {
      params: { startDate, endDate }
    }),
}
