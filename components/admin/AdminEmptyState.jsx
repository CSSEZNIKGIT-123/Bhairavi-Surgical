'use client';

import React from 'react';
import { PackageOpen } from 'lucide-react';

/**
 * Modern Empty State illustration and action container
 */
export default function AdminEmptyState({
  icon: Icon = PackageOpen,
  title = 'No records found',
  description = 'There are currently no items matching your criteria in the database.',
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 mb-4 shadow-inner">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
        {title}
      </h3>
      <p className="text-xs text-slate-400 max-w-sm mt-1 mb-5">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-950 hover:shadow-emerald-900"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
