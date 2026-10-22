// src/app/dashboard/elections/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Vote, Plus, ArrowRight, CheckCircle, AlertCircle, Calendar, X } from 'lucide-react';
import api from '@/app/lib/api';

export default function ElectionsListPage() {
  const [elections, setElections] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [candidateInput, setCandidateInput] = useState('');
  const [candidates, setCandidates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const fetchElections = async () => {
    try {
      const res = await api.get('/elections');
      // If you store elections in your overview or a dedicated /elections endpoint, map them here:
      if (res.data && res.data.elections) {
        setElections(res.data.elections);
      }
    } catch (err) {
      console.error('Failed to load elections', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchElections();
  }, []);

  const handleAddCandidate = () => {
    if (candidateInput.trim()) {
      setCandidates([...candidates, candidateInput.trim()]);
      setCandidateInput('');
    }
  };

  const handleCreateElection = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const formattedCandidates = candidates.map((c) => ({ name: c }));
      const res = await api.post('/elections', { title, candidates: formattedCandidates });
      if (res.data.success) {
        setMessage('Election created successfully in DRAFT state!');
        setTitle('');
        setCandidates([]);
        setIsModalOpen(false);
        fetchElections();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create election.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Elections Management</h1>
          <p className="text-sm text-gray-400 mt-1">Manage election configurations, launch active voting cycles, and inspect results.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 transition-colors px-4 py-2.5 rounded-lg text-sm font-medium flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Election</span>
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

      {/* Modal for Creating Election */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 border border-gray-700 w-full max-w-lg rounded-xl p-6 relative space-y-6">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold">Create New Election</h2>

            <form onSubmit={handleCreateElection} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 uppercase mb-1">Election Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g., Student Union Presidential Election 2026"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 uppercase mb-1">Candidates</label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={candidateInput}
                    onChange={(e) => setCandidateInput(e.target.value)}
                    placeholder="Candidate Name"
                    className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddCandidate}
                    className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {candidates.map((c, idx) => (
                    <span key={idx} className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 px-3 py-1 rounded-full text-xs flex items-center space-x-1">
                      <span>{c}</span>
                    </span>
                  ))}
                </div>
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
                  disabled={candidates.length === 0}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 transition-colors py-2.5 rounded-lg font-medium text-sm disabled:opacity-50"
                >
                  Save & Initialize
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Elections List Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Existing Elections</h2>
        {loading ? (
          <p className="text-gray-400 text-sm">Loading elections...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {elections.map((election) => (
              <div key={election.id} className="bg-gray-800 border border-gray-700/60 p-6 rounded-xl flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-indigo-500/10 text-indigo-400 text-xs px-2.5 py-1 rounded-full font-medium uppercase">
                      {election.status}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(election.createdAt).toLocaleDateString()}</span>
                    </span>
                  </div>
                  <h3 className="text-lg font-bold">{election.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">Click below to inspect candidate tallies and verifiable ballot logs.</p>
                </div>

                <button
                  onClick={() => router.push(`/dashboard/elections/${election.id}/results`)}
                  className="flex items-center justify-between bg-gray-900 hover:bg-gray-700/50 border border-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors w-full text-indigo-400"
                >
                  <span>View Results & Ballots</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
            {elections.length === 0 && (
              <p className="text-gray-500 text-sm italic col-span-2">No elections found. Create one using the button above.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
