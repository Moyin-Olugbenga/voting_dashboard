// src/app/dashboard/elections/[id]/results/page.tsx
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useParams } from 'next/navigation';
import { BarChart2, ShieldCheck, Clock, Award, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import api from '@/app/lib/api';

function ElectionResultsContent() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [ballots, setBallots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');
  const [actionError, setActionError] = useState('');

  const fetchResultsAndBallots = async () => {
    try {
      const [resResults, resBallots] = await Promise.all([
        api.get(`/admin/dashboard/elections/${id}/results`),
        api.get(`/admin/dashboard/elections/${id}/ballots`),
      ]);
      setData(resResults.data);
      setBallots(resResults.data.ballots);
    } catch (err) {
      console.error('Failed to load election results', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchResultsAndBallots();
  }, [id]);

  const handleCloseElection = async () => {
    setActionMessage('');
    setActionError('');
    try {
      const res = await api.patch(`/elections/${id}/status`, { status: 'CLOSED' });
      if (res.data.success) {
        setActionMessage('Election closed successfully. Ballot box locked.');
        fetchResultsAndBallots();
      }
    } catch (err: any) {
      setActionError(err.response?.data?.message || 'Failed to close election.');
    }
  };

  if (loading) {
    return <div className="text-gray-400 p-8">Loading election analytics...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header & Status Control */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gray-800 border border-gray-700/60 p-6 rounded-xl">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h1 className="text-2xl font-bold tracking-tight">{data?.title}</h1>
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-semibold uppercase ${
                data?.status === 'ACTIVE'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'bg-red-500/10 text-red-400 border border-red-500/30'
              }`}
            >
              {data?.status}
            </span>
          </div>
          <p className="text-sm text-gray-400">Total Votes Cast: <span className="text-indigo-400 font-bold">{data?.totalVotes}</span></p>
        </div>

        {data?.status === 'ACTIVE' && (
          <button
            onClick={handleCloseElection}
            className="bg-red-600 hover:bg-red-500 transition-colors px-4 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center space-x-2"
          >
            <Lock className="w-4 h-4" />
            <span>Close Election</span>
          </button>
        )}
      </div>

      {actionMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl flex items-center space-x-3 text-sm">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {actionError && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-center space-x-3 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Candidate Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data?.results.map((candidate: any) => (
          <div key={candidate.candidateId} className="bg-gray-800 border border-gray-700/60 p-6 rounded-xl relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-gray-400">Candidate</p>
                <h3 className="text-lg font-bold mt-1">{candidate.name}</h3>
              </div>
              <div className="bg-indigo-500/10 p-2.5 rounded-lg text-indigo-400">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-indigo-400">{candidate.voteCount} <span className="text-xs font-normal text-gray-400">votes</span></p>
          </div>
        ))}
      </div>

      {/* Anonymous Ballot Audit Trail */}
      <div className="bg-gray-800 border border-gray-700/60 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <span>Verified Anonymous Ballot Audit Log</span>
          </h2>
          <span className="text-xs text-gray-400">Ensures secret ballot integrity</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-900/50 text-gray-400 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Ballot #</th>
                <th className="px-6 py-3">Selected Candidate</th>
                <th className="px-6 py-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {ballots.map((b: any) => (
                <tr key={b.ballotNo} className="hover:bg-gray-700/20">
                  <td className="px-6 py-4 font-mono text-indigo-300">#{b.ballotNo}</td>
                  <td className="px-6 py-4 font-medium">{b.candidateName}</td>
                  <td className="px-6 py-4 text-gray-400 flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(b.castAt).toLocaleString()}</span>
                  </td>
                </tr>
              ))}
              {ballots.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                    No ballots recorded yet for this election.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function ElectionResultsPage() {
  return (
    <Suspense fallback={<div className="text-gray-400 p-8">Loading results...</div>}>
      <ElectionResultsContent />
    </Suspense>
  );
}