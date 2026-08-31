'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Package,
  FileSpreadsheet,
  Crown,
  ShoppingCart,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Plus,
  Layers,
  Building2,
  Eye,
  DollarSign
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import AdminStatCard from '@/components/admin/AdminStatCard';
import AdminStatusBadge from '@/components/admin/AdminStatusBadge';
import AdminEmptyState from '@/components/admin/AdminEmptyState';
import AdminTableSkeleton from '@/components/admin/AdminTableSkeleton';
import Modal from '@/components/ui/Modal';

export default function AdminDashboardPage() {
  const { admin } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/admin/stats');
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
          setRecentOrders(data.recentOrders || []);
        }
      } catch (e) {
        console.error('Failed to fetch dashboard stats:', e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="space-y-8 font-poppins text-slate-900">
      
      {/* 1. Hero Greeting Banner (Light SaaS) */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              <span>{currentDate} • System Live</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              {getGreeting()}, <span className="text-emerald-700">{admin?.name || 'Administrator'}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
              Real-time executive oversight across wholesale hospital procurement, retail Ayurvedic direct sales, and bespoke Shirodhara & Droni artisan commissions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link href="/admin/products">
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-900/10 hover:shadow-emerald-900/20 hover:-translate-y-0.5">
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </Link>
            <Link href="/admin/quotes">
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition-all hover:-translate-y-0.5">
                <FileSpreadsheet className="w-4 h-4 text-sky-600" />
                <span>Review RFQs</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. KPI Statistic Cards Grid (Light Mode) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <AdminStatCard
          title="Platform Revenue"
          value={stats ? formatCurrency(stats.totalRevenue) : '—'}
          subtitle="Combined B2B, B2C & Special gross"
          trend="+18.4%"
          trendLabel="growth velocity"
          icon={TrendingUp}
          accentColor="emerald"
          loading={loading}
        />
        <AdminStatCard
          title="Pending B2B RFQs"
          value={stats ? `${stats.pendingQuotes} Quotes` : '—'}
          subtitle={`${stats?.totalQuotes || 0} total quotations in pipeline`}
          trend={stats?.pendingQuotes > 0 ? `+${stats.pendingQuotes} Action req.` : 'Clear'}
          trendLabel="pricing desk"
          icon={FileSpreadsheet}
          accentColor="blue"
          loading={loading}
        />
        <AdminStatCard
          title="Special Inquiries"
          value={stats ? `${stats.newInquiries} Inquiries` : '—'}
          subtitle={`${stats?.totalInquiries || 0} bespoke suites registered`}
          trend={stats?.newInquiries > 0 ? `+${stats.newInquiries} New` : 'Up to date'}
          trendLabel="artisan commissions"
          icon={Crown}
          accentColor="amber"
          loading={loading}
        />
        <AdminStatCard
          title="Catalog SKUs"
          value={stats ? `${stats.totalProducts} Items` : '—'}
          subtitle="Fully configured in PostgreSQL"
          trend="93 Live"
          trendLabel="multi-mode deployed"
          icon={Package}
          accentColor="purple"
          loading={loading}
        />
      </div>

      {/* 3. Main Data Row: Recent Orders (8 cols) & Channel Analytics (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Recent Orders Section (8 Cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                  Recent Customer Transactions
                </h2>
                <p className="text-[11px] text-slate-500">Live purchases recorded across retail & hospital accounts</p>
              </div>
            </div>

            <Link
              href="/admin/orders"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {loading ? (
            <AdminTableSkeleton rows={4} cols={5} />
          ) : recentOrders.length === 0 ? (
            <AdminEmptyState
              icon={ShoppingCart}
              title="No customer orders yet"
              description="Customer purchases placed on B2C and B2B portals will appear here automatically."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-slate-500 uppercase tracking-wider text-[10px] bg-slate-50 border-b border-slate-200/80 font-bold">
                  <tr>
                    <th className="py-3 px-3">Order ID</th>
                    <th className="py-3 px-3">Channel</th>
                    <th className="py-3 px-3">Customer / Entity</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {recentOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="py-3.5 px-3 font-mono font-bold text-emerald-700">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3.5 px-3">
                        <AdminStatusBadge status={ord.mode || 'B2C'} type="channel" size="xs" />
                      </td>
                      <td className="py-3.5 px-3 font-medium">
                        <div className="text-slate-900 font-bold">{ord.customerName}</div>
                        {ord.companyName && (
                          <div className="text-[10px] text-slate-500 truncate max-w-[150px]">
                            {ord.companyName}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-3 font-bold text-slate-900 font-poppins">
                        {formatCurrency(ord.totalAmount)}
                      </td>
                      <td className="py-3.5 px-3">
                        <AdminStatusBadge status={ord.status || 'PENDING'} type="order" size="xs" />
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(ord)}
                          className="p-1.5 rounded-lg bg-slate-50 hover:bg-emerald-600 border border-slate-200 text-slate-600 hover:text-white transition-colors"
                          title="Inspect Order Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Channel Breakdown & Quick Actions (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Storefront Channel Matrix */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Layers className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Storefront Channel Matrix
              </h3>
            </div>

            <div className="space-y-3">
              {/* B2B Wholesale */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>Wholesale B2B Mode</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/80">
                    65% Vol.
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 w-[65%]" />
                </div>
                <p className="text-[10px] text-slate-500">Institutional tenders, bulk pricing tiers & hospital POs</p>
              </div>

              {/* B2C Retail */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Retail B2C Mode</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/80">
                    25% Vol.
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 w-[25%]" />
                </div>
                <p className="text-[10px] text-slate-500">Direct-to-consumer wellness & certified surgical kits</p>
              </div>

              {/* Special Atelier */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>Bespoke Atelier Mode</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/80">
                    10% Vol.
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-[10%]" />
                </div>
                <p className="text-[10px] text-slate-500">Hand-carved single-wood tables & brass apparatus</p>
              </div>
            </div>
          </div>

          {/* Quick Management Actions */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
              Quick Operations
            </h3>

            <div className="space-y-2">
              <Link
                href="/admin/products"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-xs transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <Package className="w-4 h-4 text-purple-600" />
                  <div>
                    <div className="font-bold text-slate-900 group-hover:text-purple-700 transition-colors">Catalog Editor</div>
                    <div className="text-[10px] text-slate-500">Update prices, stock & mode flags</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 transition-transform group-hover:translate-x-0.5" />
              </Link>

              <Link
                href="/admin/settings/admins"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-xs transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">Staff Roles (RBAC)</div>
                    <div className="text-[10px] text-slate-500">Provision admins & sales managers</div>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

        </div>

      </div>

      {/* Quick Order Inspect Modal (Light Mode) */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Order #${selectedOrder.orderNumber}`}
          subtitle={`Customer: ${selectedOrder.customerName} • Channel: ${selectedOrder.mode || 'B2C'}`}
          className="bg-white border-slate-200 text-slate-900 max-w-xl shadow-2xl"
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase">Customer</span>
                <div className="font-bold text-slate-900">{selectedOrder.customerName}</div>
                <div className="text-slate-500 text-[11px]">{selectedOrder.customerEmail}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase">Status</span>
                <div className="mt-0.5">
                  <AdminStatusBadge status={selectedOrder.status || 'PENDING'} type="order" />
                </div>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Order Total: <span className="text-slate-900 text-sm font-bold font-poppins">{formatCurrency(selectedOrder.totalAmount)}</span>
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Link href="/admin/orders">
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-xs"
                >
                  Manage Full Order →
                </button>
              </Link>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}
