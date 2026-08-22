'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Package,
  FileSpreadsheet,
  Crown,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  ShieldCheck,
  Building2,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import Button from '@/components/ui/Button';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { admin, isAdminLoggedIn, logoutAdmin } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { label: 'Executive Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Multi-Mode Products', href: '/admin/products', icon: Package },
    { label: 'B2B Quotes (RFQ)', href: '/admin/quotes', icon: FileSpreadsheet },
    { label: 'Special Inquiries', href: '/admin/inquiries', icon: Crown },
    { label: 'Customer Orders', href: '/admin/orders', icon: ShoppingCart },
    { label: 'Admins & Staff Roles', href: '/admin/settings/admins', icon: Users },
  ];

  const handleLogout = () => {
    logoutAdmin();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row font-poppins selection:bg-emerald-500 selection:text-white">
      
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
            BS
          </div>
          <span className="font-bold text-white text-sm">Admin Portal</span>
        </div>
        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-300"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Left Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 border-r border-slate-800 p-5 flex flex-col justify-between transform transition-transform duration-300 md:translate-x-0 md:static ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-lg font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-tight block leading-tight">
                Yugan Ayurved
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold tracking-widest uppercase">
                EXECUTIVE CONSOLE
              </span>
            </div>
          </div>

          {/* User Snapshot */}
          <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
              {admin?.name?.charAt(0) || 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate">{admin?.name || 'Administrator'}</div>
              <div className="text-[10px] text-emerald-400 font-mono font-semibold">
                {admin?.role || 'SUPER_ADMIN'}
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-950'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Links */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <Building2 className="w-4 h-4" />
            <span>Storefront Mode Selector</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs text-red-400 hover:bg-red-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Exit Admin Portal</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-900">
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

    </div>
  );
}
