import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Plus, Trash2, Ruler, Search, Edit2 } from 'lucide-react';
import { MeasurementModal } from '../components/MeasurementModal';
import { mockGetMeasurements, mockAddMeasurement, mockUpdateMeasurement, mockDeleteMeasurement, mockGetCustomers } from '../api/mock';

interface Measurement {
    _id: string;
    customerId: string;
    customerName?: string; // We'll map this manually
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
    createdAt: string;
}

export const Measurements = () => {
    const [measurements, setMeasurements] = useState<Measurement[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMeasurement, setSelectedMeasurement] = useState<Measurement | null>(null);

    useEffect(() => {
        fetchMeasurements();
    }, []);

    const fetchMeasurements = async () => {
        setLoading(true);
        try {
            const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token;
            const config = { headers: { Authorization: `Bearer ${token}` } };

            // Try real API first
            try {
                const { data } = await api.get('/measurements', config);
                // Note: The real API might not return all measurements if endpoint doesn't exist yet,
                // or if it expects a customer ID. Assuming for now we have a general GET endpoint or use mock.
                // If real API fails (404/500), catch block below handles it.
                // For this implementation, since backend doesn't have a "get all measurements" endpoint likely,
                // we might rely on mock data primarily or assume it exists.
                // Let's assume we need to fetch customers to map names if backend doesn't populate them.
                setMeasurements(data);
            } catch (backendErr) {
                console.warn("Backend unavailable/endpoint missing, using Mock Data for Measurements");
                const data = await mockGetMeasurements();
                const customers = await mockGetCustomers();

                // Map customer names to measurements for display
                const mappedData = data.map((m: any) => {
                    const customer = customers.find((c: any) => c._id === m.customerId);
                    return { ...m, customerName: customer ? customer.name : 'Unknown Customer' };
                });
                setMeasurements(mappedData);
            }

        } catch (err) {
            console.error('Failed to fetch measurements', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (data: any) => {
        try {
            if (data._id) {
                await mockUpdateMeasurement(data._id, data);
            } else {
                await mockAddMeasurement(data);
            }
            fetchMeasurements();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to save", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this measurement?")) return;
        try {
            await mockDeleteMeasurement(id);
            fetchMeasurements();
        } catch (error) {
            console.error("Failed to delete", error);
        }
    };

    const handleEdit = (measurement: Measurement) => {
        setSelectedMeasurement(measurement);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setSelectedMeasurement(null);
        setIsModalOpen(true);
    };

    const filteredMeasurements = measurements.filter(m =>
        (m.customerName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (m.notes?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center glass-card p-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Measurements</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage customer measurement records</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:-translate-y-0.5 font-bold"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    <span>Add Measurement</span>
                </button>
            </div>

            {/* Search */}
            <div className="glass-card p-4">
                <div className="relative">
                    <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by customer name or notes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
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
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Chest</th>
                                    <th className="px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Waist</th>
                                    <th className="px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Hips</th>
                                    <th className="px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Length</th>
                                    <th className="px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Shoulder</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Notes</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {filteredMeasurements.map((m) => (
                                    <tr key={m._id} className="hover:bg-gray-50/80 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                                                    <Ruler className="h-4 w-4" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-bold text-gray-900">{m.customerName || 'Unknown'}</div>
                                                    <div className="text-xs text-gray-500">{new Date(m.createdAt).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{m.chest || '-'}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{m.waist || '-'}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{m.hips || '-'}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{m.length || '-'}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{m.shoulder || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">{m.notes}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() => handleEdit(m)}
                                                    className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 p-2 rounded-lg transition-all"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(m._id)}
                                                    className="text-red-400 hover:text-red-900 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-all"
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
                </div>
            )}

            <MeasurementModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSave}
                initialData={selectedMeasurement}
            />
        </div>
    );
};
