'use client';

import React from 'react';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { CreditCard, Layers, Wrench, ShieldCheck, FileSpreadsheet, ArrowRight, Leaf } from 'lucide-react';

export default function B2BSolutionsPage() {
  const solutions = [
    {
      icon: CreditCard,
      title: 'Institutional Credit Lines & 30-Day PO Terms',
      desc: 'Qualifying Ayurvedic hospitals and clinic chains can avail revolving credit limits up to ₹25,00,000 with 30-day net payment terms upon GST and drug license verification.',
    },
    {
      icon: Layers,
      title: 'Bulk Drum Tiered Volume Matrix (5L to 25L)',
      desc: 'Transparent automated volume pricing integrated directly into our catalog, unlocking up to 38% direct discount on high-volume clinic replenishment.',
    },
    {
      icon: Leaf,
      title: 'Custom Herb Decoction & Taila Batch Formulation',
      desc: 'Formulate proprietary herbal oils or specialized Kashayams prepared according to your hospital’s clinical Samhita specifications in certified GMP facilities.',
    },
    {
      icon: ShieldCheck,
      title: 'Turnkey Panchkarma Clinic Outfitting & Setup',
      desc: 'End-to-end therapy room spatial layout, brass Shirodhara stand installation, and therapist training by experienced senior Vaidyas.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-poppins">
      <AnnouncementBar mode="B2B" />
      <Navbar mode="B2B" />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
            Ayurvedic Enterprise Solutions
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-charcoal font-poppins leading-tight">
            Streamlined Supply Chain for Ayurvedic Institutions
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted">
            Comprehensive financial, logistical, and classical manufacturing solutions built to support hospitals and Panchkarma clinics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {solutions.map((sol, idx) => {
            const Icon = sol.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-8 border border-cream-300 shadow-soft space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-charcoal font-poppins">
                    {sol.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
                    {sol.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-cream-200">
                  <Link href="/b2b/quotes" className="text-xs font-bold text-emerald-900 hover:underline flex items-center gap-1">
                    Apply for this solution <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer mode="B2B" />
    </div>
  );
}
