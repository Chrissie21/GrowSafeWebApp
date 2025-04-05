'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/navigation';

const Login = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [errors, setErrors] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });

        // Clear error when user starts typing
        if (errors[name as keyof typeof errors]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const validate = () => {
        let isValid = true;
        const newErrors = { email: '', password: '' };

        if (!formData.email) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
            isValid = false;
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
            isValid = false;
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validate()) {
            // Here you would typically handle authentication
            console.log('Page form submitted:', formData);

            // Simulate successful login and redirect
            // In a real app, you would verify credentials first
            router.push('/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col">
            <Head>
                <title>Login | GrowSafe Investments</title>
                <meta name="description" content="Log in to your GrowSafe Investments account" />
            </Head>

            <header className="container mx-auto px-4 py-6">
                <nav className="flex justify-between items-center">
                    <Link href="../" className="text-green-700 font-bold text-xl">
                        GrowSafe
                    </Link>
                    <div>
                        <Link href="/auth/signup">
                            <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                                Sign Up
                            </button>
                        </Link>
                    </div>
                </nav>
            </header>

            <main className="flex-grow flex items-center justify-center px-4 py-12">
                <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-green-800">Welcome Back</h1>
                        <p className="text-gray-600 mt-2">Log in to access your investments</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded border ${
                                    errors.email ? 'border-red-500' : 'border-gray-300'
                                } focus:outline-none focus:ring-2 focus:ring-green-500`}
                                placeholder="you@example.com"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                            )}
                        </div>

                        <div className="mb-6">
                            <div className="flex justify-between mb-2">
                                <label htmlFor="password" className="block text-gray-700 font-medium">
                                    Password
                                </label>
                                <Link href="/forgot-password" className="text-sm text-green-600 hover:underline">
                                    Forgot Password?
                                </Link>
                            </div>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded border ${
                                    errors.password ? 'border-red-500' : 'border-gray-300'
                                } focus:outline-none focus:ring-2 focus:ring-green-500`}
                                placeholder="••••••••"
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                            )}
                        </div>

                        <div className="flex items-center mb-6">
                            <input
                                type="checkbox"
                                id="rememberMe"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                                className="h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                            />
                            <label htmlFor="rememberMe" className="ml-2 block text-gray-700">
                                Remember me
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white py-3 rounded font-medium hover:bg-green-700 transition-colors"
                        >
                            Log In
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-600">
                            Don&apos;t have an account?{" "}
                            <Link href="/auth/signup" className="text-green-600 hover:underline font-medium">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </main>

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

export default Login;