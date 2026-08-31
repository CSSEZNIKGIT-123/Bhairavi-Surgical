'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  ShoppingCart,
  Search,
  Eye,
  CheckCircle2,
  AlertCircle,
  Truck,
  PackageCheck,
  Clock,
  ChevronLeft,
  ChevronRight,
  Filter,
  DollarSign,
  User,
  MapPin,
  RefreshCw,
  X
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import AdminStatusBadge from '@/components/admin/AdminStatusBadge';
import AdminEmptyState from '@/components/admin/AdminEmptyState';
import AdminTableSkeleton from '@/components/admin/AdminTableSkeleton';
import Modal from '@/components/ui/Modal';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [notification, setNotification] = useState(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const showNotification = (type, text) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 3000);
  };

  // Filtered orders calculation
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      const searchMatch =
        !searchTerm ||
        ord.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ord.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ord.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ord.companyName?.toLowerCase().includes(searchTerm.toLowerCase());

      const statusMatch =
        selectedStatus === 'ALL' ||
        String(ord.status).toUpperCase() === selectedStatus;

      return searchMatch && statusMatch;
    });
  }, [orders, searchTerm, selectedStatus]);

  // Aggregate metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  const pendingCount = orders.filter((o) => o.status === 'PENDING' || o.status === 'PROCESSING').length;
  const deliveredCount = orders.filter((o) => o.status === 'DELIVERED').length;

  // Handle status update
  const handleUpdateStatus = async (newStatus) => {
    if (!selectedOrder) return;
    setUpdatingStatus(true);

    try {
      // If we have an order update route or general status update
      const res = await fetch(`/api/orders`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedOrder.id, status: newStatus }),
      });

      // Update local state
      setOrders((prev) =>
        prev.map((o) => (o.id === selectedOrder.id ? { ...o, status: newStatus } : o))
      );
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
      showNotification('success', `Order #${selectedOrder.orderNumber} updated to ${newStatus}`);
    } catch (err) {
      showNotification('error', 'Failed to update order status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="space-y-6 font-poppins text-slate-100">
      
      {/* 1. Header & Summary Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Customer Orders & Fulfillment
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs font-semibold">
              {orders.length} Orders
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track, inspect, and fulfill retail Ayurvedic orders and institutional hospital supply contracts.
          </p>
        </div>

        <button
          type="button"
          onClick={loadOrders}
          title="Refresh Orders"
          className="self-start md:self-auto p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between backdrop-blur-xl">
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Sales Volume</div>
            <div className="text-xl sm:text-2xl font-bold text-white font-poppins mt-0.5">{formatCurrency(totalRevenue)}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between backdrop-blur-xl">
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Pending Fulfillment</div>
            <div className="text-xl sm:text-2xl font-bold text-amber-400 font-poppins mt-0.5">{pendingCount} Orders</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between backdrop-blur-xl">
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Successfully Delivered</div>
            <div className="text-xl sm:text-2xl font-bold text-emerald-400 font-poppins mt-0.5">{deliveredCount} Orders</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <PackageCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div
          className={`p-3.5 rounded-2xl border text-xs flex items-center gap-2.5 animate-in fade-in duration-200 ${
            notification.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-700/80 text-emerald-200'
              : 'bg-rose-950/90 border-rose-700/80 text-rose-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="font-medium">{notification.text}</span>
        </div>
      )}

      {/* 2. Filters & Status Tabs */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-xl shadow-lg space-y-3.5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by order #, customer, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {['ALL', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 ${
                  selectedStatus === st
                    ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-950'
                    : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {st === 'ALL' ? 'All Orders' : st.charAt(0) + st.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Orders Table */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl overflow-hidden backdrop-blur-xl shadow-xl">
        {loading ? (
          <div className="p-6">
            <AdminTableSkeleton rows={6} cols={6} />
          </div>
        ) : filteredOrders.length === 0 ? (
          <AdminEmptyState
            icon={ShoppingCart}
            title="No orders found"
            description="There are currently no customer purchase records matching your criteria."
            actionLabel={searchTerm || selectedStatus !== 'ALL' ? 'Clear Filters' : null}
            onAction={() => {
              setSearchTerm('');
              setSelectedStatus('ALL');
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-slate-400 uppercase tracking-wider text-[10px] bg-slate-950/80 border-b border-slate-800/80">
                <tr>
                  <th className="py-3.5 px-4">Order ID & Date</th>
                  <th className="py-3.5 px-3">Mode</th>
                  <th className="py-3.5 px-4">Customer Details</th>
                  <th className="py-3.5 px-3">Items</th>
                  <th className="py-3.5 px-3">Total Amount</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-slate-200">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-emerald-400">
                        {ord.orderNumber}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString() : 'Recent'}
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <AdminStatusBadge status={ord.mode || 'B2C'} type="channel" size="xs" />
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] font-bold shrink-0">
                          {ord.customerName?.charAt(0) || 'C'}
                        </div>
                        <div>
                          <div>{ord.customerName}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{ord.customerEmail}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 font-mono">
                      {ord.items?.length || 1} Line Items
                    </td>

                    <td className="py-3.5 px-3 font-bold font-poppins text-white">
                      {formatCurrency(ord.totalAmount)}
                    </td>

                    <td className="py-3.5 px-3">
                      <AdminStatusBadge status={ord.status || 'PENDING'} type="order" />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(ord)}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-white hover:bg-emerald-600 transition-all font-semibold text-xs"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. Full Order Inspection & Fulfillment Modal */}
      {selectedOrder && (
        <Modal
          isOpen={Boolean(selectedOrder)}
          onClose={() => setSelectedOrder(null)}
          title={`Order #${selectedOrder.orderNumber}`}
          subtitle={`Placed on ${new Date(selectedOrder.createdAt).toLocaleString()} • Channel: ${selectedOrder.mode || 'B2C'}`}
          className="bg-slate-900 border-slate-800 text-slate-100 max-w-2xl"
        >
          <div className="space-y-5 text-xs">
            
            {/* Customer & Status Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-950/70 rounded-2xl border border-slate-800">
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3 h-3 text-emerald-400" />
                  <span>Customer Profile</span>
                </div>
                <div className="font-bold text-white text-sm">{selectedOrder.customerName}</div>
                <div className="text-slate-400">{selectedOrder.customerEmail}</div>
                {selectedOrder.companyName && (
                  <div className="text-emerald-400 font-medium">{selectedOrder.companyName}</div>
                )}
              </div>

              <div className="space-y-2 sm:border-l sm:border-slate-800/80 sm:pl-3">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Update Fulfillment Status
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      disabled={updatingStatus}
                      onClick={() => handleUpdateStatus(st)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                        selectedOrder.status === st
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Line Items Breakdown */}
            <div className="space-y-2">
              <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                Itemized Order Summary
              </div>
              <div className="bg-slate-950/70 rounded-2xl border border-slate-800 overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="text-slate-400 uppercase tracking-wider text-[9px] bg-slate-900 border-b border-slate-800">
                    <tr>
                      <th className="py-2 px-3">Item</th>
                      <th className="py-2 px-3">Qty</th>
                      <th className="py-2 px-3">Price</th>
                      <th className="py-2 px-3 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-200">
                    {selectedOrder.items && selectedOrder.items.length > 0 ? (
                      selectedOrder.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="py-2.5 px-3 font-medium text-white">
                            {item.product?.title || item.title || 'Surgical Instrument'}
                          </td>
                          <td className="py-2.5 px-3 font-mono">{item.quantity || 1}</td>
                          <td className="py-2.5 px-3 font-poppins">{formatCurrency(item.unitPrice || 0)}</td>
                          <td className="py-2.5 px-3 font-poppins font-bold text-white text-right">
                            {formatCurrency((item.unitPrice || 0) * (item.quantity || 1))}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="py-2.5 px-3 font-medium text-white">Wholesale Ayurvedic Equipment Package</td>
                        <td className="py-2.5 px-3 font-mono">1</td>
                        <td className="py-2.5 px-3 font-poppins">{formatCurrency(selectedOrder.totalAmount)}</td>
                        <td className="py-2.5 px-3 font-poppins font-bold text-white text-right">{formatCurrency(selectedOrder.totalAmount)}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Total Footer */}
            <div className="flex justify-between items-center pt-3 border-t border-slate-800">
              <span className="text-xs text-slate-400">Final Order Grand Total:</span>
              <span className="text-lg font-bold text-white font-poppins">
                {formatCurrency(selectedOrder.totalAmount)}
              </span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-colors"
              >
                Close Inspector
              </button>
            </div>

          </div>
        </Modal>
      )}

    </div>
  );
}
