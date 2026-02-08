import axios from 'axios';

const API_BASE_URL = 'https://fundflow-bac.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const fundService = {
  getFunds: () => api.get('/funds'),
  getFund: (id: string) => api.get(`/funds/${id}`),
  createFund: (data: { name: string; totalAmount: number; date?: string; note?: string }) => api.post('/funds', data),
  deleteFund: (id: string) => api.delete(`/funds/${id}`),
};

export const expenseService = {
  getExpensesByFund: (fundId: string) => api.get(`/expenses/fund/${fundId}`),
  getExpense: (id: string) => api.get(`/expenses/${id}`),
  addExpense: (data: { amount: number; category: string; fundId: string; date?: string; note?: string }) => api.post('/expenses', data),
  updateExpense: (id: string, data: { amount?: number; category?: string; date?: string; note?: string }) => api.put(`/expenses/${id}`, data),
  deleteExpense: (id: string) => api.delete(`/expenses/${id}`),
};

export const reportService = {
  getMonthlyReport: (year: number, month: number) => api.get('/reports/monthly', { params: { year, month } }),
};

export default api;
