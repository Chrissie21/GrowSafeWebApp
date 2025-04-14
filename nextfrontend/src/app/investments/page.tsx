"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import { useRouter, usePathname } from "next/navigation";
import api from "../../lib/api";
import { AxiosError } from "axios";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { motion, AnimatePresence } from "framer-motion";

interface Investment {
  id: number;
  name: string;
  amount: string;
  daily_return_rate: string;
}

interface InvestmentOption {
  id: number;
  name: string;
  min_investment: string;
  expected_return: string;
  risk_level: string;
}

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  total: string;
}

const Page = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [investing, setInvesting] = useState(false);

  const [userData, setUserData] = useState<UserData>({
    firstName: "",
    lastName: "",
    email: "",
    total: "0.00",
  });

  const [portfolioData, setPortfolioData] = useState<Investment[]>([]);
  const [availableInvestments, setAvailableInvestments] = useState<
    InvestmentOption[]
  >([]);
  const [activeTab, setActiveTab] = useState<"current" | "available">(
    "current",
  );
  const [investModal, setInvestModal] = useState<{
    open: boolean;
    option?: InvestmentOption;
    amount?: string;
  }>({ open: false });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const profileResponse = await api.get("profile/");
        setUserData({
          firstName: profileResponse.data.first_name || "",
          lastName: profileResponse.data.last_name || "",
          email: profileResponse.data.email || "",
          total: profileResponse.data.total || "0.00",
        });
        setPortfolioData(profileResponse.data.investments || []);

        const optionsResponse = await api.get("available-investments/");
        setAvailableInvestments(optionsResponse.data || []);
      } catch (err: unknown) {
        console.error("Fetch error:", err);
        if (err instanceof AxiosError) {
          if (err.response?.status === 401) {
            try {
              const refreshToken = localStorage.getItem("refresh_token");
              const refreshResponse = await api.post("token/refresh/", {
                refresh: refreshToken,
              });
              localStorage.setItem("access_token", refreshResponse.data.access);
              // Retry original requests
              const profileResponse = await api.get("profile/");
              setUserData({
                firstName: profileResponse.data.first_name || "",
                lastName: profileResponse.data.last_name || "",
                email: profileResponse.data.email || "",
                total: profileResponse.data.total || "0.00",
              });
              setPortfolioData(profileResponse.data.investments || []);
              const optionsResponse = await api.get("available-investments/");
              setAvailableInvestments(optionsResponse.data || []);
            } catch (refreshErr) {
              console.error("Refresh token error:", refreshErr);
              localStorage.removeItem("access_token");
              localStorage.removeItem("refresh_token");
              router.push("/auth/login");
            }
          } else {
            setError(err.response?.data?.error || "Failed to load investments");
          }
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

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
        refresh: localStorage.getItem("refresh_token"),
      });
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      router.push("/auth/login");
    } catch (err) {
      router.push("/auth/login");
    }
  };

  const handleInvest = (option: InvestmentOption) => {
    setInvestModal({ open: true, option, amount: "" });
  };

  const handleSell = (investment: Investment) => {
    alert("Sell functionality coming soon!");
    // Future: POST to /api/auth/sell/ with investment.id
  };

  const confirmInvest = async () => {
    if (!investModal.option || !investModal.amount) {
      alert("Please enter an amount");
      return;
    }
    const amount = parseFloat(investModal.amount);
    const minInvestment = parseFloat(investModal.option.min_investment);
    if (isNaN(amount) || amount < minInvestment) {
      alert(
        `Amount must be at least Tsh${minInvestment.toLocaleString("en-US")}`,
      );
      return;
    }
    if (amount > parseFloat(userData.total)) {
      alert("Insufficient balance");
      return;
    }
    try {
      setInvesting(true);
      const response = await api.post("invest/", {
        option_id: investModal.option.id,
        amount: investModal.amount,
      });
      setPortfolioData([...portfolioData, response.data.investment]);
      setUserData({ ...userData, total: response.data.total });
      setInvestModal({ open: false });
      alert("Investment successful!");
    } catch (err: unknown) {
      console.error("Invest error:", err);
      alert(
        err instanceof AxiosError
          ? err.response?.data?.error
          : "Investment failed",
      );
    } finally {
      setInvesting(false);
    }
  };

  const navLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Investments", path: "/investments" },
    { name: "Account", path: "/account" },
  ];

  const chartData = portfolioData.map((item) => ({
    name: item.name,
    value: parseFloat(item.amount),
  }));

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="h-8 w-8 border-4 border-green-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Head>
        <title>Investments | GrowSafe Investments</title>
        <meta
          name="description"
          content="Manage and explore your investment options with GrowSafe"
        />
      </Head>

      {/* Navbar */}
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
          <h1 className="text-3xl font-bold text-gray-800">Your Investments</h1>
          <p className="text-gray-600 mt-1">
            Manage and explore investment opportunities. Balance: Tsh
            {parseFloat(userData.total).toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </p>
        </motion.div>

        {/* Portfolio Chart */}
        <AnimatePresence>
          {portfolioData.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-12 bg-white rounded-lg shadow p-6"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Portfolio Allocation
              </h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) =>
                        `Tsh${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "current"
                  ? "border-green-600 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("current")}
            >
              Current Investments
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "available"
                  ? "border-green-600 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("available")}
            >
              Available Investments
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          {activeTab === "current" && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">
                  Current Investments
                </h2>
              </div>
              <div className="p-6">
                {portfolioData.length === 0 ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-gray-600"
                  >
                    No investments yet. Explore available options!
                  </motion.p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Investment
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Daily Return
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
                              Tsh
                              {parseFloat(item.amount).toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                              })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {(
                                parseFloat(item.daily_return_rate) * 100
                              ).toFixed(2)}
                              %
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() =>
                                    handleInvest({
                                      id: item.id,
                                      name: item.name,
                                      min_investment: "0",
                                      expected_return: item.daily_return_rate,
                                      risk_level: "",
                                    })
                                  }
                                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-xs"
                                >
                                  Buy More
                                </button>
                                <button
                                  onClick={() => handleSell(item)}
                                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-xs"
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
                )}
              </div>
            </div>
          )}

          {activeTab === "available" && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">
                  Available Investment Opportunities
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableInvestments.map((investment) => (
                    <motion.div
                      key={investment.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {investment.name}
                      </h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>
                          Minimum Investment: Tsh
                          {parseFloat(investment.min_investment).toLocaleString(
                            "en-US",
                          )}
                        </p>
                        <p>Expected Return: {investment.expected_return}%</p>
                        <p>Risk Level: {investment.risk_level}</p>
                      </div>
                      <button
                        onClick={() => handleInvest(investment)}
                        className="mt-4 w-full px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                      >
                        Invest Now
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </main>

      {/* Investment Modal */}
      <AnimatePresence>
        {investModal.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Invest in {investModal.option?.name}
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Minimum: Tsh
                {parseFloat(
                  investModal.option?.min_investment || "0",
                ).toLocaleString("en-US")}
              </p>
              <input
                type="number"
                placeholder="Enter amount"
                className="w-full p-2 border rounded mb-4"
                value={investModal.amount || ""}
                onChange={(e) =>
                  setInvestModal({ ...investModal, amount: e.target.value })
                }
                disabled={investing}
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setInvestModal({ open: false })}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  disabled={investing}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmInvest}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
                  disabled={investing}
                >
                  {investing ? "Investing..." : "Confirm"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="bg-green-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>
            © {new Date().getFullYear()} GrowSafe Investments. All rights
            reserved.
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

export default Page;
