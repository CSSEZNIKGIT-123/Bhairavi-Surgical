'use client';

import React from 'react';

/**
 * Standardized Premium Light Status Badge component for Admin Panel
 */
export default function AdminStatusBadge({ status, type = 'order', size = 'sm' }) {
  if (!status) return null;

  const normalized = String(status).toUpperCase();

  // Premium Light mode color config map
  const configs = {
    // Orders
    PENDING: { bg: 'bg-amber-50 text-amber-700 border-amber-200/80', dot: 'bg-amber-500', label: 'Pending' },
    PROCESSING: { bg: 'bg-blue-50 text-blue-700 border-blue-200/80', dot: 'bg-blue-500 animate-pulse', label: 'Processing' },
    SHIPPED: { bg: 'bg-indigo-50 text-indigo-700 border-indigo-200/80', dot: 'bg-indigo-500', label: 'Shipped' },
    DELIVERED: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80', dot: 'bg-emerald-500', label: 'Delivered' },
    CANCELLED: { bg: 'bg-rose-50 text-rose-700 border-rose-200/80', dot: 'bg-rose-500', label: 'Cancelled' },

    // Quotes / RFQs
    UNDER_REVIEW: { bg: 'bg-amber-50 text-amber-700 border-amber-200/80', dot: 'bg-amber-500', label: 'Under Review' },
    QUOTED: { bg: 'bg-sky-50 text-sky-700 border-sky-200/80', dot: 'bg-sky-500', label: 'Formal Quoted' },
    APPROVED: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80', dot: 'bg-emerald-500', label: 'PO Approved' },
    REJECTED: { bg: 'bg-rose-50 text-rose-700 border-rose-200/80', dot: 'bg-rose-500', label: 'Declined' },

    // Inquiries
    NEW: { bg: 'bg-purple-50 text-purple-700 border-purple-200/80', dot: 'bg-purple-500 animate-ping', label: 'New Inquiry' },
    CONTACTED: { bg: 'bg-blue-50 text-blue-700 border-blue-200/80', dot: 'bg-blue-500', label: 'Contacted' },
    CONSULTATION_SCHEDULED: { bg: 'bg-amber-50 text-amber-700 border-amber-200/80', dot: 'bg-amber-500', label: 'Consultation' },
    COMMISSIONED: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80', dot: 'bg-emerald-500', label: 'Commissioned' },
    CLOSED: { bg: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-400', label: 'Closed' },

    // Stock
    IN_STOCK: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80', dot: 'bg-emerald-500', label: 'In Stock' },
    LOW_STOCK: { bg: 'bg-amber-50 text-amber-700 border-amber-200/80', dot: 'bg-amber-500', label: 'Low Stock' },
    OUT_OF_STOCK: { bg: 'bg-rose-50 text-rose-700 border-rose-200/80', dot: 'bg-rose-500', label: 'Out of Stock' },

    // Roles
    SUPER_ADMIN: { bg: 'bg-amber-50 text-amber-800 border-amber-300', dot: 'bg-amber-500', label: 'Super Admin' },
    ADMIN: { bg: 'bg-emerald-50 text-emerald-800 border-emerald-300', dot: 'bg-emerald-600', label: 'Admin' },
    SALES_MANAGER: { bg: 'bg-sky-50 text-sky-800 border-sky-300', dot: 'bg-sky-500', label: 'Sales Mgr' },
    ACCOUNT_MANAGER: { bg: 'bg-teal-50 text-teal-800 border-teal-300', dot: 'bg-teal-600', label: 'Account Mgr' },

    // Channels
    B2B: { bg: 'bg-blue-50 text-blue-700 border-blue-200/80', dot: 'bg-blue-500', label: 'Wholesale B2B' },
    B2C: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80', dot: 'bg-emerald-500', label: 'Retail B2C' },
    SPECIAL: { bg: 'bg-amber-50 text-amber-700 border-amber-200/80', dot: 'bg-amber-500', label: 'Bespoke Special' },
  };

  const current = configs[normalized] || {
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
    label: status,
  };

  const sizeClasses = size === 'xs' 
    ? 'text-[10px] px-2 py-0.5 gap-1.5 font-medium' 
    : 'text-[11px] px-2.5 py-1 gap-1.5 font-medium';

  return (
    <span className={`inline-flex items-center rounded-full border shadow-2xs ${current.bg} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
      <span>{current.label}</span>
    </span>
  );
}
