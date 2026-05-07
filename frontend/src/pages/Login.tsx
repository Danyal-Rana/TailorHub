import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Scissors } from 'lucide-react';
import { Carousel } from '../components/Carousel';
import axios from 'axios';
import { mockLogin } from '../api/mock';

const slides = [
    "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=1600",
    "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=1600",
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1600",
];

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data } = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password,
            });

            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate('/');
        } catch (err: any) {
            console.warn("Backend login failed, attempting mock fallback...", err);

            // Fallback for demo when backend DB is down
            try {
                // For demo: any password works
                const mockData = await mockLogin(email);
                localStorage.setItem('userInfo', JSON.stringify(mockData));
                alert("Running in Demo Mode: Login successful (Mock)");
                navigate('/');
            } catch (mockErr) {
                setError(err.response?.data?.message || 'Invalid email or password');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side - Login Form */}
            {/* Removed h-screen and overflow-hidden */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 animate-in slide-in-from-left duration-700">
                <div className="max-w-md w-full space-y-8">
                    {/* Brand */}
                    <div className="flex items-center space-x-3 mb-10">
                        <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-200">
                            <Scissors className="h-7 w-7 text-white" />
                        </div>
                        <span className="text-2xl font-black text-gray-900 tracking-tighter">Tailors Hub</span>
                    </div>

                    <div>
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
                            Welcome Back!
                        </h2>
                        <p className="text-slate-500 text-lg">
                            Sign in to access your tailoring dashboard.
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg shadow-sm" role="alert">
                            <p className="font-bold">Login Failed</p>
                            <p>{error}</p>
                        </div>
                    )}

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        className="block w-full pl-11 pr-4 py-4 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all bg-gray-50 hover:bg-white"
                                        placeholder="admin@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-bold text-gray-700">Password</label>
                                    <a href="#" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">
                                        Forgot password?
                                    </a>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        className="block w-full pl-11 pr-4 py-4 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all bg-gray-50 hover:bg-white"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                type="checkbox"
                                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 font-medium cursor-pointer">
                                Remember me
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-xl shadow-indigo-200 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:-translate-y-1 active:translate-y-0 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Validating...
                                </span>
                            ) : (
                                <span className="flex items-center">
                                    Sign In <ArrowRight className="ml-2 h-5 w-5" />
                                </span>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-500 text-sm">
                            Don't have an account?{' '}
                            <a href="/register" className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors">
                                Create Account
                            </a>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Carousel */}
            {/* Added sticky to keep it visible while scrolling left side */}
            <div className="hidden lg:block w-1/2 sticky top-0 h-screen bg-gray-900 animate-in slide-in-from-right duration-700 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent z-10"></div>

                <Carousel
                    images={slides}
                    autoSlide={true}
                    autoSlideInterval={5000}
                    className="w-full h-full object-cover"
                />

                <div className="absolute bottom-16 left-12 right-12 z-20 text-white">
                    <h2 className="text-4xl font-extrabold mb-4 leading-tight">
                        Manage Your Tailoring Business with Ease.
                    </h2>
                    <p className="text-lg text-gray-200">
                        Track orders, manage customers, and organize measurements all in one place.
                    </p>
                </div>
            </div>
        </div>
    );
};
