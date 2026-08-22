'use client';

import React, { useState } from 'react';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { Crown, Compass, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function SpecialInquiryPage() {
  const [form, setForm] = useState({
    name: '',
    organization: '',
    email: '',
    phone: '',
    requirementType: 'Turnkey Carved Teak Droni & Brass Shirodhara Suite',
    urgency: 'IMMEDIATE',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successData, setSuccessData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit consultation inquiry');

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

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full">
        
        {successData ? (
          /* Success Screen */
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gold/40 shadow-soft text-center space-y-6 animate-slide-up">
            <div className="w-16 h-16 rounded-full bg-gold/20 text-gold-dark border border-gold/40 flex items-center justify-center mx-auto shadow-soft">
              <Crown className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-gold-dark uppercase tracking-widest bg-gold/10 px-3 py-1 rounded-full border border-gold/30">
                Bespoke Sanctuary Consultation Registered
              </span>
              <h1 className="text-2xl sm:text-3xl font-normal text-charcoal font-poppins">
                Inquiry Reference #{successData.inquiryNumber}
              </h1>
              <p className="text-xs sm:text-sm text-charcoal-muted">
                Assigned to Yugan Master Vaidya & Architectural Commission Team
              </p>
            </div>

            <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-gold/20 text-xs text-left space-y-2.5 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Commission Lead:</span>
                <span className="font-semibold text-charcoal">{successData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Sanctuary / Practice:</span>
                <span className="text-charcoal">{successData.organization || 'Private Sanctuary'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Requirement:</span>
                <span className="text-gold-dark font-semibold">{successData.requirementType}</span>
              </div>
            </div>

            <p className="text-xs text-charcoal-muted max-w-md mx-auto leading-relaxed font-light">
              Our Master Vaidya and Lead Architectural Wood Sculptor will review your sanctuary specifications and contact you at <strong className="text-charcoal">{successData.phone}</strong> to coordinate a confidential private consultation.
            </p>

            <div className="pt-2">
              <Link href="/special">
                <Button variant="gold" size="md" className="font-bold uppercase tracking-wider">
                  Return to Sovereign Atelier
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          /* Main Inquiry Form */
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gold/30 shadow-card space-y-8">
            <div className="space-y-2 text-center max-w-xl mx-auto">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-dark bg-gold/15 px-3 py-1 rounded-full border border-gold/30 uppercase tracking-widest">
                <Crown className="w-3.5 h-3.5" />
                <span>Confidential Sanctuary Inquiry</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-light text-charcoal font-poppins">
                Commission a Bespoke Ayurvedic Suite
              </h1>
              <p className="text-xs sm:text-sm text-charcoal-muted font-light">
                Single-log carved teak Dronis, hand-hammered brass Shirodhara vessels, or private sanctuary outfitting.
              </p>
            </div>

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
                  label="Sanctuary / Practice Name"
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Select
                  label="Primary Commission Category *"
                  value={form.requirementType}
                  onChange={(e) => setForm({ ...form, requirementType: e.target.value })}
                  options={[
                    { value: 'Turnkey Carved Teak Droni & Brass Shirodhara Suite', label: 'Turnkey Carved Teak Droni & Brass Shirodhara Suite' },
                    { value: 'Single-Log Seasoned Burmese Teak Droni', label: 'Single-Log Seasoned Burmese Teak Droni' },
                    { value: 'Hand-Hammered Solid Brass Shirodhara Apparatus', label: 'Hand-Hammered Solid Brass Shirodhara Apparatus' },
                    { value: 'Master Avarti 101x Potentiated Classical Tailas', label: 'Master Avarti 101x Potentiated Classical Tailas' },
                    { value: 'Turnkey Commercial Spa & Resort Outfitting', label: 'Turnkey Commercial Spa & Resort Outfitting' },
                  ]}
                />

                <Select
                  label="Timeline / Installation Urgency"
                  value={form.urgency}
                  onChange={(e) => setForm({ ...form, urgency: e.target.value })}
                  options={[
                    { value: 'IMMEDIATE', label: 'Immediate Allocation (Ready in 3-4 Weeks)' },
                    { value: 'WITHIN_3_MONTHS', label: 'Next Quarter Sanctuary Opening' },
                    { value: 'ARCHITECTURAL_PLANNING', label: 'Architectural Blueprint Stage' },
                  ]}
                />
              </div>

              <Textarea
                label="Sanctuary Dimensions, Timber Preferences & Custom Inscriptions"
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Specify desired Droni length (standard 8ft or custom 9ft), wood species, laser-engraved monogram, and special botanical taila allocations..."
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="gold"
                  size="lg"
                  loading={loading}
                  className="w-full font-bold uppercase tracking-wider shadow-glow"
                  icon={Compass}
                >
                  {loading ? 'Submitting Specification...' : 'Register Private Consultation Request'}
                </Button>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-charcoal-muted pt-1">
                <ShieldCheck className="w-4 h-4 text-forest" />
                <span>All sanctuary inquiries remain strictly confidential under NDA.</span>
              </div>
            </form>
          </div>
        )}

      </main>

      <Footer mode="SPECIAL" />
    </div>
  );
}
