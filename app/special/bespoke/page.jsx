'use client';

import React, { useState } from 'react';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Link from 'next/link';
import { Crown, Sparkles, CheckCircle2, Compass, Layers, Leaf } from 'lucide-react';

export default function SpecialBespokePage() {
  const [timber, setTimber] = useState('BURMA_TEAK');
  const [metal, setMetal] = useState('HEAVY_BRASS');
  const [monogram, setMonogram] = useState('ANANDA VEDIC SANCTUARY');
  const [oilAllocation, setOilAllocation] = useState('50L Classical Tailas');

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-charcoal flex flex-col font-poppins selection:bg-gold selection:text-charcoal">
      <AnnouncementBar mode="SPECIAL" />
      <Navbar mode="SPECIAL" />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-dark bg-gold/15 px-3 py-1 rounded-full border border-gold/30 uppercase tracking-widest">
            <Crown className="w-3.5 h-3.5" />
            <span>Interactive Bespoke Sanctuary Configurator</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-light text-charcoal font-poppins">
            Configure Your Sovereign Therapy Suite
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted">
            Select seasoned timber species, hand-forged brass apparatus, and personalized sanctuary crest engraving.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gold/30 shadow-card grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Timber Selection */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-charcoal uppercase tracking-wider block">
                1. Select Heirloom Droni Wood Species
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'BURMA_TEAK', title: 'Seasoned Burmese Teak (Tectona grandis)', desc: 'Single-log carved, naturally rich in botanical oils with supreme oil-resistance' },
                  { id: 'MALABAR_ROSEWOOD', title: 'Malabar Rosewood (Sheesham)', desc: 'Heavy dark grain, dense acoustic grounding, and heirloom durability' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTimber(t.id)}
                    className={`p-4 rounded-2xl border text-left space-y-1 transition-all ${
                      timber === t.id
                        ? 'border-gold-dark bg-gold/15 text-charcoal ring-1 ring-gold'
                        : 'border-cream-200 bg-[#FAF8F5] text-charcoal hover:bg-cream-100/70'
                    }`}
                  >
                    <div className="text-xs font-bold text-gold-dark">{t.title}</div>
                    <div className="text-[11px] text-charcoal-muted leading-tight">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Metal Apparatus Selection */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-charcoal uppercase tracking-wider block">
                2. Shirodhara & Therapy Metal Apparatus
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'HEAVY_BRASS', title: 'Heavy-Gauge Solid Brass (Pital)', desc: 'Lotus finial carving with precision brass micro-needle flow valve' },
                  { id: 'TRADITIONAL_KANSA', title: '79:21 Pure Bronze Kansa Vessel', desc: 'Bell-metal alloy celebrated for drawing out excess Pitta heat' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMetal(m.id)}
                    className={`p-4 rounded-2xl border text-left space-y-1 transition-all ${
                      metal === m.id
                        ? 'border-gold-dark bg-gold/15 text-charcoal ring-1 ring-gold'
                        : 'border-cream-200 bg-[#FAF8F5] text-charcoal hover:bg-cream-100/70'
                    }`}
                  >
                    <div className="text-xs font-bold text-gold-dark">{m.title}</div>
                    <div className="text-[11px] text-charcoal-muted leading-tight">{m.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Laser Engraved Monogram */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-charcoal uppercase tracking-wider block">
                3. Custom Clinic / Sanctuary Brass Crest Inscription
              </label>
              <input
                type="text"
                value={monogram}
                onChange={(e) => setMonogram(e.target.value)}
                placeholder="e.g., SOUKYA VEDIC SANCTUARY"
                className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-[#FAF8F5] text-charcoal text-xs font-poppins focus:outline-none focus:border-forest"
              />
              <p className="text-[11px] text-charcoal-muted">
                Will be laser-inscribed and hand-enameled onto the solid brass dedication plaque mounted on the Droni pedestal.
              </p>
            </div>

            {/* 4. Avarti Taila Allocation */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-charcoal uppercase tracking-wider block">
                4. Initial Master Herbal Taila Allocation
              </label>
              <select
                value={oilAllocation}
                onChange={(e) => setOilAllocation(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-[#FAF8F5] text-charcoal text-xs font-poppins focus:outline-none focus:border-forest"
              >
                <option value="50L Classical Tailas">50 Liters Classical Mahanarayan & Ksheerabala 101 Tailas</option>
                <option value="100L Classical Tailas">100 Liters Classical Suite Batch Allocation</option>
                <option value="200L Bespoke Formulations">200 Liters Turnkey Sanctuary Annual Allocation</option>
              </select>
            </div>

          </div>

          {/* Real-time Commission Estimate (5 Cols) */}
          <div className="lg:col-span-5 bg-[#FAF8F5] rounded-2xl p-6 border border-gold/30 space-y-6">
            <div className="flex items-center gap-2 text-gold-dark text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Commission Summary</span>
            </div>

            <div className="space-y-3 text-xs divide-y divide-cream-200">
              <div className="pt-2 flex justify-between">
                <span className="text-charcoal-muted">Timber Selection:</span>
                <span className="font-semibold text-charcoal">{timber.replace('_', ' ')}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-charcoal-muted">Therapy Metal:</span>
                <span className="font-semibold text-charcoal">{metal.replace('_', ' ')}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-charcoal-muted">Bespoke Monogram:</span>
                <span className="font-semibold text-gold-dark truncate max-w-[160px]">{monogram || 'Standard'}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-charcoal-muted">Taila Allocation:</span>
                <span className="font-semibold text-charcoal">{oilAllocation}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-cream-200">
              <span className="text-[10px] text-charcoal-muted uppercase tracking-widest block">
                Estimated Turnkey Allocation
              </span>
              <div className="text-2xl font-bold text-forest font-poppins mt-0.5">
                ₹3,45,000 – ₹4,80,000
              </div>
              <p className="text-[10px] text-charcoal-muted mt-1">
                Includes white-glove on-site assembly, therapist orientation & brassware calibration.
              </p>
            </div>

            <Link
              href={`/special/inquiry?timber=${timber}&metal=${metal}&monogram=${encodeURIComponent(monogram)}`}
              className="block"
            >
              <Button variant="gold" size="md" className="w-full font-bold uppercase tracking-wider shadow-glow" icon={Compass}>
                Submit Bespoke Specification
              </Button>
            </Link>
          </div>

        </div>

      </main>

      <Footer mode="SPECIAL" />
    </div>
  );
}
