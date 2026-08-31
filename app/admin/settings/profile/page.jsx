'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  Shield,
  KeyRound,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
  Lock,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Sparkles,
  Camera,
  Calendar,
  Layers,
  ShieldCheck,
  Building,
  Check,
  IdCard,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AdminStatusBadge from '@/components/admin/AdminStatusBadge';

const AVATAR_PRESETS = [
  { id: '1', label: 'Doctor / Surgeon (Male)', url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80' },
  { id: '2', label: 'Doctor / Specialist (Female)', url: 'https://images.unsplash.com/photo-1594824813511-20986561cfdd?auto=format&fit=crop&w=400&q=80' },
  { id: '3', label: 'Senior Vaidya / Practitioner', url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80' },
  { id: '4', label: 'Executive Operations', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
];

export default function AdminProfilePage() {
  const { admin, adminToken, updateAdmin } = useAuth();

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('');
  const [role, setRole] = useState('SUPER_ADMIN');
  const [createdAt, setCreatedAt] = useState(null);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Active section tab
  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'security' | 'permissions'

  // Fetch initial profile
  useEffect(() => {
    async function loadProfile() {
      try {
        setLoadingProfile(true);
        const headers = { 'Content-Type': 'application/json' };
        if (adminToken) {
          headers['Authorization'] = `Bearer ${adminToken}`;
        }

        const res = await fetch('/api/admin/profile', {
          method: 'GET',
          headers,
        });

        const data = await res.json();
        if (res.ok && data.profile) {
          setName(data.profile.name || '');
          setEmail(data.profile.email || '');
          setPhone(data.profile.phone || '');
          setAvatar(data.profile.avatar || '');
          setRole(data.profile.role || 'SUPER_ADMIN');
          setCreatedAt(data.profile.createdAt);
        } else if (admin) {
          // Fallback to AuthContext admin
          setName(admin.name || '');
          setEmail(admin.email || '');
          setRole(admin.role || 'SUPER_ADMIN');
        }
      } catch (err) {
        console.error('Error fetching admin profile:', err);
        if (admin) {
          setName(admin.name || '');
          setEmail(admin.email || '');
          setRole(admin.role || 'SUPER_ADMIN');
        }
      } finally {
        setLoadingProfile(false);
      }
    }

    loadProfile();
  }, [admin, adminToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setNotification(null);

    // Validation
    if (!name.trim()) {
      setNotification({ type: 'error', text: 'Full Name is required.' });
      setSaving(false);
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setNotification({ type: 'error', text: 'A valid corporate email is required.' });
      setSaving(false);
      return;
    }

    if (newPassword) {
      if (!currentPassword) {
        setNotification({ type: 'error', text: 'Please enter your current password to set a new password.' });
        setSaving(false);
        return;
      }
      if (newPassword.length < 6) {
        setNotification({ type: 'error', text: 'New password must be at least 6 characters.' });
        setSaving(false);
        return;
      }
      if (newPassword !== confirmPassword) {
        setNotification({ type: 'error', text: 'New password and confirmation do not match.' });
        setSaving(false);
        return;
      }
    }

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (adminToken) {
        headers['Authorization'] = `Bearer ${adminToken}`;
      }

      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone ? phone.trim() : null,
          avatar: avatar ? avatar.trim() : null,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update profile.');
      }

      // Sync AuthContext dynamically
      updateAdmin(data.user, data.token);

      setNotification({
        type: 'success',
        text: 'Profile and credentials updated successfully in PostgreSQL!',
      });

      // Clear password fields on success
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setTimeout(() => setNotification(null), 4000);
    } catch (err) {
      setNotification({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const getRoleDescription = (r) => {
    switch (r) {
      case 'SUPER_ADMIN':
        return 'Highest level governance with full authority over database operations, staff RBAC management, and master catalogs.';
      case 'SALES_MANAGER':
        return 'Authorized for B2B wholesale quotation review, custom tier discount generation, and institutional tender processing.';
      case 'ACCOUNT_MANAGER':
        return 'Oversees customer orders, hospital shipments, inventory allocation, and specialized client inquiries.';
      case 'ADMIN':
      default:
        return 'General administrative management of product catalogs, pricing tiers, and commerce fulfillment operations.';
    }
  };

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'Active Since Inception';

  return (
    <div className="space-y-8 font-poppins text-slate-900">
      
      {/* 1. Top Header */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Executive Profile & Governance
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-xs font-bold">
                Live PostgreSQL Sync
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Manage your personal administrator identity, contact information, and encrypted account security credentials.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Role:</span>
              <span className="text-emerald-700 font-mono font-bold">{role}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-center justify-between gap-3 animate-in fade-in duration-200 shadow-sm ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span className="font-semibold">{notification.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-xs font-bold underline opacity-70 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 2. Executive Profile Hero Card (Pure Light) */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-emerald-50/60 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            {/* Avatar with glow */}
            <div className="relative group shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center font-extrabold text-2xl sm:text-3xl shadow-lg shadow-emerald-900/15 overflow-hidden border-2 border-white">
                {avatar ? (
                  <img
                    src={avatar}
                    alt={name || 'Admin'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <span>{name?.charAt(0) || 'A'}</span>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white" title="Active Verified Admin">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </div>

            {/* Admin Bio Details */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {name || 'Executive Administrator'}
                </h2>
                <AdminStatusBadge status={role} type="role" size="sm" />
              </div>
              <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{email || 'admin@yuganayurved.com'}</span>
              </p>
              <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1">
                <span className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Bhairavi Surgical & Healthcare</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Joined: {formattedDate}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics / Status */}
          <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-center min-w-[110px]">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Security</span>
              <span className="text-xs font-bold text-emerald-700 flex items-center justify-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Encrypted</span>
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-center min-w-[110px]">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</span>
              <span className="text-xs font-bold text-emerald-700 flex items-center justify-center gap-1 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Operational</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'general'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/15'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Personal Information</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'security'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/15'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Security & Password</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('permissions')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'permissions'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/15'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Role Scope & Access</span>
        </button>
      </div>

      {/* 4. Form Sections */}
      <form onSubmit={handleSubmit}>
        {/* Tab 1: Personal Information */}
        {activeTab === 'general' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-in fade-in duration-150">
            {/* Left 8 cols: Basic Info */}
            <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="pb-4 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Administrator Information</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update your display name, corporate contact info, and profile avatar.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                    Full Legal / Professional Name <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Dr. Vaidya Yugan Sharma"
                      className="w-full px-3.5 py-2.5 pl-10 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                      Corporate Email Address <span className="text-rose-600">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@yuganayurved.com"
                        className="w-full px-3.5 py-2.5 pl-10 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                      Direct Telephone / WhatsApp
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 pl-10 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                    Profile Avatar Photo URL (HTTPS)
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3.5 py-2.5 pl-10 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                    <Camera className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Provide a direct HTTPS image URL or select from our curated medical avatar presets below.
                  </p>
                </div>
              </div>

              {/* Avatar Presets Selection */}
              <div className="pt-2">
                <label className="block text-[11px] font-bold text-slate-700 mb-2.5">
                  Or Pick a Verified Medical Avatar Preset:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {AVATAR_PRESETS.map((preset) => {
                    const isSelected = avatar === preset.url;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setAvatar(preset.url)}
                        className={`p-2 rounded-2xl border text-left flex flex-col items-center gap-2 transition-all ${
                          isSelected
                            ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                            : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100 hover:border-slate-300'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <span className="text-[10px] font-semibold text-slate-700 text-center leading-tight">
                          {preset.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs transition-all shadow-md shadow-emerald-900/15 hover:shadow-emerald-900/25"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Profile Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right 4 cols: Account Summary Card */}
            <div className="lg:col-span-4 space-y-5">
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                    <IdCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Account Credentials</h3>
                    <p className="text-[10px] text-slate-400">PostgreSQL ID & Role Details</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Assigned Role</span>
                    <div className="mt-1">
                      <AdminStatusBadge status={role} type="role" size="sm" />
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Governance Level</span>
                    <span className="text-slate-800 font-semibold mt-0.5 block">
                      {role === 'SUPER_ADMIN' ? 'Root Platform Authority' : 'Restricted Role-Based Scope'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Session Expiration</span>
                    <span className="text-slate-700 font-mono text-[11px] mt-0.5 block">7 Days (Lax HTTP-Only JWT)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Security & Password */}
        {activeTab === 'security' && (
          <div className="max-w-2xl bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-150">
            <div className="pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Change Authentication Password</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Update your login passphrase. Current password is required to verify identity.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                  Current Existing Password <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter your current password"
                    className="w-full px-3.5 py-2.5 pl-10 pr-10 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="p-1 text-slate-400 hover:text-slate-600 absolute right-3 top-2.5"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                    New Passphrase (Min 6 chars) <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3.5 py-2.5 pl-10 pr-10 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="p-1 text-slate-400 hover:text-slate-600 absolute right-3 top-2.5"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                    Confirm New Passphrase <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className={`w-full px-3.5 py-2.5 pl-10 pr-10 rounded-xl bg-slate-50 border text-slate-900 font-medium focus:bg-white focus:outline-none transition-colors ${
                        confirmPassword && confirmPassword !== newPassword
                          ? 'border-rose-300 focus:border-rose-500'
                          : 'border-slate-200 focus:border-emerald-500'
                      }`}
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="p-1 text-slate-400 hover:text-slate-600 absolute right-3 top-2.5"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {newPassword && confirmPassword && (
                <div className="text-[11px] font-semibold flex items-center gap-1.5 pt-1">
                  {newPassword === confirmPassword ? (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Passwords match perfectly.
                    </span>
                  ) : (
                    <span className="text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Passwords do not match.
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Password will be encrypted using 10 salt rounds of bcrypt.
              </span>
              <button
                type="submit"
                disabled={saving || !currentPassword || !newPassword}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs transition-all shadow-md shadow-rose-900/15"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Update Password</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Role Scope & Access */}
        {activeTab === 'permissions' && (
          <div className="max-w-3xl bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-150">
            <div className="pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Your Operational Scope & RBAC Permissions</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Assigned administrative privileges governed under Bhairavi Surgical Security Rules.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wide">
                  Active Designation:
                </span>
                <AdminStatusBadge status={role} type="role" size="sm" />
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                {getRoleDescription(role)}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Granted System Capabilities
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Catalog CRUD & Bulk Excel</span>
                    <span className="text-[11px] text-slate-500">Create, edit, archive products and multi-mode B2B/B2C pricing tiers.</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Order Processing & Fulfillment</span>
                    <span className="text-[11px] text-slate-500">Update shipping states, manage PO invoices, and verify customer payments.</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">RFQ Wholesale Quotations</span>
                    <span className="text-[11px] text-slate-500">Review institutional quotations, adjust custom rates, and dispatch formal quotes.</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Executive Diagnostics & Logs</span>
                    <span className="text-[11px] text-slate-500">Monitor PostgreSQL health, connection pools, and real-time database transactions.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>

    </div>
  );
}
