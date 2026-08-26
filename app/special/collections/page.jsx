'use client';

import React, { useState, useEffect } from 'react';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SpecialProductCard from '@/components/products/SpecialProductCard';
import { Crown, Compass } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function SpecialCollectionsPage() {
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

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-charcoal flex flex-col font-poppins selection:bg-gold selection:text-charcoal">
      <AnnouncementBar mode="SPECIAL" />
      <Navbar mode="SPECIAL" />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-dark bg-gold/15 px-3 py-1 rounded-full border border-gold/30 uppercase tracking-widest">
            <Crown className="w-3.5 h-3.5" />
            <span>The Master Atelier Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-light text-charcoal font-poppins">
            Sovereign Panchkarma Suites & Masterworks
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted max-w-xl mx-auto font-light leading-relaxed">
            Exclusively commissioned carved teak Dronis, hand-hammered brass Shirodhara vessels, and 101-times potentiated Avarti tailas.
          </p>
        </div>

        {/* Dynamic Product Count Indicator */}
        <div className="flex items-center justify-between px-1 border-b border-gold/20 pb-4">
          <span className="text-sm font-semibold text-charcoal">
            {loading ? (
              'Loading masterworks...'
            ) : (
              <>
                Showing <span className="text-gold-dark font-bold">{products.length}</span>{' '}
                {products.length === 1 ? 'Sovereign Masterwork' : 'Sovereign Masterworks'}
              </>
            )}
          </span>
          <span className="text-xs text-charcoal-muted font-light hidden sm:inline">
            Direct Atelier Commission & Custom Dimensions Available
          </span>
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

        {/* Centered Pre-Footer CTA */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gold/30 shadow-soft text-center max-w-3xl mx-auto flex flex-col items-center justify-center space-y-5">
          <div className="w-12 h-12 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold-dark">
            <Crown className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-normal text-charcoal font-poppins">
              Looking for a Bespoke Custom Dimension?
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-muted max-w-lg mx-auto">
              Our temple artisans customize table lengths, crest monograms, and brassware finishes to your architectural sanctuary specs.
            </p>
          </div>
          <Link href="/special/inquiry">
            <Button variant="gold" size="md" icon={Compass} className="font-bold uppercase tracking-wider">
              Book Consultation
            </Button>
          </Link>
        </div>
      </main>

      <Footer mode="SPECIAL" />
    </div>
  );
}
