export interface Investment {
    name: string;
    amount: number;
    dailyReturnRate: number;
  }
  
  export interface User {
    id: string;
    userId: string;
    total: number;
    totalDeposit: number;
    totalWithdraw: number;
    investments: Investment[];
    dailyEarnings: number;
  }
  
  export interface AuthResponse {
    access: string;
    refresh: string;
    message?: string;
  }