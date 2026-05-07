import { useState, useEffect } from 'react';
import { supabase, Customer, Measurement, Order } from '../lib/supabase';
import { Plus, Edit2, Trash2, X, Clock, CheckCircle, AlertCircle } from 'lucide-react';

type OrderWithRelations = Order & {
  customer: Customer;
  measurement?: Measurement | null;
};

export function OrdersView() {
  const [orders, setOrders] = useState<OrderWithRelations[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [formData, setFormData] = useState({
    customer_id: '',
    measurement_id: '',
    garment_type: '',
    fabric_details: '',
    design_notes: '',
    total_amount: '',
    status: 'Pending' as 'Pending' | 'In Progress' | 'Delivered',
    delivery_date: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [customersResult, measurementsResult, ordersResult] = await Promise.all([
      supabase.from('customers').select('*').order('name'),
      supabase.from('measurements').select('*'),
      supabase.from('orders').select('*, customer:customers(*), measurement:measurements(*)').order('created_at', { ascending: false })
    ]);

    if (!customersResult.error && customersResult.data) {
      setCustomers(customersResult.data);
    }

    if (!measurementsResult.error && measurementsResult.data) {
      setMeasurements(measurementsResult.data);
    }

    if (!ordersResult.error && ordersResult.data) {
      setOrders(ordersResult.data as any);
    }
    setLoading(false);
  };

  const generateOrderNumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORD${year}${month}${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const orderData = {
      customer_id: formData.customer_id,
      measurement_id: formData.measurement_id || null,
      user_id: user.id,
      garment_type: formData.garment_type,
      fabric_details: formData.fabric_details,
      design_notes: formData.design_notes,
      total_amount: parseFloat(formData.total_amount),
      status: formData.status,
      delivery_date: formData.delivery_date || null,
    };

    if (editingOrder) {
      const { error } = await supabase
        .from('orders')
        .update({ ...orderData, updated_at: new Date().toISOString() })
        .eq('id', editingOrder.id);

      if (!error) {
        fetchData();
        closeModal();
      }
    } else {
      const { error } = await supabase
        .from('orders')
        .insert([{ ...orderData, order_number: generateOrderNumber() }]);

      if (!error) {
        fetchData();
        closeModal();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this order?')) {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);

      if (!error) {
        fetchData();
      }
    }
  };

  const openModal = (order?: Order) => {
    if (order) {
      setEditingOrder(order);
      setFormData({
        customer_id: order.customer_id,
        measurement_id: order.measurement_id || '',
        garment_type: order.garment_type,
        fabric_details: order.fabric_details || '',
        design_notes: order.design_notes || '',
        total_amount: order.total_amount.toString(),
        status: order.status,
        delivery_date: order.delivery_date ? new Date(order.delivery_date).toISOString().split('T')[0] : '',
      });
    } else {
      setEditingOrder(null);
      setFormData({
        customer_id: '',
        measurement_id: '',
        garment_type: '',
        fabric_details: '',
        design_notes: '',
        total_amount: '',
        status: 'Pending',
        delivery_date: '',
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingOrder(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'In Progress':
        return <AlertCircle className="w-5 h-5 text-blue-600" />;
      case 'Delivered':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = filterStatus === 'All'
    ? orders
    : orders.filter(order => order.status === filterStatus);

  const customerMeasurements = measurements.filter(m => m.customer_id === formData.customer_id);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Orders</h2>
        <button
          onClick={() => openModal()}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          disabled={customers.length === 0}
        >
          <Plus className="w-5 h-5" />
          <span>Create Order</span>
        </button>
      </div>

      <div className="mb-6 flex space-x-2">
        {['All', 'Pending', 'In Progress', 'Delivered'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterStatus === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {customers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Please add customers first before creating orders.
        </div>
      ) : loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {filterStatus === 'All' ? 'No orders yet. Create your first order!' : `No ${filterStatus.toLowerCase()} orders.`}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg p-5 border-2 border-gray-200 hover:border-blue-300 transition">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-bold text-lg text-gray-900">{order.order_number}</h3>
                    <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span>{order.status}</span>
                    </div>
                  </div>
                  <p className="text-gray-700 font-medium">{order.customer.name}</p>
                  <p className="text-sm text-gray-600">{order.garment_type}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openModal(order)}
                    className="text-blue-600 hover:text-blue-800 transition"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(order.id)}
                    className="text-red-600 hover:text-red-800 transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3 text-sm">
                {order.fabric_details && (
                  <div><span className="text-gray-600">Fabric:</span> {order.fabric_details}</div>
                )}
                <div><span className="text-gray-600">Amount:</span> ${order.total_amount.toFixed(2)}</div>
                {order.delivery_date && (
                  <div><span className="text-gray-600">Delivery:</span> {new Date(order.delivery_date).toLocaleDateString()}</div>
                )}
                <div><span className="text-gray-600">Order Date:</span> {new Date(order.order_date).toLocaleDateString()}</div>
              </div>

              {order.design_notes && (
                <p className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <span className="font-medium">Notes:</span> {order.design_notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl my-8">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                {editingOrder ? 'Edit Order' : 'Create Order'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer *</label>
                  <select
                    value={formData.customer_id}
                    onChange={(e) => setFormData({ ...formData, customer_id: e.target.value, measurement_id: '' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  >
                    <option value="">Select customer</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>{customer.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Measurement</label>
                  <select
                    value={formData.measurement_id}
                    onChange={(e) => setFormData({ ...formData, measurement_id: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    disabled={!formData.customer_id}
                  >
                    <option value="">Select measurement (optional)</option>
                    {customerMeasurements.map((measurement) => (
                      <option key={measurement.id} value={measurement.id}>
                        {measurement.measurement_type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Garment Type *</label>
                  <input
                    type="text"
                    value={formData.garment_type}
                    onChange={(e) => setFormData({ ...formData, garment_type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="e.g., Shirt, Pants, Suit"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.total_amount}
                    onChange={(e) => setFormData({ ...formData, total_amount: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Date</label>
                  <input
                    type="date"
                    value={formData.delivery_date}
                    onChange={(e) => setFormData({ ...formData, delivery_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fabric Details</label>
                <input
                  type="text"
                  value={formData.fabric_details}
                  onChange={(e) => setFormData({ ...formData, fabric_details: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Type, color, pattern, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Design Notes</label>
                <textarea
                  value={formData.design_notes}
                  onChange={(e) => setFormData({ ...formData, design_notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  rows={3}
                  placeholder="Special design requirements or instructions..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  {editingOrder ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
