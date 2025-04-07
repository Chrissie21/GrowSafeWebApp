'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter, usePathname } from 'next/navigation';

const Page = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const [userData, setUserData] = useState({
        firstName: 'Franck',
        lastName: 'Edmund',
        email: 'john.doe@example.com',
    });

    const [portfolioData, setPortfolioData] = useState([
        { id: 1, name: 'Sustainable Energy Fund', allocation: 35, value: 4375.00, change: 5.2, performance: 12.5, riskLevel: 'Medium' },
        { id: 2, name: 'Green Technology ETF', allocation: 25, value: 3125.00, change: -1.8, performance: 8.3, riskLevel: 'High' },
        { id: 3, name: 'Eco-friendly Real Estate', allocation: 20, value: 2500.00, change: 2.7, performance: 6.8, riskLevel: 'Low' },
        { id: 4, name: 'Water Conservation Fund', allocation: 15, value: 1875.00, change: 3.5, performance: 9.1, riskLevel: 'Medium' },
        { id: 5, name: 'Renewable Resources', allocation: 5, value: 625.00, change: 8.3, performance: 15.2, riskLevel: 'High' }
    ]);

    const [availableInvestments, setAvailableInvestments] = useState([
        { id: 6, name: 'Clean Energy Bonds', minInvestment: 1000, expectedReturn: 4.5, riskLevel: 'Low' },
        { id: 7, name: 'Carbon Offset Credits', minInvestment: 500, expectedReturn: 7.8, riskLevel: 'Medium' },
        { id: 8, name: 'Sustainable Agriculture Fund', minInvestment: 2000, expectedReturn: 6.2, riskLevel: 'Medium' }
    ]);

    const [activeTab, setActiveTab] = useState('current');

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
        router.push('/auth/login');
    };

    const navLinks = [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Investments', path: '/investments' },
        { name: 'Account', path: '/account' }
    ];

    const handleInvest = (investmentId: number) => {
        // Handle investment logic here
        console.log(`Investing in ${investmentId}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Head>
                <title>Investments | GrowSafe Investments</title>
                <meta name="description" content="Manage and explore your investment options with GrowSafe" />
            </Head>

            {/* Navbar Component */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-white/90 backdrop-blur-sm'}`}>
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <Link href="/dashboard" className="flex items-center">
                                <div className="text-green-700 font-bold text-2xl">GrowSafe</div>
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

                        <div className="flex items-center space-x-4">
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

            {/* Main Content */}
            <main className="flex-grow container mx-auto px-4 py-8 mt-20">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Your Investments</h1>
                    <p className="text-gray-600 mt-1">Manage and explore investment opportunities</p>
                </div>

                {/* Tabs */}
                <div className="mb-6 border-b border-gray-200">
                    <nav className="flex space-x-8">
                        <button
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'current'
                                    ? 'border-green-600 text-green-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                            onClick={() => setActiveTab('current')}
                        >
                            Current Investments
                        </button>
                        <button
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'available'
                                    ? 'border-green-600 text-green-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                            onClick={() => setActiveTab('available')}
                        >
                            Available Investments
                        </button>
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="mb-12">
                    {activeTab === 'current' && (
                        <div className="bg-white rounded-lg shadow">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-bold text-gray-800">Current Investments</h2>
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
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">YTD Performance</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                        {portfolioData.map((item) => (
                                            <tr key={item.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.allocation}%</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Tsh{item.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {item.change >= 0 ? '+' : ''}{item.change}%
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${item.performance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {item.performance >= 0 ? '+' : ''}{item.performance}%
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.riskLevel}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div className="flex space-x-2">
                                                        <button className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-xs">
                                                            Buy More
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

                    {activeTab === 'available' && (
                        <div className="bg-white rounded-lg shadow">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-bold text-gray-800">Available Investment Opportunities</h2>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {availableInvestments.map((investment) => (
                                        <div key={investment.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">{investment.name}</h3>
                                            <div className="space-y-2 text-sm text-gray-600">
                                                <p>Minimum Investment: Tsh{investment.minInvestment.toLocaleString('en-US')}</p>
                                                <p>Expected Return: {investment.expectedReturn}%</p>
                                                <p>Risk Level: {investment.riskLevel}</p>
                                            </div>
                                            <button
                                                onClick={() => handleInvest(investment.id)}
                                                className="mt-4 w-full px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                                            >
                                                Invest Now
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-green-800 text-white py-6">
                <div className="container mx-auto px-4 text-center">
                    <p>© {new Date().getFullYear()} GrowSafe Investments. All rights reserved.</p>
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

export default Page;