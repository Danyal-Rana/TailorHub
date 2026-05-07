import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Plus, Trash2, ShoppingBag } from 'lucide-react';
import { mockGetOrders, mockUpdateOrderStatus, mockDeleteOrder } from '../api/mock';

interface Order {
    _id: string;
    customer: { name: string; phone: string } | string;
    dressType: string;
    status: string;
    price: number;
    deliveryDate?: string;
    pickupDate?: string;
}

export const Orders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await api.get('/orders', config);
            setOrders(res.data);
        } catch (err) {
            console.warn("Backend unavailable, using Mock Data for Orders");
            const data = await mockGetOrders();
            setOrders(data);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            try {
                const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await api.delete(`/orders/${id}`, config);
                fetchOrders();
            } catch (err) {
                console.warn("Backend unavailable, using Mock Data for Delete");
                await mockDeleteOrder(id);
                fetchOrders();
            }
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await api.put(`/orders/${id}`, { status: newStatus }, config);
            fetchOrders();
        } catch (err) {
            console.warn("Backend unavailable, using Mock Data for Status Update");
            await mockUpdateOrderStatus(id, newStatus);
            fetchOrders();
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'In Progress': return 'bg-blue-100 text-blue-800';
            case 'Ready': return 'bg-purple-100 text-purple-800';
            case 'Delivered': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
        const customerName = (order.customer as any)?.name?.toLowerCase() || '';
        const matchesSearch = customerName.includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center glass-card p-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Orders</h1>
                    <p className="text-slate-500 font-medium mt-1">Track and manage your tailoring orders</p>
                </div>
                <button
                    onClick={() => window.location.href = '/orders/add'}
                    className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:-translate-y-0.5 font-bold"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    <span>New Order</span>
                </button>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search by customer name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                </div>
                <div className="w-full md:w-48">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white"
                    >
                        <option value="All">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Ready">Ready</option>
                        <option value="Delivered">Delivered</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Dress Type</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Delivery Date</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {filteredOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50/80 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                                            #{order._id.slice(-6)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-gray-900">{(order.customer as any)?.name || 'Unknown'}</div>
                                            <div className="text-xs text-gray-500">{(order.customer as any)?.phone}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {order.dressType || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                            ${order.price}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                                className={`text-xs font-semibold rounded-full px-3 py-1 border-0 focus:ring-2 focus:ring-indigo-500 cursor-pointer ${getStatusColor(order.status)}`}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Ready">Ready</option>
                                                <option value="Delivered">Delivered</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleDelete(order._id)}
                                                className="text-red-400 hover:text-red-900 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-all"
                                                title="Delete Order"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredOrders.length === 0 && (
                        <div className="p-12 text-center">
                            <div className="mx-auto h-12 w-12 text-gray-300 mb-4">
                                <ShoppingBag className="h-12 w-12" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">No orders found</h3>
                            <p className="mt-1 text-gray-500">Try adjusting your filters or create a new order.</p>
                        </div>
                    )}
                </div>
            )}
        </div >
    );
};
