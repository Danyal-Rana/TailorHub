import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Save, ShoppingBag, User, Ruler, Plus } from 'lucide-react';
import { mockGetCustomers, mockGetMeasurements, mockCreateOrder, mockAddCustomer } from '../api/mock';
import { CustomerModal } from '../components/CustomerModal';

interface Customer {
    _id: string;
    name: string;
    phone?: string;
}

interface Measurement {
    _id: string;
    createdAt: string;
    notes?: string;
    chest?: number;
    waist?: number;
}

export const AddOrder = () => {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [measurements, setMeasurements] = useState<Measurement[]>([]);
    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        customerId: '',
        measurementId: '',
        dressType: '',
        fabricDetails: '',
        price: '',
        pickupDate: '',
        deliveryDate: '',
        status: 'Pending'
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await api.get('/customers', config);
            setCustomers(data);
        } catch (err) {
            console.warn('Backend unavailable, using Mock Data for Customers');
            const data = await mockGetCustomers();
            setCustomers(data);
        }
    };

    // Fetch measurements when customer changes
    useEffect(() => {
        if (!formData.customerId) {
            setMeasurements([]);
            return;
        }

        const fetchMeasurements = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await api.get(`/measurements/${formData.customerId}`, config);
                setMeasurements(data);

                // Auto-select latest measurement if available
                if (data.length > 0) {
                    setFormData(prev => ({ ...prev, measurementId: data[0]._id }));
                } else {
                    setFormData(prev => ({ ...prev, measurementId: '' }));
                }
            } catch (err) {
                console.warn('Backend unavailable, using Mock Data for Measurements');
                const data = await mockGetMeasurements(formData.customerId);
                setMeasurements(data);
                if (data.length > 0) {
                    setFormData(prev => ({ ...prev, measurementId: data[0]._id }));
                }
            }
        };
        fetchMeasurements();
    }, [formData.customerId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCreateCustomer = async (customerData: any) => {
        try {
            const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            // Try backend first
            let newCustomer;
            try {
                const { data } = await api.post('/customers', customerData, config);
                newCustomer = data;
            } catch (err) {
                console.warn("Backend failed, using mock add customer");
                newCustomer = await mockAddCustomer(customerData);
            }

            await fetchCustomers();
            setFormData(prev => ({ ...prev, customerId: newCustomer._id }));
            setIsCustomerModalOpen(false);
        } catch (error) {
            console.error("Failed to create customer", error);
            alert("Failed to create customer");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!formData.customerId) {
            setError('Please select a customer');
            setLoading(false);
            return;
        }

        if (!formData.measurementId && measurements.length > 0) {
            // If measurements exist but none selected, require it.
            setError('Please select a measurement');
            setLoading(false);
            return;
        }

        try {
            const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
            const config = { headers: { Authorization: `Bearer ${token}` } };

            await api.post('/orders', formData, config);

            navigate('/orders');
        } catch (err: any) {
            console.warn("Backend order creation failed, attempting mock fallback...", err);
            try {
                await mockCreateOrder(formData);
                alert("Running in Demo Mode: Order created successfully (Mock)");
                navigate('/orders');
            } catch (mockErr) {
                setError('Failed to create order. Please check your connection.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="glass-card p-8">
                <div className="flex items-center space-x-4 mb-6">
                    <div className="bg-indigo-100 p-3 rounded-full text-indigo-600">
                        <ShoppingBag className="h-8 w-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">New Order</h1>
                        <p className="text-slate-500 font-medium">Create a new order for a customer</p>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium flex items-center">
                        <span className="mr-2">⚠️</span> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Customer Selection */}
                        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center justify-between">
                                <div className="flex items-center">
                                    <User className="w-4 h-4 mr-2 text-indigo-500" />
                                    Select Customer
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsCustomerModalOpen(true)}
                                    className="text-indigo-600 text-xs font-bold hover:text-indigo-800 flex items-center bg-indigo-50 px-2 py-1 rounded-lg transition-colors border border-indigo-100 hover:border-indigo-200"
                                >
                                    <Plus className="w-3 h-3 mr-1" />
                                    Add New
                                </button>
                            </label>
                            <select
                                name="customerId"
                                value={formData.customerId}
                                onChange={handleChange}
                                className="block w-full py-3 px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white"
                                required
                            >
                                <option value="">-- Choose a Customer --</option>
                                {customers.map((customer) => (
                                    <option key={customer._id} value={customer._id}>
                                        {customer.name} {customer.phone ? `(${customer.phone})` : ''}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Measurement Selection */}
                        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                                <Ruler className="w-4 h-4 mr-2 text-indigo-500" />
                                Select Measurement
                            </label>
                            <select
                                name="measurementId"
                                value={formData.measurementId}
                                onChange={handleChange}
                                className="block w-full py-3 px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white"
                                required
                                disabled={!formData.customerId}
                            >
                                <option value="">-- Choose Measurement --</option>
                                {measurements.map((m, index) => (
                                    <option key={m._id} value={m._id}>
                                        Measurement #{index + 1} ({new Date(m.createdAt).toLocaleDateString()}) - Chest: {m.chest}"
                                    </option>
                                ))}
                            </select>
                            {formData.customerId && measurements.length === 0 && (
                                <p className="text-sm text-amber-500 mt-2 flex items-center">
                                    <span>⚠️ No measurements found.</span>
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Order Details */}
                    <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
                        <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Order Details</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Dress Type</label>
                                <input
                                    type="text"
                                    name="dressType"
                                    value={formData.dressType}
                                    onChange={handleChange}
                                    placeholder="e.g. Suit, Shirt, Kurta"
                                    className="block w-full py-3 px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Price</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    className="block w-full py-3 px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Fabric Details</label>
                            <textarea
                                name="fabricDetails"
                                value={formData.fabricDetails}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Color, brand, type, etc."
                                className="block w-full py-3 px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Pickup Date</label>
                                <input
                                    type="date"
                                    name="pickupDate"
                                    value={formData.pickupDate}
                                    onChange={handleChange}
                                    className="block w-full py-3 px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Delivery Date</label>
                                <input
                                    type="date"
                                    name="deliveryDate"
                                    value={formData.deliveryDate}
                                    onChange={handleChange}
                                    className="block w-full py-3 px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white"
                                />
                            </div>
                        </div>
                    </div>


                    {/* Submit Button */}
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex items-center px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:-translate-y-0.5 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Creating Order...' : (
                                <>
                                    <Save className="w-5 h-5 mr-2" />
                                    Create Order
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Customer Modal Integration */}
            <CustomerModal
                isOpen={isCustomerModalOpen}
                onClose={() => setIsCustomerModalOpen(false)}
                onSubmit={handleCreateCustomer}
            />
        </div>
    );
};
