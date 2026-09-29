import React, { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaToggleOn, FaToggleOff, FaSearch } from 'react-icons/fa';
import Modal from '../components/Modal';
import { getAllBikes, createBike, updateBike, updateBikeAvailability, uploadBikeImage, API_URL } from '../services/api';
import { Bike } from '../types';

const getImageUrl = (path: string) => {
  if (path.startsWith('/uploads/') || path.startsWith('/api/')) {
    return `${API_URL.replace('/api', '')}${path}`;
  }
  return path;
};

const emptyBike: Bike = {
  id: '',
  name: '',
  image: '/images/placeholder.jpg',
  features: [],
  baseRatePerHour: 0,
  baseRate12Hours: 0,
  baseRate24Hours: 0,
  category: 'motorcycle',
  available: true,
  price1Day: 0,
  price2Days: 0,
  price3Days: 0,
  price7Days: 0,
};

const Bikes: React.FC = () => {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedBike, setSelectedBike] = useState<Bike | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<Bike>(emptyBike);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const data = await getAllBikes();
        setBikes(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load bikes');
      } finally {
        setLoading(false);
      }
    };
    fetchBikes();
  }, []);

  const toggleAvailability = async (id: string) => {
    const bike = bikes.find((b) => b.id === id);
    if (!bike) return;
    try {
      await updateBikeAvailability(id, !bike.available);
      setBikes((prev) =>
        prev.map((b) => (b.id === id ? { ...b, available: !b.available } : b))
      );
    } catch (err: any) {
      alert(err.message || 'Failed to update availability');
    }
  };

  const openAdd = () => {
    setForm(emptyBike);
    setIsAdding(true);
  };

  const openEdit = (bike: Bike) => {
    setForm({ ...bike });
    setSelectedBike(bike);
  };

  const closeModal = () => {
    setSelectedBike(null);
    setIsAdding(false);
  };

  const handleChange = (field: keyof Bike, value: string | number | boolean | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadBikeImage(file);
      setForm((prev) => ({ ...prev, image: url }));
    } catch (err: any) {
      alert(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (isAdding) {
        const { id, ...bikeData } = form;
        const newBike = await createBike(bikeData);
        setBikes((prev) => [...prev, newBike]);
      } else if (selectedBike) {
        const updated = await updateBike(selectedBike.id, form);
        setBikes((prev) => prev.map((b) => (b.id === selectedBike.id ? updated : b)));
      }
      closeModal();
    } catch (err: any) {
      alert(err.message || 'Failed to save bike');
    }
  };

  const filteredBikes = bikes.filter((bike) =>
    bike.name.toLowerCase().includes(search.toLowerCase()) ||
    bike.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-64 bg-white rounded-xl shadow-sm animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search bikes"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-turquoise-blue"
          />
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-turquoise-blue hover:bg-cyan-600 text-white rounded-lg transition-colors text-sm font-medium"
        >
          <FaPlus />
          Add New Bike
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredBikes.map((bike) => (
          <div key={bike.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="h-40 bg-slate-100 flex items-center justify-center overflow-hidden relative">
              <img
                src={getImageUrl(bike.image)}
                alt={bike.name}
                className="h-full w-full object-cover relative z-10"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="text-6xl text-slate-300 absolute z-0">🛵</div>
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-slate-800">{bike.name}</h3>
                  <p className="text-xs text-slate-500 capitalize">{bike.category}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    bike.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {bike.available ? 'Available' : 'Unavailable'}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 my-3">
                {bike.features.slice(0, 3).map((feature) => (
                  <span key={feature} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
                    {feature}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between text-sm text-slate-600 mt-4">
                <div className="space-y-1">
                  <span>₹{bike.baseRate24Hours}/day</span>
                  {bike.price1Day ? (
                    <div className="flex gap-2 text-xs text-slate-400">
                      {bike.price1Day ? <span>1D: ₹{bike.price1Day}</span> : null}
                      {bike.price2Days ? <span>2D: ₹{bike.price2Days}</span> : null}
                      {bike.price3Days ? <span>3D: ₹{bike.price3Days}</span> : null}
                      {bike.price7Days ? <span>7D: ₹{bike.price7Days}</span> : null}
                    </div>
                  ) : null}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(bike)}
                    className="p-2 text-slate-500 hover:text-turquoise-blue transition-colors"
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => toggleAvailability(bike.id)}
                    className={`p-2 transition-colors ${bike.available ? 'text-mint-green' : 'text-slate-400'}`}
                    title="Toggle availability"
                  >
                    {bike.available ? <FaToggleOn /> : <FaToggleOff />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isAdding || !!selectedBike}
        onClose={closeModal}
        title={isAdding ? 'Add New Bike' : 'Edit Bike'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-turquoise-blue"
              placeholder="Honda Activa BS6"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Bike Image</label>
            <div className="flex items-center gap-4">
              {form.image && (
                <img
                  src={getImageUrl(form.image)}
                  alt="Preview"
                  className="w-16 h-16 object-cover rounded-lg border border-slate-200"
                />
              )}
              <label className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm cursor-pointer transition-colors">
                <FaPlus />
                {uploading ? 'Uploading...' : form.image ? 'Change Image' : 'Upload Image'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
            {form.image && (
              <p className="text-xs text-slate-500 mt-2 truncate max-w-xs">{form.image}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Category</label>
            <select
              value={form.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-turquoise-blue"
            >
              <option value="motorcycle">Motorcycle</option>
              <option value="scooter">Scooter</option>
              <option value="electric">Electric</option>
            </select>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Per Hour</label>
              <input
                type="number"
                value={form.baseRatePerHour}
                onChange={(e) => handleChange('baseRatePerHour', Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-turquoise-blue"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">12 Hours</label>
              <input
                type="number"
                value={form.baseRate12Hours}
                onChange={(e) => handleChange('baseRate12Hours', Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-turquoise-blue"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">24 Hours</label>
              <input
                type="number"
                value={form.baseRate24Hours}
                onChange={(e) => handleChange('baseRate24Hours', Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-turquoise-blue"
              />
            </div>
          </div>

          {/* Package pricing */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-2">Package Prices (0 = not available)</label>
            <div className="grid grid-cols-4 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">1 Day</label>
                <input
                  type="number"
                  value={form.price1Day || 0}
                  onChange={(e) => handleChange('price1Day' as keyof Bike, Number(e.target.value))}
                  className="w-full px-2 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-turquoise-blue"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">2 Days</label>
                <input
                  type="number"
                  value={form.price2Days || 0}
                  onChange={(e) => handleChange('price2Days' as keyof Bike, Number(e.target.value))}
                  className="w-full px-2 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-turquoise-blue"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">3 Days</label>
                <input
                  type="number"
                  value={form.price3Days || 0}
                  onChange={(e) => handleChange('price3Days' as keyof Bike, Number(e.target.value))}
                  className="w-full px-2 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-turquoise-blue"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">7 Days</label>
                <input
                  type="number"
                  value={form.price7Days || 0}
                  onChange={(e) => handleChange('price7Days' as keyof Bike, Number(e.target.value))}
                  className="w-full px-2 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-turquoise-blue"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Features (comma separated)</label>
            <input
              type="text"
              value={form.features.join(', ')}
              onChange={(e) => handleChange('features', e.target.value.split(',').map((f) => f.trim()).filter(Boolean))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-turquoise-blue"
              placeholder="100cc Engine, Disc Brake, ..."
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="available"
              type="checkbox"
              checked={form.available}
              onChange={(e) => handleChange('available', e.target.checked)}
              className="w-4 h-4 text-turquoise-blue border-slate-300 rounded focus:ring-turquoise-blue"
            />
            <label htmlFor="available" className="text-sm text-slate-700">Available for booking</label>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              className="flex-1 py-2 bg-turquoise-blue hover:bg-cyan-600 text-white font-medium rounded-lg transition-colors"
            >
              Save
            </button>
            <button
              onClick={closeModal}
              className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Bikes;
