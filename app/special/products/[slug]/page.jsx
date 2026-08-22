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
import SpecialProductCard from '@/components/products/SpecialProductCard';
import {
  Crown,
  Sparkles,
  Compass,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  ShoppingBag,
  Award,
  ArrowRight,
  Leaf,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { getProductBySlug, getRelatedProducts } from '@/lib/products';

export default function SpecialProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    if (slug) {
      const prod = getProductBySlug(slug);
      if (prod) {
        setProduct(prod);
        if (prod.variants && prod.variants.length > 0) {
          setSelectedVariant(prod.variants[0]);
        }
        const rel = getRelatedProducts(prod, 'special', 3);
        setRelated(rel);
      }
      setLoading(false);
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] text-charcoal flex flex-col font-poppins">
        <AnnouncementBar mode="SPECIAL" />
        <Navbar mode="SPECIAL" />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer mode="SPECIAL" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] text-charcoal flex flex-col font-poppins">
        <AnnouncementBar mode="SPECIAL" />
        <Navbar mode="SPECIAL" />
        <main className="flex-1 max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-gold/20 text-gold-dark flex items-center justify-center mx-auto">
            <Crown className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-charcoal">Atelier Suite Not Found</h1>
          <p className="text-sm text-charcoal-muted max-w-md mx-auto">
            The bespoke sanctuary commission you requested is not listed in the atelier portfolio.
          </p>
          <Link href="/special/collections">
            <Button variant="gold" size="lg">Explore Atelier Collections</Button>
          </Link>
        </main>
        <Footer mode="SPECIAL" />
      </div>
    );
  }

  const activePrice = selectedVariant?.price || product.specialBasePrice || product.retailPrice * 1.5;

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-charcoal flex flex-col font-poppins selection:bg-gold selection:text-charcoal">
      <AnnouncementBar mode="SPECIAL" />
      <Navbar mode="SPECIAL" />

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full text-xs text-charcoal-muted flex items-center gap-2 flex-wrap">
        <Link href="/special" className="hover:text-forest">Special Atelier</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/special/collections" className="hover:text-forest">Collections</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-charcoal font-semibold truncate max-w-[200px] sm:max-w-xs">{product.name}</span>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-16">
        
        {/* Top Product Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Visuals (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative aspect-square w-full rounded-3xl bg-white overflow-hidden border border-gold/30 shadow-card">
              <Image
                src={product.images[selectedImgIndex] || product.thumbnail}
                alt={product.name}
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute top-4 left-4">
                <span className="text-[10px] font-bold text-slate-950 bg-gold/95 px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                  {product.badge || 'ATELIER COMMISSION'}
                </span>
              </div>
            </div>

            {/* Thumbnail Carousel */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-2.5 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImgIndex(idx)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-white ${
                      selectedImgIndex === idx ? 'border-gold ring-2 ring-gold/20' : 'border-gold/20 opacity-70'
                    }`}
                  >
                    <Image src={img} alt={`View ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="p-5 rounded-2xl bg-white border border-gold/20 text-xs text-charcoal space-y-2 shadow-soft">
              <div className="font-semibold text-gold-dark flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-gold-dark" />
                <span>Individually Serialized Turnkey Suite</span>
              </div>
              <p className="text-[11px] text-charcoal-muted leading-relaxed font-light">
                Hand-carved by hereditary temple sculptors, seasoned for 3 years, and delivered with a laser-engraved brass registry plaque.
              </p>
            </div>
          </div>

          {/* Details & Order Controls (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Title & SKU */}
            <div>
              <span className="text-xs font-mono text-gold-dark font-bold bg-gold/10 px-2.5 py-0.5 rounded border border-gold/20">
                SKU: {product.sku}
              </span>
              <h1 className="text-3xl sm:text-4xl font-light text-charcoal font-poppins mt-2">
                {product.name}
              </h1>
              {product.subtitle && (
                <p className="text-xs sm:text-sm text-gold-dark font-medium italic mt-1">{product.subtitle}</p>
              )}
            </div>

            {/* Commission Price Box */}
            <div className="p-6 bg-white rounded-3xl border border-gold/30 space-y-4 shadow-soft">
              <div className="flex items-baseline gap-3">
                <span className="text-xs font-semibold text-charcoal-muted uppercase tracking-widest">
                  Estimated Investment:
                </span>
                <span className="text-3xl sm:text-4xl font-bold text-forest font-poppins">
                  {formatCurrency(activePrice)}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed font-light">
                {product.shortDescription || product.description}
              </p>

              {/* Variant Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold text-charcoal uppercase tracking-wider block">
                    Select Dimensions & Timber Edition:
                  </label>
                  <div className="flex flex-wrap gap-2.5">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        className={`px-4 py-2.5 rounded-xl border text-xs font-semibold font-poppins transition-all ${
                          selectedVariant?.id === v.id
                            ? 'bg-gold text-slate-950 border-gold shadow-sm font-bold'
                            : 'bg-white text-charcoal border-gold/30 hover:border-gold'
                        }`}
                      >
                        {v.name} — {formatCurrency(v.price)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Action Buttons — MAKE YOUR ORDER */}
              <div className="pt-4 border-t border-cream-200 flex flex-col sm:flex-row gap-3">
                <Link
                  href={`/special/inquiry?product=${encodeURIComponent(product.name)}&sku=${encodeURIComponent(product.sku)}&variant=${encodeURIComponent(selectedVariant?.name || '')}&action=order`}
                  className="flex-1"
                >
                  <Button
                    variant="gold"
                    size="lg"
                    className="w-full font-bold uppercase tracking-wider shadow-glow text-slate-950"
                    icon={ShoppingBag}
                  >
                    Make Your Order
                  </Button>
                </Link>

                <Link href="/special/bespoke" className="sm:w-auto">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full border-gold/30 text-charcoal hover:bg-gold/10"
                    icon={Compass}
                  >
                    Custom Calibration
                  </Button>
                </Link>
              </div>
            </div>

            {/* Technical Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-gold-dark uppercase tracking-widest">
                  Atelier Technical & Wood Specifications
                </h3>
                <div className="rounded-2xl border border-gold/20 overflow-hidden text-xs divide-y divide-gold/20 bg-white shadow-soft">
                  {Object.entries(product.specifications).map(([key, val], idx) => (
                    <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 p-3.5">
                      <span className="text-charcoal font-medium sm:col-span-1">{key}</span>
                      <span className="text-charcoal-muted sm:col-span-2">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Benefits & Heritage Details */}
        {product.benefits && product.benefits.length > 0 && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gold/30 shadow-soft space-y-4">
            <h2 className="text-lg sm:text-xl font-medium text-charcoal font-poppins flex items-center gap-2">
              <Award className="w-5 h-5 text-gold-dark" />
              Masterwork Craftsmanship & Ayurvedic Alignment
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {product.benefits.map((b, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-4 rounded-2xl bg-[#FAF9F5] border border-gold/20 text-xs">
                  <Sparkles className="w-4 h-4 text-gold-dark shrink-0 mt-0.5" />
                  <span className="text-charcoal font-medium leading-relaxed">{b}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Atelier Collections */}
        {related.length > 0 && (
          <div className="space-y-6 pt-6 border-t border-gold/20">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-light text-charcoal font-poppins">
                  Complementary Atelier Masterworks
                </h2>
                <p className="text-xs text-charcoal-muted font-light mt-0.5">
                  Handcrafted Shirodhara arches, teak Dronis, and brass suites
                </p>
              </div>
              <Link href="/special/collections" className="text-xs font-bold text-gold-dark hover:text-forest flex items-center gap-1">
                <span>View Full Atelier</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 min-[440px]:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((relProduct) => (
                <SpecialProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </div>
        )}

      </main>

      <Footer mode="SPECIAL" />
    </div>
  );
}
