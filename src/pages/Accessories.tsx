import React, { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import Modal from '../components/Modal';
import { getAllAccessories, createAccessory, updateAccessory, deleteAccessory, Accessory } from '../services/api';

const Accessories: React.FC = () => {
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Accessory | null>(null);
  const [form, setForm] = useState({ name: '', description: '', pricePerDay: 0, available: true });

  const fetchAccessories = async () => {
    try {
      const data = await getAllAccessories();
      setAccessories(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load accessories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccessories();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', description: '', pricePerDay: 0, available: true });
    setModalOpen(true);
  };

  const openEdit = (acc: Accessory) => {
    setEditing(acc);
    setForm({ name: acc.name, description: acc.description, pricePerDay: acc.pricePerDay, available: acc.available });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateAccessory(editing.id, form);
      } else {
        await createAccessory(form);
      }
      setModalOpen(false);
      fetchAccessories();
    } catch (err: any) {
      alert(err.message || 'Failed to save accessory');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this accessory?')) return;
    try {
      await deleteAccessory(id);
      fetchAccessories();
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-14 bg-white rounded-xl shadow-sm animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">Accessories</h3>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-turquoise-blue text-white rounded-lg text-sm font-medium hover:bg-mint-green transition-colors"
        >
          <FaPlus /> Add Accessory
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Description</th>
                <th className="px-6 py-3 font-medium">Price/Day</th>
                <th className="px-6 py-3 font-medium">Available</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {accessories.map((acc) => (
                <tr key={acc.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-800">{acc.name}</td>
                  <td className="px-6 py-4 text-slate-600">{acc.description || '—'}</td>
                  <td className="px-6 py-4 text-slate-800">₹{acc.pricePerDay}</td>
                  <td className="px-6 py-4">
                    {acc.available ? (
                      <span className="text-green-600"><FaCheck className="inline" /></span>
                    ) : (
                      <span className="text-red-500"><FaTimes className="inline" /></span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(acc)} className="p-2 text-slate-500 hover:text-turquoise-blue" title="Edit">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(acc.id)} className="p-2 text-slate-500 hover:text-hot-pink" title="Delete">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {accessories.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400">No accessories yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Accessory' : 'Add Accessory'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-turquoise-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-turquoise-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Price per day (₹) *</label>
            <input
              type="number"
              value={form.pricePerDay}
              onChange={(e) => setForm({ ...form, pricePerDay: Number(e.target.value) })}
              required
              min="0"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-turquoise-blue"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="accAvailable"
              checked={form.available}
              onChange={(e) => setForm({ ...form, available: e.target.checked })}
            />
            <label htmlFor="accAvailable" className="text-sm font-medium text-slate-700">Available for booking</label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="flex-1 py-2 bg-mint-green text-white font-medium rounded-lg hover:bg-green-600 transition-colors">
              {editing ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Accessories;
