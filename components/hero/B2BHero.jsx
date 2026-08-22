'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Building2, FileSpreadsheet, ShieldCheck, ArrowRight, Layers, Award, CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import CTAGroup from '@/components/ui/CTAGroup';
import VideoBackground from '@/components/ui/VideoBackground';

export default function B2BHero() {
  return (
    <section className="relative w-full overflow-hidden min-h-[calc(100dvh-80px)] flex items-center justify-center font-poppins border-b border-cream-200">
      
      {/* 1. Full-Width Background Video with Fallback Poster */}
      <VideoBackground
        videoSrc="/videos/b2b-hero.mp4"
        fallbackVideoSrc="https://assets.mixkit.co/videos/preview/mixkit-hands-massaging-the-shoulders-of-a-person-in-a-spa-43579-large.mp4"
        posterSrc="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1920&q=85"
        posterAlt="Yugan Ayurved B2B Wholesale Supply for Clinics & Hospitals"
        overlayClassName="bg-gradient-to-r from-[#0F1C12]/95 via-[#132317]/85 to-[#0F1C12]/65 backdrop-brightness-95"
      />

      {/* 2. Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
        <div className="max-w-3xl space-y-6 sm:space-y-8">
          
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/30 px-4 py-1.5 rounded-full text-xs font-semibold text-emerald-300 backdrop-blur-md"
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="tracking-wide uppercase">RELIABLE AYURVEDIC & PANCHKARMA SUPPLY FOR BUSINESSES</span>
          </motion.div>

          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-3"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight font-poppins leading-[1.12]">
              Bulk Ayurvedic Supply for <br />
              <span className="text-emerald-300">Clinics & Panchkarma Centers.</span>
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-emerald-100/80 font-light max-w-2xl leading-relaxed pt-2">
              Direct institutional procurement of volume-tiered classical medicated oils, raw herbs, brass Shirodhara apparatus, and treatment consumables with verified batch certificates and 18% GST input credit.
            </p>
          </motion.div>

          {/* Dual CTAs using robust CTAGroup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="pt-2"
          >
            <CTAGroup>
              <Link href="/b2b/quotes" className="w-full sm:w-auto">
                <Button
                  variant="white"
                  size="lg"
                  icon={FileSpreadsheet}
                  className="w-full sm:w-auto uppercase tracking-wider"
                >
                  Request a Quote
                </Button>
              </Link>

              <Link href="/b2b/products" className="w-full sm:w-auto">
                <Button
                  variant="outline-white"
                  size="lg"
                  icon={Layers}
                  className="w-full sm:w-auto uppercase tracking-wider"
                >
                  Explore B2B Products
                </Button>
              </Link>
            </CTAGroup>
          </motion.div>

          {/* 3 Metrics Badges Below Hero */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="pt-8 border-t border-emerald-500/20 grid grid-cols-1 sm:grid-cols-3 gap-5 text-cream-100"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-400 shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold leading-tight">450+ Centers Supplied</h4>
                <p className="text-[11px] text-emerald-200/70 mt-0.5">Pan-India clinic network</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-400 shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold leading-tight">Tiered Volume Pricing</h4>
                <p className="text-[11px] text-emerald-200/70 mt-0.5">Up to 38% institutional savings</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-400 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold leading-tight">30-Day PO Terms</h4>
                <p className="text-[11px] text-emerald-200/70 mt-0.5">Credit line for verified hospitals</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

    </section>
  );
}
