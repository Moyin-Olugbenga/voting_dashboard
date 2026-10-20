// src/app/dashboard/layout.tsx
'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Vote, Users, ShieldCheck, LogOut } from 'lucide-react';

interface DashboardNavProps {
  children: React.ReactNode;
}

function DashboardNav({ children }: DashboardNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/login');
  };

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Elections', href: '/dashboard/elections', icon: Vote },
    { name: 'Voters', href: '/dashboard/voters', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex w-full">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-800 bg-gray-900/50 p-6 flex flex-col justify-between hidden md:flex">
        <div>
          <div className="flex items-center space-x-3 mb-8">
            <ShieldCheck className="w-6 h-6 text-indigo-400" />
            <span className="font-bold tracking-tight">Admin Portal</span>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </aside>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-900 text-gray-400 flex items-center justify-center">Loading dashboard...</div>}>
      <DashboardNav>{children}</DashboardNav>
    </Suspense>
  );
}