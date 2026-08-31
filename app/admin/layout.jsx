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
  UserCheck,
  User,
  UserCog,
  Settings,
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
        { label: 'Executive Profile', href: '/admin/settings/profile', icon: UserCog },
      ],
    },
  ];

  const handleLogout = () => {
    logoutAdmin();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex font-poppins selection:bg-emerald-600 selection:text-white">
      
      {/* Mobile Drawer Overlay Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation (Pure Light) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200/90 p-5 flex flex-col justify-between transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-64 xl:w-72 shrink-0 shadow-sm ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center justify-between px-1">
            <Link href="/admin/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-900/15 group-hover:scale-105 transition-transform duration-200">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 tracking-tight block leading-tight group-hover:text-emerald-700 transition-colors">
                  Yugan Ayurved
                </span>
                <span className="text-[9px] text-emerald-700 font-bold tracking-widest uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  EXECUTIVE PORTAL
                </span>
              </div>
            </Link>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Groups */}
          <nav className="space-y-5">
            {navGroups.map((group) => (
              <div key={group.title} className="space-y-1">
                <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
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
                        className={`group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon
                            className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                              isActive ? 'text-emerald-700' : 'text-slate-400 group-hover:text-slate-700'
                            }`}
                          />
                          <span>{item.label}</span>
                        </div>

                        {item.badge && (
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded-md font-mono font-semibold ${
                              isActive
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}

                        {/* Active Pill Indicator */}
                        {isActive && (
                          <span className="absolute left-0 top-2 bottom-2 w-1 bg-emerald-600 rounded-r-full" />
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
        <div className="pt-4 border-t border-slate-100 space-y-3">
          {/* Storefront Jump */}
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 hover:border-slate-300 transition-all group"
          >
            <div className="flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>View Live Storefront</span>
            </div>
            <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-slate-600" />
          </Link>

          {/* User Card with direct link to Profile */}
          <div className="bg-slate-50 border border-slate-200/80 p-2.5 rounded-2xl flex items-center justify-between gap-2 shadow-2xs group">
            <Link
              href="/admin/settings/profile"
              className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-80 transition-opacity"
              title="Edit Profile"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs overflow-hidden">
                {admin?.avatar ? (
                  <img
                    src={admin.avatar}
                    alt={admin?.name || 'Admin'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{admin?.name?.charAt(0) || 'A'}</span>
                )}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate leading-tight group-hover:text-emerald-700 transition-colors">
                  {admin?.name || 'Administrator'}
                </div>
                <div className="text-[10px] text-emerald-700 font-mono font-semibold truncate leading-tight">
                  {admin?.role || 'SUPER_ADMIN'}
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-1">
              <Link
                href="/admin/settings/profile"
                title="Edit Profile"
                className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
              >
                <UserCog className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                title="Sign Out"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
        <AdminHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-150">
          {children}
        </main>
      </div>

    </div>
  );
}
