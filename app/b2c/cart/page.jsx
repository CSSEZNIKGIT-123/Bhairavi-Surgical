'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/context/CartContext';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag, Check } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { formatCurrency, safeJsonParse } from '@/lib/utils';

export default function B2CCartPage() {
  const { items, updateQuantity, removeItem, clearCart, subtotal, itemCount } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState(null);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'SURGICAL20') {
      const discount = subtotal * 0.2;
      setAppliedDiscount(discount);
      setCouponMessage({ type: 'success', text: 'Coupon SURGICAL20 applied (20% OFF)' });
    } else if (couponCode.toUpperCase() === 'FIRSTCARE') {
      const discount = subtotal * 0.1;
      setAppliedDiscount(discount);
      setCouponMessage({ type: 'success', text: 'Coupon FIRSTCARE applied (10% OFF)' });
    } else {
      setCouponMessage({ type: 'error', text: 'Invalid promotional coupon code' });
    }
  };

  const finalTotal = Math.max(0, subtotal - appliedDiscount + (subtotal > 4999 ? 0 : 250));

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-poppins">
      <AnnouncementBar mode="B2C" />
      <Navbar mode="B2C" />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <h1 className="text-2xl sm:text-3xl font-bold text-charcoal font-poppins mb-8">
          Your Shopping Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
        </h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center space-y-4 border border-cream-200 shadow-soft max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-cream-100 flex items-center justify-center mx-auto text-charcoal-light">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-charcoal">Your cart is currently empty</h2>
            <p className="text-xs sm:text-sm text-charcoal-muted">
              Add surgical instruments or clinical monitors to proceed with order.
            </p>
            <Link href="/b2c/shop">
              <Button variant="primary" size="md">
                Browse Clinical Catalog
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Items Table (8 Cols) */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-cream-300 shadow-soft divide-y divide-cream-200">
              {items.map((item) => {
                const images = safeJsonParse(item.product.images, ['https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=300&q=80']);
                const primaryImg = images[0];

                return (
                  <div key={item.id} className="py-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex gap-4 items-center">
                      <div className="relative w-20 h-20 rounded-2xl bg-cream-100 overflow-hidden border border-cream-200 shrink-0">
                        <Image src={primaryImg} alt={item.product.title} fill className="object-cover" />
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-charcoal font-poppins">
                          {item.product.title}
                        </h3>
                        <span className="text-[11px] font-mono text-charcoal-light block">
                          SKU: {item.product.sku}
                        </span>
                        <span className="text-xs font-semibold text-forest">
                          {formatCurrency(item.unitPrice)} each
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 self-end sm:self-center">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-cream-300 rounded-xl bg-white p-0.5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center font-bold text-charcoal hover:bg-cream-100 rounded-lg text-xs"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center font-bold text-charcoal hover:bg-cream-100 rounded-lg text-xs"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-sm font-bold text-charcoal w-24 text-right">
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-charcoal-light hover:text-terracotta p-1.5 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}

              <div className="pt-4 flex justify-between items-center text-xs">
                <Link href="/b2c/shop" className="text-forest font-semibold hover:underline">
                  ← Continue Shopping
                </Link>
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-charcoal-muted hover:text-terracotta transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Right Summary Card (4 Cols) */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-cream-300 shadow-soft space-y-6">
              <h2 className="text-lg font-bold text-charcoal font-poppins pb-3 border-b border-cream-200">
                Order Summary
              </h2>

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <label className="text-xs font-bold text-charcoal block">Have a coupon code?</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g. SURGICAL20"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" variant="secondary" size="md">
                    Apply
                  </Button>
                </div>
                {couponMessage && (
                  <p className={`text-xs font-medium ${couponMessage.type === 'success' ? 'text-emerald-700' : 'text-terracotta'}`}>
                    {couponMessage.text}
                  </p>
                )}
              </form>

              {/* Breakdown */}
              <div className="space-y-2 text-xs text-charcoal pt-2 border-t border-cream-200">
                <div className="flex justify-between">
                  <span className="text-charcoal-muted">Subtotal</span>
                  <span className="font-semibold">{formatCurrency(subtotal)}</span>
                </div>

                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Promotional Discount</span>
                    <span>-{formatCurrency(appliedDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-charcoal-muted">Shipping (Standard Express)</span>
                  <span className="font-semibold text-emerald-800">
                    {subtotal > 4999 ? 'FREE' : formatCurrency(250)}
                  </span>
                </div>

                <div className="flex justify-between text-base font-bold text-charcoal pt-3 border-t border-cream-200">
                  <span>Grand Total</span>
                  <span className="text-forest font-poppins">{formatCurrency(finalTotal)}</span>
                </div>
              </div>

              <Link href="/b2c/checkout" className="block w-full">
                <Button variant="primary" size="lg" className="w-full" icon={ArrowRight} iconPosition="right">
                  PROCEED TO CHECKOUT
                </Button>
              </Link>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-charcoal-muted">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>256-Bit SSL Encrypted Healthcare Checkout</span>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer mode="B2C" />
    </div>
  );
}
