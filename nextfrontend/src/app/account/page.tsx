'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter, usePathname } from 'next/navigation';

const Account = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const [userData, setUserData] = useState({
        firstName: 'Franck',
        lastName: 'Edmund',
        email: 'john.doe@example.com',
        phone: '+255 123 456 789',
        address: '123 Green Lane, Dar es Salaam, Tanzania',
        joinedDate: '2023-01-15',
    });

    const [accountActivity, setAccountActivity] = useState([
        { id: 1, date: '2025-04-05', action: 'Logged in', ip: '192.168.1.1', device: 'Chrome - Windows' },
        { id: 2, date: '2025-04-03', action: 'Password updated', ip: '192.168.1.1', device: 'Chrome - Windows' },
        { id: 3, date: '2025-03-30', action: 'Profile updated', ip: '192.168.1.1', device: 'Safari - iPhone' },
        { id: 4, date: '2025-03-25', action: 'Logged in', ip: '10.0.0.1', device: 'Firefox - MacOS' },
    ]);

    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);

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

    const handleSaveProfile = () => {
        // Save profile logic here (e.g., API call)
        setIsEditing(false);
        console.log('Profile saved:', userData);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({ ...prev, [name]: value }));
    };

    const navLinks = [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Investments', path: '/investments' },
        { name: 'Account', path: '/account' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Head>
                <title>Account | GrowSafe Investments</title>
                <meta name="description" content="Manage your GrowSafe Investments account" />
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
                    <h1 className="text-3xl font-bold text-gray-800">Account Settings</h1>
                    <p className="text-gray-600 mt-1">Manage your profile and account preferences</p>
                </div>

                {/* Tabs */}
                <div className="mb-6 border-b border-gray-200">
                    <nav className="flex space-x-8">
                        <button
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'profile'
                                    ? 'border-green-600 text-green-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                            onClick={() => setActiveTab('profile')}
                        >
                            Profile
                        </button>
                        <button
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'activity'
                                    ? 'border-green-600 text-green-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                            onClick={() => setActiveTab('activity')}
                        >
                            Account Activity
                        </button>
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="mb-12">
                    {activeTab === 'profile' && (
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-800">Profile Details</h2>
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                                    >
                                        Edit Profile
                                    </button>
                                ) : (
                                    <div className="space-x-2">
                                        <button
                                            onClick={handleSaveProfile}
                                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={userData.firstName}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 ${
                                            !isEditing ? 'bg-gray-100' : ''
                                        }`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={userData.lastName}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 ${
                                            !isEditing ? 'bg-gray-100' : ''
                                        }`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={userData.email}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 ${
                                            !isEditing ? 'bg-gray-100' : ''
                                        }`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={userData.phone}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 ${
                                            !isEditing ? 'bg-gray-100' : ''
                                        }`}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={userData.address}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 ${
                                            !isEditing ? 'bg-gray-100' : ''
                                        }`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Joined Date</label>
                                    <input
                                        type="text"
                                        value={new Date(userData.joinedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        disabled
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100"
                                    />
                                </div>
                            </div>
                            <div className="mt-8 border-t pt-6">
                                <h3 className="text-lg font-medium text-gray-800 mb-4">Security</h3>
                                <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm">
                                    Change Password
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'activity' && (
                        <div className="bg-white rounded-lg shadow">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-bold text-gray-800">Account Activity</h2>
                            </div>
                            <div className="p-6">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead>
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                        {accountActivity.map((activity) => (
                                            <tr key={activity.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(activity.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{activity.action}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.ip}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.device}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
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

export default Account;
