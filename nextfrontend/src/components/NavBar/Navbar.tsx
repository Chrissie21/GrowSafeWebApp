'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

const Navbar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const [userData, setUserData] = useState({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        profileImage: null
    });

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
    );
};

export default Navbar;