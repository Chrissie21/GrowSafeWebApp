'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/navigation';

const SignUp = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
    });
    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: ''
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
        const newErrors = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            agreeTerms: ''
        };

        // First name validation
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
            isValid = false;
        }

        // Last name validation
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
            isValid = false;
        }

        // Email validation
        if (!formData.email) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
            isValid = false;
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
            isValid = false;
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
            isValid = false;
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
            isValid = false;
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        // Terms agreement validation
        if (!formData.agreeTerms) {
            newErrors.agreeTerms = 'You must agree to the terms and conditions';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validate()) {
            // Here you would typically handle user registration
            console.log('Signup form submitted:', formData);

            // Simulate successful registration and redirect
            router.push('/welcome');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col">
            <Head>
                <title>Sign Up | GrowSafe Page</title>
                <meta name="description" content="Create your GrowSafe Page account" />
            </Head>

            <header className="container mx-auto px-4 py-6">
                <nav className="flex justify-between items-center">
                    <Link href="../" className="text-green-700 font-bold text-xl">
                        GrowSafe
                    </Link>
                    <div>
                        <Link href="/auth/login">
                            <button className="px-4 py-2 text-green-700 border border-green-600 rounded hover:bg-green-600 hover:text-white transition-colors">
                                Log In
                            </button>
                        </Link>
                    </div>
                </nav>
            </header>

            <main className="flex-grow flex items-center justify-center px-4 py-8">
                <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold text-green-800">Create Your Account</h1>
                        <p className="text-gray-600 mt-2">Start your investment journey with GrowSafe</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label htmlFor="firstName" className="block text-gray-700 font-medium mb-2">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded border ${
                                        errors.firstName ? 'border-red-500' : 'border-gray-300'
                                    } focus:outline-none focus:ring-2 focus:ring-green-500`}
                                    placeholder="John"
                                />
                                {errors.firstName && (
                                    <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-gray-700 font-medium mb-2">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded border ${
                                        errors.lastName ? 'border-red-500' : 'border-gray-300'
                                    } focus:outline-none focus:ring-2 focus:ring-green-500`}
                                    placeholder="Doe"
                                />
                                {errors.lastName && (
                                    <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                                )}
                            </div>
                        </div>

                        <div className="mb-4">
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

                        <div className="mb-4">
                            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                                Password
                            </label>
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
                            <p className="text-gray-500 text-sm mt-1">
                                Must be at least 8 characters
                            </p>
                        </div>

                        <div className="mb-6">
                            <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded border ${
                                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                } focus:outline-none focus:ring-2 focus:ring-green-500`}
                                placeholder="••••••••"
                            />
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                            )}
                        </div>

                        <div className="mb-6">
                            <div className="flex items-start">
                                <input
                                    type="checkbox"
                                    id="agreeTerms"
                                    name="agreeTerms"
                                    checked={formData.agreeTerms}
                                    onChange={handleChange}
                                    className="h-4 w-4 mt-1 text-green-600 rounded border-gray-300 focus:ring-green-500"
                                />
                                <label htmlFor="agreeTerms" className="ml-2 block text-gray-700">
                                    I agree to the{" "}
                                    <Link href="/terms" className="text-green-600 hover:underline">
                                        Terms and Conditions
                                    </Link>{" "}
                                    and{" "}
                                    <Link href="/privacy" className="text-green-600 hover:underline">
                                        Privacy Policy
                                    </Link>
                                </label>
                            </div>
                            {errors.agreeTerms && (
                                <p className="text-red-500 text-sm mt-1">{errors.agreeTerms}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white py-3 rounded font-medium hover:bg-green-700 transition-colors"
                        >
                                Create Account
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-600">
                            Already have an account?{" "}
                            <Link href="/auth/login" className="text-green-600 hover:underline font-medium">
                                Log in
                            </Link>
                        </p>
                    </div>
                </div>
            </main>

            <footer className="bg-green-800 text-white py-6">
                <div className="container mx-auto px-4 text-center">
                    <p>&copy; {new Date().getFullYear()} GrowSafe Page. All rights reserved.</p>
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

export default SignUp;