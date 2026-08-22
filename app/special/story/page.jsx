'use client';

import React from 'react';
import Image from 'next/image';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Crown, Sparkles, Compass, Leaf } from 'lucide-react';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function SpecialStoryPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F5] text-charcoal flex flex-col font-poppins selection:bg-gold selection:text-charcoal">
      <AnnouncementBar mode="SPECIAL" />
      <Navbar mode="SPECIAL" />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-semibold text-gold-dark bg-gold/15 px-4 py-1.5 rounded-full border border-gold/30 uppercase tracking-widest">
            The Sovereign Atelier Origin & Metallurgy
          </span>
          <h1 className="text-3xl sm:text-5xl font-light text-charcoal font-poppins leading-tight">
            Sacred Metallurgy & Woodcraft for the World's Discerning Vaidyas.
          </h1>
          <p className="text-sm sm:text-base text-charcoal-muted leading-relaxed font-light">
            Born from a devotion to reviving the highest classical standards of Ayurveda, the Sovereign division of Yugan crafts bespoke therapy tables, hand-forged bell-metal apparatus, and rare Avarti potentiations for sanctuaries of enduring prestige.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white rounded-3xl p-8 sm:p-12 border border-gold/25 shadow-soft">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-card border border-gold/20">
            <Image
              src="https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=80"
              alt="Bespoke Ayurvedic atelier craftsmanship"
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-medium text-charcoal font-poppins">
              The Heirloom Standard
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed font-light">
              We collaborate with hereditary bell-metal artisans from Kerala and master temple woodcarvers to create Panchkarma equipment that elevates the therapeutic experience into an art form. Each brass Shirodhara pot is hand-turned, mirror-buffed, and fitted with custom flow regulators.
            </p>
            <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed font-light">
              Presented with serialized certification of metal purity and timber provenance, our Sovereign collections represent the highest benchmark in holistic Ayurvedic sanctuary design.
            </p>

            <div className="pt-4">
              <Link href="/special/inquiry">
                <Button variant="gold" size="lg" icon={Compass} className="font-bold uppercase tracking-wider shadow-glow">
                  Commission a Sanctuary Suite
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer mode="SPECIAL" />
    </div>
  );
}
