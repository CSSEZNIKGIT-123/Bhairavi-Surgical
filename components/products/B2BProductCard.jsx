'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FileText, ShoppingCart, Plus, Minus, Layers, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useQuote } from '@/context/QuoteContext';
import Badge from '@/components/ui/Badge';
import { formatCurrency, safeJsonParse } from '@/lib/utils';

export default function B2BProductCard({ product }) {
  const { addItem } = useCart();
  const { addToQuote } = useQuote();

  const minOrderQty = product.moq || 5;
  const [quantity, setQuantity] = useState(minOrderQty);
  const [addedCart, setAddedCart] = useState(false);
  const [addedQuote, setAddedQuote] = useState(false);

  const images = safeJsonParse(product.images, [
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80',
  ]);
  const primaryImg = images[0];

  const priceTiers = product.priceTiers || [];

  // Calculate active unit price based on current quantity
  const getUnitPrice = (qty) => {
    if (priceTiers && priceTiers.length > 0) {
      const sorted = [...priceTiers].sort((a, b) => b.minQty - a.minQty);
      const match = sorted.find((t) => qty >= t.minQty);
      if (match) return match.unitPrice;
    }
    return product.b2bBasePrice || product.salePrice || product.retailPrice;
  };

  const currentUnitPrice = getUnitPrice(quantity);
  const totalWholesale = currentUnitPrice * quantity;

  const handleBulkAddToCart = () => {
    addItem(product, quantity, 'B2B');
    setAddedCart(true);
    setTimeout(() => setAddedCart(false), 1800);
  };

  const handleAddToQuote = () => {
    addToQuote(product, quantity, currentUnitPrice);
    setAddedQuote(true);
    setTimeout(() => setAddedQuote(false), 1800);
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-cream-200 hover:border-emerald-800/40 transition-all duration-300 hover:shadow-card flex flex-col justify-between">
      
      <div>
        {/* Top Badges & SKU Header */}
        <div className="flex items-center justify-between pb-3 border-b border-cream-200 text-xs">
          <span className="font-mono text-[11px] font-semibold text-charcoal-light bg-cream-100 px-2 py-0.5 rounded-md">
            SKU: {product.sku}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold text-emerald-800">
              {product.stock > 0 ? `${product.stock} In Stock` : 'Backorder'}
            </span>
          </div>
        </div>

        {/* Media & Details Row */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 my-4 items-center">
          <div className="sm:col-span-4 relative aspect-square rounded-xl bg-cream-100 overflow-hidden">
            <Image
              src={primaryImg}
              alt={product.title}
              fill
              className="object-cover object-center"
              sizes="(max-width: 640px) 100vw, 30vw"
            />
            <div className="absolute bottom-1.5 left-1.5">
              <Badge variant="forest" size="sm">
                MOQ: {minOrderQty} units
              </Badge>
            </div>
          </div>

          <div className="sm:col-span-8 space-y-1.5">
            <Link href={`/b2b/products/${product.slug}`} className="hover:text-forest transition-colors">
              <h3 className="text-base font-bold text-charcoal font-poppins line-clamp-1">
                {product.title}
              </h3>
            </Link>
            <p className="text-xs text-charcoal-muted line-clamp-2">
              {product.description}
            </p>

            {/* Wholesale Base Price */}
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-xs text-charcoal-muted">Wholesale Base:</span>
              <span className="text-base font-bold text-charcoal font-poppins">
                {formatCurrency(currentUnitPrice)}
                <span className="text-[11px] font-normal text-charcoal-light"> / unit</span>
              </span>
            </div>
          </div>
        </div>

        {/* Volume Tier Pricing Breakdown Matrix */}
        {priceTiers.length > 0 && (
          <div className="bg-cream-50 rounded-xl p-2.5 border border-cream-200 mb-4 space-y-1.5">
            <div className="text-[11px] font-bold text-charcoal uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3 h-3 text-forest" />
              Volume Tiered Pricing:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-center">
              {priceTiers.map((tier, idx) => {
                const isSelectedTier =
                  quantity >= tier.minQty &&
                  (!tier.maxQty || quantity <= tier.maxQty);

                return (
                  <div
                    key={idx}
                    className={`p-1.5 rounded-lg border text-[11px] transition-colors ${
                      isSelectedTier
                        ? 'bg-forest text-white border-forest font-bold shadow-sm'
                        : 'bg-white text-charcoal border-cream-300'
                    }`}
                  >
                    <div className="text-[10px] opacity-80">
                      {tier.minQty}{tier.maxQty ? `–${tier.maxQty}` : '+'} units
                    </div>
                    <div className="font-semibold">{formatCurrency(tier.unitPrice)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Action Footer: Quantity Selector + Dual CTAs */}
      <div className="pt-3 border-t border-cream-200 space-y-3">
        
        {/* Quantity Controls & Live Total */}
        <div className="flex items-center justify-between">
          <div className="flex items-center border border-cream-300 rounded-xl bg-white p-0.5">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(minOrderQty, quantity - 5))}
              className="p-1.5 hover:bg-cream-100 rounded-lg text-charcoal transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <input
              type="number"
              min={minOrderQty}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(minOrderQty, parseInt(e.target.value) || minOrderQty))}
              className="w-14 text-center text-xs font-bold text-charcoal focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setQuantity(quantity + 5)}
              className="p-1.5 hover:bg-cream-100 rounded-lg text-charcoal transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="text-right">
            <div className="text-[10px] text-charcoal-muted uppercase">Subtotal (Excl. GST)</div>
            <div className="text-sm font-bold text-forest">{formatCurrency(totalWholesale)}</div>
          </div>
        </div>

        {/* Dual Actions: Add to Quote (RFQ) & Add to Bulk Cart */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleAddToQuote}
            className={`py-2 px-2.5 rounded-xl border text-xs font-bold font-poppins transition-all flex items-center justify-center gap-1.5 ${
              addedQuote
                ? 'bg-emerald-800 text-white border-emerald-800'
                : 'border-emerald-800/30 text-emerald-900 bg-emerald-50/50 hover:bg-emerald-100'
            }`}
          >
            {addedQuote ? <Check className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
            <span>{addedQuote ? 'ADDED RFQ' : 'ADD TO RFQ'}</span>
          </button>

          <button
            type="button"
            onClick={handleBulkAddToCart}
            className={`py-2 px-2.5 rounded-xl border text-xs font-bold font-poppins transition-all flex items-center justify-center gap-1.5 ${
              addedCart
                ? 'bg-forest text-white border-forest'
                : 'bg-forest text-white border-forest hover:bg-forest-dark'
            }`}
          >
            {addedCart ? <Check className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
            <span>{addedCart ? 'ADDED' : 'BUY BULK'}</span>
          </button>
        </div>

      </div>

    </div>
  );
}
