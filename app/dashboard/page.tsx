// src/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Vote, ShieldCheck, Activity, LogOut } from 'lucide-react';
import api from '../lib/api';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await api.get('/admin/dashboard/overview');
        setMetrics(res.data.metrics);
      } catch (err: any) {
        // Redirect to login if unauthorized
        router.push('/login');
        // console.log('API Error Response:', err.response?.data);
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="animate-pulse text-indigo-400">Loading system metrics...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Top Navbar */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur sticky top-0 z-10 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <ShieldCheck className="w-6 h-6 text-indigo-400" />
          <h1 className="font-bold tracking-tight text-lg">Voting System Admin Dashboard</h1>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 text-sm text-gray-400 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gray-800 border border-gray-700/60 p-6 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Total Registered Voters</p>
              <p className="text-3xl font-bold mt-2">{metrics?.totalVoters || 0}</p>
            </div>
            <div className="bg-indigo-500/10 p-3 rounded-lg text-indigo-400">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700/60 p-6 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Total Votes Recorded</p>
              <p className="text-3xl font-bold mt-2">{metrics?.totalVotesRecorded || 0}</p>
            </div>
            <div className="bg-emerald-500/10 p-3 rounded-lg text-emerald-400">
              <Vote className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700/60 p-6 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Active Elections</p>
              <p className="text-3xl font-bold mt-2">{metrics?.activeElections || 0}</p>
            </div>
            <div className="bg-amber-500/10 p-3 rounded-lg text-amber-400">
              <Activity className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700/60 p-6 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Total Elections</p>
              <p className="text-3xl font-bold mt-2">{metrics?.totalElections || 0}</p>
            </div>
            <div className="bg-blue-500/10 p-3 rounded-lg text-blue-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Quick Actions / Instructions */}
        <div className="bg-gray-800 border border-gray-700/60 p-6 rounded-xl">
          <h2 className="text-lg font-semibold mb-2">System Status & Operations</h2>
          <p className="text-sm text-gray-400">
            The backend API is successfully running and communicating with your PostgreSQL database and ESP32 simulation endpoints. Use Postman or build out sub-pages here to configure new candidates, activate elections, and inspect cryptographic voting session logs.
          </p>
        </div>
      </main>
    </div>
  );
}