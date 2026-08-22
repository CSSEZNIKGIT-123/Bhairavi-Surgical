'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Crown, Sparkles, Compass, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { formatCurrency, safeJsonParse } from '@/lib/utils';

export default function SpecialProductCard({ product }) {
  const images = safeJsonParse(product.images, [
    'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80',
  ]);
  const primaryImg = images[0];
  const specs = safeJsonParse(product.specifications, {});

  return (
    <div className="group relative bg-white rounded-3xl p-5 sm:p-6 border border-gold/30 hover:border-gold transition-all duration-300 shadow-soft hover:shadow-card flex flex-col justify-between text-charcoal">
      
      <div>
        {/* Media Container with Warm Ivory Frame */}
        <div className="relative w-full aspect-video sm:aspect-square rounded-2xl bg-[#FAF8F5] overflow-hidden mb-5 border border-gold/20">
          <Image
            src={primaryImg}
            alt={product.title}
            fill
            className="object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 640px) 100vw, 33vw"
          />

          <div className="absolute top-3 left-3 z-10">
            <span className="bg-gold/90 backdrop-blur-md text-slate-950 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              {product.badge || 'BESPOKE COMMISSION'}
            </span>
          </div>

          <div className="absolute bottom-3 right-3 z-10 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-gold/30 text-[11px] font-semibold text-gold-dark shadow-sm">
            Private Atelier
          </div>
        </div>

        {/* Product Information */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-gold-dark text-xs tracking-wider uppercase font-semibold">
            <Crown className="w-3.5 h-3.5" />
            <span>Exclusive Suite</span>
          </div>

          <Link href={`/special/products/${product.slug}`} className="block group-hover:text-forest transition-colors">
            <h3 className="text-lg sm:text-xl font-medium tracking-tight text-charcoal font-poppins">
              {product.title}
            </h3>
          </Link>

          <p className="text-xs sm:text-sm text-charcoal-muted line-clamp-2 leading-relaxed font-light">
            {product.description}
          </p>

          {/* Key Specs Pills */}
          {Object.keys(specs).length > 0 && (
            <div className="pt-2 flex flex-wrap gap-1.5">
              {Object.entries(specs).slice(0, 2).map(([key, val], idx) => (
                <span
                  key={idx}
                  className="bg-[#FAF8F5] border border-gold/20 px-2.5 py-1 rounded-lg text-[11px] text-charcoal"
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
                {product.specialBasePrice ? formatCurrency(product.specialBasePrice) : 'By Consultation'}
              </span>
            </div>
            <span className="text-[11px] text-charcoal-muted italic">Turnkey Commission</span>
          </div>
        </div>

      </div>

      {/* CTA Button */}
      <div className="pt-5 mt-4">
        <Link href={`/special/inquiry?product=${encodeURIComponent(product.title)}`} className="block w-full">
          <Button variant="gold" size="md" className="w-full font-bold uppercase tracking-wider" icon={Compass}>
            Request Private Consultation
          </Button>
        </Link>
      </div>

    </div>
  );
}
