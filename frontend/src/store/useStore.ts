import { create } from 'zustand';
import { fundService } from '../services/api';

interface Fund {
  _id: string;
  name: string;
  totalAmount: number;
  usedAmount: number;
  remainingAmount: number;
  date: string;
  note?: string;
}

interface AppState {
  funds: Fund[];
  loading: boolean;
  error: string | null;
  fetchFunds: () => Promise<void>;
  getTotalStats: () => { totalIncome: number; totalExpense: number; currentBalance: number };
}

export const useStore = create<AppState>((set, get) => ({
  funds: [],
  loading: false,
  error: null,

  fetchFunds: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fundService.getFunds();
      set({ funds: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  getTotalStats: () => {
    const funds = get().funds;
    const totalIncome = funds.reduce((acc, fund) => acc + fund.totalAmount, 0);
    const totalExpense = funds.reduce((acc, fund) => acc + fund.usedAmount, 0);
    const currentBalance = totalIncome - totalExpense;
    return { totalIncome, totalExpense, currentBalance };
  },
}));
