'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

export default function CustomerLoginPage() {
  const router = useRouter();
  const { loginCustomer } = useAuth();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/customer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      loginCustomer(data.user, data.token);
      router.push('/account');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (email, password) => {
    setForm({ email, password });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-poppins">
      <AnnouncementBar mode="B2C" />
      <Navbar mode="B2C" />

      <main className="flex-1 max-w-md mx-auto px-4 py-16 w-full">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-300 shadow-elevated space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-forest uppercase tracking-wider bg-forest/10 px-3 py-1 rounded-full">
              Customer Account
            </span>
            <h1 className="text-2xl font-bold text-charcoal font-poppins pt-2">
              Sign In to Your Account
            </h1>
            <p className="text-xs text-charcoal-muted">
              Access your orders, quotes, addresses, and clinical preferences.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-terracotta/10 border border-terracotta/30 text-terracotta text-xs font-medium rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              required
              placeholder="dr.ananya@clinicdemo.com"
              icon={Mail}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <Input
              label="Password"
              type="password"
              required
              placeholder="••••••••"
              icon={Lock}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-charcoal-muted">
                <input type="checkbox" defaultChecked className="rounded text-forest" />
                <span>Keep me signed in</span>
              </label>
              <a href="#" className="text-forest font-semibold hover:underline">
                Forgot password?
              </a>
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
              SIGN IN
            </Button>
          </form>

          {/* Demo Logins */}
          <div className="pt-4 border-t border-cream-200 space-y-2">
            <span className="text-[11px] font-bold text-charcoal-light uppercase tracking-wider block">
              Demo Customer Accounts:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('procurement@apollohospitals.demo', 'Customer@123456')}
                className="text-left p-2 rounded-xl bg-cream-50 hover:bg-cream-100 border border-cream-300 text-[11px] transition-colors"
              >
                <div className="font-bold text-emerald-800">B2B Hospital</div>
                <div className="text-charcoal-muted text-[10px] truncate">Apollo Procurement</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('dr.ananya@clinicdemo.com', 'Customer@123456')}
                className="text-left p-2 rounded-xl bg-cream-50 hover:bg-cream-100 border border-cream-300 text-[11px] transition-colors"
              >
                <div className="font-bold text-forest">B2C Practitioner</div>
                <div className="text-charcoal-muted text-[10px] truncate">Dr. Ananya Roy</div>
              </button>
            </div>
          </div>

          <div className="pt-2 text-center text-xs text-charcoal-muted">
            Don’t have an account yet?{' '}
            <Link href="/account/register" className="font-bold text-forest hover:underline">
              Register now
            </Link>
          </div>
        </div>
      </main>

      <Footer mode="B2C" />
    </div>
  );
}
