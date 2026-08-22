'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Crown, Sparkles, Compass, ShieldCheck, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import CTAGroup from '@/components/ui/CTAGroup';
import VideoBackground from '@/components/ui/VideoBackground';

export default function SpecialHero() {
  return (
    <section className="relative w-full overflow-hidden min-h-[calc(100dvh-80px)] flex items-center justify-center font-poppins border-b border-gold/20">
      
      {/* 1. Full-Width Background Video with Fallback Poster & Luminous Warm Gradient */}
      <VideoBackground
        videoSrc="/videos/special-hero.mp4"
        fallbackVideoSrc="https://assets.mixkit.co/videos/preview/mixkit-essential-oil-being-poured-into-a-bowl-43578-large.mp4"
        posterSrc="https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1920&q=85"
        posterAlt="Yugan Sovereign Atelier Heirloom Panchkarma Suites"
        overlayClassName="bg-gradient-to-r from-[#18201A]/95 via-[#18201A]/80 to-[#18201A]/60 backdrop-brightness-95"
      />

      {/* 2. Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
        <div className="max-w-3xl space-y-6 sm:space-y-8">
          
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-gold/20 border border-gold/40 px-4 py-1.5 rounded-full text-xs font-semibold text-gold-light backdrop-blur-md"
          >
            <Crown className="w-3.5 h-3.5 text-gold animate-pulse" />
            <span className="tracking-widest uppercase text-[11px]">THE SOVEREIGN ATELIER OF AYURVEDIC MASTERY</span>
          </motion.div>

          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-3"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white tracking-tight font-poppins leading-[1.12]">
              Heirloom Panchkarma Suites & <br />
              <span className="text-gold-light font-normal">Bespoke Sacred Formulations.</span>
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-cream-100/90 font-light max-w-2xl leading-relaxed pt-2">
              Commissioning handcrafted solid Burmese teak Droni tables, hand-hammered brass Shirodhara vessels, and master-formulated 101x potentiated tailas for presidential wellness sanctuaries and visionary Vaidyas.
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
              <Link href="/special/inquiry" className="w-full sm:w-auto">
                <Button
                  variant="gold"
                  size="lg"
                  icon={Compass}
                  className="w-full sm:w-auto uppercase tracking-wider text-slate-950 font-bold"
                >
                  Book Consultation
                </Button>
              </Link>

              <Link href="/special/collections" className="w-full sm:w-auto">
                <Button
                  variant="outline-gold"
                  size="lg"
                  icon={Crown}
                  className="w-full sm:w-auto uppercase tracking-wider"
                >
                  Explore Signature Collection
                </Button>
              </Link>
            </CTAGroup>
          </motion.div>

          {/* 3 Luxury Pillars */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="pt-8 border-t border-gold/25 grid grid-cols-1 sm:grid-cols-3 gap-5 text-cream-100"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-gold/20 border border-gold/40 text-gold-light shrink-0">
                <Crown className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white leading-tight">Heirloom Teak Droni</h4>
                <p className="text-[11px] text-cream-200/80 mt-0.5 font-light">Carved single-log Burmese teak</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-gold/20 border border-gold/40 text-gold-light shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white leading-tight">101-Times Potentiated</h4>
                <p className="text-[11px] text-cream-200/80 mt-0.5 font-light">Rare Avarti classical tailas</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-gold/20 border border-gold/40 text-gold-light shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white leading-tight">White-Glove Commission</h4>
                <p className="text-[11px] text-cream-200/80 mt-0.5 font-light">On-site master therapist setup</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

    </section>
  );
}
