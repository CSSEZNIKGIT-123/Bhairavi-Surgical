'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Crown, Sparkles, Compass, ShieldCheck, CheckCircle2, ChevronRight } from 'lucide-react';
import { formatCurrency, safeJsonParse } from '@/lib/utils';

export default function SpecialProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/products/${slug}`);
        const data = await res.json();
        if (data.success) setProduct(data.product);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    if (slug) load();
  }, [slug]);

  if (loading || !product) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] text-charcoal flex flex-col font-poppins">
        <AnnouncementBar mode="SPECIAL" />
        <Navbar mode="SPECIAL" />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer mode="SPECIAL" />
      </div>
    );
  }

  const images = safeJsonParse(product.images, ['https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80']);
  const specs = safeJsonParse(product.specifications, {});

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-charcoal flex flex-col font-poppins selection:bg-gold selection:text-charcoal">
      <AnnouncementBar mode="SPECIAL" />
      <Navbar mode="SPECIAL" />

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full text-xs text-charcoal-muted flex items-center gap-1.5">
        <Link href="/special" className="hover:text-forest">Special Atelier</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/special/collections" className="hover:text-forest">Collections</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-charcoal font-medium truncate max-w-xs">{product.title}</span>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Visuals (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative aspect-square w-full rounded-3xl bg-white overflow-hidden border border-gold/30 shadow-card">
              <Image src={images[0]} alt={product.title} fill priority className="object-cover" />
              <div className="absolute top-4 left-4">
                <span className="text-[10px] font-bold text-slate-950 bg-gold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                  ATELIER COMMISSION
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-gold/20 text-xs text-charcoal space-y-2 shadow-soft">
              <div className="font-semibold text-gold-dark flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-gold-dark" />
                <span>Individually Serialized Masterpiece</span>
              </div>
              <p className="text-[11px] text-charcoal-muted leading-relaxed font-light">
                Delivered with hand-signed metallurgical test certificates, cryogenic treatment documentation, and dedicated brass plaque.
              </p>
            </div>
          </div>

          {/* Details & Commission CTA (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-mono text-gold-dark font-bold">
                SKU: {product.sku}
              </span>
              <h1 className="text-3xl sm:text-4xl font-light text-charcoal font-poppins mt-1">
                {product.title}
              </h1>
              {product.subtitle && (
                <p className="text-sm text-charcoal-muted mt-1">{product.subtitle}</p>
              )}
            </div>

            <div className="p-6 bg-white rounded-3xl border border-gold/30 space-y-4 shadow-soft">
              <div className="flex items-baseline gap-3">
                <span className="text-xs font-light text-charcoal-muted uppercase tracking-widest">
                  Commission Base:
                </span>
                <span className="text-3xl font-bold text-forest font-poppins">
                  {formatCurrency(product.specialBasePrice || product.retailPrice * 1.5)}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed font-light">
                {product.description}
              </p>

              <div className="pt-3 border-t border-cream-200 flex flex-col sm:flex-row gap-3">
                <Link href={`/special/inquiry?product=${encodeURIComponent(product.title)}`} className="flex-1">
                  <Button variant="gold" size="lg" className="w-full font-bold uppercase tracking-wider shadow-glow" icon={Compass}>
                    Book Consultation
                  </Button>
                </Link>

                <Link href="/special/bespoke">
                  <Button variant="secondary" size="lg" className="border-cream-300 text-charcoal hover:bg-cream-100">
                    Customize Specifications
                  </Button>
                </Link>
              </div>
            </div>

            {/* Technical Specifications */}
            {Object.keys(specs).length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-gold-dark uppercase tracking-widest">
                  Atelier Technical Specifications
                </h3>
                <div className="rounded-2xl border border-cream-200 overflow-hidden text-xs divide-y divide-cream-200 bg-white shadow-soft">
                  {Object.entries(specs).map(([key, val], idx) => (
                    <div key={idx} className="grid grid-cols-2 p-3.5">
                      <span className="text-charcoal font-medium">{key}</span>
                      <span className="text-charcoal-muted">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </main>

      <Footer mode="SPECIAL" />
    </div>
  );
}
