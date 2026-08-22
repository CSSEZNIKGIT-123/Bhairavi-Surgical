'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, FileText, ArrowRight, Building2, Send } from 'lucide-react';
import Drawer from '@/components/ui/Drawer';
import Button from '@/components/ui/Button';
import { useQuote } from '@/context/QuoteContext';
import { formatCurrency, safeJsonParse } from '@/lib/utils';

export default function QuoteBuilderDrawer() {
  const { quoteItems, isOpen, closeQuote, updateQuoteItem, removeFromQuote, quoteCount } = useQuote();

  return (
    <Drawer
      isOpen={isOpen}
      onClose={closeQuote}
      title="B2B RFQ Procurement Tray"
      subtitle={`${quoteCount} wholesale line item${quoteCount === 1 ? '' : 's'}`}
      footer={
        quoteItems.length > 0 && (
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" /> Institutional Bidding Active
              </div>
              <p className="text-[11px] text-emerald-800">
                Quotes are evaluated by our assigned Ayurvedic institutional accounts team with custom volume discounts and GST credit invoices.
              </p>
            </div>

            <Link href="/b2b/quotes" onClick={closeQuote} className="block w-full">
              <Button variant="primary" size="lg" className="w-full" icon={Send} iconPosition="right">
                COMPLETE & SUBMIT RFQ
              </Button>
            </Link>
          </div>
        )
      }
    >
      {quoteItems.length === 0 ? (
        <div className="py-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-800">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-base font-bold text-charcoal">Your RFQ Tray is empty</h4>
            <p className="text-xs text-charcoal-muted mt-1 max-w-xs mx-auto">
              Add products from the B2B catalog to request custom volume discounts and institutional pricing.
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={closeQuote}>
            Browse Wholesale Catalog
          </Button>
        </div>
      ) : (
        <div className="divide-y divide-cream-200">
          {quoteItems.map((item) => {
            const images = safeJsonParse(item.product.images, ['https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=300&q=80']);
            const primaryImg = images[0];

            return (
              <div key={item.id} className="py-4 space-y-2">
                <div className="flex gap-3 items-center">
                  <div className="relative w-16 h-16 rounded-xl bg-cream-100 overflow-hidden border border-cream-200 shrink-0">
                    <Image src={primaryImg} alt={item.product.title} fill className="object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-charcoal truncate font-poppins">
                      {item.product.title}
                    </h4>
                    <span className="text-[10px] font-mono text-charcoal-light">
                      SKU: {item.product.sku}
                    </span>
                    <div className="text-xs font-semibold text-forest">
                      Wholesale Base: {formatCurrency(item.product.b2bBasePrice || item.product.retailPrice)}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromQuote(item.id)}
                    className="text-charcoal-light hover:text-terracotta p-1 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Quantity & Target Price Inputs */}
                <div className="grid grid-cols-2 gap-2 bg-cream-50 p-2.5 rounded-xl border border-cream-200">
                  <div>
                    <label className="text-[10px] font-bold text-charcoal uppercase block mb-1">
                      Required Quantity
                    </label>
                    <input
                      type="number"
                      min={item.product.moq || 1}
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuoteItem(item.id, {
                          quantity: Math.max(1, parseInt(e.target.value) || 1),
                        })
                      }
                      className="w-full px-2.5 py-1 text-xs font-bold rounded-lg border border-cream-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-charcoal uppercase block mb-1">
                      Target Unit Price (₹)
                    </label>
                    <input
                      type="number"
                      value={item.targetPrice || ''}
                      onChange={(e) =>
                        updateQuoteItem(item.id, {
                          targetPrice: parseFloat(e.target.value) || null,
                        })
                      }
                      placeholder="Optional"
                      className="w-full px-2.5 py-1 text-xs font-semibold rounded-lg border border-cream-300 bg-white"
                    />
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
