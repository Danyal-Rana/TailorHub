import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Save, Ruler, User } from 'lucide-react';

interface Customer {
    _id: string;
    name: string;
}

export const AddMeasurement = () => {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [formData, setFormData] = useState({
        customerId: '',
        chest: '',
        waist: '',
        shoulder: '',
        sleeves: '',
        length: '',
        notes: '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await api.get('/customers', config);
                setCustomers(data);
            } catch (err) {
                console.error('Failed to fetch customers', err);
            }
        };
        fetchCustomers();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (!formData.customerId) {
            setError('Please select a customer');
            setLoading(false);
            return;
        }

        try {
            const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
            const config = { headers: { Authorization: `Bearer ${token}` } };

            await api.post('/measurements', formData, config);

            setSuccess('Measurement added successfully!');
            setFormData({
                customerId: '',
                chest: '',
                waist: '',
                shoulder: '',
                sleeves: '',
                length: '',
                notes: '',
            });

            // Optional: Navigate back or clear form
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to add measurement');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="glass-card p-8">
                <div className="flex items-center space-x-4 mb-6">
                    <div className="bg-indigo-100 p-3 rounded-full text-indigo-600">
                        <Ruler className="h-8 w-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Add Measurement</h1>
                        <p className="text-slate-500 font-medium">Record new measurements for a customer</p>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium flex items-center">
                        <span className="mr-2">⚠️</span> {error}
                    </div>
                )}

                {success && (
                    <div className="mb-6 bg-green-50 text-green-600 p-4 rounded-xl text-sm font-medium flex items-center">
                        <span className="mr-2">✅</span> {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Customer Selection */}
                    <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                            <User className="w-4 h-4 mr-2 text-indigo-500" />
                            Select Customer
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

                    {/* Measurement Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {['chest', 'waist', 'shoulder', 'sleeves', 'length'].map((field) => (
                            <div key={field}>
                                <label className="block text-sm font-bold text-gray-700 mb-2 capitalize">
                                    {field} (inches)
                                </label>
                                <input
                                    type="number"
                                    name={field}
                                    value={(formData as any)[field]}
                                    onChange={handleChange}
                                    placeholder={`Enter ${field}`}
                                    className="block w-full py-3 px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Notes</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Any additional details..."
                            className="block w-full py-3 px-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex items-center px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:-translate-y-0.5 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Saving...' : (
                                <>
                                    <Save className="w-5 h-5 mr-2" />
                                    Save Measurement
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
