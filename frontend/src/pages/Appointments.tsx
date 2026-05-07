import { useState } from 'react';
import { Calendar, Clock, User, Phone, CheckCircle, Plus } from 'lucide-react';

interface Appointment {
    id: string;
    customerName: string;
    date: string; // ISO date string
    time: string;
    type: 'Fitting' | 'Consultation' | 'Pickup' | 'Alteration';
    status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';
    contact: string;
    notes?: string;
}

const MOCK_APPOINTMENTS: Appointment[] = [
    {
        id: '1',
        customerName: 'James Wilson',
        date: '2025-12-20',
        time: '10:00 AM',
        type: 'Consultation',
        status: 'Confirmed',
        contact: '+1 (555) 123-4567',
        notes: 'Wedding suit discussion'
    },
    {
        id: '2',
        customerName: 'Sarah Miller',
        date: '2025-12-20',
        time: '02:30 PM',
        type: 'Fitting',
        status: 'Pending',
        contact: '+1 (555) 987-6543',
        notes: 'First fitting for evening gown'
    },
    {
        id: '3',
        customerName: 'Robert Chen',
        date: '2025-12-21',
        time: '11:15 AM',
        type: 'Pickup',
        status: 'Confirmed',
        contact: '+1 (555) 456-7890'
    },
    {
        id: '4',
        customerName: 'Emma Davis',
        date: '2025-12-21',
        time: '04:00 PM',
        type: 'Alteration',
        status: 'Completed',
        contact: '+1 (555) 789-0123',
        notes: 'Hem shortening'
    },
];

export const Appointments = () => {
    const [filterStatus, setFilterStatus] = useState<string>('All');

    // Sort logic (mocked logic for date sorting could go here, but list is short)

    const filteredAppointments = MOCK_APPOINTMENTS.filter(apt =>
        filterStatus === 'All' || apt.status === filterStatus
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Confirmed': return 'bg-blue-100 text-blue-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Completed': return 'bg-green-100 text-green-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'Fitting': return <User className="w-4 h-4 mr-1 text-indigo-500" />;
            case 'Pickup': return <CheckCircle className="w-4 h-4 mr-1 text-green-500" />;
            case 'Consultation': return <Calendar className="w-4 h-4 mr-1 text-blue-500" />;
            default: return <Clock className="w-4 h-4 mr-1 text-gray-500" />;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center glass-card p-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Appointments</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage fittings, consultations, and pick-ups</p>
                </div>
                <button className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:-translate-y-0.5 font-bold">
                    <Plus className="w-5 h-5 mr-2" />
                    New Appointment
                </button>
            </div>

            {/* Filters */}
            <div className="flex space-x-2 overflow-x-auto pb-2">
                {['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filterStatus === status
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Appointments List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upcoming Section (Mock split by date or simply listing all for now) */}
                <div className="lg:col-span-2 space-y-4">
                    {filteredAppointments.length > 0 ? (
                        filteredAppointments.map((apt) => (
                            <div key={apt.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                                <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0 bg-indigo-50 rounded-lg p-3 text-center min-w-[80px]">
                                            <div className="text-xs font-bold text-indigo-600 uppercase mb-1">
                                                {new Date(apt.date).toLocaleDateString('en-US', { month: 'short' })}
                                            </div>
                                            <div className="text-2xl font-bold text-gray-900">
                                                {new Date(apt.date).getDate()}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {apt.time}
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">{apt.customerName}</h3>
                                            <div className="flex items-center text-sm text-gray-500 mt-1 space-x-4">
                                                <span className="flex items-center">
                                                    {getTypeIcon(apt.type)}
                                                    {apt.type}
                                                </span>
                                                <span className="flex items-center">
                                                    <Phone className="w-3 h-3 mr-1" />
                                                    {apt.contact}
                                                </span>
                                            </div>
                                            {apt.notes && (
                                                <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded border border-gray-100 inline-block">
                                                    <span className="font-medium text-xs text-gray-500 mr-2">NOTE:</span>
                                                    {apt.notes}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-4 sm:mt-0 flex flex-col items-end space-y-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                                            {apt.status}
                                        </span>
                                        <div className="flex space-x-2">
                                            <button className="text-xs text-gray-500 hover:text-indigo-600 underline">Reschedule</button>
                                            <button className="text-xs text-gray-500 hover:text-red-600 underline">Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                            <Calendar className="mx-auto h-12 w-12 text-gray-300" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments found</h3>
                            <p className="mt-1 text-sm text-gray-500">There are no appointments with this status.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
