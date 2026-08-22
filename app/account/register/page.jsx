'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { Building2, ShoppingBag, Crown, Lock, Mail, User, Phone, ArrowRight } from 'lucide-react';

export default function CustomerRegisterPage() {
  const router = useRouter();
  const { loginCustomer } = useAuth();

  const [mode, setMode] = useState('B2C'); // 'B2C', 'B2B', 'SPECIAL'
  const [form, setForm] = useState({
    // Common
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    // B2C
    firstName: '',
    lastName: '',
    // B2B
    companyName: '',
    contactPerson: '',
    businessType: 'Hospital Network',
    taxGstNumber: '',
    industry: 'Healthcare & Surgical',
    companyAddress: '',
    // SPECIAL
    name: '',
    organization: '',
    requirementType: 'Turnkey OT Suite & Custom Instruments',
    requirementDescription: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/customer/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, ...form }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      loginCustomer(data.user, data.token);
      router.push('/account');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-poppins">
      <AnnouncementBar mode={mode} />
      <Navbar mode={mode} />

      <main className="flex-1 max-w-2xl mx-auto px-4 py-12 w-full">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-cream-300 shadow-elevated space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-forest uppercase tracking-wider bg-forest/10 px-3 py-1 rounded-full">
              Account Registration
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-charcoal font-poppins pt-2">
              Create Your Account
            </h1>
            <p className="text-xs text-charcoal-muted">
              Select your account type to configure your specialized portal.
            </p>
          </div>

          {/* Mode Selector Tabs */}
          <div className="grid grid-cols-3 gap-2 bg-cream-100 p-1.5 rounded-2xl border border-cream-300">
            <button
              type="button"
              onClick={() => setMode('B2C')}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                mode === 'B2C'
                  ? 'bg-white text-forest shadow-sm ring-1 ring-cream-300'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>B2C Retail</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('B2B')}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                mode === 'B2B'
                  ? 'bg-white text-emerald-900 shadow-sm ring-1 ring-cream-300'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>B2B Business</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('SPECIAL')}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                mode === 'SPECIAL'
                  ? 'bg-charcoal text-gold-light shadow-sm'
                  : 'text-charcoal-muted hover:text-charcoal'
              }`}
            >
              <Crown className="w-4 h-4" />
              <span>SPECIAL</span>
            </button>
          </div>

          {error && (
            <div className="p-3 bg-terracotta/10 border border-terracotta/30 text-terracotta text-xs font-medium rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* 1. B2C Fields */}
            {mode === 'B2C' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  required
                  placeholder="Ananya"
                  icon={User}
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                />
                <Input
                  label="Last Name"
                  required
                  placeholder="Roy"
                  icon={User}
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                />
              </div>
            )}

            {/* 2. B2B Fields */}
            {mode === 'B2B' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Company / Hospital Network"
                    required
                    placeholder="Apollo Hospitals Enterprise"
                    icon={Building2}
                    value={form.companyName}
                    onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  />
                  <Input
                    label="Contact Officer"
                    required
                    placeholder="Vikram Mehta"
                    icon={User}
                    value={form.contactPerson}
                    onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Business Type"
                    value={form.businessType}
                    onChange={(e) => setForm({ ...form, businessType: e.target.value })}
                    options={['Hospital Network', 'Private Clinic Chain', 'Medical Distributor', 'University / Research Lab']}
                  />
                  <Input
                    label="GST / Tax Identification Number"
                    placeholder="07AAAAA0000A1Z5"
                    value={form.taxGstNumber}
                    onChange={(e) => setForm({ ...form, taxGstNumber: e.target.value })}
                  />
                </div>

                <Input
                  label="Registered Company Address"
                  placeholder="Plot 42, Health City, Sector 44, New Delhi"
                  value={form.companyAddress}
                  onChange={(e) => setForm({ ...form, companyAddress: e.target.value })}
                />
              </div>
            )}

            {/* 3. SPECIAL Fields */}
            {mode === 'SPECIAL' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Surgeon / Practitioner Name"
                    required
                    placeholder="Dr. Siddharth Sengupta"
                    icon={User}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  <Input
                    label="Organization / Private Practice"
                    placeholder="Robotic Surgery Institute"
                    icon={Building2}
                    value={form.organization}
                    onChange={(e) => setForm({ ...form, organization: e.target.value })}
                  />
                </div>

                <Select
                  label="Initial Requirement Type"
                  value={form.requirementType}
                  onChange={(e) => setForm({ ...form, requirementType: e.target.value })}
                  options={[
                    'Turnkey Integrated OT & Custom Titanium Sets',
                    'Black Obsidian DLC Neurosurgical Micro-Kit',
                    'Personalized Biometric Surgeon Titanium Loupes',
                    'Custom Laser Monogramming & Serialization',
                  ]}
                />

                <Textarea
                  label="Initial Requirement Description"
                  rows={2}
                  placeholder="Describe your surgical specialization or theatre setup requirements..."
                  value={form.requirementDescription}
                  onChange={(e) => setForm({ ...form, requirementDescription: e.target.value })}
                />
              </div>
            )}

            {/* Common Credentials */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-cream-200">
              <Input
                label="Email Address"
                type="email"
                required
                placeholder="name@organization.com"
                icon={Mail}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <Input
                label="Phone Number"
                required
                placeholder="+91 98765 43210"
                icon={Phone}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Password"
                type="password"
                required
                placeholder="••••••••"
                icon={Lock}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <Input
                label="Confirm Password"
                type="password"
                required
                placeholder="••••••••"
                icon={Lock}
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              />
            </div>

            <Button
              type="submit"
              variant={mode === 'SPECIAL' ? 'luxury' : 'primary'}
              size="lg"
              className="w-full"
              loading={loading}
              icon={ArrowRight}
              iconPosition="right"
            >
              CREATE {mode} ACCOUNT
            </Button>
          </form>

          <div className="pt-2 text-center text-xs text-charcoal-muted">
            Already have an account?{' '}
            <Link href="/account/login" className="font-bold text-forest hover:underline">
              Sign in here
            </Link>
          </div>
        </div>
      </main>

      <Footer mode={mode} />
    </div>
  );
}
