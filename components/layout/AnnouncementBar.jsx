'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Building2, Crown, ShieldCheck, Truck, Clock } from 'lucide-react';

export default function AnnouncementBar({ mode = 'B2C' }) {
  if (mode === 'SPECIAL') {
    return (
      <aside aria-label="Atelier Announcement" className="bg-[#0e120f] border-b border-gold/20 text-gold-light py-2 px-4 text-xs font-poppins">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <Crown className="w-3.5 h-3.5 text-gold animate-pulse" />
            <span className="font-light tracking-widest text-[11px] uppercase">
              Yugan Sovereign Atelier: Handcrafted Brass Shirodhara Suites & Bespoke Formulations
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-[11px] text-cream-200/70">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-gold" /> Private Consultation Scheduling
            </span>
            <Link href="/special/inquiry" className="text-gold-light hover:underline font-semibold">
              Book Appointment →
            </Link>
          </div>
        </div>
      </aside>
    );
  }

  if (mode === 'B2B') {
    return (
      <aside aria-label="Wholesale Announcement" className="bg-[#1b2b1e] border-b border-emerald-900/50 text-emerald-100 py-2 px-4 text-xs font-poppins">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-medium text-[11px]">
              Institutional Supply for Ayurvedic Clinics, Panchkarma Centers & Wellness Spas • GST Input Credit 18% Available
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-[11px] text-emerald-200/80">
            <span className="flex items-center gap-1 font-semibold text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5" /> Batch Test Certificates Included
            </span>
            <Link href="/b2b/quotes" className="text-white hover:underline font-bold">
              Open RFQ Tray →
            </Link>
          </div>
        </div>
      </aside>
    );
  }

  // Default B2C
  return (
    <aside aria-label="Store Announcement" className="bg-forest text-cream-50 py-2 px-4 text-xs font-poppins">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <Sparkles className="w-3.5 h-3.5 text-terracotta-light" />
          <span className="font-medium text-[11px]">
            Complimentary Classical Abhyanga Guide with Orders Over ₹999 • 100% Authentic Classical Ayurveda
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-[11px] text-cream-200">
          <span className="flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-emerald-300" /> Free Pan-India Dispatch
          </span>
          <Link href="/b2c/offers" className="text-white hover:underline font-semibold">
            View Seasonal Wellness Sets →
          </Link>
        </div>
      </div>
    </aside>
  );
}
