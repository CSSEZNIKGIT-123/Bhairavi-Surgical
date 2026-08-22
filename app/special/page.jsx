'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SpecialHero from '@/components/hero/SpecialHero';
import SpecialProductCard from '@/components/products/SpecialProductCard';
import { Crown, Sparkles, Compass, ShieldCheck, ArrowRight, Star, Leaf } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function SpecialHomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products?mode=special')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProducts(data.products);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const bespokePillars = [
    {
      title: 'Heirloom Burmese Teak Dronis',
      desc: 'Hand-carved from a single trunk of seasoned Burma Teak by hereditary temple craftsmen, treated with botanical Ayurvedic oil sealants for lifetime resilience.',
      image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Hand-Hammered Solid Brass Shirodhara',
      desc: 'Crafted from virgin heavy-gauge brass with hand-machined flow control needle valves to produce an unbroken, serene laminar stream on the forehead.',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Master Avarti Potentiations (101x)',
      desc: 'Rare classical tailas processed through 101 continuous boiling cycles with fresh herbal decoctions and A2 milk for profound cellular bio-absorption.',
      image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-charcoal flex flex-col font-poppins selection:bg-gold selection:text-charcoal">
      <AnnouncementBar mode="SPECIAL" />
      <Navbar mode="SPECIAL" />

      {/* 1. Ultra-Luxury Special Video Hero */}
      <SpecialHero />

      <main className="flex-1 w-full space-y-16 sm:space-y-24 py-14 sm:py-20">
        
        {/* 2. Philosophy & Negative Space Banner */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-dark uppercase tracking-widest bg-gold/15 px-4 py-1.5 rounded-full border border-gold/30">
            <Crown className="w-3.5 h-3.5 text-gold-dark" />
            <span>THE ATELIER PHILOSOPHY</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-light text-charcoal font-poppins leading-tight">
            Where Metallurgical Purity Meets Vedic Healing.
          </h2>
          <p className="text-sm sm:text-base text-charcoal-muted max-w-2xl mx-auto leading-relaxed font-light">
            We reject mass mechanical production for our Sovereign Atelier collections. Every therapy vessel, bronze wand, and potentiated elixir is a devotion between master bell-metal artisans, seasoned wood sculptors, and revered Ayurvedic Vaidyas.
          </p>
        </section>

        {/* 3. Bespoke Masterworks Showcase */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10 pb-4 border-b border-cream-200">
            <div>
              <div className="flex items-center gap-2 text-gold-dark text-xs uppercase tracking-widest font-semibold mb-1">
                <Crown className="w-3.5 h-3.5" /> Private Commissions
              </div>
              <h2 className="text-2xl sm:text-4xl font-normal text-charcoal font-poppins">
                Signature Atelier Masterworks
              </h2>
            </div>
            <Link
              href="/special/collections"
              className="text-xs sm:text-sm font-semibold text-forest hover:text-forest-dark flex items-center gap-1 group"
            >
              <span>Explore All Suites</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-96 bg-white rounded-3xl animate-pulse border border-cream-200" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {products.map((prod) => (
                <SpecialProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </section>

        {/* 4. Luxury Craftsmanship Pillars */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-normal text-charcoal font-poppins">
              The Hallmarks of Sovereign Engineering
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-muted font-light">
              Crafted in limited annual allocations with bespoke brass crest monograms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {bespokePillars.map((p, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-gold/25 space-y-4 flex flex-col justify-between hover:border-gold transition-all duration-300 shadow-soft hover:shadow-card"
              >
                <div className="space-y-4">
                  <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-cream-200">
                    <Image src={p.image} alt={p.title} fill className="object-cover" />
                  </div>
                  <h3 className="text-lg font-medium text-charcoal font-poppins">
                    {p.title}
                  </h3>
                  <p className="text-xs text-charcoal-muted leading-relaxed font-light">
                    {p.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-cream-200">
                  <Link href="/special/bespoke" className="text-xs font-semibold text-gold-dark hover:text-forest inline-flex items-center gap-1">
                    Commission Specifications <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. CRITICAL: Centered & Balanced "Book Consultation" CTA Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-14 border border-gold/40 shadow-soft text-center max-w-4xl mx-auto flex flex-col items-center justify-center space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold-dark">
              <Crown className="w-7 h-7" />
            </div>

            <div className="space-y-3 max-w-2xl">
              <span className="text-[11px] font-bold text-gold-dark uppercase tracking-widest block">
                READY TO DISCUSS YOUR REQUIREMENTS?
              </span>
              <h3 className="text-2xl sm:text-4xl font-normal text-charcoal font-poppins leading-tight">
                Explore a More Personalized Ayurvedic & Wellness Experience
              </h3>
              <p className="text-xs sm:text-sm text-charcoal-muted max-w-xl mx-auto font-light leading-relaxed">
                Connect directly with our Master Vaidya and master craftsmen to commission turnkey Panchkarma sanctuary outfitting, custom teak tables, and personalized brassware.
              </p>
            </div>

            <div className="pt-2">
              <Link href="/special/inquiry">
                <Button variant="gold" size="lg" icon={Compass} className="uppercase tracking-wider font-bold shadow-glow">
                  Book Consultation
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer mode="SPECIAL" />
    </div>
  );
}
