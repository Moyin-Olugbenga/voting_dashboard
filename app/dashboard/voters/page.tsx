// src/app/dashboard/voters/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Users, Plus, CheckCircle, AlertCircle, Fingerprint, Calendar, X } from 'lucide-react';
import api from '@/app/lib/api';
export default function VotersListPage() {
  const [voters, setVoters] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [voterId, setVoterId] = useState('');
  const [name, setName] = useState('');
  const [fingerprintId, setFingerprintId] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchVoters = async () => {
    try {
      // Adjust endpoint if your backend route differs (e.g. /admin/voters)
      const res = await api.get('/admin/voters');
      if (res.data) {
        setVoters(res.data.voters || res.data);
      }
    } catch (err) {
      console.error('Failed to load voters', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVoters();
  }, []);

  const handleCreateVoter = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await api.post('/voters', {
        voterId,
        name,
        fingerprintId: parseInt(fingerprintId, 10),
      });

      if (res.data.success || res.status === 201) {
        setMessage('Voter registered successfully!');
        setVoterId('');
        setName('');
        setFingerprintId('');
        setIsModalOpen(false);
        fetchVoters();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register voter.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Voters Management</h1>
          <p className="text-sm text-gray-400 mt-1">Register eligible voters, assign fingerprint biometric IDs, and track participation.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 transition-colors px-4 py-2.5 rounded-lg text-sm font-medium flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Register Voter</span>
        </button>
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

      {/* Modal for Registering New Voter */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 border border-gray-700 w-full max-w-lg rounded-xl p-6 relative space-y-6">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold flex items-center space-x-2">
              <Users className="w-5 h-5 text-indigo-400" />
              <span>Register New Voter</span>
            </h2>

            <form onSubmit={handleCreateVoter} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 uppercase mb-1">Voter ID / Matric Number</label>
                <input
                  type="text"
                  value={voterId}
                  onChange={(e) => setVoterId(e.target.value)}
                  required
                  placeholder="e.g., SAX/4657/467"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 font-mono"
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

              <div>
                <label className="block text-xs font-medium text-gray-300 uppercase mb-1">Fingerprint Template ID</label>
                <input
                  type="number"
                  value={fingerprintId}
                  onChange={(e) => setFingerprintId(e.target.value)}
                  required
                  placeholder="e.g., 1"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 transition-colors py-2.5 rounded-lg font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 transition-colors py-2.5 rounded-lg font-medium text-sm"
                >
                  Save Voter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Voters List Table / Grid */}
      <div className="bg-gray-800 border border-gray-700/60 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center space-x-2">
            <Users className="w-5 h-5 text-indigo-400" />
            <span>Registered Voters Directory</span>
          </h2>
          <span className="text-xs text-gray-400">Total: {voters.length} registered</span>
        </div>

        {loading ? (
          <div className="p-8 text-gray-400 text-sm">Loading voters list...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-900/50 text-gray-400 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3">Voter ID</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Fingerprint Slot</th>
                  <th className="px-6 py-3">Registered Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {voters.map((voter) => (
                  <tr key={voter.id || voter.voterId} className="hover:bg-gray-700/20">
                    <td className="px-6 py-4 font-mono text-indigo-300">{voter.voterId}</td>
                    <td className="px-6 py-4 font-medium">{voter.name}</td>
                    <td className="px-6 py-4 font-mono text-gray-300 flex items-center space-x-1">
                      <Fingerprint className="w-4 h-4 text-indigo-400" />
                      <span>#{voter.fingerprintId}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {voter.createdAt ? new Date(voter.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
                {voters.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500 italic">
                      No voters registered yet. Click "Register Voter" above to add one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
