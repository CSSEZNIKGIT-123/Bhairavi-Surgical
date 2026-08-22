'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Crown, Sparkles, ArrowRight, ShoppingBag } from 'lucide-react';
import Button from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { normalizeProduct } from '@/lib/products';

export default function SpecialProductCard({ product }) {
  const p = normalizeProduct(product);
  if (!p) return null;

  const primaryImg = p.images[0] || 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=600&q=80';
  const specs = p.specifications || {};

  return (
    <div className="group relative bg-white rounded-3xl p-5 sm:p-6 border border-gold/30 hover:border-gold transition-all duration-300 shadow-soft hover:shadow-card flex flex-col justify-between text-charcoal">
      
      <div>
        {/* Media Container with Warm Ivory Frame */}
        <Link href={`/special/products/${p.slug}`} className="block relative w-full aspect-video sm:aspect-square rounded-2xl bg-[#FAF8F5] overflow-hidden mb-5 border border-gold/20">
          <Image
            src={primaryImg}
            alt={p.name}
            fill
            className="object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 640px) 100vw, 33vw"
          />

          <div className="absolute top-3 left-3 z-10">
            <span className="bg-gold/90 backdrop-blur-md text-slate-950 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              {p.badge || 'BESPOKE SUITE'}
            </span>
          </div>

          <div className="absolute bottom-3 right-3 z-10 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-gold/30 text-[11px] font-semibold text-gold-dark shadow-sm">
            Sovereign Atelier
          </div>
        </Link>

        {/* Product Information */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-gold-dark text-xs tracking-wider uppercase font-semibold">
            <Crown className="w-3.5 h-3.5" />
            <span>Exclusive Masterwork</span>
          </div>

          <Link href={`/special/products/${p.slug}`} className="block group-hover:text-forest transition-colors">
            <h3 className="text-lg sm:text-xl font-medium tracking-tight text-charcoal font-poppins line-clamp-1">
              {p.name}
            </h3>
          </Link>

          <p className="text-xs sm:text-sm text-charcoal-muted line-clamp-2 leading-relaxed font-light">
            {p.shortDescription || p.description}
          </p>

          {/* Key Specs Pills */}
          {Object.keys(specs).length > 0 && (
            <div className="pt-2 flex flex-wrap gap-1.5">
              {Object.entries(specs).slice(0, 2).map(([key, val], idx) => (
                <span
                  key={idx}
                  className="bg-[#FAF8F5] border border-gold/20 px-2.5 py-1 rounded-lg text-[11px] text-charcoal truncate max-w-full"
                >
                  <strong className="text-gold-dark font-semibold">{key}:</strong> {val}
                </span>
              ))}
            </div>
          )}

          {/* Base Commission Estimate */}
          <div className="pt-3 flex items-baseline justify-between border-t border-cream-200 mt-3">
            <div>
              <span className="text-[10px] text-charcoal-muted uppercase tracking-widest block font-medium">
                Estimated Investment
              </span>
              <span className="text-lg font-bold text-forest font-poppins">
                {p.specialBasePrice ? formatCurrency(p.specialBasePrice) : 'Custom Commission'}
              </span>
            </div>
            <span className="text-[11px] text-charcoal-muted italic">Turnkey Suite</span>
          </div>
        </div>

      </div>

      {/* CTA Button — MAKE YOUR ORDER */}
      <div className="pt-5 mt-4 flex flex-col gap-2">
        <Link
          href={`/special/inquiry?product=${encodeURIComponent(p.name)}&sku=${encodeURIComponent(p.sku)}&action=order`}
          className="block w-full"
        >
          <Button variant="gold" size="md" className="w-full font-bold uppercase tracking-wider text-slate-950" icon={ShoppingBag}>
            Make Your Order
          </Button>
        </Link>
        <Link
          href={`/special/products/${p.slug}`}
          className="text-center text-xs font-semibold text-charcoal-muted hover:text-forest transition-colors py-1 flex items-center justify-center gap-1"
        >
          <span>View Masterwork Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
}
