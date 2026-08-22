'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { Crown, Compass, CheckCircle2, ShieldCheck, ShoppingBag, ArrowRight, Sparkles, Box } from 'lucide-react';
import Link from 'next/link';

function SpecialInquiryContent() {
  const searchParams = useSearchParams();
  const productParam = searchParams.get('product') || '';
  const skuParam = searchParams.get('sku') || '';
  const variantParam = searchParams.get('variant') || '';
  const actionParam = searchParams.get('action') || '';

  const isOrderFlow = actionParam === 'order' || Boolean(productParam);

  const [form, setForm] = useState({
    name: '',
    organization: '',
    email: '',
    phone: '',
    requirementType: productParam ? `${productParam}${variantParam ? ` (${variantParam})` : ''}` : 'Turnkey Carved Teak Droni & Brass Shirodhara Suite',
    urgency: 'IMMEDIATE',
    quantity: '1',
    description: variantParam ? `Selected Variant: ${variantParam}. Please specify custom engraving, timber finish, or architectural requirements...` : '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successData, setSuccessData] = useState(null);

  useEffect(() => {
    if (productParam) {
      setForm((prev) => ({
        ...prev,
        requirementType: `${productParam}${variantParam ? ` (${variantParam})` : ''}`,
        description: prev.description || (variantParam ? `Selected Specification: ${variantParam}` : ''),
      }));
    }
  }, [productParam, variantParam]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        ...form,
        orderType: isOrderFlow ? 'PRODUCT_ORDER' : 'GENERAL_INQUIRY',
        productSku: skuParam || null,
        description: `[Order Flow: ${isOrderFlow ? 'Make Your Order' : 'Consultation'}] [Quantity: ${form.quantity || 1}] ${form.description || ''}`,
      };

      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit order');

      setSuccessData(data.inquiry);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-charcoal flex flex-col font-poppins selection:bg-gold selection:text-charcoal">
      <AnnouncementBar mode="SPECIAL" />
      <Navbar mode="SPECIAL" />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        
        {successData ? (
          /* Success Screen */
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gold/40 shadow-soft text-center space-y-6 animate-slide-up">
            <div className="w-16 h-16 rounded-full bg-gold/20 text-gold-dark border border-gold/40 flex items-center justify-center mx-auto shadow-soft">
              {isOrderFlow ? <ShoppingBag className="w-8 h-8" /> : <Crown className="w-8 h-8" />}
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-gold-dark uppercase tracking-widest bg-gold/10 px-3 py-1 rounded-full border border-gold/30">
                {isOrderFlow ? 'Atelier Commission Order Received' : 'Sanctuary Consultation Registered'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-normal text-charcoal font-poppins">
                Order Reference #{successData.inquiryNumber}
              </h1>
              <p className="text-xs sm:text-sm text-charcoal-muted">
                Assigned directly to Yugan Senior Artisan Atelier & Logistics Team
              </p>
            </div>

            <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-gold/20 text-xs text-left space-y-2.5 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Client / Vaidya:</span>
                <span className="font-semibold text-charcoal">{successData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Sanctuary / Practice:</span>
                <span className="text-charcoal">{successData.organization || 'Private Sanctuary'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Order Specification:</span>
                <span className="text-gold-dark font-semibold truncate max-w-[200px]">{successData.requirementType}</span>
              </div>
              {skuParam && (
                <div className="flex justify-between">
                  <span className="text-charcoal-muted">SKU:</span>
                  <span className="font-mono text-charcoal">{skuParam}</span>
                </div>
              )}
            </div>

            <p className="text-xs text-charcoal-muted max-w-md mx-auto leading-relaxed font-light">
              Our Master Wood Sculptor and Logistics Director will contact you at <strong className="text-charcoal">{successData.phone}</strong> within 24 hours to confirm timber grain allocation, laser engraving proofs, and direct door-to-door delivery timelines.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/special/collections">
                <Button variant="gold" size="md" className="font-bold uppercase tracking-wider text-slate-950">
                  Explore More Collections
                </Button>
              </Link>
              <Link href="/special">
                <Button variant="secondary" size="md" className="border-gold/30 text-charcoal">
                  Return to Sovereign Atelier
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          /* Main Order / Inquiry Form */
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gold/30 shadow-card space-y-8">
            
            {/* Header */}
            <div className="space-y-2 text-center max-w-xl mx-auto">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-dark bg-gold/15 px-3.5 py-1 rounded-full border border-gold/30 uppercase tracking-widest">
                {isOrderFlow ? <ShoppingBag className="w-3.5 h-3.5" /> : <Crown className="w-3.5 h-3.5" />}
                <span>{isOrderFlow ? 'Make Your Order — Sovereign Atelier' : 'Confidential Sanctuary Inquiry'}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-light text-charcoal font-poppins">
                {isOrderFlow ? 'Commission Your Masterwork' : 'Commission a Bespoke Ayurvedic Suite'}
              </h1>
              <p className="text-xs sm:text-sm text-charcoal-muted font-light">
                {isOrderFlow
                  ? 'Complete your order specification for hand-carved teak Dronis, brass Shirodhara suites, or classical masterworks.'
                  : 'Single-log carved teak Dronis, hand-hammered brass Shirodhara vessels, or private sanctuary outfitting.'}
              </p>
            </div>

            {/* Pre-filled Product Notice Banner if coming from product page */}
            {productParam && (
              <div className="bg-gold/10 p-4 sm:p-5 rounded-2xl border border-gold/30 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gold/20 text-gold-dark flex items-center justify-center shrink-0">
                    <Box className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-gold-dark tracking-wider">
                      Selected Masterwork Order Item
                    </div>
                    <div className="text-sm font-semibold text-charcoal font-poppins">
                      {productParam} {variantParam ? `— ${variantParam}` : ''}
                    </div>
                    {skuParam && (
                      <div className="text-[11px] font-mono text-charcoal-muted">SKU: {skuParam}</div>
                    )}
                  </div>
                </div>
                <Link
                  href="/special/collections"
                  className="text-xs font-semibold text-gold-dark hover:text-forest underline decoration-gold/40"
                >
                  Change Selection
                </Link>
              </div>
            )}

            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  label="Your Full Name *"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Vaidya Dr. Rajesh Sharma"
                />

                <Input
                  label="Sanctuary / Practice / Organization"
                  value={form.organization}
                  onChange={(e) => setForm({ ...form, organization: e.target.value })}
                  placeholder="Soukya Ayurvedic Wellness Retreat"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  label="Official Email Address *"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="doctor@soukyawellness.com"
                />

                <Input
                  label="Direct Phone / WhatsApp *"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="sm:col-span-2">
                  <Select
                    label="Commission Item / Category *"
                    value={form.requirementType}
                    onChange={(e) => setForm({ ...form, requirementType: e.target.value })}
                    options={[
                      { value: 'The Sovereign Heirloom Teak Droni Therapy Suite', label: 'The Sovereign Heirloom Teak Droni Therapy Suite' },
                      { value: 'Hand-Hammered Solid Brass Shirodhara Vessel with Flow Tap', label: 'Hand-Hammered Solid Brass Shirodhara Vessel with Flow Tap' },
                      { value: 'Bronze Kansa Vataki 79:21 Classical Foot Massage Set', label: 'Bronze Kansa Vataki 79:21 Classical Foot Massage Set' },
                      { value: 'Ksheerabala 101 Classical Medicated Taila', label: 'Ksheerabala 101 Classical Medicated Taila' },
                      { value: 'Mahanarayan Classical Medicated Massage Oil', label: 'Mahanarayan Classical Medicated Massage Oil' },
                      { value: 'Bespoke Brass Swedana Steam Chamber Commission', label: 'Bespoke Brass Swedana Steam Chamber Commission' },
                      { value: 'Turnkey Commercial Spa & Resort Outfitting', label: 'Turnkey Commercial Spa & Resort Outfitting' },
                    ]}
                  />
                </div>

                <div>
                  <Input
                    label="Suite Quantity *"
                    type="number"
                    min="1"
                    required
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                    placeholder="1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Select
                  label="Delivery / Installation Urgency"
                  value={form.urgency}
                  onChange={(e) => setForm({ ...form, urgency: e.target.value })}
                  options={[
                    { value: 'IMMEDIATE', label: 'Priority Allocation (Ready in 2-3 Weeks)' },
                    { value: 'WITHIN_3_MONTHS', label: 'Next Quarter Sanctuary Opening' },
                    { value: 'ARCHITECTURAL_PLANNING', label: 'Architectural Blueprint Stage' },
                  ]}
                />

                <Input
                  label="Destination City / Pin Code"
                  placeholder="e.g. Rishikesh, 249201"
                  onChange={(e) => {
                    const val = e.target.value;
                    setForm((prev) => ({
                      ...prev,
                      destination: val,
                    }));
                  }}
                />
              </div>

              <Textarea
                label="Custom Dimensions, Timber Species & Brass Inscription Notes"
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Specify preferred Droni length (8ft standard or 9ft presidential), wood grain preferences, laser-engraved monogram, or clinic requirements..."
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="gold"
                  size="lg"
                  loading={loading}
                  className="w-full font-bold uppercase tracking-wider shadow-glow text-slate-950"
                  icon={isOrderFlow ? ShoppingBag : Compass}
                >
                  {loading ? 'Registering Specification...' : isOrderFlow ? 'Make Your Order' : 'Submit Consultation Request'}
                </Button>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-charcoal-muted pt-1">
                <ShieldCheck className="w-4 h-4 text-forest" />
                <span>All sanctuary commissions remain confidential under Master Artisan warranty.</span>
              </div>
            </form>
          </div>
        )}

      </main>

      <Footer mode="SPECIAL" />
    </div>
  );
}

export default function SpecialInquiryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF9F5] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SpecialInquiryContent />
    </Suspense>
  );
}
