import React, { useState, useEffect } from 'react';
import { X, Save, User, Plus } from 'lucide-react';
import api from '../api/axios';
import { mockGetCustomers, mockAddCustomer } from '../api/mock';
import { CustomerModal } from './CustomerModal';

interface Customer {
    _id: string;
    name: string;
    phone?: string;
}

interface Measurement {
    _id?: string;
    customerId: string;
    shoulder?: number;
    length?: number;
    bust?: number;
    underBust?: number;
    waist?: number;
    lowWaist?: number;
    hips?: number;
    sleeveLength?: number;
    armHole?: number;
    muscle?: number;
    elbow?: number;
    cuff?: number;
    chest?: number;
    notes?: string;
}

interface MeasurementModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Measurement) => Promise<void>;
    initialData?: Measurement | null;
    defaultCustomerId?: string; // New prop to pre-select customer
}

export const MeasurementModal: React.FC<MeasurementModalProps> = ({ isOpen, onClose, onSubmit, initialData, defaultCustomerId }) => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
    const [formData, setFormData] = useState<Measurement>({
        customerId: defaultCustomerId || '',
        shoulder: 0,
        length: 0,
        bust: 0,
        underBust: 0,
        waist: 0,
        lowWaist: 0,
        hips: 0,
        sleeveLength: 0,
        armHole: 0,
        muscle: 0,
        elbow: 0,
        cuff: 0,
        chest: 0,
        notes: ''
    });
    const [loading, setLoading] = useState(false);

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

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                customerId: defaultCustomerId || '',
                shoulder: '',
                length: '',
                bust: '',
                underBust: '',
                waist: '',
                lowWaist: '',
                hips: '',
                sleeveLength: '',
                armHole: '',
                muscle: '',
                elbow: '',
                cuff: '',
                chest: '',
                notes: ''
            } as any);
        }
    }, [initialData, isOpen, defaultCustomerId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        // Handle numeric inputs properly
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value
        }));
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
        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const measurementFields = [
        { name: 'shoulder', label: 'Shoulder' },
        { name: 'length', label: 'Length' },
        { name: 'bust', label: 'Bust' },
        { name: 'underBust', label: 'Under Bust' },
        { name: 'waist', label: 'Waist' },
        { name: 'lowWaist', label: 'Low Waist' },
        { name: 'hips', label: 'Hips' },
        { name: 'sleeveLength', label: 'Sleeve Full Length' },
        { name: 'armHole', label: 'Arm Hole' },
        { name: 'muscle', label: 'Muscle' },
        { name: 'elbow', label: 'Elbow' },
        { name: 'cuff', label: 'Cuff' },
        { name: 'chest', label: 'Chest' },
    ];

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-900 opacity-75" onClick={onClose}></div>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl w-full animate-in zoom-in-95 duration-200">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="flex justify-between items-start mb-5">
                            <h3 className="text-xl font-bold text-gray-900">
                                {initialData ? 'Edit Measurement' : 'Add New Measurement'}
                            </h3>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-500 transition-colors">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Customer Selection */}
                            <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center justify-between">
                                    <div className="flex items-center">
                                        <User className="w-4 h-4 mr-2 text-indigo-500" />
                                        Select Customer
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setIsCustomerModalOpen(true)}
                                        className="text-indigo-600 text-xs font-bold hover:text-indigo-800 flex items-center bg-indigo-50 px-2 py-1 rounded-lg transition-colors border border-indigo-100 hover:border-indigo-200"
                                        disabled={!!initialData} // Disable adding new on edit mode if desired
                                    >
                                        <Plus className="w-3 h-3 mr-1" />
                                        Add New
                                    </button>
                                </label>
                                <select
                                    name="customerId"
                                    value={formData.customerId}
                                    onChange={handleChange}
                                    className="block w-full py-2.5 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white"
                                    required
                                    disabled={!!initialData} // Disable changing customer on edit if desired, or allow it
                                >
                                    <option value="">-- Choose a Customer --</option>
                                    {customers.map((customer) => (
                                        <option key={customer._id} value={customer._id}>
                                            {customer.name} {customer.phone ? `(${customer.phone})` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Measurement Fields Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {measurementFields.map((field) => (
                                    <div key={field.name}>
                                        <label className="block text-xs font-bold text-gray-700 mb-1">
                                            {field.label}
                                        </label>
                                        <input
                                            type="number"
                                            name={field.name}
                                            value={(formData as any)[field.name]}
                                            onChange={handleChange}
                                            placeholder="0.0"
                                            className="block w-full py-2 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white"
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
                                    rows={3}
                                    placeholder="Any additional details..."
                                    className="block w-full py-2.5 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white"
                                />
                            </div>

                            <div className="mt-5 sm:mt-6 pt-4 border-t border-gray-100 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-md shadow-indigo-200 transition-all flex items-center"
                                >
                                    {loading ? 'Saving...' : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            Save Measurement
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
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
