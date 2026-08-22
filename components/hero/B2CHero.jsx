'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles, ArrowRight, Leaf, HeartHandshake, CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import CTAGroup from '@/components/ui/CTAGroup';
import VideoBackground from '@/components/ui/VideoBackground';

export default function B2CHero() {
  return (
    <section className="relative w-full overflow-hidden min-h-[calc(100dvh-80px)] flex items-center justify-center font-poppins border-b border-cream-200">
      
      {/* 1. Full-Width Background Video with Fallback Poster */}
      <VideoBackground
        videoSrc="/videos/b2c-hero.mp4"
        fallbackVideoSrc="https://assets.mixkit.co/videos/preview/mixkit-oil-being-poured-into-a-bowl-43577-large.mp4"
        posterSrc="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1920&q=85"
        posterAlt="Yugan Ayurved Classical Medicated Oils & Herbal Products"
        overlayClassName="bg-gradient-to-r from-[#141F16]/95 via-[#18281B]/80 to-[#141F16]/60 backdrop-brightness-95"
      />

      {/* 2. Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
        <div className="max-w-3xl space-y-6 sm:space-y-8">
          
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-cream-100/15 border border-cream-200/30 px-4 py-1.5 rounded-full text-xs font-semibold text-cream-100 backdrop-blur-md"
          >
            <Leaf className="w-3.5 h-3.5 text-emerald-300" />
            <span className="tracking-wide">AUTHENTIC CLASSICAL AYURVEDA & PANCHKARMA</span>
          </motion.div>

          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-3"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight font-poppins leading-[1.12]">
              Rooted in Tradition. <br />
              <span className="text-emerald-300">Crafted for Modern Wellness.</span>
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-cream-200/85 font-light max-w-2xl leading-relaxed pt-2">
              Time-honored classical medicated oils, wildcrafted single-herb churnas, and traditional Panchkarma self-care essentials — prepared according to sacred Vedic texts with pure botanicals.
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
              <Link href="/b2c/shop" className="w-full sm:w-auto">
                <Button
                  variant="white"
                  size="lg"
                  icon={ArrowRight}
                  iconPosition="right"
                  className="w-full sm:w-auto uppercase tracking-wider"
                >
                  Shop Ayurvedic Products
                </Button>
              </Link>

              <Link href="/b2c/categories" className="w-full sm:w-auto">
                <Button
                  variant="outline-white"
                  size="lg"
                  className="w-full sm:w-auto uppercase tracking-wider"
                >
                  Explore Collection
                </Button>
              </Link>
            </CTAGroup>
          </motion.div>

          {/* 3 Trust Badges Below Hero */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="pt-8 border-t border-cream-200/20 grid grid-cols-1 sm:grid-cols-3 gap-5 text-cream-100"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-white/10 text-emerald-300 backdrop-blur-md shrink-0">
                <Leaf className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold leading-tight">100% Classical Formulae</h4>
                <p className="text-[11px] text-cream-200/70 mt-0.5">Charaka & Sahasrayogam text</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-white/10 text-emerald-300 backdrop-blur-md shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold leading-tight">Wildcrafted Botanicals</h4>
                <p className="text-[11px] text-cream-200/70 mt-0.5">Heavy metal tested & pure</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-white/10 text-emerald-300 backdrop-blur-md shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold leading-tight">GMP Standard Manufacturing</h4>
                <p className="text-[11px] text-cream-200/70 mt-0.5">Slow 72-hr Taila Paka Vidhi</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

    </section>
  );
}
