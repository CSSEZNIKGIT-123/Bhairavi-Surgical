'use client';

import React from 'react';
import Image from 'next/image';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Leaf, Award, ShieldCheck, HeartHandshake, Sparkles, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function B2CAboutPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-poppins">
      <AnnouncementBar mode="B2C" />
      <Navbar mode="B2C" />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-16">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-cream-200 px-3.5 py-1.5 rounded-full text-xs font-semibold text-forest">
            <Leaf className="w-3.5 h-3.5 text-forest" />
            <span>Rooted in Vedic Tradition</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-charcoal font-poppins leading-tight">
            The Living Heritage of Yugan Ayurved
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed font-normal">
            We preserve and practice the timeless metallurgical and herbal science of classical Ayurveda. Every oil, churna, and Panchkarma tool is crafted with devotion to sacred Samhita wisdom and uncompromising purity.
          </p>
        </div>

        {/* Visual Story Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center bg-white rounded-3xl p-8 sm:p-12 border border-cream-300 shadow-soft">
          <div className="space-y-4">
            <span className="text-xs font-bold text-forest uppercase tracking-widest bg-forest/10 px-3 py-1 rounded-full">
              Taila Paka Vidhi
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-charcoal font-poppins">
              Slow 72-Hour Simmering in Pure Brass Cauldrons
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
              Industrial shortcuts boil herbs in high heat, degrading vital volatile bio-compounds. At Yugan, we adhere strictly to the classical 3-stage Taila Paka method: boiling the herbal Kashayam (decoction), adding the Kalka (herbal paste), and slowly infusing organic black sesame oil over wood-fired brass vessels for 72 continuous hours until the *Phenodgama* test verifies complete moisture evaporation.
            </p>
            <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
              The result is a medicated oil of unparalleled micro-cellular penetration, rich classical aroma, and profound therapeutic grounding.
            </p>
          </div>

          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-card border border-cream-200">
            <Image
              src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80"
              alt="Ayurvedic Medicated Oil Simmering"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* 3 Pillars of Sourcing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-3xl border border-cream-300 shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-forest/10 text-forest flex items-center justify-center">
              <Leaf className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-charcoal font-poppins">
              Wildcrafted & Native Herbs
            </h3>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Sourced directly from native tribal cooperatives and organic certified biodiversity zones across the Western Ghats and Himalayan foothills.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-cream-300 shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-forest/10 text-forest flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-charcoal font-poppins">
              Zero Chemical Additives
            </h3>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              No mineral oils, no artificial colorants, no parabens, and no synthetic perfumes. 100% natural, therapeutic-grade purity tested for zero heavy metals.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-cream-300 shadow-soft space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-forest/10 text-forest flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-charcoal font-poppins">
              Classical Panchkarma Expertise
            </h3>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Developed in continuous consultation with leading Vaidyas, Ayurvedic researchers, and Panchkarma center directors across India.
            </p>
          </div>
        </div>

      </main>

      <Footer mode="B2C" />
    </div>
  );
}
