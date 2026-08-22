'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import Drawer from '@/components/ui/Drawer';
import Button from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';
import { formatCurrency, safeJsonParse } from '@/lib/utils';

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, subtotal, itemCount } = useCart();

  return (
    <Drawer
      isOpen={isOpen}
      onClose={closeCart}
      title="Shopping Cart"
      subtitle={`${itemCount} item${itemCount === 1 ? '' : 's'} selected`}
      footer={
        items.length > 0 && (
          <div className="space-y-4">
            <div className="space-y-1.5 text-xs text-charcoal">
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Subtotal</span>
                <span className="font-semibold">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Standard Shipping</span>
                <span className="text-emerald-700 font-semibold">
                  {subtotal > 4999 ? 'FREE' : formatCurrency(250)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold pt-2 border-t border-cream-200">
                <span>Estimated Total</span>
                <span className="text-forest">
                  {formatCurrency(subtotal + (subtotal > 4999 ? 0 : 250))}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Link href="/b2c/checkout" onClick={closeCart} className="block w-full">
                <Button variant="primary" size="lg" className="w-full" icon={ArrowRight} iconPosition="right">
                  PROCEED TO CHECKOUT
                </Button>
              </Link>
              <Link href="/b2c/cart" onClick={closeCart} className="block w-full text-center text-xs text-charcoal-muted hover:text-forest underline py-1">
                View Full Cart & Apply Coupons
              </Link>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-charcoal-muted">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>256-Bit SSL Encrypted Clinical Checkout</span>
            </div>
          </div>
        )
      }
    >
      {items.length === 0 ? (
        <div className="py-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-cream-200 flex items-center justify-center mx-auto text-charcoal-light">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-base font-bold text-charcoal">Your cart is empty</h4>
            <p className="text-xs text-charcoal-muted mt-1 max-w-xs mx-auto">
              Explore our clinical catalog for precision titanium instruments and diagnostic gear.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={closeCart}>
            Continue Shopping
          </Button>
        </div>
      ) : (
        <div className="divide-y divide-cream-200">
          {items.map((item) => {
            const images = safeJsonParse(item.product.images, ['https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=300&q=80']);
            const primaryImg = images[0];

            return (
              <div key={item.id} className="py-4 flex gap-3.5 items-center">
                <div className="relative w-20 h-20 rounded-xl bg-cream-100 overflow-hidden border border-cream-200 shrink-0">
                  <Image src={primaryImg} alt={item.product.title} fill className="object-cover" />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <h4 className="text-xs sm:text-sm font-bold text-charcoal truncate font-poppins">
                    {item.product.title}
                  </h4>
                  <div className="text-xs font-semibold text-forest">
                    {formatCurrency(item.unitPrice)}
                    {item.mode === 'B2B' && (
                      <span className="text-[10px] text-emerald-800 ml-1.5 font-bold uppercase bg-emerald-50 px-1.5 py-0.5 rounded">
                        B2B Tier
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-cream-300 rounded-lg bg-white">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-xs font-bold text-charcoal hover:bg-cream-100 rounded-l-lg"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-xs font-bold text-charcoal hover:bg-cream-100 rounded-r-lg"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-charcoal-light hover:text-terracotta p-1 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Drawer>
  );
}
