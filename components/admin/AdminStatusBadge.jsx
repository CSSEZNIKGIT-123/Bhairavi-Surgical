'use client';

import React from 'react';

/**
 * Standardized status badge component for Admin Panel
 */
export default function AdminStatusBadge({ status, type = 'order', size = 'sm' }) {
  if (!status) return null;

  const normalized = String(status).toUpperCase();

  // Color config map
  const configs = {
    // Orders
    PENDING: { bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20', dot: 'bg-amber-400', label: 'Pending' },
    PROCESSING: { bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20', dot: 'bg-blue-400 animate-pulse', label: 'Processing' },
    SHIPPED: { bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20', dot: 'bg-indigo-400', label: 'Shipped' },
    DELIVERED: { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', dot: 'bg-emerald-400', label: 'Delivered' },
    CANCELLED: { bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20', dot: 'bg-rose-400', label: 'Cancelled' },

    // Quotes / RFQs
    UNDER_REVIEW: { bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20', dot: 'bg-amber-400', label: 'Under Review' },
    QUOTED: { bg: 'bg-sky-500/10 text-sky-400 border-sky-500/20', dot: 'bg-sky-400', label: 'Formal Quoted' },
    APPROVED: { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', dot: 'bg-emerald-400', label: 'PO Approved' },
    REJECTED: { bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20', dot: 'bg-rose-400', label: 'Declined' },

    // Inquiries
    NEW: { bg: 'bg-purple-500/10 text-purple-400 border-purple-500/20', dot: 'bg-purple-400 animate-ping', label: 'New Inquiry' },
    CONTACTED: { bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20', dot: 'bg-blue-400', label: 'Contacted' },
    CONSULTATION_SCHEDULED: { bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20', dot: 'bg-amber-400', label: 'Consultation' },
    COMMISSIONED: { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', dot: 'bg-emerald-400', label: 'Commissioned' },
    CLOSED: { bg: 'bg-slate-500/10 text-slate-400 border-slate-500/20', dot: 'bg-slate-400', label: 'Closed' },

    // Stock
    IN_STOCK: { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', dot: 'bg-emerald-400', label: 'In Stock' },
    LOW_STOCK: { bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20', dot: 'bg-amber-400', label: 'Low Stock' },
    OUT_OF_STOCK: { bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20', dot: 'bg-rose-400', label: 'Out of Stock' },

    // Roles
    SUPER_ADMIN: { bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30', dot: 'bg-amber-400', label: 'Super Admin' },
    ADMIN: { bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', dot: 'bg-emerald-400', label: 'Admin' },
    SALES_MANAGER: { bg: 'bg-sky-500/15 text-sky-300 border-sky-500/30', dot: 'bg-sky-400', label: 'Sales Mgr' },
    ACCOUNT_MANAGER: { bg: 'bg-teal-500/15 text-teal-300 border-teal-500/30', dot: 'bg-teal-400', label: 'Account Mgr' },

    // Channels
    B2B: { bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20', dot: 'bg-blue-400', label: 'Wholesale B2B' },
    B2C: { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', dot: 'bg-emerald-400', label: 'Retail B2C' },
    SPECIAL: { bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20', dot: 'bg-amber-400', label: 'Bespoke Special' },
  };

  const current = configs[normalized] || {
    bg: 'bg-slate-800/80 text-slate-300 border-slate-700',
    dot: 'bg-slate-400',
    label: status,
  };

  const sizeClasses = size === 'xs' 
    ? 'text-[10px] px-2 py-0.5 gap-1.5' 
    : 'text-[11px] px-2.5 py-1 gap-1.5';

  return (
    <span className={`inline-flex items-center font-medium rounded-full border backdrop-blur-sm ${current.bg} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
      <span>{current.label}</span>
    </span>
  );
}
