'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  ExternalLink,
  ChevronRight,
  Database,
  User,
  LogOut,
  Sparkles,
  Shield,
  Layers,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminHeader({ onToggleSidebar }) {
  const pathname = usePathname();
  const router = useRouter();
  const { admin, logoutAdmin } = useAuth();
  const [storeDropdownOpen, setStoreDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Generate breadcrumb trail
  const pathParts = pathname.split('/').filter(Boolean);
  const breadcrumbs = pathParts.map((part, index) => {
    const href = '/' + pathParts.slice(0, index + 1).join('/');
    let label = part.charAt(0).toUpperCase() + part.slice(1);
    if (part === 'admin') label = 'Console';
    if (part === 'dashboard') label = 'Dashboard';
    if (part === 'products') label = 'Catalog';
    if (part === 'quotes') label = 'B2B Quotes';
    if (part === 'inquiries') label = 'Special Inquiries';
    if (part === 'orders') label = 'Customer Orders';
    if (part === 'settings') label = 'Settings';
    if (part === 'admins') label = 'Staff & Roles';
    return { label, href, isLast: index === pathParts.length - 1 };
  });

  const handleLogout = () => {
    logoutAdmin();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between transition-all">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
          <Link
            href="/admin/dashboard"
            className="hover:text-emerald-400 transition-colors font-medium flex items-center gap-1.5"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Admin</span>
          </Link>
          {breadcrumbs.slice(1).map((crumb, i) => (
            <React.Fragment key={crumb.href}>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              {crumb.isLast ? (
                <span className="font-semibold text-white truncate max-w-[180px]">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="hover:text-slate-200 transition-colors font-medium"
                >
                  {crumb.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right: DB Health, Storefront Link, User Menu */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Database Status Chip */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-mono">PostgreSQL Active</span>
        </div>

        {/* Storefront Switcher Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setStoreDropdownOpen(!storeDropdownOpen);
              setProfileDropdownOpen(false);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:border-slate-700 transition-all"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Storefronts</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {storeDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl p-1.5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Live Storefront Modes
              </div>
              <Link
                href="/b2c"
                target="_blank"
                onClick={() => setStoreDropdownOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>B2C Retail Portal</span>
                </div>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </Link>
              <Link
                href="/b2b"
                target="_blank"
                onClick={() => setStoreDropdownOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  <span>B2B Wholesale Portal</span>
                </div>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </Link>
              <Link
                href="/special"
                target="_blank"
                onClick={() => setStoreDropdownOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>Special Atelier Suite</span>
                </div>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </Link>
            </div>
          )}
        </div>

        {/* User Profile / Logout Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setProfileDropdownOpen(!profileDropdownOpen);
              setStoreDropdownOpen(false);
            }}
            className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all text-left"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-xs shadow-md">
              {admin?.name?.charAt(0) || 'A'}
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-semibold text-white leading-none truncate max-w-[110px]">
                {admin?.name || 'Administrator'}
              </div>
              <div className="text-[10px] text-emerald-400 font-mono mt-0.5 leading-none">
                {admin?.role || 'SUPER_ADMIN'}
              </div>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl p-1.5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="p-3 border-b border-slate-800/80">
                <div className="text-xs font-bold text-white truncate">
                  {admin?.name || 'Administrator'}
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">
                  {admin?.email || 'admin@yuganayurved.com'}
                </div>
                <span className="inline-block mt-2 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  {admin?.role || 'SUPER_ADMIN'}
                </span>
              </div>
              <div className="p-1 space-y-0.5">
                <Link
                  href="/admin/settings/admins"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                  <span>Staff & Roles</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
