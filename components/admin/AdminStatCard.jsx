'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

/**
 * Modern SaaS Stat Card with subtle glassmorphism, accent glow, and trend metrics
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
      border: 'hover:border-emerald-500/40',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      glow: 'from-emerald-500/5 to-transparent',
    },
    blue: {
      border: 'hover:border-sky-500/40',
      iconBg: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
      glow: 'from-sky-500/5 to-transparent',
    },
    amber: {
      border: 'hover:border-amber-500/40',
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      glow: 'from-amber-500/5 to-transparent',
    },
    purple: {
      border: 'hover:border-purple-500/40',
      iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      glow: 'from-purple-500/5 to-transparent',
    },
  };

  const style = accentStyles[accentColor] || accentStyles.emerald;

  if (loading) {
    return (
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 animate-pulse space-y-3">
        <div className="flex justify-between items-center">
          <div className="h-3 w-24 bg-slate-800 rounded" />
          <div className="h-9 w-9 bg-slate-800 rounded-xl" />
        </div>
        <div className="h-7 w-32 bg-slate-800 rounded" />
        <div className="h-3 w-40 bg-slate-800/60 rounded" />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-5 transition-all duration-300 ${style.border} group shadow-lg hover:shadow-xl hover:-translate-y-0.5`}>
      {/* Ambient background glow */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${style.glow} pointer-events-none rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition-opacity`} />

      <div className="relative z-10 flex flex-col justify-between h-full space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            {title}
          </span>
          {Icon && (
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-110 ${style.iconBg}`}>
              <Icon className="w-4 h-4" />
            </div>
          )}
        </div>

        <div>
          <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-poppins">
            {value}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1 line-clamp-1">{subtitle}</p>
          )}
        </div>

        {trend && (
          <div className="pt-2 border-t border-slate-800/60 flex items-center gap-1.5 text-xs">
            {trend.startsWith('+') ? (
              <span className="inline-flex items-center gap-0.5 text-emerald-400 font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded text-[10px]">
                <ArrowUpRight className="w-3 h-3" />
                {trend}
              </span>
            ) : trend.startsWith('-') ? (
              <span className="inline-flex items-center gap-0.5 text-rose-400 font-medium bg-rose-500/10 px-1.5 py-0.5 rounded text-[10px]">
                <ArrowDownRight className="w-3 h-3" />
                {trend}
              </span>
            ) : (
              <span className="inline-flex items-center gap-0.5 text-slate-400 font-medium bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">
                <Minus className="w-3 h-3" />
                {trend}
              </span>
            )}
            <span className="text-[11px] text-slate-400">{trendLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}
