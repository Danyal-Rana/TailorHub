import { useState, useEffect } from 'react';
import { supabase, Customer, Measurement } from '../lib/supabase';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

export function MeasurementsView() {
  const [measurements, setMeasurements] = useState<(Measurement & { customer: Customer })[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMeasurement, setEditingMeasurement] = useState<Measurement | null>(null);
  const [formData, setFormData] = useState({
    customer_id: '',
    measurement_type: '',
    neck: '',
    chest: '',
    waist: '',
    hips: '',
    shoulder: '',
    sleeve_length: '',
    shirt_length: '',
    inseam: '',
    outseam: '',
    thigh: '',
    notes: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [customersResult, measurementsResult] = await Promise.all([
      supabase.from('customers').select('*').order('name'),
      supabase.from('measurements').select('*, customer:customers(*)').order('created_at', { ascending: false })
    ]);

    if (!customersResult.error && customersResult.data) {
      setCustomers(customersResult.data);
    }

    if (!measurementsResult.error && measurementsResult.data) {
      setMeasurements(measurementsResult.data as any);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const measurementData = {
      customer_id: formData.customer_id,
      measurement_type: formData.measurement_type,
      user_id: user.id,
      neck: formData.neck ? parseFloat(formData.neck) : null,
      chest: formData.chest ? parseFloat(formData.chest) : null,
      waist: formData.waist ? parseFloat(formData.waist) : null,
      hips: formData.hips ? parseFloat(formData.hips) : null,
      shoulder: formData.shoulder ? parseFloat(formData.shoulder) : null,
      sleeve_length: formData.sleeve_length ? parseFloat(formData.sleeve_length) : null,
      shirt_length: formData.shirt_length ? parseFloat(formData.shirt_length) : null,
      inseam: formData.inseam ? parseFloat(formData.inseam) : null,
      outseam: formData.outseam ? parseFloat(formData.outseam) : null,
      thigh: formData.thigh ? parseFloat(formData.thigh) : null,
      notes: formData.notes,
    };

    if (editingMeasurement) {
      const { error } = await supabase
        .from('measurements')
        .update({ ...measurementData, updated_at: new Date().toISOString() })
        .eq('id', editingMeasurement.id);

      if (!error) {
        fetchData();
        closeModal();
      }
    } else {
      const { error } = await supabase
        .from('measurements')
        .insert([measurementData]);

      if (!error) {
        fetchData();
        closeModal();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this measurement?')) {
      const { error } = await supabase
        .from('measurements')
        .delete()
        .eq('id', id);

      if (!error) {
        fetchData();
      }
    }
  };

  const openModal = (measurement?: Measurement) => {
    if (measurement) {
      setEditingMeasurement(measurement);
      setFormData({
        customer_id: measurement.customer_id,
        measurement_type: measurement.measurement_type,
        neck: measurement.neck?.toString() || '',
        chest: measurement.chest?.toString() || '',
        waist: measurement.waist?.toString() || '',
        hips: measurement.hips?.toString() || '',
        shoulder: measurement.shoulder?.toString() || '',
        sleeve_length: measurement.sleeve_length?.toString() || '',
        shirt_length: measurement.shirt_length?.toString() || '',
        inseam: measurement.inseam?.toString() || '',
        outseam: measurement.outseam?.toString() || '',
        thigh: measurement.thigh?.toString() || '',
        notes: measurement.notes || '',
      });
    } else {
      setEditingMeasurement(null);
      setFormData({
        customer_id: '',
        measurement_type: '',
        neck: '',
        chest: '',
        waist: '',
        hips: '',
        shoulder: '',
        sleeve_length: '',
        shirt_length: '',
        inseam: '',
        outseam: '',
        thigh: '',
        notes: '',
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingMeasurement(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Measurements</h2>
        <button
          onClick={() => openModal()}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          disabled={customers.length === 0}
        >
          <Plus className="w-5 h-5" />
          <span>Add Measurement</span>
        </button>
      </div>

      {customers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Please add customers first before creating measurements.
        </div>
      ) : loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : measurements.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No measurements yet. Add your first measurement!
        </div>
      ) : (
        <div className="grid gap-4">
          {measurements.map((measurement) => (
            <div key={measurement.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{measurement.customer.name}</h3>
                  <p className="text-sm text-gray-600">{measurement.measurement_type}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openModal(measurement)}
                    className="text-blue-600 hover:text-blue-800 transition"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(measurement.id)}
                    className="text-red-600 hover:text-red-800 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                {measurement.neck && <div><span className="text-gray-600">Neck:</span> {measurement.neck}"</div>}
                {measurement.chest && <div><span className="text-gray-600">Chest:</span> {measurement.chest}"</div>}
                {measurement.waist && <div><span className="text-gray-600">Waist:</span> {measurement.waist}"</div>}
                {measurement.hips && <div><span className="text-gray-600">Hips:</span> {measurement.hips}"</div>}
                {measurement.shoulder && <div><span className="text-gray-600">Shoulder:</span> {measurement.shoulder}"</div>}
                {measurement.sleeve_length && <div><span className="text-gray-600">Sleeve:</span> {measurement.sleeve_length}"</div>}
                {measurement.shirt_length && <div><span className="text-gray-600">Shirt Length:</span> {measurement.shirt_length}"</div>}
                {measurement.inseam && <div><span className="text-gray-600">Inseam:</span> {measurement.inseam}"</div>}
                {measurement.outseam && <div><span className="text-gray-600">Outseam:</span> {measurement.outseam}"</div>}
                {measurement.thigh && <div><span className="text-gray-600">Thigh:</span> {measurement.thigh}"</div>}
              </div>
              {measurement.notes && (
                <p className="mt-2 text-sm text-gray-600 italic">{measurement.notes}</p>
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
                {editingMeasurement ? 'Edit Measurement' : 'Add Measurement'}
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
                    onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Measurement Type *</label>
                  <select
                    value={formData.measurement_type}
                    onChange={(e) => setFormData({ ...formData, measurement_type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  >
                    <option value="">Select type</option>
                    <option value="Shirt">Shirt</option>
                    <option value="Pants">Pants</option>
                    <option value="Suit">Suit</option>
                    <option value="Dress">Dress</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Neck</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.neck}
                    onChange={(e) => setFormData({ ...formData, neck: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="inches"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chest</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.chest}
                    onChange={(e) => setFormData({ ...formData, chest: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="inches"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Waist</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.waist}
                    onChange={(e) => setFormData({ ...formData, waist: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="inches"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hips</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.hips}
                    onChange={(e) => setFormData({ ...formData, hips: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="inches"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Shoulder</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.shoulder}
                    onChange={(e) => setFormData({ ...formData, shoulder: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="inches"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sleeve Length</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.sleeve_length}
                    onChange={(e) => setFormData({ ...formData, sleeve_length: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="inches"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Shirt Length</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.shirt_length}
                    onChange={(e) => setFormData({ ...formData, shirt_length: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="inches"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Inseam</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.inseam}
                    onChange={(e) => setFormData({ ...formData, inseam: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="inches"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Outseam</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.outseam}
                    onChange={(e) => setFormData({ ...formData, outseam: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="inches"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Thigh</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.thigh}
                    onChange={(e) => setFormData({ ...formData, thigh: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="inches"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  rows={3}
                  placeholder="Additional notes or special instructions..."
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
                  {editingMeasurement ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
