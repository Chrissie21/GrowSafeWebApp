'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter, usePathname } from 'next/navigation';

const Dashboard = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const [userData, setUserData] = useState({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        accountBalance: 15750.42,
        investmentsValue: 12500.00,
        availableCash: 3250.42
    });

    const [portfolioData, setPortfolioData] = useState([
        { id: 1, name: 'Sustainable Energy Fund', allocation: 35, value: 4375.00, change: 5.2 },
        { id: 2, name: 'Green Technology ETF', allocation: 25, value: 3125.00, change: -1.8 },
        { id: 3, name: 'Eco-friendly Real Estate', allocation: 20, value: 2500.00, change: 2.7 },
        { id: 4, name: 'Water Conservation Fund', allocation: 15, value: 1875.00, change: 3.5 },
        { id: 5, name: 'Renewable Resources', allocation: 5, value: 625.00, change: 8.3 }
    ]);

    const [recentTransactions, setRecentTransactions] = useState([
        { id: 1, date: '2025-04-01', type: 'Deposit', amount: 1000.00, status: 'Completed' },
        { id: 2, date: '2025-03-25', type: 'Purchase', investment: 'Green Technology ETF', amount: 500.00, status: 'Completed' },
        { id: 3, date: '2025-03-20', type: 'Sell', investment: 'Renewable Resources', amount: 250.00, status: 'Completed' },
        { id: 4, date: '2025-03-15', type: 'Deposit', amount: 2000.00, status: 'Completed' }
    ]);

    const [marketNews, setMarketNews] = useState([
        { id: 1, title: 'New Solar Technology Boosts Efficiency by 30%', date: '2025-04-05', source: 'Green Energy Today' },
        { id: 2, title: 'Sustainable Investment Funds See Record Inflows', date: '2025-04-03', source: 'Financial Times' },
        { id: 3, title: 'Carbon Credit Markets Expand in Southeast Asia', date: '2025-04-02', source: 'Climate Economics' },
        { id: 4, title: 'Water Conservation Startups Attract Major Funding', date: '2025-03-30', source: 'Tech Investor Weekly' }
    ]);

    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        // Handle logout logic here
        router.push('/auth/login');
    };

    const navLinks = [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Investments', path: '/investments' },
        { name: 'Account', path: '/account' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Head>
                <title>Dashboard | GrowSafe Investments</title>
                <meta name="description" content="Manage your GrowSafe Investments portfolio" />
            </Head>

            {/* Navbar Component */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-white/90 backdrop-blur-sm'}`}>
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link href="/dashboard" className="flex items-center">
                                <div className="text-green-700 font-bold text-2xl">GrowSafe</div>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-1">
                            <nav className="flex space-x-1">
                                {navLinks.map((link) => (
                                    <Link
                                        href={link.path}
                                        key={link.name}
                                        className={`px-4 py-2 rounded-lg transition-colors relative group ${
                                            pathname === link.path
                                                ? 'text-green-700 font-medium'
                                                : 'text-gray-600 hover:text-green-700'
                                        }`}
                                    >
                                        {link.name}
                                        {pathname === link.path && (
                                            <span className="absolute bottom-0 left-0 w-full h-1 bg-green-600 rounded-t-lg"></span>
                                        )}
                                        <span className={`absolute bottom-0 left-0 w-0 h-1 bg-green-600 rounded-t-lg transition-all duration-300 ${
                                            pathname === link.path ? '' : 'group-hover:w-full'
                                        }`}></span>
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        {/* User Menu & Mobile Menu Button */}
                        <div className="flex items-center space-x-4">
                            {/* User Profile */}
                            <div className="hidden md:flex items-center space-x-3 border-l pl-4 border-gray-200">
                                <div className="h-8 w-8 rounded-full bg-green-600 text-white flex items-center justify-center font-medium">
                                    {userData.firstName.charAt(0)}{userData.lastName.charAt(0)}
                                </div>
                                <div className="text-sm">
                                    <p className="font-medium text-gray-700">{userData.firstName} {userData.lastName}</p>
                                    <button
                                        onClick={handleLogout}
                                        className="text-xs text-gray-500 hover:text-green-600"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>

                            {/* Mobile Menu Button */}
                            <button
                                className="md:hidden rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-green-700 focus:outline-none"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {isMenuOpen
                                        ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    }
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${isMenuOpen ? 'max-h-64' : 'max-h-0'}`}>
                        <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200">
                            {navLinks.map((link) => (
                                <Link
                                    href={link.path}
                                    key={link.name}
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                                        pathname === link.path
                                            ? 'bg-green-100 text-green-700'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-green-700'
                                    }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="border-t border-gray-200 pt-4 pb-3">
                                <div className="flex items-center px-3">
                                    <div className="h-10 w-10 rounded-full bg-green-600 text-white flex items-center justify-center font-medium">
                                        {userData.firstName.charAt(0)}{userData.lastName.charAt(0)}
                                    </div>
                                    <div className="ml-3">
                                        <div className="text-base font-medium text-gray-800">{userData.firstName} {userData.lastName}</div>
                                        <div className="text-sm font-medium text-gray-500">{userData.email}</div>
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

            {/* Main Content - Added margin-top to account for fixed navbar */}
            <main className="flex-grow container mx-auto px-4 py-8 mt-20">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Welcome back, {userData.firstName}</h1>
                    <p className="text-gray-600 mt-1">Here's an overview of your investments</p>
                </div>

                {/* Account Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-gray-500 text-sm uppercase font-medium">Total Balance</h2>
                        <p className="text-3xl font-bold text-gray-800 mt-2">${userData.accountBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        <p className="text-green-600 mt-1">+3.2% this month</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-gray-500 text-sm uppercase font-medium">Investments Value</h2>
                        <p className="text-3xl font-bold text-gray-800 mt-2">${userData.investmentsValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        <p className="text-green-600 mt-1">+2.8% this month</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-gray-500 text-sm uppercase font-medium">Available Cash</h2>
                        <p className="text-3xl font-bold text-gray-800 mt-2">${userData.availableCash.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        <button className="mt-3 text-sm px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                            Add Funds
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-6 border-b border-gray-200">
                    <nav className="flex space-x-8">
                        <button
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'overview'
                                    ? 'border-green-600 text-green-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                            onClick={() => setActiveTab('overview')}
                        >
                            Overview
                        </button>
                        <button
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'portfolio'
                                    ? 'border-green-600 text-green-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                            onClick={() => setActiveTab('portfolio')}
                        >
                            Portfolio
                        </button>
                        <button
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'transactions'
                                    ? 'border-green-600 text-green-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                            onClick={() => setActiveTab('transactions')}
                        >
                            Transactions
                        </button>
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="mb-12">
                    {activeTab === 'overview' && (
                        <div>
                            {/* Portfolio Allocation */}
                            <div className="bg-white rounded-lg shadow mb-8">
                                <div className="p-6 border-b border-gray-200">
                                    <h2 className="text-xl font-bold text-gray-800">Portfolio Allocation</h2>
                                </div>
                                <div className="p-6">
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead>
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investment</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allocation</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">24h Change</th>
                                            </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                            {portfolioData.map((item) => (
                                                <tr key={item.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.allocation}%</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                        {item.change >= 0 ? '+' : ''}{item.change}%
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Market News */}
                            <div className="bg-white rounded-lg shadow">
                                <div className="p-6 border-b border-gray-200">
                                    <h2 className="text-xl font-bold text-gray-800">Market News</h2>
                                </div>
                                <div className="divide-y divide-gray-200">
                                    {marketNews.map((news) => (
                                        <div key={news.id} className="p-6 hover:bg-gray-50 transition-colors">
                                            <h3 className="text-lg font-medium text-gray-900 mb-1">{news.title}</h3>
                                            <div className="flex text-sm text-gray-500">
                                                <span>{news.source}</span>
                                                <span className="mx-2">•</span>
                                                <span>{new Date(news.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-4 border-t border-gray-200 text-center">
                                    <button className="text-green-600 hover:text-green-700 font-medium">
                                        View All News
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'portfolio' && (
                        <div className="bg-white rounded-lg shadow">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-bold text-gray-800">Your Investments</h2>
                            </div>
                            <div className="p-6">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead>
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investment</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allocation</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">24h Change</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                        {portfolioData.map((item) => (
                                            <tr key={item.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.allocation}%</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {item.change >= 0 ? '+' : ''}{item.change}%
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div className="flex space-x-2">
                                                        <button className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-xs">
                                                            Buy
                                                        </button>
                                                        <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-xs">
                                                            Sell
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'transactions' && (
                        <div className="bg-white rounded-lg shadow">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-bold text-gray-800">Recent Transactions</h2>
                            </div>
                            <div className="p-6">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead>
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                        {recentTransactions.map((transaction) => (
                                            <tr key={transaction.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(transaction.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.type}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {transaction.investment ? transaction.investment : 'Cash'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    ${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                            {transaction.status}
                                                        </span>
                                                </td>
                                            </tr>
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
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-green-800 text-white py-6">
                <div className="container mx-auto px-4 text-center">
                    <p>&copy; {new Date().getFullYear()} GrowSafe Investments. All rights reserved.</p>
                    <div className="mt-2">
                        <Link href="/terms" className="text-green-200 mx-2 hover:underline text-sm">Terms</Link>
                        <Link href="/privacy" className="text-green-200 mx-2 hover:underline text-sm">Privacy</Link>
                        <Link href="/contact" className="text-green-200 mx-2 hover:underline text-sm">Contact</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Dashboard;