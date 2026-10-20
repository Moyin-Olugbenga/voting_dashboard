// src/app/dashboard/voters/page.tsx
'use client';

import { useState } from 'react';
import { UserPlus, CheckCircle, AlertCircle } from 'lucide-react';
import api from '@/app/lib/api';

export default function VotersPage() {
  const [voterId, setVoterId] = useState('');
  const [name, setName] = useState('');
  const [fingerprintId, setFingerprintId] = useState('');
  const [deviceId, setDeviceId] = useState('device-esp32-01');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegisterVoter = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/voters', {
        voterId,
        name,
        fingerprintId: parseInt(fingerprintId, 10),
        deviceId,
      });

      if (res.data.success) {
        setMessage(`Voter ${name} (${voterId}) registered successfully!`);
        setVoterId('');
        setName('');
        setFingerprintId('');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register voter.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Voter Management</h1>
        <p className="text-sm text-gray-400 mt-1">Register new voters and bind fingerprint references to terminals.</p>
      </div>

      {message && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl flex items-center space-x-3 text-sm">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-center space-x-3 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleRegisterVoter} className="bg-gray-800 border border-gray-700/60 p-6 rounded-xl space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-300 uppercase mb-1">Voter ID / Matric Number</label>
          <input
            type="text"
            value={voterId}
            onChange={(e) => setVoterId(e.target.value)}
            required
            placeholder="e.g., V001"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-300 uppercase mb-1">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g., John Doe"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 uppercase mb-1">Fingerprint Slot ID</label>
            <input
              type="number"
              min="1"
              value={fingerprintId}
              onChange={(e) => setFingerprintId(e.target.value)}
              required
              placeholder="e.g., 1"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 uppercase mb-1">Device Terminal ID</label>
            <input
              type="text"
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
              required
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 transition-colors py-2.5 rounded-lg font-medium text-sm flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <UserPlus className="w-4 h-4" />
          <span>{loading ? 'Registering...' : 'Register Voter'}</span>
        </button>
      </form>
    </div>
  );
}