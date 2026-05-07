import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Plus, Search, Ruler, Edit2, Trash2 } from 'lucide-react';
import { MeasurementModal } from '../components/MeasurementModal';
import { CustomerModal } from '../components/CustomerModal';
import { mockGetCustomers, mockSearchCustomers, mockAddCustomer, mockUpdateCustomer, mockDeleteCustomer } from '../api/mock';

interface Customer {
    _id: string;
    name: string;
    phone: string;
    email?: string;
    address?: string;
    measurements?: any;
}

export const Customers = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isMeasurementModalOpen, setIsMeasurementModalOpen] = useState(false);
    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const res = await api.get('/customers');
            setCustomers(res.data);
        } catch (err) {
            console.warn("Backend unavailable, using Mock Data");
            const data = await mockGetCustomers();
            setCustomers(data);
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.get(`/customers/search?q=${searchTerm}`);
            setCustomers(res.data);
        } catch (err) {
            const data = await mockSearchCustomers(searchTerm);
            setCustomers(data);
        }
    };

    const handleSaveCustomer = async (customerData: Partial<Customer>) => {
        try {
            if (customerData._id) {
                // Update
                try {
                    await api.put(`/customers/${customerData._id}`, customerData);
                } catch {
                    await mockUpdateCustomer(customerData._id, customerData);
                }
            } else {
                // Create
                try {
                    await api.post('/customers', customerData);
                } catch {
                    await mockAddCustomer(customerData);
                }
            }
            fetchCustomers();
            setIsCustomerModalOpen(false);
        } catch (error) {
            console.error("Failed to save customer", error);
            alert("Failed to save customer. Please try again.");
        }
    };

    const handleDeleteCustomer = async (id: string, name: string) => {
        if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;

        try {
            await api.delete(`/customers/${id}`);
        } catch {
            await mockDeleteCustomer(id);
        }
        fetchCustomers();
    };

    const handleOpenMeasurements = (customer: Customer) => {
        setSelectedCustomer(customer);
        setIsMeasurementModalOpen(true);
    };

    const handleEditCustomer = (customer: Customer) => {
        setSelectedCustomer(customer);
        setIsCustomerModalOpen(true);
    };

    const handleAddCustomer = () => {
        setSelectedCustomer(null);
        setIsCustomerModalOpen(true);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center glass-card p-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Customers</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage your client list and measurements</p>
                </div>
                <button
                    onClick={handleAddCustomer}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-2xl shadow-lg shadow-indigo-200 flex items-center space-x-2 hover:bg-indigo-700 transition-all transform hover:-translate-y-0.5 font-bold"
                >
                    <Plus className="h-5 w-5" />
                    <span>Add Customer</span>
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-8 w-full max-w-md">
                <form onSubmit={handleSearch} className="relative group">
                    <input
                        type="text"
                        placeholder="Search customers by name or phone..."
                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all text-gray-700 placeholder-gray-400 group-hover:shadow-md"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            if (e.target.value === '') fetchCustomers();
                        }}
                    />
                    <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </form>
            </div>

            {/* Customers Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Address</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {customers.map((customer) => (
                                <tr key={customer._id} className="hover:bg-gray-50/80 transition-colors duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-lg">
                                                {customer.name.charAt(0)}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{customer.phone}</div>
                                        {customer.email && <div className="text-xs text-gray-500">{customer.email}</div>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {customer.address || <span className="text-gray-300 italic">No address</span>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-3">
                                            <button
                                                onClick={() => handleOpenMeasurements(customer)}
                                                className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-2 rounded-lg transition-colors"
                                                title="Measurements"
                                            >
                                                <Ruler className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleEditCustomer(customer)}
                                                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCustomer(customer._id, customer.name)}
                                                className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {customers.length === 0 && (
                    <div className="p-12 text-center">
                        <div className="mx-auto h-12 w-12 text-gray-300 mb-4">
                            <Search className="h-12 w-12" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No customers found</h3>
                        <p className="mt-1 text-gray-500">Try adjusting your search or add a new customer.</p>
                    </div>
                )}
            </div>

            {selectedCustomer && (
                <MeasurementModal
                    isOpen={isMeasurementModalOpen}
                    onClose={() => {
                        setIsMeasurementModalOpen(false);
                        setSelectedCustomer(null);
                    }}
                    defaultCustomerId={selectedCustomer._id}
                    initialData={selectedCustomer.measurements} // Assuming measurements is a single object here, otherwise this might need adjustment if it's an array
                    onSubmit={async (data) => {
                        // Decide what to do here. If it's adding new measurements or updating.
                        // For now let's assume we are updating the customer with new measurements.
                        if (selectedCustomer) {
                            const updatedCustomer = { ...selectedCustomer, measurements: data };
                            await handleSaveCustomer(updatedCustomer);
                        }
                    }}
                />
            )}

            <CustomerModal
                isOpen={isCustomerModalOpen}
                onClose={() => setIsCustomerModalOpen(false)}
                onSubmit={handleSaveCustomer}
                initialData={selectedCustomer}
            />
        </div>
    );
};
