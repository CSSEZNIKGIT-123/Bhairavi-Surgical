'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

/**
 * Premium Light-Mode SaaS Stat Card with clean white surface, subtle border, and trend metrics
 */
export default function AdminStatCard({
  title,
  value,
  subtitle,
  trend,
  trendLabel = 'vs last month',
  icon: Icon,
  accentColor = 'emerald', // emerald, blue, amber, purple
  loading = false,
}) {
  const accentStyles = {
    emerald: {
      border: 'hover:border-emerald-300',
      iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    },
    blue: {
      border: 'hover:border-sky-300',
      iconBg: 'bg-sky-50 text-sky-700 border-sky-200/80',
    },
    amber: {
      border: 'hover:border-amber-300',
      iconBg: 'bg-amber-50 text-amber-700 border-amber-200/80',
    },
    purple: {
      border: 'hover:border-purple-300',
      iconBg: 'bg-purple-50 text-purple-700 border-purple-200/80',
    },
  };

  const style = accentStyles[accentColor] || accentStyles.emerald;

  if (loading) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 animate-pulse space-y-3 shadow-sm">
        <div className="flex justify-between items-center">
          <div className="h-3 w-24 bg-slate-100 rounded" />
          <div className="h-9 w-9 bg-slate-100 rounded-xl" />
        </div>
        <div className="h-7 w-32 bg-slate-100 rounded" />
        <div className="h-3 w-40 bg-slate-100 rounded" />
      </div>
    );
  }

  return (
    <div className={`bg-white border border-slate-200/80 rounded-2xl p-5 transition-all duration-200 ${style.border} group shadow-sm hover:shadow-md hover:-translate-y-0.5`}>
      <div className="flex flex-col justify-between h-full space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            {title}
          </span>
          {Icon && (
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-transform duration-200 group-hover:scale-105 ${style.iconBg}`}>
              <Icon className="w-4 h-4" />
            </div>
          )}
        </div>

        <div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-poppins">
            {value}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1 line-clamp-1">{subtitle}</p>
          )}
        </div>

        {trend && (
          <div className="pt-2.5 border-t border-slate-100 flex items-center gap-1.5 text-xs">
            {trend.startsWith('+') ? (
              <span className="inline-flex items-center gap-0.5 text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.5 rounded text-[10px]">
                <ArrowUpRight className="w-3 h-3" />
                {trend}
              </span>
            ) : trend.startsWith('-') ? (
              <span className="inline-flex items-center gap-0.5 text-rose-700 font-semibold bg-rose-50 border border-rose-200/60 px-1.5 py-0.5 rounded text-[10px]">
                <ArrowDownRight className="w-3 h-3" />
                {trend}
              </span>
            ) : (
              <span className="inline-flex items-center gap-0.5 text-slate-600 font-semibold bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-[10px]">
                <Minus className="w-3 h-3" />
                {trend}
              </span>
            )}
            <span className="text-[11px] text-slate-500">{trendLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}
