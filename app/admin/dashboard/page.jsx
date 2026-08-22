'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Package,
  FileSpreadsheet,
  Crown,
  Users,
  ShoppingCart,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Button from '@/components/ui/Button';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin/stats');
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
          setRecentOrders(data.recentOrders || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const kpis = [
    {
      title: 'Total Platform Revenue',
      value: stats ? formatCurrency(stats.totalRevenue) : '—',
      desc: 'Across B2C, B2B & Special orders',
      icon: TrendingUp,
      color: 'from-emerald-600 to-teal-700',
    },
    {
      title: 'Pending B2B Quotes',
      value: stats ? `${stats.pendingQuotes} RFQs` : '—',
      desc: `${stats?.totalQuotes || 0} total quotations in pipeline`,
      icon: FileSpreadsheet,
      color: 'from-blue-600 to-indigo-700',
    },
    {
      title: 'Special Inquiries',
      value: stats ? `${stats.newInquiries} New` : '—',
      desc: `${stats?.totalInquiries || 0} bespoke suites registered`,
      icon: Crown,
      color: 'from-amber-600 to-yellow-700',
    },
    {
      title: 'Active Catalog SKUs',
      value: stats ? `${stats.totalProducts} Items` : '—',
      desc: 'Configured across multi-modes',
      icon: Package,
      color: 'from-purple-600 to-violet-700',
    },
  ];

  return (
    <div className="space-y-8 font-poppins">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Executive Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time overview of wholesale procurement, retail transactions, and bespoke commissions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/products">
            <button className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md">
              + Manage Catalog
            </button>
          </Link>
          <Link href="/admin/quotes">
            <button className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700">
              Review RFQs
            </button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-slate-950 p-5 rounded-3xl border border-slate-800 space-y-3 shadow-soft"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {kpi.title}
                </span>
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${kpi.color} flex items-center justify-center text-white shadow-sm`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white font-poppins">
                {kpi.value}
              </div>
              <p className="text-[11px] text-slate-400">{kpi.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Main Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Recent Transactions (8 Cols) */}
        <div className="lg:col-span-8 bg-slate-950 rounded-3xl p-6 border border-slate-800 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-base font-bold text-white">Recent Customer Orders</h2>
            <Link href="/admin/orders" className="text-xs font-bold text-emerald-400 hover:underline">
              View All Orders →
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-500">
              No recent orders recorded in database.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Order ID</th>
                    <th className="py-2.5 px-3">Mode</th>
                    <th className="py-2.5 px-3">Customer / Organization</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900 text-slate-200">
                  {recentOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-900/60 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          ord.mode === 'B2B'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {ord.mode}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-medium">
                        <div>{ord.customerName}</div>
                        {ord.companyName && (
                          <div className="text-[10px] text-slate-400">{ord.companyName}</div>
                        )}
                      </td>
                      <td className="py-3 px-3 font-bold font-poppins">
                        {formatCurrency(ord.totalAmount)}
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40">
                          {ord.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Management Shortcuts (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 shadow-soft space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-800">
              Quick Admin Actions
            </h3>

            <div className="space-y-2.5">
              <Link
                href="/admin/products"
                className="block p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs transition-colors"
              >
                <div className="font-bold text-white flex items-center justify-between">
                  <span>Product Mode Visibility</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Toggle B2B, B2C, and SPECIAL display</p>
              </Link>

              <Link
                href="/admin/quotes"
                className="block p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs transition-colors"
              >
                <div className="font-bold text-white flex items-center justify-between">
                  <span>B2B RFQ Pricing Quotes</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Assign custom discounts & approve</p>
              </Link>

              <Link
                href="/admin/inquiries"
                className="block p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs transition-colors"
              >
                <div className="font-bold text-white flex items-center justify-between">
                  <span>Bespoke Surgical Inquiries</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Schedule surgeon consultations</p>
              </Link>

              <Link
                href="/admin/settings/admins"
                className="block p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs transition-colors"
              >
                <div className="font-bold text-white flex items-center justify-between">
                  <span>Staff & Roles Provisioning</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Manage Super Admin, Sales & Account Mgrs</p>
              </Link>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
