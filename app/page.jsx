import React from 'react';
import Link from 'next/link';
import ModeSelector from '@/components/auth/ModeSelector';
import AdminAuthCard from '@/components/auth/AdminAuthCard';
import { ShieldCheck, Award, Lock, Sparkles, Building2, Crown, ShoppingBag, Leaf } from 'lucide-react';

export default function EntryPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-between relative overflow-hidden font-poppins">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-terracotta/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <header className="w-full border-b border-cream-300/80 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest flex items-center justify-center text-cream-50 shadow-sm">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold text-forest tracking-tight block leading-tight">
                Yugan Ayurved
              </span>
              <span className="text-[10px] text-charcoal-muted font-semibold tracking-widest uppercase">
                PANCHKARMA & WELLNESS PRODUCTS • B2B + B2C + SPECIAL
              </span>
            </div>
          </div>

          {/* Quick Direct Mode Links */}
          <div className="hidden md:flex items-center gap-3 text-xs font-semibold">
            <Link
              href="/b2b"
              className="px-3 py-1.5 rounded-xl text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center gap-1.5"
            >
              <Building2 className="w-3.5 h-3.5" /> B2B Wholesale
            </Link>
            <Link
              href="/b2c"
              className="px-3 py-1.5 rounded-xl text-forest bg-brand-50 hover:bg-brand-100 border border-brand-200 transition-colors flex items-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" /> B2C Retail
            </Link>
            <Link
              href="/special"
              className="px-3 py-1.5 rounded-xl text-gold-dark bg-[#181D19] text-gold-light border border-gold/40 hover:border-gold transition-colors flex items-center gap-1.5"
            >
              <Crown className="w-3.5 h-3.5" /> SPECIAL Atelier
            </Link>
          </div>

        </div>
      </header>

      {/* Main Split Grid (Left Side Mode Selection, Right Side Admin Auth) */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* LEFT SIDE: Website Mode Selection (7 Cols) */}
          <div className="lg:col-span-7">
            <ModeSelector />
          </div>

          {/* RIGHT SIDE: Admin Authentication (5 Cols) */}
          <div className="lg:col-span-5 sticky top-28">
            <AdminAuthCard />
          </div>

        </div>
      </main>

      {/* Trust & Compliance Footer Bar */}
      <footer className="w-full border-t border-cream-300/80 bg-white py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-charcoal-muted">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 font-medium text-charcoal">
              <Award className="w-4 h-4 text-forest" /> 100% Classical Ayurveda
            </span>
            <span className="flex items-center gap-1.5 font-medium text-charcoal">
              <ShieldCheck className="w-4 h-4 text-forest" /> GMP Standard Formulations
            </span>
            <span className="flex items-center gap-1.5 font-medium text-charcoal">
              <Lock className="w-4 h-4 text-forest" /> 256-Bit Secure RBAC
            </span>
          </div>

          <div>
            © 2026 Yugan Ayurved & Panchkarma Products. Rooted in tradition, crafted for modern wellness.
          </div>
        </div>
      </footer>

    </div>
  );
}
