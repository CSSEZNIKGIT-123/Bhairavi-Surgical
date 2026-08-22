'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingCart, Eye, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setOrders(data.orders);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 font-poppins text-slate-100">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Customer Orders Management
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          All placed retail and wholesale hospital purchase orders.
        </p>
      </div>

      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-slate-400 uppercase tracking-wider text-[10px] bg-slate-900/80 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-3">Mode</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-3">Items</th>
                <th className="py-3 px-3">Total Amount</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 text-slate-200">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                    {ord.orderNumber}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {ord.mode}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-white">
                    <div>{ord.customerName}</div>
                    <div className="text-[10px] text-slate-400">{ord.customerEmail}</div>
                  </td>
                  <td className="py-3.5 px-3">
                    {ord.items?.length || 1} line items
                  </td>
                  <td className="py-3.5 px-3 font-bold font-poppins text-slate-100">
                    {formatCurrency(ord.totalAmount)}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                      {ord.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(ord)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-200 transition-colors font-bold text-xs"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Order #${selectedOrder.orderNumber}`}
          subtitle={`Customer: ${selectedOrder.customerName} • Date: ${new Date(selectedOrder.createdAt).toLocaleString()}`}
          className="bg-slate-950 border-slate-800 text-slate-100"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
              <span className="font-bold text-slate-400 uppercase text-[10px]">Shipping Destination:</span>
              <p className="text-white">{selectedOrder.shippingAddress}</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-300 uppercase text-[10px]">Ordered Line Items:</h4>
              <div className="bg-slate-900 rounded-2xl border border-slate-800 divide-y divide-slate-800 overflow-hidden">
                {selectedOrder.items?.map((it, idx) => (
                  <div key={idx} className="p-3 flex justify-between items-center">
                    <div>
                      <div className="font-bold text-white">{it.product?.title}</div>
                      <span className="text-[10px] text-slate-400">Qty: {it.quantity}</span>
                    </div>
                    <span className="font-bold font-poppins text-emerald-400">
                      {formatCurrency(it.totalPrice || it.unitPrice * it.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center text-sm font-bold pt-2 border-t border-slate-800">
              <span className="text-slate-300">Total Paid Amount:</span>
              <span className="text-emerald-400 font-poppins">{formatCurrency(selectedOrder.totalAmount)}</span>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}
