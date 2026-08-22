'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useQuote } from '@/context/QuoteContext';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import {
  FileSpreadsheet,
  Building2,
  Trash2,
  Send,
  CheckCircle2,
  Printer,
  ShieldCheck,
  Plus,
  Leaf,
} from 'lucide-react';
import { formatCurrency, safeJsonParse } from '@/lib/utils';

export default function B2BQuotesPage() {
  const { quoteItems, updateQuoteItem, removeFromQuote, clearQuote, addToQuote } = useQuote();
  const { user } = useAuth();

  const [availableProducts, setAvailableProducts] = useState([]);
  const [selectedAddProduct, setSelectedAddProduct] = useState('');

  const [form, setForm] = useState({
    companyName: user?.businessProfile?.companyName || '',
    contactPerson: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    taxId: user?.businessProfile?.taxGstNumber || '',
    estimatedBudget: '₹1,00,000 - ₹5,00,000',
    deliveryTimeline: 'Within 2 Weeks',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quoteSuccess, setQuoteSuccess] = useState(null);

  useEffect(() => {
    fetch('/api/products?mode=b2b')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setAvailableProducts(data.products);
      })
      .catch(console.error);
  }, []);

  const handleAddQuickProduct = () => {
    if (!selectedAddProduct) return;
    const prod = availableProducts.find((p) => p.id === selectedAddProduct);
    if (prod) {
      addToQuote(prod, prod.moq || 10, prod.b2bBasePrice || prod.retailPrice);
      setSelectedAddProduct('');
    }
  };

  const handleSubmitQuote = async (e) => {
    e.preventDefault();
    setError(null);

    if (quoteItems.length === 0) {
      setError('Please add at least one line item to your RFQ before submitting.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: form.companyName,
          contactPerson: form.contactPerson,
          email: form.email,
          phone: form.phone,
          taxId: form.taxId,
          estimatedBudget: form.estimatedBudget,
          deliveryTimeline: form.deliveryTimeline,
          notes: form.notes,
          items: quoteItems.map((it) => ({
            productId: it.product.id,
            quantity: it.quantity,
            targetPrice: it.targetPrice,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit RFQ');

      setQuoteSuccess(data.quote);
      clearQuote();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-poppins">
      <AnnouncementBar mode="B2B" />
      <Navbar mode="B2B" />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        
        {quoteSuccess ? (
          /* RFQ Submission Success Screen */
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-cream-300 shadow-elevated text-center space-y-6 animate-slide-up">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-soft">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider bg-emerald-100 px-3 py-1 rounded-full">
                RFQ Submitted Successfully
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-charcoal font-poppins">
                Quotation Request #{quoteSuccess.quoteNumber}
              </h1>
              <p className="text-xs sm:text-sm text-charcoal-muted">
                Assigned to Yugan Ayurved Clinical Wholesale Division
              </p>
            </div>

            <div className="bg-cream-50 p-5 rounded-2xl border border-cream-200 text-xs text-left space-y-2.5">
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Clinic / Hospital / Company:</span>
                <span className="font-bold text-charcoal">{quoteSuccess.companyName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Procurement Officer / Vaidya:</span>
                <span className="font-semibold text-charcoal">{quoteSuccess.contactPerson}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Email for Formal Quotation:</span>
                <span className="font-medium text-charcoal">{quoteSuccess.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Total Requested Line Items:</span>
                <span className="font-bold text-forest">{quoteSuccess.items?.length || 1} Items</span>
              </div>
            </div>

            <p className="text-xs text-charcoal-muted leading-relaxed">
              Our Ayurvedic institutional sales team will analyze your requested bulk volume tiers (5L, 10L, 25L drums), apply GST credits, and deliver an official PDF quotation within <strong className="text-charcoal">4 business hours</strong>.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl border border-cream-300 text-charcoal text-xs font-bold hover:bg-cream-100 transition-colors flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Print RFQ Copy
              </button>
              <Link href="/b2b/products">
                <Button variant="primary" size="md">
                  Browse Wholesale Products
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          /* Main RFQ Builder */
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                <Building2 className="w-3.5 h-3.5" />
                <span>Institutional Request for Quote (RFQ)</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold text-charcoal font-poppins">
                Ayurvedic Wholesale Quotation Builder
              </h1>
              <p className="text-xs sm:text-sm text-charcoal-muted mt-1 max-w-2xl">
                Configure your clinic or hospital requirement list for bulk medicated oils, churnas, or Panchkarma tools, specify target pricing expectations, and receive a formal stamped quotation.
              </p>
            </div>

            {error && (
              <div className="p-4 bg-terracotta/10 border border-terracotta/30 text-terracotta text-xs font-medium rounded-2xl">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmitQuote} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Line Items Table (7 Cols) */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-cream-300 shadow-soft space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-cream-200">
                  <h3 className="text-base font-bold text-charcoal font-poppins">
                    Requested Line Items ({quoteItems.length})
                  </h3>
                  <span className="text-xs text-charcoal-muted">Adjust quantity & target rates</span>
                </div>

                {/* Quick Add Product Dropdown */}
                <div className="flex gap-2 p-3 bg-cream-50 rounded-2xl border border-cream-200 items-center">
                  <select
                    value={selectedAddProduct}
                    onChange={(e) => setSelectedAddProduct(e.target.value)}
                    className="flex-1 bg-white border border-cream-300 rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-none"
                  >
                    <option value="">Select Ayurvedic product to add to RFQ...</option>
                    {availableProducts.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} (SKU: {p.sku})
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAddQuickProduct}
                    disabled={!selectedAddProduct}
                    className="px-3.5 py-2 rounded-xl bg-forest hover:bg-forest-dark text-white text-xs font-bold disabled:opacity-40 transition-colors flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>

                {quoteItems.length === 0 ? (
                  <div className="py-12 text-center space-y-2 border-2 border-dashed border-cream-300 rounded-2xl p-6">
                    <p className="text-xs text-charcoal-muted">
                      No items currently in your RFQ tray. Select an Ayurvedic formulation above or add directly from the catalog.
                    </p>
                    <Link href="/b2b/products" className="text-xs font-bold text-forest underline block">
                      Browse Wholesale Catalog
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-cream-200">
                    {quoteItems.map((item) => {
                      const images = safeJsonParse(item.product.images, ['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=300&q=80']);
                      return (
                        <div key={item.id} className="py-4 space-y-3">
                          <div className="flex gap-3 items-center justify-between">
                            <div className="flex gap-3 items-center">
                              <div className="relative w-12 h-12 rounded-xl bg-cream-100 overflow-hidden border border-cream-200 shrink-0">
                                <Image src={images[0]} alt={item.product.title} fill className="object-cover" />
                              </div>
                              <div>
                                <h4 className="text-xs sm:text-sm font-bold text-charcoal">
                                  {item.product.title}
                                </h4>
                                <span className="text-[10px] font-mono text-charcoal-light block">
                                  SKU: {item.product.sku}
                                </span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeFromQuote(item.id)}
                              className="text-charcoal-light hover:text-terracotta p-1.5 transition-colors"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-cream-50/70 p-3 rounded-xl border border-cream-200 text-xs">
                            <div>
                              <label className="text-[10px] font-bold text-charcoal uppercase block mb-1">
                                Required Units / Drums
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
                                className="w-full px-3 py-1.5 text-xs font-bold rounded-lg border border-cream-300 bg-white"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-charcoal uppercase block mb-1">
                                Target Unit Price (₹)
                              </label>
                              <input
                                type="number"
                                value={item.targetPrice || ''}
                                placeholder={`Base: ₹${item.product.b2bBasePrice || item.product.retailPrice}`}
                                onChange={(e) =>
                                  updateQuoteItem(item.id, {
                                    targetPrice: parseFloat(e.target.value) || null,
                                  })
                                }
                                className="w-full px-3 py-1.5 text-xs font-semibold rounded-lg border border-cream-300 bg-white"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right Column: Business & Delivery Profile (5 Cols) */}
              <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-cream-300 shadow-soft space-y-5">
                <h3 className="text-base font-bold text-charcoal font-poppins pb-3 border-b border-cream-200">
                  Clinic & Institution Profile
                </h3>

                <Input
                  label="Hospital / Clinic / Distribution Firm"
                  required
                  placeholder="Ayush Panchkarma & Wellness Center"
                  value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Lead Vaidya / Officer"
                    required
                    placeholder="Dr. Anand Varma"
                    value={form.contactPerson}
                    onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                  />
                  <Input
                    label="GSTIN / Drug License ID"
                    placeholder="27ABCDE1234F1Z5"
                    value={form.taxId}
                    onChange={(e) => setForm({ ...form, taxId: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Official Email"
                    type="email"
                    required
                    placeholder="procurement@ayushpanchkarma.demo"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                  <Input
                    label="Direct Contact Phone"
                    required
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Select
                    label="Estimated Order Budget"
                    value={form.estimatedBudget}
                    onChange={(e) => setForm({ ...form, estimatedBudget: e.target.value })}
                    options={[
                      'Under ₹50,000',
                      '₹50,000 - ₹2,00,000',
                      '₹2,00,000 - ₹10,00,000',
                      '₹10,00,000+',
                    ]}
                  />

                  <Select
                    label="Required Dispatch Timeline"
                    value={form.deliveryTimeline}
                    onChange={(e) => setForm({ ...form, deliveryTimeline: e.target.value })}
                    options={[
                      'Immediate (2-3 Days)',
                      'Within 2 Weeks',
                      'Monthly Recurring Schedule',
                      'New Center Setup (Planning)',
                    ]}
                  />
                </div>

                <Textarea
                  label="Special Bulk Instructions / Packaging Preferences"
                  placeholder="Mention drum sizes (e.g. 5L/25L), batch test certificate requirements, or credit terms..."
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  loading={loading}
                  icon={Send}
                  iconPosition="right"
                >
                  SUBMIT FORMAL RFQ
                </Button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-charcoal-muted">
                  <ShieldCheck className="w-4 h-4 text-emerald-800" />
                  <span>Official GST 18% Tax Quotation within 4 business hours.</span>
                </div>
              </div>

            </form>
          </div>
        )}

      </main>

      <Footer mode="B2B" />
    </div>
  );
}
