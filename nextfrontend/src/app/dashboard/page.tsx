"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import { useRouter, usePathname } from "next/navigation";
import api from "../../lib/api";
import { AxiosError } from "axios";
import { motion, AnimatePresence } from "framer-motion";

interface ApiErrorResponse {
  error?: string;
}

const Dashboard = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [depositError, setDepositError] = useState<string | null>(null);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false); // State for withdraw modal
  const [withdrawAmount, setWithdrawAmount] = useState(""); // State for withdraw input
  const [withdrawError, setWithdrawError] = useState<string | null>(null); // State for withdraw error

  const [userData, setUserData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    accountBalance: number;
    investmentsValue: number;
    availableCash: number;
    mobile_number?: string;
  }>({
    firstName: "",
    lastName: "",
    email: "",
    accountBalance: 0,
    investmentsValue: 0,
    availableCash: 0,
    mobile_number: "",
  });

  const [portfolioData, setPortfolioData] = useState<
    {
      id: number;
      name: string;
      allocation: number;
      value: number;
      change: number;
    }[]
  >([]);
  const [recentTransactions, setRecentTransactions] = useState<
    {
      id: number;
      date: string;
      type: string;
      investment: string;
      amount: number;
      status: string;
    }[]
  >([]);
  const [marketNews, setMarketNews] = useState<
    { id: number; title: string; date: string; source: string }[]
  >([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get("profile/");
        const data = response.data;

        setUserData({
          firstName: data.first_name || data.username,
          lastName: data.last_name || "",
          email: data.email,
          accountBalance: parseFloat(data.total) || 0,
          investmentsValue:
            data.investments.reduce(
              (sum: number, inv: { amount: string }) =>
                sum + parseFloat(inv.amount),
              0,
            ) || 0,
          availableCash: parseFloat(data.total) || 0,
          mobile_number: data.mobile_number || "",
        });

        setPortfolioData(
          data.investments.map(
            (
              inv: { name: string; amount: string; daily_return_rate: string },
              index: number,
            ) => ({
              id: index + 1,
              name: inv.name,
              allocation: calculateAllocation(inv.amount, data.investments),
              value: parseFloat(inv.amount),
              change: parseFloat(inv.daily_return_rate) * 100,
            }),
          ),
        );

        setRecentTransactions(
          data.transactions.map(
            (
              tx: {
                type: string;
                amount: string;
                status: string;
                created_at: string;
                notes: string;
              },
              index: number,
            ) => ({
              id: index + 1,
              date: new Date(tx.created_at).toISOString().split("T")[0],
              type: tx.type,
              investment: tx.notes || "Cash",
              amount: parseFloat(tx.amount),
              status: tx.status,
            }),
          ),
        );

        setMarketNews([
          {
            id: 1,
            title: "New Solar Technology Boosts Efficiency by 30%",
            date: "2025-04-05",
            source: "Green Energy Today",
          },
          {
            id: 2,
            title: "Sustainable Investment Funds See Record Inflows",
            date: "2025-04-03",
            source: "Financial Times",
          },
          {
            id: 3,
            title: "Carbon Credit Markets Expand in Southeast Asia",
            date: "2025-04-02",
            source: "Climate Economics",
          },
          {
            id: 4,
            title: "Water Conservation Startups Attract Major Funding",
            date: "2025-03-30",
            source: "Tech Investor Weekly",
          },
        ]);

        setLoading(false);
      } catch (err: unknown) {
        setError("Failed to load data. Please try again.");
        setLoading(false);
        if ((err as AxiosError).response?.status === 401) {
          router.push("/auth/login");
        }
      }
    };

    fetchData();
  }, [router]);

  const calculateAllocation = (
    amount: string,
    investments: { amount: string }[],
  ) => {
    const total = investments.reduce(
      (sum, inv) => sum + parseFloat(inv.amount),
      0,
    );
    return total > 0 ? ((parseFloat(amount) / total) * 100).toFixed(0) : 0;
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("logout/", {
        refresh:
          localStorage.getItem("refresh_token") ||
          sessionStorage.getItem("refresh_token"),
      });
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      sessionStorage.removeItem("access_token");
      sessionStorage.removeItem("refresh_token");
      router.push("/auth/login");
    } catch (err) {
      console.error("Logout failed:", err);
      router.push("/auth/login");
    }
  };

  const handleDeposit = async () => {
    if (
      !depositAmount ||
      isNaN(Number(depositAmount)) ||
      Number(depositAmount) <= 0
    ) {
      setDepositError("Please enter a valid amount");
      return;
    }

    try {
      const response = await api.post("deposit/", {
        amount: depositAmount,
        mobile_number: userData.mobile_number || "1234567890",
      });
      alert(`Deposit request submitted: ${response.data.message}`);
      setIsDepositModalOpen(false);
      setDepositAmount("");
      setDepositError(null);

      // Refresh data
      const profileResponse = await api.get("profile/");
      const data = profileResponse.data;
      setUserData({
        firstName: data.first_name || data.username,
        lastName: data.last_name || "",
        email: data.email,
        accountBalance: parseFloat(data.total) || 0,
        investmentsValue:
          data.investments.reduce(
            (sum: number, inv: { amount: string }) =>
              sum + parseFloat(inv.amount),
            0,
          ) || 0,
        availableCash: parseFloat(data.total) || 0,
        mobile_number: data.mobile_number || "",
      });
      setPortfolioData(
        data.investments.map(
          (
            inv: { name: string; amount: string; daily_return_rate: string },
            index: number,
          ) => ({
            id: index + 1,
            name: inv.name,
            allocation: calculateAllocation(inv.amount, data.investments),
            value: parseFloat(inv.amount),
            change: parseFloat(inv.daily_return_rate) * 100,
          }),
        ),
      );
      setRecentTransactions(
        data.transactions.map(
          (
            tx: {
              type: string;
              amount: string;
              status: string;
              created_at: string;
              notes: string;
            },
            index: number,
          ) => ({
            id: index + 1,
            date: new Date(tx.created_at).toISOString().split("T")[0],
            type: tx.type,
            investment: tx.notes || "Cash",
            amount: parseFloat(tx.amount),
            status: tx.status,
          }),
        ),
      );
    } catch (err: unknown) {
      setDepositError(
        (err as AxiosError<ApiErrorResponse>).response?.data?.error ||
          "Deposit failed",
      );
    }
  };

  const handleWithdraw = async () => {
    const amount = Number(withdrawAmount);
    if (
      !withdrawAmount ||
      isNaN(amount) ||
      amount <= 0 ||
      amount > userData.availableCash
    ) {
      setWithdrawError(
        amount > userData.availableCash
          ? "Amount exceeds available cash"
          : "Please enter a valid amount",
      );
      return;
    }

    try {
      const response = await api.post("withdraw/", {
        amount: withdrawAmount,
        mobile_number: userData.mobile_number || "1234567890",
      });
      alert(`Withdrawal request submitted: ${response.data.message}`);
      setIsWithdrawModalOpen(false);
      setWithdrawAmount("");
      setWithdrawError(null);

      // Refresh data
      const profileResponse = await api.get("profile/");
      const data = profileResponse.data;
      setUserData({
        firstName: data.first_name || data.username,
        lastName: data.last_name || "",
        email: data.email,
        accountBalance: parseFloat(data.total) || 0,
        investmentsValue:
          data.investments.reduce(
            (sum: number, inv: { amount: string }) =>
              sum + parseFloat(inv.amount),
            0,
          ) || 0,
        availableCash: parseFloat(data.total) || 0,
        mobile_number: data.mobile_number || "",
      });
      setPortfolioData(
        data.investments.map(
          (
            inv: { name: string; amount: string; daily_return_rate: string },
            index: number,
          ) => ({
            id: index + 1,
            name: inv.name,
            allocation: calculateAllocation(inv.amount, data.investments),
            value: parseFloat(inv.amount),
            change: parseFloat(inv.daily_return_rate) * 100,
          }),
        ),
      );
      setRecentTransactions(
        data.transactions.map(
          (
            tx: {
              type: string;
              amount: string;
              status: string;
              created_at: string;
              notes: string;
            },
            index: number,
          ) => ({
            id: index + 1,
            date: new Date(tx.created_at).toISOString().split("T")[0],
            type: tx.type,
            investment: tx.notes || "Cash",
            amount: parseFloat(tx.amount),
            status: tx.status,
          }),
        ),
      );
    } catch (err: unknown) {
      setWithdrawError(
        (err as AxiosError<ApiErrorResponse>).response?.data?.error ||
          "Withdrawal failed",
      );
    }
  };

  const navLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Investments", path: "/investments" },
    { name: "Account", path: "/account" },
  ];

  if (loading) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="h-8 w-8 border-4 border-green-600 border-t-transparent rounded-full"
        />
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center text-red-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {error}
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Head>
        <title>Dashboard | GrowSafe Page</title>
        <meta
          name="description"
          content="Manage your GrowSafe Page portfolio"
        />
      </Head>

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white shadow-md" : "bg-white/90 backdrop-blur-sm"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center">
                <div className="text-green-700 font-bold text-2xl">
                  GrowSafe
                </div>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-1">
              <nav className="flex space-x-1">
                {navLinks.map((link) => (
                  <Link
                    href={link.path}
                    key={link.name}
                    className={`px-4 py-2 rounded-lg transition-colors relative group ${
                      pathname === link.path
                        ? "text-green-700 font-medium"
                        : "text-gray-600 hover:text-green-700"
                    }`}
                  >
                    {link.name}
                    {pathname === link.path && (
                      <span className="absolute bottom-0 left-0 w-full h-1 bg-green-600 rounded-t-lg"></span>
                    )}
                    <span
                      className={`absolute bottom-0 left-0 w-0 h-1 bg-green-600 rounded-t-lg transition-all duration-300 ${
                        pathname === link.path ? "" : "group-hover:w-full"
                      }`}
                    ></span>
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-3 border-l pl-4 border-gray-200">
                <div className="h-8 w-8 rounded-full bg-green-600 text-white flex items-center justify-center font-medium">
                  {userData.firstName.charAt(0)}
                  {userData.lastName.charAt(0)}
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-700">
                    {userData.firstName} {userData.lastName}
                  </p>
                  <button
                    onClick={handleLogout}
                    className="text-xs text-gray-500 hover:text-green-600"
                  >
                    Logout
                  </button>
                </div>
              </div>
              <button
                className="md:hidden rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-green-700 focus:outline-none"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
          <div
            className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
              isMenuOpen ? "max-h-64" : "max-h-0"
            }`}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200">
              {navLinks.map((link) => (
                <Link
                  href={link.path}
                  key={link.name}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    pathname === link.path
                      ? "bg-green-100 text-green-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-green-700"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="border-t border-gray-200 pt-4 pb-3">
                <div className="flex items-center px-3">
                  <div className="h-10 w-10 rounded-full bg-green-600 text-white flex items-center justify-center font-medium">
                    {userData.firstName.charAt(0)}
                    {userData.lastName.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">
                      {userData.firstName} {userData.lastName}
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                      {userData.email}
                    </div>
                  </div>
                </div>
                <div className="mt-3 px-2">
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-green-700"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, {userData.firstName}
          </h1>
          <p className="text-gray-600 mt-1">
            Here is an overview of your investments
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-gray-500 text-sm uppercase font-medium">
              Total Balance
            </h2>
            <p className="text-3xl font-bold text-gray-800 mt-2">
              Tsh
              {userData.accountBalance.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="text-green-600 mt-1">+3.2% this month</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-gray-500 text-sm uppercase font-medium">
              Invested Amount
            </h2>
            <p className="text-3xl font-bold text-gray-800 mt-2">
              Tsh
              {userData.investmentsValue.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="text-green-600 mt-1">+2.8% this month</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-gray-500 text-sm uppercase font-medium">
              Available Cash
            </h2>
            <p className="text-3xl font-bold text-gray-800 mt-2">
              Tsh
              {userData.availableCash.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <div className="mt-3 flex space-x-2">
              <button
                onClick={() => setIsDepositModalOpen(true)}
                className="text-sm px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Add Funds
              </button>
              <button
                onClick={() => setIsWithdrawModalOpen(true)}
                className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Withdraw Funds
              </button>
            </div>
          </div>
        </div>

        {/* Deposit Modal */}
        <AnimatePresence>
          {isDepositModalOpen && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="bg-white rounded-lg p-6 w-full max-w-md"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Add Funds
                </h2>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount (Tsh)
                  </label>
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => {
                      setDepositAmount(e.target.value);
                      setDepositError(null);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
                    placeholder="Enter amount"
                  />
                  {depositError && (
                    <p className="text-red-600 text-sm mt-1">{depositError}</p>
                  )}
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setIsDepositModalOpen(false);
                      setDepositAmount("");
                      setDepositError(null);
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeposit}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    Deposit
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Withdraw Modal */}
        <AnimatePresence>
          {isWithdrawModalOpen && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="bg-white rounded-lg p-6 w-full max-w-md"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Withdraw Funds
                </h2>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount (Tsh)
                  </label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => {
                      setWithdrawAmount(e.target.value);
                      setWithdrawError(null);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="Enter amount"
                  />
                  {withdrawError && (
                    <p className="text-red-600 text-sm mt-1">{withdrawError}</p>
                  )}
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setIsWithdrawModalOpen(false);
                      setWithdrawAmount("");
                      setWithdrawError(null);
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleWithdraw}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Withdraw
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "overview"
                  ? "border-green-600 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "portfolio"
                  ? "border-green-600 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("portfolio")}
            >
              Portfolio
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "transactions"
                  ? "border-green-600 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("transactions")}
            >
              Transactions
            </button>
          </nav>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          {activeTab === "overview" && (
            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow mb-8"
              >
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-800">
                    Portfolio Allocation
                  </h2>
                </div>
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Investment
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Allocation
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Value
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            24h Change
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {portfolioData.map((item) => (
                          <motion.tr
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {item.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.allocation}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              Tsh
                              {item.value.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </td>
                            <td
                              className={`px-6 py-4 whitespace-nowrap text-sm ${
                                item.change >= 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {item.change >= 0 ? "+" : ""}
                              {item.change}%
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow"
              >
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-800">
                    Market News
                  </h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {marketNews.map((news) => (
                    <motion.div
                      key={news.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="p-6 hover:bg-gray-50 transition-colors"
                    >
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        {news.title}
                      </h3>
                      <div className="flex text-sm text-gray-500">
                        <span>{news.source}</span>
                        <span className="mx-2">•</span>
                        <span>
                          {new Date(news.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-200 text-center">
                  <button className="text-green-600 hover:text-green-700 font-medium">
                    View All News
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {activeTab === "portfolio" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow"
            >
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Your Page</h2>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Investment
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Allocation
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Value
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          24h Change
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {portfolioData.map((item) => (
                        <motion.tr
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.allocation}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            Tsh
                            {item.value.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                          <td
                            className={`px-6 py-4 whitespace-nowrap text-sm ${
                              item.change >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {item.change >= 0 ? "+" : ""}
                            {item.change}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-2">
                              <button
                                onClick={async () => {
                                  const amount = prompt(
                                    "Enter amount to invest:",
                                  );
                                  if (
                                    amount &&
                                    !isNaN(Number(amount)) &&
                                    Number(amount) > 0
                                  ) {
                                    try {
                                      const response = await api.post(
                                        "invest/",
                                        {
                                          name: item.name,
                                          amount,
                                          daily_return_rate: (
                                            item.change / 100
                                          ).toString(),
                                        },
                                      );
                                      alert(
                                        `Investment successful: ${response.data.message}`,
                                      );
                                      const profileResponse =
                                        await api.get("profile/");
                                      const data = profileResponse.data;
                                      setUserData({
                                        firstName:
                                          data.first_name || data.username,
                                        lastName: data.last_name || "",
                                        email: data.email,
                                        accountBalance:
                                          parseFloat(data.total) || 0,
                                        investmentsValue:
                                          data.investments.reduce(
                                            (
                                              sum: number,
                                              inv: { amount: string },
                                            ) => sum + parseFloat(inv.amount),
                                            0,
                                          ) || 0,
                                        availableCash:
                                          parseFloat(data.total) || 0,
                                        mobile_number: data.mobile_number || "",
                                      });
                                      setPortfolioData(
                                        data.investments.map(
                                          (
                                            inv: {
                                              name: string;
                                              amount: string;
                                              daily_return_rate: string;
                                            },
                                            index: number,
                                          ) => ({
                                            id: index + 1,
                                            name: inv.name,
                                            allocation: calculateAllocation(
                                              inv.amount,
                                              data.investments,
                                            ),
                                            value: parseFloat(inv.amount),
                                            change:
                                              parseFloat(
                                                inv.daily_return_rate,
                                              ) * 100,
                                          }),
                                        ),
                                      );
                                      setRecentTransactions(
                                        data.transactions.map(
                                          (
                                            tx: {
                                              type: string;
                                              amount: string;
                                              status: string;
                                              created_at: string;
                                              notes: string;
                                            },
                                            index: number,
                                          ) => ({
                                            id: index + 1,
                                            date: new Date(tx.created_at)
                                              .toISOString()
                                              .split("T")[0],
                                            type: tx.type,
                                            investment: tx.notes || "Cash",
                                            amount: parseFloat(tx.amount),
                                            status: tx.status,
                                          }),
                                        ),
                                      );
                                    } catch (err: unknown) {
                                      alert(
                                        `Investment failed: ${(err as AxiosError<ApiErrorResponse>).response?.data?.error || "Unknown error"}`,
                                      );
                                    }
                                  } else {
                                    alert("Please enter a valid amount");
                                  }
                                }}
                                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-xs"
                              >
                                Buy
                              </button>
                              <button
                                className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-xs"
                                onClick={() =>
                                  alert(
                                    "Sell functionality not implemented yet",
                                  )
                                }
                              >
                                Sell
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "transactions" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow"
            >
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">
                  Recent Transactions
                </h2>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentTransactions.map((transaction) => (
                        <motion.tr
                          key={transaction.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(transaction.date).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {transaction.type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {transaction.investment}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            Tsh
                            {transaction.amount.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                transaction.status === "APPROVED"
                                  ? "bg-green-100 text-green-800"
                                  : transaction.status === "PENDING"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {transaction.status}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="p-4 border-t border-gray-200 text-center">
                <button className="text-green-600 hover:text-green-700 font-medium">
                  View All Transactions
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>

      <footer className="bg-green-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>
            © {new Date().getFullYear()} GrowSafe Page. All rights reserved.
          </p>
          <div className="mt-2">
            <Link
              href="/terms"
              className="text-green-200 mx-2 hover:underline text-sm"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-green-200 mx-2 hover:underline text-sm"
            >
              Privacy
            </Link>
            <Link
              href="/contact"
              className="text-green-200 mx-2 hover:underline text-sm"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
