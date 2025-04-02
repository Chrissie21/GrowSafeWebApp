import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthResponse } from '../models/types';
import * as api from '../services/apiService';

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signup: (username: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  deposit: (amount: number) => Promise<void>;
  withdraw: (amount: number) => Promise<void>;
  invest: (name: string, amount: number, dailyReturnRate: number) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('accessToken'));
  const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem('refreshToken'));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!accessToken && !!user;

  useEffect(() => {
    if (accessToken) checkAuthStatus();
  }, [accessToken]);

  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      const profile = await api.getProfile(accessToken!);
      setUser(profile);
    } catch (e) {
      setAccessToken(null);
      setRefreshToken(null);
      localStorage.clear();
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (username: string, email: string, password: string, confirmPassword: string) => {
    setIsLoading(true);
    try {
      const data = await api.signup(username, email, password, confirmPassword);
      setAccessToken(data.access);
      setRefreshToken(data.refresh);
      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);
      const profile = await api.getProfile(data.access);
      setUser(profile);
    } catch (e: any) {
      setError(e.response?.data?.error ?? 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await api.login(username, password);
      setAccessToken(data.access);
      setRefreshToken(data.refresh);
      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);
      const profile = await api.getProfile(data.access);
      setUser(profile);
    } catch (e: any) {
      setError(e.response?.data?.error ?? 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await api.logout(accessToken!);
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      localStorage.clear();
    } catch (e: any) {
      setError(e.response?.data?.error ?? 'Logout failed');
    } finally {
      setIsLoading(false);
    }
  };

  const deposit = async (amount: number) => {
    setIsLoading(true);
    try {
      await api.deposit(accessToken!, amount);
      const profile = await api.getProfile(accessToken!);
      setUser(profile);
    } catch (e: any) {
      setError(e.response?.data?.error ?? 'Deposit failed');
    } finally {
      setIsLoading(false);
    }
  };

  const withdraw = async (amount: number) => {
    setIsLoading(true);
    try {
      await api.withdraw(accessToken!, amount);
      const profile = await api.getProfile(accessToken!);
      setUser(profile);
    } catch (e: any) {
      setError(e.response?.data?.error ?? 'Withdrawal failed');
    } finally {
      setIsLoading(false);
    }
  };

  const invest = async (name: string, amount: number, dailyReturnRate: number) => {
    setIsLoading(true);
    try {
      await api.invest(accessToken!, name, amount, dailyReturnRate);
      const profile = await api.getProfile(accessToken!);
      setUser(profile);
    } catch (e: any) {
      setError(e.response?.data?.error ?? 'Investment failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, refreshToken, isAuthenticated, isLoading, error, signup, login, logout, deposit, withdraw, invest }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};