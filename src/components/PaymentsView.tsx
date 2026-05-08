import { useState, useEffect } from 'react';
// import { supabase, Order, Payment, Customer } from '../lib/supabase';
import { Plus, X, DollarSign, CreditCard } from 'lucide-react';

// Temporary type definitions
type Customer = {
  id: string;
  name: string;
};

type Order = {
  id: string;
  order_number: string;
  customer_id: string;
  total_amount: number;
  garment_type: string;
};

type Payment = {
  id: string;
  order_id: string;
  amount: number;
  payment_method: string;
  payment_date: string;
  notes?: string;
};

type PaymentWithOrder = Payment & {
  order: Order & { customer: Customer };
};

export function PaymentsView() {
  const [payments, setPayments] = useState<PaymentWithOrder[]>([]);
  const [orders, setOrders] = useState<(Order & { customer: Customer })[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    order_id: '',
    amount: '',
    payment_method: 'Cash',
    payment_date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    /*
    const [ordersResult, paymentsResult] = await Promise.all([
      supabase.from('orders').select('*, customer:customers(*)').order('created_at', { ascending: false }),
      supabase.from('payments').select('*, order:orders(*, customer:customers(*))').order('payment_date', { ascending: false })
    ]);

    if (!ordersResult.error && ordersResult.data) {
      setOrders(ordersResult.data as any);
    }

    if (!paymentsResult.error && paymentsResult.data) {
      setPayments(paymentsResult.data as any);
    }
    */
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    /*
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('payments')
      .insert([{
        order_id: formData.order_id,
        user_id: user.id,
        amount: parseFloat(formData.amount),
        payment_method: formData.payment_method,
        payment_date: new Date(formData.payment_date).toISOString(),
        notes: formData.notes || null,
      }]);

    if (!error) {
      fetchData();
      closeModal();
    }
    */
  };

  const openModal = () => {
    setFormData({
      order_id: '',
      amount: '',
      payment_method: 'Cash',
      payment_date: new Date().toISOString().split('T')[0],
      notes: '',
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const getTotalPaymentsForOrder = (orderId: string) => {
    return payments
      .filter(p => p.order_id === orderId)
      .reduce((sum, p) => sum + p.amount, 0);
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'Cash':
        return <DollarSign className="w-4 h-4" />;
      case 'Card':
      case 'Online':
        return <CreditCard className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  const selectedOrder = orders.find(o => o.id === formData.order_id);
  const totalPaid = selectedOrder ? getTotalPaymentsForOrder(selectedOrder.id) : 0;
  const remainingAmount = selectedOrder ? selectedOrder.total_amount - totalPaid : 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Payments</h2>
        <button
          onClick={openModal}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          disabled={orders.length === 0}
        >
          <Plus className="w-5 h-5" />
          <span>Record Payment</span>
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Please create orders first before recording payments.
        </div>
      ) : loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : (
        <div>
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Payments</h3>
            {payments.length === 0 ? (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                No payments recorded yet.
              </div>
            ) : (
              <div className="space-y-3">
                {payments.slice(0, 10).map((payment) => (
                  <div key={payment.id} className="bg-white rounded-lg p-4 border-2 border-gray-200 hover:border-blue-300 transition">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-semibold text-gray-900">{payment.order.customer.name}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-sm text-gray-600">{payment.order.order_number}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            {getPaymentMethodIcon(payment.payment_method)}
                            <span>{payment.payment_method}</span>
                          </div>
                          <span>{new Date(payment.payment_date).toLocaleDateString()}</span>
                        </div>
                        {payment.notes && (
                          <p className="text-sm text-gray-600 mt-2 italic">{payment.notes}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          ${payment.amount.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Summary by Order</h3>
            <div className="space-y-3">
              {orders.map((order) => {
                const totalPaidForOrder = getTotalPaymentsForOrder(order.id);
                const remaining = order.total_amount - totalPaidForOrder;
                const isPaid = remaining <= 0;

                return (
                  <div key={order.id} className={`bg-white rounded-lg p-4 border-2 ${
                    isPaid ? 'border-green-200 bg-green-50' : 'border-gray-200'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-semibold text-gray-900">{order.order_number}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-sm text-gray-600">{order.customer.name}</span>
                        </div>
                        <div className="text-sm text-gray-600">{order.garment_type}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600 mb-1">
                          Total: ${order.total_amount.toFixed(2)}
                        </div>
                        <div className="text-sm font-medium text-blue-600">
                          Paid: ${totalPaidForOrder.toFixed(2)}
                        </div>
                        {isPaid ? (
                          <div className="text-sm font-semibold text-green-600 mt-1">
                            Fully Paid
                          </div>
                        ) : (
                          <div className="text-sm font-semibold text-red-600 mt-1">
                            Due: ${remaining.toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Record Payment</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Order *</label>
                <select
                  value={formData.order_id}
                  onChange={(e) => setFormData({ ...formData, order_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                >
                  <option value="">Select order</option>
                  {orders.map((order) => (
                    <option key={order.id} value={order.id}>
                      {order.order_number} - {order.customer.name} - ${order.total_amount.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              {selectedOrder && (
                <div className="bg-blue-50 p-3 rounded-lg text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Order Total:</span>
                    <span className="font-semibold">${selectedOrder.total_amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Already Paid:</span>
                    <span className="font-semibold text-green-600">${totalPaid.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-blue-200">
                    <span className="text-gray-700 font-medium">Remaining:</span>
                    <span className="font-bold text-blue-700">${remainingAmount.toFixed(2)}</span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method *</label>
                <select
                  value={formData.payment_method}
                  onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                >
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="Online">Online</option>
                  <option value="Check">Check</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Date *</label>
                <input
                  type="date"
                  value={formData.payment_date}
                  onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  rows={2}
                  placeholder="Optional payment notes..."
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
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
