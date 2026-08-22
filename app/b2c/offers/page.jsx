'use client';

import React, { useState, useEffect } from 'react';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import B2CProductCard from '@/components/products/B2CProductCard';
import { Tag, Sparkles, Copy, Check, Leaf } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function B2COffersPage() {
  const [products, setProducts] = useState([]);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    fetch('/api/products?mode=b2c')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.products.filter((p) => p.salePrice && p.salePrice < p.retailPrice));
        }
      })
      .catch(console.error);
  }, []);

  const coupons = [
    {
      code: 'VEDA15',
      discount: '15% OFF',
      desc: 'Applicable across all classical medicated oils and wildcrafted churnas.',
      minSpend: 'Min spend ₹999',
    },
    {
      code: 'PANCHKARMA',
      discount: '₹500 FLAT',
      desc: 'Exclusive savings on bronze Kansa therapy wands and Shirodhara accessories.',
      minSpend: 'Min spend ₹3,500',
    },
    {
      code: 'FIRSTAYURVED',
      discount: '10% OFF',
      desc: 'Welcome voucher on your first order of authentic Ayurvedic products.',
      minSpend: 'No minimum order',
    },
  ];

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-poppins">
      <AnnouncementBar mode="B2C" />
      <Navbar mode="B2C" />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-terracotta/10 text-terracotta px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Leaf className="w-3.5 h-3.5" />
            <span>Seasonal Wellness Promotions</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-charcoal font-poppins">
            Special Offers & Seasonal Bundles
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted">
            Apply active promotional coupon codes during checkout for authentic Ayurvedic wellness savings.
          </p>
        </div>

        {/* Coupons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {coupons.map((c, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border-2 border-dashed border-terracotta/30 shadow-soft space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-terracotta">{c.discount}</span>
                  <span className="text-[10px] text-charcoal-muted uppercase">{c.minSpend}</span>
                </div>
                <p className="text-xs text-charcoal leading-relaxed">{c.desc}</p>
              </div>

              <div className="flex items-center justify-between bg-cream-100 p-2.5 rounded-xl border border-cream-300">
                <span className="font-mono font-bold text-xs text-charcoal tracking-wider">
                  {c.code}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(c.code)}
                  className="text-xs font-semibold text-forest hover:text-forest-dark flex items-center gap-1"
                >
                  {copiedCode === c.code ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Code
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Discounted Products Grid */}
        <div className="space-y-6 pt-6">
          <h2 className="text-2xl font-bold text-charcoal font-poppins">
            Featured Classical Formulations on Sale
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((p) => (
              <B2CProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </main>

      <Footer mode="B2C" />
    </div>
  );
}
