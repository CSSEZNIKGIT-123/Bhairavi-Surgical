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
  Building2,
  X,
  ShieldCheck,
  LogOut,
  ChevronRight,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { admin, logoutAdmin } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navGroups = [
    {
      title: 'OVERVIEW',
      items: [
        { label: 'Executive Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'COMMERCE & CATALOG',
      items: [
        { label: 'Multi-Mode Products', href: '/admin/products', icon: Package, badge: '93 SKUs' },
        { label: 'Customer Orders', href: '/admin/orders', icon: ShoppingCart },
        { label: 'B2B Quotes (RFQ)', href: '/admin/quotes', icon: FileSpreadsheet },
        { label: 'Special Inquiries', href: '/admin/inquiries', icon: Crown },
      ],
    },
    {
      title: 'SYSTEM & GOVERNANCE',
      items: [
        { label: 'Staff & Roles (RBAC)', href: '/admin/settings/admins', icon: Users },
      ],
    },
  ];

  const handleLogout = () => {
    logoutAdmin();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex font-poppins selection:bg-emerald-500 selection:text-white">
      
      {/* Mobile Drawer Overlay Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0E131F]/95 backdrop-blur-2xl border-r border-slate-800/80 p-5 flex flex-col justify-between transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-64 xl:w-72 shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center justify-between px-1">
            <Link href="/admin/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-emerald-950 border border-emerald-400/20 group-hover:scale-105 transition-transform duration-200">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-white tracking-tight block leading-tight group-hover:text-emerald-300 transition-colors">
                  Yugan Ayurved
                </span>
                <span className="text-[9px] text-emerald-400 font-semibold tracking-widest uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  EXECUTIVE PORTAL
                </span>
              </div>
            </Link>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Groups */}
          <nav className="space-y-5">
            {navGroups.map((group) => (
              <div key={group.title} className="space-y-1">
                <div className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  {group.title}
                </div>

                <div className="space-y-1 pt-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-emerald-600/15 text-emerald-300 font-semibold border border-emerald-500/30 shadow-sm'
                            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/70 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                              isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'
                            }`}
                          />
                          <span>{item.label}</span>
                        </div>

                        {item.badge && (
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded-md font-mono font-medium ${
                              isActive
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}

                        {/* Active Pill Indicator */}
                        {isActive && (
                          <span className="absolute left-0 top-2 bottom-2 w-1 bg-emerald-400 rounded-r-full" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer: Storefront Link & Profile Widget */}
        <div className="pt-4 border-t border-slate-800/80 space-y-3">
          {/* Storefront Jump */}
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400 hover:text-white hover:border-slate-700 transition-all group"
          >
            <div className="flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>View Live Storefront</span>
            </div>
            <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-slate-300" />
          </Link>

          {/* User Card */}
          <div className="bg-slate-900/80 border border-slate-800/90 p-2.5 rounded-2xl flex items-center justify-between gap-2 shadow-inner">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
                {admin?.name?.charAt(0) || 'A'}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate leading-tight">
                  {admin?.name || 'Administrator'}
                </div>
                <div className="text-[10px] text-emerald-400 font-mono font-semibold truncate leading-tight">
                  {admin?.role || 'SUPER_ADMIN'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0B0F17]">
        <AdminHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-200">
          {children}
        </main>
      </div>

    </div>
  );
}
