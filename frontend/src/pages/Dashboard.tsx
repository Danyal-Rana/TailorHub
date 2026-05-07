import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Carousel } from '../components/Carousel';
import { ShoppingBag, Clock, CheckCircle, Users, Package } from 'lucide-react';

const slides = [
    "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=1600",
    "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=1600",
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1600",
];

export const Dashboard = () => {
    const [stats, setStats] = useState({ totalOrders: 0, pendingOrders: 0, completedOrders: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userInfo = localStorage.getItem('userInfo');
                if (!userInfo) {
                    navigate('/login');
                    return;
                }

                const { token } = JSON.parse(userInfo);
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };

                const { data: orders } = await api.get('/orders', config);

                const totalOrders = orders.length;
                const pendingOrders = orders.filter((o: any) => o.status === 'Pending').length;
                const completedOrders = orders.filter((o: any) => o.status === 'Delivered').length;

                setStats({
                    totalOrders,
                    pendingOrders,
                    completedOrders,
                });
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
                // navigate('/login'); // Optional: redirect on error if 401
            }
        };
        fetchData();
    }, [navigate]);

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <header>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Dashboard</h1>
                <p className="text-slate-500 font-medium mt-2">Welcome back! Here's what's happening today.</p>
            </header>

            {/* Carousel Section */}
            <section className="glass-card overflow-hidden p-2">
                <Carousel images={slides} autoSlide={true} />
            </section>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="glass-card p-8 group hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                    <h2 className="text-slate-400 text-sm font-bold uppercase tracking-wider">Total Orders</h2>
                    <div className="flex items-end justify-between mt-4">
                        <p className="text-5xl font-black text-slate-900">{stats.totalOrders}</p>
                        <div className="bg-indigo-100 p-3 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            <ShoppingBag className="w-6 h-6" />
                        </div>
                    </div>
                </div>
                <div className="glass-card p-8 group hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                    <h2 className="text-slate-400 text-sm font-bold uppercase tracking-wider">Pending Orders</h2>
                    <div className="flex items-end justify-between mt-4">
                        <p className="text-5xl font-black text-slate-900">{stats.pendingOrders}</p>
                        <div className="bg-amber-100 p-3 rounded-2xl text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                            <Clock className="w-6 h-6" />
                        </div>
                    </div>
                </div>
                <div className="glass-card p-8 group hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                    <h2 className="text-slate-400 text-sm font-bold uppercase tracking-wider">Completed Orders</h2>
                    <div className="flex items-end justify-between mt-4">
                        <p className="text-5xl font-black text-slate-900">{stats.completedOrders}</p>
                        <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                            <CheckCircle className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-12">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <button
                        onClick={() => navigate('/orders/add')}
                        className="flex items-center p-4 bg-white rounded-2xl shadow-sm border border-indigo-100 hover:shadow-md hover:border-indigo-200 transition-all group text-left"
                    >
                        <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors mr-4">
                            <ShoppingBag className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">New Order</h3>
                            <p className="text-sm text-slate-500">Create a new order</p>
                        </div>
                    </button>

                    <button
                        onClick={() => navigate('/customers')}
                        className="flex items-center p-4 bg-white rounded-2xl shadow-sm border border-emerald-100 hover:shadow-md hover:border-emerald-200 transition-all group text-left"
                    >
                        <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors mr-4">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">Add Customer</h3>
                            <p className="text-sm text-slate-500">Register a new client</p>
                        </div>
                    </button>

                    <button
                        onClick={() => navigate('/inventory')}
                        className="flex items-center p-4 bg-white rounded-2xl shadow-sm border border-amber-100 hover:shadow-md hover:border-amber-200 transition-all group text-left"
                    >
                        <div className="bg-amber-100 p-3 rounded-xl text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors mr-4">
                            <Package className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">Update Stock</h3>
                            <p className="text-sm text-slate-500">Manage inventory</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};
