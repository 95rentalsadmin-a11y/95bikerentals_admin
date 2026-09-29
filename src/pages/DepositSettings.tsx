import React, { useEffect, useState } from 'react';
import { getSecurityDeposit, updateSecurityDeposit } from '../services/api';

const DepositSettings: React.FC = () => {
  const [securityDeposit, setSecurityDeposit] = useState('500');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSecurityDeposit()
      .then((data) => setSecurityDeposit(String(data.securityDeposit)))
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    const value = Number(securityDeposit);
    if (!Number.isInteger(value) || value < 0) {
      alert('Deposit must be a non-negative whole number');
      return;
    }

    setSaving(true);
    try {
      const data = await updateSecurityDeposit(value);
      setSecurityDeposit(String(data.securityDeposit));
      alert('Security deposit updated');
    } catch (err: any) {
      alert(err.message || 'Failed to update security deposit');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-xl font-semibold text-slate-800">Security Deposit</h3>
        <p className="mt-1 text-sm text-slate-500">This amount applies to all new customer bookings.</p>
        <label className="block max-w-sm mt-6">
          <span className="text-sm text-slate-600">Deposit amount (₹)</span>
          <div className="mt-2 flex gap-3">
            <input
              type="number"
              min="0"
              step="1"
              value={securityDeposit}
              disabled={loading}
              onChange={(e) => setSecurityDeposit(e.target.value)}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-turquoise-blue disabled:bg-slate-100"
            />
            <button
              type="button"
              onClick={save}
              disabled={loading || saving}
              className="px-5 py-2 bg-turquoise-blue text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </label>
      </div>
    </div>
  );
};

export default DepositSettings;
