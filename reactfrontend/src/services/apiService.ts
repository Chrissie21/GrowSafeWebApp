import axios from 'axios';
import { AuthResponse, User } from '../models/types';

const BASE_URL = 'http://127.0.0.1:8000/api/auth';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const signup = async (username: string, email: string, password: string, confirmPassword: string) => {
  const response = await api.post('/signup/', { username, email, password, confirm_password: confirmPassword });
  return response.data as AuthResponse;
};

export const login = async (username: string, password: string) => {
  const response = await api.post('/login/', { username, password });
  return response.data as AuthResponse;
};

export const logout = async (token: string) => {
  const response = await api.post('/logout/', {}, { headers: { Authorization: `Bearer ${token}` } });
  return response.data;
};

export const getProfile = async (token: string) => {
  const response = await api.get('/profile/', { headers: { Authorization: `Bearer ${token}` } });
  const rawData = response.data;
  const parsedData: User = {
    ...rawData,
    total: Number(rawData.total), // Convert to number
    totalDeposit: Number(rawData.totalDeposit),
    totalWithdraw: Number(rawData.totalWithdraw),
    dailyEarnings: Number(rawData.dailyEarnings),
    investments: rawData.investments.map((inv: any) => ({
      ...inv,
      amount: Number(inv.amount),
      dailyReturnRate: Number(inv.dailyReturnRate),
    })),
  };
  return parsedData;
};

export const deposit = async (token: string, amount: number) => {
  const response = await api.post('/deposit/', { amount }, { headers: { Authorization: `Bearer ${token}` } });
  return response.data;
};

export const withdraw = async (token: string, amount: number) => {
  const response = await api.post('/withdraw/', { amount }, { headers: { Authorization: `Bearer ${token}` } });
  return response.data;
};

export const invest = async (token: string, name: string, amount: number, dailyReturnRate: number) => {
  const response = await api.post('/invest/', { name, amount, daily_return_rate: dailyReturnRate }, { headers: { Authorization: `Bearer ${token}` } });
  return response.data;
};

export const refreshToken = async (refresh: string) => {
  const response = await api.post('/token/refresh/', { refresh });
  return response.data as { access: string };
};