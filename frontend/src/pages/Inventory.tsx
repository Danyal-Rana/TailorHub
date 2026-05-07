import { useState, useEffect } from 'react';
import { Package, Plus, Search, AlertTriangle, Filter, Trash2, Edit2 } from 'lucide-react';
import { InventoryModal } from '../components/InventoryModal';
import { mockGetInventory, mockAddInventoryItem, mockUpdateInventoryItem, mockDeleteInventoryItem } from '../api/mock';

interface InventoryItem {
    _id: string;
    name: string;
    category: string;
    stock: number;
    unit: string;
    price: number;
    supplier: string;
    minStock?: number; // Optional for now as modal doesn't capture it yet
}

export const Inventory = () => {
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState<string>('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        // In a real app, this would be api.get('/inventory')
        // For now, we use mock directly as we haven't set up the backend controller for inventory yet
        const data = await mockGetInventory();
        setInventory(data as any);
    };

    const handleSaveItem = async (itemData: any) => {
        try {
            if (itemData._id) {
                await mockUpdateInventoryItem(itemData._id, itemData);
            } else {
                await mockAddInventoryItem(itemData);
            }
            fetchInventory();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to save item", error);
        }
    };

    const handleDeleteItem = async (id: string, name: string) => {
        if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
        await mockDeleteInventoryItem(id);
        fetchInventory();
    };

    const handleEditItem = (item: InventoryItem) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleAddItem = () => {
        setSelectedItem(null);
        setIsModalOpen(true);
    };

    // Filter logic
    const filteredItems = inventory.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.supplier && item.supplier.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = ['All', 'Fabric', 'Button', 'Thread', 'Zipper', 'Other'];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center glass-card p-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Inventory</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage fabrics, materials, and stock levels</p>
                </div>
                <button
                    onClick={handleAddItem}
                    className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:-translate-y-0.5 font-bold"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Item
                </button>
            </div>

            {/* Filters and Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-3 glass-card p-4 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search inventory..."
                            className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="relative w-full md:w-48">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <select
                            className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2 appearance-none bg-white"
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Low Stock Alert Summary */}
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 flex items-center justify-between">
                    <div className="flex items-center">
                        <AlertTriangle className="w-5 h-5 text-orange-500 mr-2" />
                        <span className="font-medium text-orange-900">Low Stock</span>
                    </div>
                    <span className="text-2xl font-bold text-orange-700">
                        {inventory.filter(i => i.stock <= (i.minStock || 10)).length}
                    </span>
                </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Level</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredItems.map((item) => (
                                <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 rounded bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                                                <Package className="w-4 h-4" />
                                            </div>
                                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                            ${item.category === 'Fabric' ? 'bg-blue-100 text-blue-800' :
                                                item.category === 'Button' ? 'bg-yellow-100 text-yellow-800' :
                                                    item.category === 'Thread' ? 'bg-green-100 text-green-800' :
                                                        'bg-gray-100 text-gray-800'}`}>
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <span className={`text-sm font-medium ${item.stock <= (item.minStock || 10) ? 'text-red-600' : 'text-gray-900'}`}>
                                                {item.stock} {item.unit}
                                            </span>
                                            {item.stock <= (item.minStock || 10) && (
                                                <AlertTriangle className="w-4 h-4 text-red-500 ml-2" />
                                            )}
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2 max-w-[100px]">
                                            <div
                                                className={`h-1.5 rounded-full ${item.stock <= (item.minStock || 10) ? 'bg-red-500' : 'bg-green-500'}`}
                                                style={{ width: `${Math.min((item.stock / ((item.minStock || 10) * 3)) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        ${item.price.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {item.supplier}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                onClick={() => handleEditItem(item)}
                                                className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-2 rounded-lg"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteItem(item._id, item.name)}
                                                className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-lg"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredItems.length === 0 && (
                    <div className="text-center py-10">
                        <p className="text-gray-500">No items found matching your filters.</p>
                    </div>
                )}
            </div>

            <InventoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSaveItem}
                initialData={selectedItem}
            />
        </div>
    );
};
