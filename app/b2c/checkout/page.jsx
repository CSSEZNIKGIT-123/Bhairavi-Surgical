'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { ShieldCheck, CheckCircle2, Truck, CreditCard, ArrowRight, Printer } from 'lucide-react';
import { formatCurrency, safeJsonParse } from '@/lib/utils';

export default function B2CCheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();

  const [form, setForm] = useState({
    customerName: user?.name || '',
    customerEmail: user?.email || '',
    customerPhone: user?.phone || '',
    clinicName: '',
    street: '',
    city: '',
    state: 'Delhi',
    postalCode: '',
    paymentMethod: 'CREDIT_CARD',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderComplete, setOrderComplete] = useState(null);

  const shippingFee = subtotal > 4999 ? 0 : 250;
  const grandTotal = subtotal + shippingFee;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const fullAddress = `${form.clinicName ? `${form.clinicName}, ` : ''}${form.street}, ${form.city}, ${form.state} - ${form.postalCode}`;

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'B2C',
          customerName: form.customerName,
          customerEmail: form.customerEmail,
          customerPhone: form.customerPhone,
          companyName: form.clinicName || null,
          shippingAddress: fullAddress,
          paymentMethod: form.paymentMethod,
          subtotalAmount: subtotal,
          shippingAmount: shippingFee,
          totalAmount: grandTotal,
          items: items.map((it) => ({
            productId: it.product.id,
            quantity: it.quantity,
            unitPrice: it.unitPrice,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Order submission failed');

      setOrderComplete(data.order);
      clearCart();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-poppins">
      <AnnouncementBar mode="B2C" />
      <Navbar mode="B2C" />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        
        {orderComplete ? (
          /* Order Confirmation Screen */
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-cream-300 shadow-elevated text-center space-y-6 animate-slide-up">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-soft">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-forest uppercase tracking-wider bg-forest/10 px-3 py-1 rounded-full">
                Order Confirmed
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-charcoal font-poppins">
                Thank You for Your Order!
              </h1>
              <p className="text-xs sm:text-sm text-charcoal-muted">
                Order ID: <span className="font-mono font-bold text-charcoal">{orderComplete.orderNumber}</span>
              </p>
            </div>

            <div className="bg-cream-50 p-4 rounded-2xl border border-cream-200 text-xs text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Recipient:</span>
                <span className="font-bold text-charcoal">{orderComplete.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Shipping Destination:</span>
                <span className="font-medium text-charcoal max-w-xs text-right truncate">
                  {orderComplete.shippingAddress}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Total Paid:</span>
                <span className="font-bold text-forest">{formatCurrency(orderComplete.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Status:</span>
                <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  Preparing Sterile Packaging
                </span>
              </div>
            </div>

            <p className="text-xs text-charcoal-muted leading-relaxed">
              A confirmation email and tax invoice have been dispatched to <strong className="text-charcoal">{orderComplete.customerEmail}</strong>.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl border border-cream-300 text-charcoal text-xs font-bold hover:bg-cream-100 transition-colors flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Print Tax Invoice
              </button>
              <Link href="/b2c/shop">
                <Button variant="primary" size="md">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        ) : items.length === 0 ? (
          /* Empty Checkout Fallback */
          <div className="text-center py-16 space-y-4 bg-white rounded-3xl border border-cream-200 max-w-xl mx-auto p-8">
            <h2 className="text-xl font-bold text-charcoal">Your cart is empty</h2>
            <p className="text-xs text-charcoal-muted">Add items before proceeding to checkout.</p>
            <Link href="/b2c/shop">
              <Button variant="primary">Browse Instruments</Button>
            </Link>
          </div>
        ) : (
          /* Main Checkout Form */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left: Customer & Shipping Form (7 Cols) */}
            <form onSubmit={handleSubmitOrder} className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-cream-300 shadow-soft space-y-6">
              <div>
                <h2 className="text-xl font-bold text-charcoal font-poppins">
                  Shipping & Clinical Practice Details
                </h2>
                <p className="text-xs text-charcoal-muted mt-0.5">
                  Enter delivery destination for sterile equipment dispatch.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-terracotta/10 border border-terracotta/30 text-terracotta text-xs font-medium rounded-xl">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name / Practitioner Name"
                  required
                  placeholder="Dr. Rajesh Varma"
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                />
                <Input
                  label="Hospital / Clinic / Department"
                  placeholder="Apollo Surgical Dept."
                  value={form.clinicName}
                  onChange={(e) => setForm({ ...form, clinicName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Contact Email"
                  type="email"
                  required
                  placeholder="r.varma@apollo.com"
                  value={form.customerEmail}
                  onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                />
                <Input
                  label="Contact Phone"
                  required
                  placeholder="+91 98765 43210"
                  value={form.customerPhone}
                  onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                />
              </div>

              <Input
                label="Street Address / Room / Floor"
                required
                placeholder="Plot 42, Health City, Sector 44"
                value={form.street}
                onChange={(e) => setForm({ ...form, street: e.target.value })}
              />

              <div className="grid grid-cols-3 gap-3">
                <Input
                  label="City"
                  required
                  placeholder="New Delhi"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
                <Select
                  label="State"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  options={[
                    'Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Uttar Pradesh', 'Telangana', 'West Bengal'
                  ]}
                />
                <Input
                  label="PIN Code"
                  required
                  placeholder="110001"
                  value={form.postalCode}
                  onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                />
              </div>

              {/* Payment Method Selector */}
              <div className="pt-4 border-t border-cream-200 space-y-3">
                <label className="text-xs font-bold text-charcoal block">Payment Method</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'CREDIT_CARD', label: 'Credit / Debit Card', icon: CreditCard },
                    { id: 'UPI', label: 'UPI / NetBanking', icon: ShieldCheck },
                    { id: 'COD', label: 'Clinical Cash On Delivery', icon: Truck },
                  ].map((pm) => {
                    const Icon = pm.icon;
                    return (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setForm({ ...form, paymentMethod: pm.id })}
                        className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                          form.paymentMethod === pm.id
                            ? 'border-forest bg-forest/5 text-forest font-bold ring-2 ring-forest/20'
                            : 'border-cream-300 bg-white text-charcoal hover:bg-cream-50'
                        }`}
                      >
                        <Icon className="w-5 h-5 mb-2" />
                        <span className="text-xs font-semibold">{pm.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                loading={loading}
                icon={ArrowRight}
                iconPosition="right"
              >
                PLACE ORDER & DISPATCH ({formatCurrency(grandTotal)})
              </Button>
            </form>

            {/* Right: Order Line Items Review (5 Cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-cream-300 shadow-soft space-y-6">
              <h3 className="text-base font-bold text-charcoal font-poppins pb-3 border-b border-cream-200">
                Order Review ({items.length} Line Items)
              </h3>

              <div className="divide-y divide-cream-200 max-h-72 overflow-y-auto pr-1">
                {items.map((item) => {
                  const images = safeJsonParse(item.product.images, ['https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=300&q=80']);
                  return (
                    <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl bg-cream-100 overflow-hidden border border-cream-200 shrink-0">
                          <Image src={images[0]} alt={item.product.title} fill className="object-cover" />
                        </div>
                        <div>
                          <div className="font-bold text-charcoal truncate max-w-[150px]">
                            {item.product.title}
                          </div>
                          <span className="text-charcoal-muted">Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <span className="font-bold text-charcoal font-poppins">
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-2 text-xs text-charcoal pt-4 border-t border-cream-200">
                <div className="flex justify-between">
                  <span className="text-charcoal-muted">Subtotal</span>
                  <span className="font-semibold">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-muted">Shipping</span>
                  <span className="text-emerald-800 font-semibold">
                    {shippingFee === 0 ? 'FREE' : formatCurrency(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-charcoal pt-3 border-t border-cream-200">
                  <span>Grand Total</span>
                  <span className="text-forest font-poppins">{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-[11px] text-emerald-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-700" />
                <span>Includes official GST invoice and 10-year metallurgical warranty.</span>
              </div>
            </div>

          </div>
        )}

      </main>

      <Footer mode="B2C" />
    </div>
  );
}
