import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
            <Head>
                <title>GrowSafe Page | Secure Your Financial Future</title>
                <meta name="description" content="GrowSafe Page - Smart and secure investment options for your financial growth" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <header className="container mx-auto px-4 py-6">
                <nav className="flex justify-between items-center">
                    <div className="text-green-700 font-bold text-xl">
                        GrowSafe
                    </div>
                    <div className="space-x-4">
                        <Link href="/auth/login">
                            <button className="px-4 py-2 text-green-700 border border-green-600 rounded hover:bg-green-600 hover:text-white transition-colors">
                                Login
                            </button>
                        </Link>
                        <Link href="/auth/signup">
                            <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                                Sign Up
                            </button>
                        </Link>
                    </div>
                </nav>
            </header>

            <main className="container mx-auto px-4 pt-20 pb-16">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-5xl font-bold text-green-800 mb-8">GrowSafe Page</h1>

                    <p className="text-xl text-gray-700 mb-6">
                        Your trusted partner for secure and sustainable financial growth.
                    </p>

                    <div className="bg-white rounded-lg shadow-lg p-8 mt-12">
                        <h2 className="text-2xl font-semibold text-green-700 mb-4">Why Choose GrowSafe?</h2>

                        <div className="grid md:grid-cols-3 gap-8 mt-8">
                            <div className="text-center">
                                <div className="bg-green-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                    </svg>
                                </div>
                                <h3 className="font-medium text-gray-800 mb-2">Secure Page</h3>
                                <p className="text-gray-600">Bank-level security protocols to protect your assets at all times.</p>
                            </div>

                            <div className="text-center">
                                <div className="bg-green-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                                <h3 className="font-medium text-gray-800 mb-2">Steady Growth</h3>
                                <p className="text-gray-600">Diversified portfolios designed for consistent long-term returns.</p>
                            </div>

                            <div className="text-center">
                                <div className="bg-green-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                                    </svg>
                                </div>
                                <h3 className="font-medium text-gray-800 mb-2">Expert Guidance</h3>
                                <p className="text-gray-600">Personalized advice from certified financial advisors.</p>
                            </div>
                        </div>

                        <div className="mt-10">
                            <Link href="/learn-more">
                                <button className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-lg">
                                    Learn More
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="bg-green-800 text-white py-8">
                <div className="container mx-auto px-4 text-center">
                    <p>&copy; {new Date().getFullYear()} GrowSafe Page. All rights reserved.</p>
                    <div className="mt-4">
                        <Link href="/terms" className="text-green-200 mx-2 hover:underline">Terms</Link>
                        <Link href="/privacy" className="text-green-200 mx-2 hover:underline">Privacy</Link>
                        <Link href="/contact" className="text-green-200 mx-2 hover:underline">Contact</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}