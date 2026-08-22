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
import { useCart } from '@/context/CartContext';
import { useQuote } from '@/context/QuoteContext';
import {
  Building2,
  FileSpreadsheet,
  FileText,
  Layers,
  ShieldCheck,
  CheckCircle2,
  ShoppingCart,
  Download,
  ChevronRight,
  Check,
} from 'lucide-react';
import { formatCurrency, safeJsonParse } from '@/lib/utils';

export default function B2BProductDetailPage() {
  const { slug } = useParams();
  const { addItem } = useCart();
  const { addToQuote } = useQuote();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(10);
  const [addedCart, setAddedCart] = useState(false);
  const [addedQuote, setAddedQuote] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/products/${slug}`);
        const data = await res.json();
        if (data.success) {
          setProduct(data.product);
          setQuantity(data.product.moq || 10);
        }
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
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
        <AnnouncementBar mode="B2B" />
        <Navbar mode="B2B" />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-forest border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer mode="B2B" />
      </div>
    );
  }

  const priceTiers = product.priceTiers || [];

  const getEffectiveUnitPrice = (qty) => {
    if (priceTiers.length > 0) {
      const sorted = [...priceTiers].sort((a, b) => b.minQty - a.minQty);
      const match = sorted.find((t) => qty >= t.minQty);
      if (match) return match.unitPrice;
    }
    return product.b2bBasePrice || product.retailPrice;
  };

  const currentUnitPrice = getEffectiveUnitPrice(quantity);
  const totalBase = currentUnitPrice * quantity;
  const gstAmount = totalBase * 0.18;
  const totalWithGst = totalBase + gstAmount;

  const images = safeJsonParse(product.images, ['https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80']);
  const specs = safeJsonParse(product.specifications, {});

  const handleBulkAdd = () => {
    addItem(product, quantity, 'B2B');
    setAddedCart(true);
    setTimeout(() => setAddedCart(false), 1800);
  };

  const handleQuoteAdd = () => {
    addToQuote(product, quantity, currentUnitPrice);
    setAddedQuote(true);
    setTimeout(() => setAddedQuote(false), 1800);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-poppins">
      <AnnouncementBar mode="B2B" />
      <Navbar mode="B2B" />

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full text-xs text-charcoal-muted flex items-center gap-1.5">
        <Link href="/b2b" className="hover:text-forest">B2B Portal</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/b2b/products" className="hover:text-forest">Wholesale Products</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-charcoal font-semibold truncate max-w-xs">{product.title}</span>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left: Product Visuals & Compliance */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative aspect-square w-full rounded-3xl bg-white overflow-hidden border border-cream-300 shadow-card">
              <Image src={images[0]} alt={product.title} fill priority className="object-cover" />
              <div className="absolute top-4 left-4">
                <Badge variant="forest" size="md">
                  MOQ: {product.moq || 5} Units
                </Badge>
              </div>
            </div>

            <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200 text-xs space-y-2 text-emerald-950">
              <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Institutional Certification & QA</span>
              </div>
              <p className="text-[11px] leading-relaxed text-emerald-900/80">
                Supplied with manufacturer batch test certificates, ISO 13485 calibration certificates, and 10-year autoclave resilience warranty.
              </p>
            </div>
          </div>

          {/* Right: Wholesale Pricing Matrix & Procurement Form */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-charcoal-light font-bold bg-cream-200 px-2 py-0.5 rounded">
                  SKU: {product.sku}
                </span>
                <span className="text-emerald-800 font-bold">
                  ● {product.stock} Units In Stock (Factory Warehouse)
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-charcoal font-poppins mt-2">
                {product.title}
              </h1>
              {product.subtitle && (
                <p className="text-sm text-charcoal-muted mt-0.5">{product.subtitle}</p>
              )}
            </div>

            {/* Volume Tier Pricing Table */}
            {priceTiers.length > 0 && (
              <div className="bg-white p-5 rounded-3xl border border-cream-300 shadow-soft space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal flex items-center gap-2">
                  <Layers className="w-4 h-4 text-forest" />
                  Volume Tiered Pricing Breakdown:
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {priceTiers.map((tier, idx) => {
                    const isSelected =
                      quantity >= tier.minQty &&
                      (!tier.maxQty || quantity <= tier.maxQty);

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setQuantity(tier.minQty)}
                        className={`p-3 rounded-2xl border text-center transition-all ${
                          isSelected
                            ? 'bg-forest text-white border-forest shadow-sm ring-2 ring-forest/20'
                            : 'bg-cream-50 hover:bg-cream-100 text-charcoal border-cream-300'
                        }`}
                      >
                        <div className="text-[10px] uppercase font-bold tracking-wider opacity-80">
                          {tier.minQty}{tier.maxQty ? `–${tier.maxQty}` : '+'} units
                        </div>
                        <div className="text-base font-bold mt-0.5">
                          {formatCurrency(tier.unitPrice)}
                        </div>
                        {tier.label && (
                          <div className="text-[9px] mt-1 opacity-90 truncate">
                            {tier.label}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Live Quantity Calculator & Total Calculation */}
            <div className="bg-white p-6 rounded-3xl border border-cream-300 shadow-soft space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <label className="text-xs font-bold text-charcoal block mb-1">
                    Select Order Quantity (Min MOQ: {product.moq || 5})
                  </label>
                  <div className="flex items-center border border-cream-300 rounded-xl bg-white p-1 max-w-xs">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(product.moq || 5, quantity - 5))}
                      className="w-10 h-10 flex items-center justify-center font-bold text-charcoal hover:bg-cream-100 rounded-lg text-sm"
                    >
                      -5
                    </button>
                    <input
                      type="number"
                      min={product.moq || 5}
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(product.moq || 5, parseInt(e.target.value) || product.moq || 5))
                      }
                      className="w-20 text-center text-base font-bold text-charcoal focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 5)}
                      className="w-10 h-10 flex items-center justify-center font-bold text-charcoal hover:bg-cream-100 rounded-lg text-sm"
                    >
                      +5
                    </button>
                  </div>
                </div>

                {/* Calculation Snapshot */}
                <div className="sm:text-right text-xs space-y-1">
                  <div className="text-charcoal-muted">
                    Effective Unit Price: <strong className="text-charcoal">{formatCurrency(currentUnitPrice)}</strong>
                  </div>
                  <div className="text-charcoal-muted">
                    GST @ 18% (Input Credit Eligible): <strong>{formatCurrency(gstAmount)}</strong>
                  </div>
                  <div className="text-lg font-bold text-forest pt-1">
                    Total: {formatCurrency(totalWithGst)}
                  </div>
                </div>
              </div>

              {/* Dual Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handleQuoteAdd}
                  icon={addedQuote ? Check : FileText}
                >
                  {addedQuote ? 'ADDED TO RFQ TRAY' : 'ADD TO RFQ TRAY'}
                </Button>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleBulkAdd}
                  icon={addedCart ? Check : ShoppingCart}
                >
                  {addedCart ? 'ADDED TO CART' : 'BUY IN BULK'}
                </Button>
              </div>
            </div>

            {/* Technical Specifications */}
            {Object.keys(specs).length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal">
                  Hospital Technical Specifications
                </h3>
                <div className="rounded-2xl border border-cream-200 overflow-hidden text-xs divide-y divide-cream-200">
                  {Object.entries(specs).map(([key, val], idx) => (
                    <div key={idx} className="grid grid-cols-2 p-3 bg-white even:bg-cream-50">
                      <span className="font-semibold text-charcoal">{key}</span>
                      <span className="text-charcoal-muted">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </main>

      <Footer mode="B2B" />
    </div>
  );
}
