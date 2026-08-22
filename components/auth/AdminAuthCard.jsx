'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Lock,
  Mail,
  User,
  Shield,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

export default function AdminAuthCard() {
  const router = useRouter();
  const { loginAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  
  // Login State
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    remember: true,
  });

  // Register State
  const [regForm, setRegForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'ADMIN',
    adminKey: 'BHAIRAVI-ADMIN-KEY-2026',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Quick autofill for evaluation
  const handleQuickLogin = (email, password) => {
    setLoginForm({ email, password, remember: true });
    setError(null);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginForm.email,
          password: loginForm.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      loginAdmin(data.user, data.token);
      setSuccess('Access granted. Redirecting to Admin Dashboard...');
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 800);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (regForm.password !== regForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regForm.name,
          email: regForm.email,
          password: regForm.password,
          role: regForm.role,
          adminKey: regForm.adminKey,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Admin registration failed');
      }

      loginAdmin(data.user, data.token);
      setSuccess('Admin account provisioned successfully! Entering portal...');
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 800);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl p-5 sm:p-8 border border-cream-300 shadow-elevated font-poppins">
      
      {/* Header with Responsive Security Badge & Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 sm:pb-6 border-b border-cream-200 gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-forest uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-forest" />
            <span>Executive Governance</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-charcoal tracking-tight">
            {activeTab === 'login' ? 'Yugan Admin Sign In' : 'Provision Staff Account'}
          </h2>
        </div>

        {/* Tab Switcher (Responsive Full Width on Mobile) */}
        <div className="flex p-1 bg-cream-100 rounded-xl border border-cream-300 self-stretch sm:self-auto">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setError(null);
              setSuccess(null);
            }}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all text-center ${
              activeTab === 'login'
                ? 'bg-white text-forest shadow-sm'
                : 'text-charcoal-muted hover:text-charcoal'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setError(null);
              setSuccess(null);
            }}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all text-center ${
              activeTab === 'register'
                ? 'bg-white text-forest shadow-sm'
                : 'text-charcoal-muted hover:text-charcoal'
            }`}
          >
            Register
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mt-4 p-3 rounded-xl bg-terracotta/10 border border-terracotta/30 text-terracotta text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      {/* 1. Admin Login Form */}
      {activeTab === 'login' && (
        <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4">
          <Input
            label="Admin Work Email"
            type="email"
            placeholder="admin@yuganayurved.com"
            icon={Mail}
            required
            value={loginForm.email}
            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            required
            value={loginForm.password}
            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs pt-1 gap-2">
            <label className="flex items-center gap-2 cursor-pointer select-none text-charcoal-muted">
              <input
                type="checkbox"
                checked={loginForm.remember}
                onChange={(e) => setLoginForm({ ...loginForm, remember: e.target.checked })}
                className="w-4 h-4 rounded text-forest focus:ring-forest border-cream-300"
              />
              <span>Remember secure session</span>
            </label>
            <button type="button" className="text-xs font-semibold text-forest hover:underline self-start sm:self-auto">
              Forgot Password?
            </button>
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
            SIGN IN TO ADMIN CONSOLE
          </Button>

          {/* Quick Demo Fillers */}
          <div className="pt-4 border-t border-cream-200">
            <span className="text-[11px] font-bold text-charcoal-light uppercase tracking-wider block mb-2">
              Demo Admin Credentials (Click to prefill):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@yuganayurved.com', 'Admin@123456')}
                className="text-left p-2.5 rounded-xl bg-cream-50 hover:bg-cream-100 border border-cream-300 text-[11px] transition-colors"
              >
                <div className="font-bold text-forest truncate">Super Admin</div>
                <div className="text-charcoal-muted text-[10px] truncate">admin@yuganayurved.com</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('sales@yuganayurved.com', 'Admin@123456')}
                className="text-left p-2.5 rounded-xl bg-cream-50 hover:bg-cream-100 border border-cream-300 text-[11px] transition-colors"
              >
                <div className="font-bold text-emerald-800 truncate">Sales Manager</div>
                <div className="text-charcoal-muted text-[10px] truncate">sales@yuganayurved.com</div>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* 2. Admin Registration Form (Controlled Security Setup) */}
      {activeTab === 'register' && (
        <form onSubmit={handleRegisterSubmit} className="mt-6 space-y-4">
          <Input
            label="Full Name"
            placeholder="Dr. Vaidya Yugan Sharma"
            icon={User}
            required
            value={regForm.name}
            onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
          />

          <Input
            label="Official Work Email"
            type="email"
            placeholder="y.sharma@yuganayurved.com"
            icon={Mail}
            required
            value={regForm.email}
            onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              required
              value={regForm.password}
              onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              required
              value={regForm.confirmPassword}
              onChange={(e) => setRegForm({ ...regForm, confirmPassword: e.target.value })}
            />
          </div>

          <Select
            label="Admin Role Specification"
            value={regForm.role}
            onChange={(e) => setRegForm({ ...regForm, role: e.target.value })}
            options={[
              { value: 'ADMIN', label: 'Admin (Operations & Catalog)' },
              { value: 'SUPER_ADMIN', label: 'Super Admin (Complete Management)' },
              { value: 'SALES_MANAGER', label: 'Sales Manager (B2B Quotes & Inquiries)' },
              { value: 'ACCOUNT_MANAGER', label: 'Account Manager (Hospital Accounts & Orders)' },
            ]}
          />

          <Input
            label="Master Admin Authorization Key"
            type="password"
            placeholder="Enter authorization key"
            icon={KeyRound}
            required
            helperText="Controlled security key required for administrator provisioning."
            value={regForm.adminKey}
            onChange={(e) => setRegForm({ ...regForm, adminKey: e.target.value })}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={loading}
          >
            CREATE ADMIN ACCOUNT
          </Button>
        </form>
      )}

    </div>
  );
}
