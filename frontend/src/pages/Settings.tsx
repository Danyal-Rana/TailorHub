import { useState } from 'react';
import { Bell, Store } from 'lucide-react';

export const Settings = () => {
    const [shopName, setShopName] = useState('Tailors Hub');
    const [email, setEmail] = useState('admin@tailorshub.com');
    const [currency, setCurrency] = useState('USD');
    const [notifications, setNotifications] = useState({
        email: true,
        browser: false,
        sms: true,
    });
    const [loading, setLoading] = useState(false);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Mock save
        setTimeout(() => {
            setLoading(false);
            alert('Settings saved!');
        }, 1000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700">
            <header>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Settings</h1>
                <p className="text-slate-500 font-medium mt-2">Manage your account and shop preferences</p>
            </header>

            {/* Profile Settings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                    <div className="flex items-center space-x-3">
                        <Store className="w-5 h-5 text-indigo-600" />
                        <h2 className="text-lg font-medium text-gray-900">Shop Profile</h2>
                    </div>
                </div>
                <div className="p-6">
                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                            <div className="sm:col-span-4">
                                <label htmlFor="shop-name" className="block text-sm font-medium text-gray-700">
                                    Shop Name
                                </label>
                                <div className="mt-1 flex rounded-md shadow-sm">
                                    <input
                                        type="text"
                                        name="shop-name"
                                        id="shop-name"
                                        value={shopName}
                                        onChange={(e) => setShopName(e.target.value)}
                                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Contact Email
                                </label>
                                <div className="mt-1 flex rounded-md shadow-sm">
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-6">
                                <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                                    Shop Address
                                </label>
                                <div className="mt-1">
                                    <textarea
                                        id="about"
                                        name="about"
                                        rows={3}
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                                        defaultValue={"123 Fashion Ave, Design District, NY 10001"}
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                                    Currency
                                </label>
                                <select
                                    id="currency"
                                    name="currency"
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    <option>USD ($)</option>
                                    <option>EUR (€)</option>
                                    <option>GBP (£)</option>
                                    <option>INR (₹)</option>
                                </select>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                    <div className="flex items-center space-x-3">
                        <Bell className="w-5 h-5 text-indigo-600" />
                        <h2 className="text-lg font-medium text-gray-900">Notifications</h2>
                    </div>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        <div className="flex items-start">
                            <div className="flex h-5 items-center">
                                <input
                                    id="email_notify"
                                    name="email_notify"
                                    type="checkbox"
                                    checked={notifications.email}
                                    onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="email_notify" className="font-medium text-gray-700">Email Notifications</label>
                                <p className="text-gray-500">Get emails for new orders and low stock alerts.</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="flex h-5 items-center">
                                <input
                                    id="sms_notify"
                                    name="sms_notify"
                                    type="checkbox"
                                    checked={notifications.sms}
                                    onChange={(e) => setNotifications({ ...notifications, sms: e.target.checked })}
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="sms_notify" className="font-medium text-gray-700">SMS Notifications</label>
                                <p className="text-gray-500">Get text messages for urgent appointent updates.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={loading}
                    className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70"
                >
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </div>
    );
};
