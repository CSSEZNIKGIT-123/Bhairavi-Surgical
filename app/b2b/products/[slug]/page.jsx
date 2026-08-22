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
import B2BProductCard from '@/components/products/B2BProductCard';
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
  ArrowRight,
  Leaf,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { getProductBySlug, getRelatedProducts } from '@/lib/products';

export default function B2BProductDetailPage() {
  const { slug } = useParams();
  const { addItem } = useCart();
  const { addToQuote, openQuote } = useQuote();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(10);
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [addedCart, setAddedCart] = useState(false);
  const [addedQuote, setAddedQuote] = useState(false);

  useEffect(() => {
    if (slug) {
      const prod = getProductBySlug(slug);
      if (prod) {
        setProduct(prod);
        setQuantity(prod.moq || 10);
        const rel = getRelatedProducts(prod, 'b2b', 4);
        setRelated(rel);
      }
      setLoading(false);
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-poppins">
        <AnnouncementBar mode="B2B" />
        <Navbar mode="B2B" />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-forest border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer mode="B2B" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-poppins">
        <AnnouncementBar mode="B2B" />
        <Navbar mode="B2B" />
        <main className="flex-1 max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center mx-auto">
            <Building2 className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-charcoal">Wholesale Formulation Not Found</h1>
          <p className="text-sm text-charcoal-muted max-w-md mx-auto">
            The wholesale procurement SKU you requested is not listed in the clinical catalog.
          </p>
          <Link href="/b2b/products">
            <Button variant="primary" size="lg">Browse B2B Catalog</Button>
          </Link>
        </main>
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
    return product.b2bBasePrice || product.retailPrice || 500;
  };

  const currentUnitPrice = getEffectiveUnitPrice(quantity);
  const totalBase = currentUnitPrice * quantity;
  const gstAmount = totalBase * 0.18;
  const totalWithGst = totalBase + gstAmount;

  const handleBulkAdd = () => {
    addItem(product, quantity, 'B2B');
    setAddedCart(true);
    setTimeout(() => setAddedCart(false), 2000);
  };

  const handleQuoteAdd = () => {
    addToQuote(product, quantity, currentUnitPrice);
    setAddedQuote(true);
    setTimeout(() => setAddedQuote(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-poppins">
      <AnnouncementBar mode="B2B" />
      <Navbar mode="B2B" />

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full text-xs text-charcoal-muted flex items-center gap-2 flex-wrap">
        <Link href="/b2b" className="hover:text-forest">B2B Portal</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/b2b/products" className="hover:text-forest">Wholesale Products</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/b2b/products?category=${product.categorySlug}`} className="hover:text-forest">
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-charcoal font-semibold truncate max-w-[200px] sm:max-w-xs">{product.name}</span>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-16">
        
        {/* Top Product Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left: Product Visuals & Compliance (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative aspect-square w-full rounded-3xl bg-white overflow-hidden border border-cream-300 shadow-card">
              <Image
                src={product.images[selectedImgIndex] || product.thumbnail}
                alt={product.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute top-4 left-4">
                <Badge variant="forest" size="md">
                  MOQ: {product.moq || 5} Units
                </Badge>
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
                      selectedImgIndex === idx ? 'border-forest ring-2 ring-forest/20' : 'border-cream-300 opacity-70'
                    }`}
                  >
                    <Image src={img} alt={`View ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="bg-emerald-50/80 p-5 rounded-2xl border border-emerald-200 text-xs space-y-2 text-emerald-950 shadow-soft">
              <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Hospital Certification & Batch Testing</span>
              </div>
              <p className="text-[11px] leading-relaxed text-emerald-900/80 font-light">
                Supplied with manufacturer NABL heavy-metal test certificates, GMP compliance documentation, and 100% tax invoice input tax credit (ITC) eligibility.
              </p>
            </div>
          </div>

          {/* Right: Wholesale Pricing Matrix & Procurement Controls (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Title & SKU */}
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-charcoal-muted font-bold bg-cream-200 px-2.5 py-0.5 rounded">
                  SKU: {product.sku}
                </span>
                <span className="text-emerald-800 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {product.stock} Units In Stock (Central Warehouse)
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-charcoal font-poppins mt-2">
                {product.name}
              </h1>
              {product.subtitle && (
                <p className="text-xs sm:text-sm text-forest font-medium italic mt-1">{product.subtitle}</p>
              )}
            </div>

            {/* Volume Tier Pricing Table */}
            {priceTiers.length > 0 && (
              <div className="bg-white p-5 rounded-3xl border border-cream-300 shadow-soft space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal flex items-center gap-2">
                  <Layers className="w-4 h-4 text-forest" />
                  Tiered Volume Pricing Structure:
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
                    Select Order Quantity (Min MOQ: {product.moq || 5} Units)
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
                  <div className="text-xl font-bold text-forest pt-1 font-poppins">
                    Estimated Total: {formatCurrency(totalWithGst)}
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
                  className="w-full font-bold uppercase tracking-wider border-emerald-800 text-emerald-950 bg-emerald-50 hover:bg-emerald-100"
                >
                  {addedQuote ? 'ADDED TO RFQ TRAY' : 'REQUEST A QUOTE'}
                </Button>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleBulkAdd}
                  icon={addedCart ? Check : ShoppingCart}
                  className="w-full font-bold uppercase tracking-wider"
                >
                  {addedCart ? 'ADDED TO CART' : 'BUY IN BULK'}
                </Button>
              </div>
            </div>

            {/* Technical Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal">
                  Hospital Technical & Regulatory Specifications
                </h3>
                <div className="rounded-2xl border border-cream-200 overflow-hidden text-xs divide-y divide-cream-200">
                  {Object.entries(product.specifications).map(([key, val], idx) => (
                    <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 p-3 bg-white even:bg-cream-50/50">
                      <span className="font-bold text-charcoal sm:col-span-1">{key}</span>
                      <span className="text-charcoal-muted sm:col-span-2">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Related B2B Formulations */}
        {related.length > 0 && (
          <div className="space-y-6 pt-6 border-t border-cream-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-charcoal font-poppins">
                  Complementary Clinical Procurement Formulations
                </h2>
                <p className="text-xs text-charcoal-muted font-light mt-0.5">
                  Tiered hospital supplies in the same category
                </p>
              </div>
              <Link href="/b2b/products" className="text-xs font-bold text-forest hover:text-forest-dark flex items-center gap-1">
                <span>View All Wholesale Products</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 min-[440px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {related.map((relProduct) => (
                <B2BProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </div>
        )}

      </main>

      <Footer mode="B2B" />
    </div>
  );
}
