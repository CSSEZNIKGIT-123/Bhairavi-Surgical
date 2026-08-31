'use client';

import React, { useState } from 'react';
import {
  Users,
  Shield,
  Plus,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Lock,
  UserCheck,
  ShieldCheck,
  Briefcase,
  Layers,
  RefreshCw,
  Check,
  X
} from 'lucide-react';
import AdminStatusBadge from '@/components/admin/AdminStatusBadge';

export default function AdminStaffManagementPage() {
  const [adminsList, setAdminsList] = useState([
    {
      id: '1',
      name: 'Dr. Vaidya Yugan Sharma',
      email: 'admin@yuganayurved.com',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      assignedArea: 'Executive Governance & Platform Control',
    },
    {
      id: '2',
      name: 'Rajesh Malhotra',
      email: 'sales@yuganayurved.com',
      role: 'SALES_MANAGER',
      status: 'ACTIVE',
      assignedArea: 'B2B Wholesale Quotes & Hospital Tender Approvals',
    },
    {
      id: '3',
      name: 'Kavita Sundaram',
      email: 'account@yuganayurved.com',
      role: 'ACCOUNT_MANAGER',
      status: 'ACTIVE',
      assignedArea: 'Panchkarma Center Accounts & Purchase Orders',
    },
  ]);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'SALES_MANAGER',
    adminKey: 'BHAIRAVI-ADMIN-KEY-2026',
  });

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create staff account');

      setAdminsList((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          name: form.name,
          email: form.email,
          role: form.role,
          status: 'ACTIVE',
          assignedArea:
            form.role === 'SALES_MANAGER'
              ? 'B2B Wholesale Quotes & RFQ Approvals'
              : form.role === 'ACCOUNT_MANAGER'
              ? 'Hospital POs & Inquiries'
              : form.role === 'SUPER_ADMIN'
              ? 'Executive Platform Governance'
              : 'General Operations Desk',
        },
      ]);

      setNotification({
        type: 'success',
        text: `Provisioned new ${form.role} account for ${form.name} in PostgreSQL!`,
      });

      setForm({
        name: '',
        email: '',
        password: '',
        role: 'SALES_MANAGER',
        adminKey: 'BHAIRAVI-ADMIN-KEY-2026',
      });
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      setNotification({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 font-poppins text-slate-900">
      
      {/* 1. Header (Pure Light) */}
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Staff Personnel & Role Governance (RBAC)
          </h1>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-xs font-bold">
            {adminsList.length} Personnel
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Role-Based Access Control (RBAC) granting fine-grained privileges across Super Admin, Normal Admin, Sales Manager, and Account Manager.
        </p>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-3.5 rounded-2xl border text-xs flex items-center gap-2.5 animate-in fade-in duration-200 ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span className="font-semibold">{notification.text}</span>
        </div>
      )}

      {/* 2. Main Two-Column Layout (Pure Light) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Staff Directory (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                  Active Admin Personnel
                </h2>
                <p className="text-[11px] text-slate-500">Staff members authorized with console credentials</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-slate-500 uppercase tracking-wider text-[10px] bg-slate-50 border-b border-slate-200 font-bold">
                <tr>
                  <th className="py-3 px-3">Staff Member</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Operational Scope</th>
                  <th className="py-3 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {adminsList.map((adm) => (
                  <tr key={adm.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                          {adm.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                            {adm.name}
                          </div>
                          <div className="text-[10px] text-slate-500">{adm.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <AdminStatusBadge status={adm.role} type="role" size="xs" />
                    </td>

                    <td className="py-3.5 px-3 text-slate-700 text-[11px] font-medium">
                      {adm.assignedArea}
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Active</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Role Permissions Matrix */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              <span>RBAC Role Permission Matrix</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="font-bold text-amber-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>SUPER_ADMIN</span>
                </div>
                <p className="text-[10px] text-slate-500">Full database control, staff provisioning, price tier mutations, and catalog exports.</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="font-bold text-sky-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                  <span>SALES_MANAGER</span>
                </div>
                <p className="text-[10px] text-slate-500">Review wholesale B2B quotes, assign custom discount totals, and issue formal PDF quotations.</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="font-bold text-teal-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-600" />
                  <span>ACCOUNT_MANAGER</span>
                </div>
                <p className="text-[10px] text-slate-500">Customer order inspection, shipping status fulfillment, and customer inquiry communication.</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="font-bold text-emerald-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span>ADMIN</span>
                </div>
                <p className="text-[10px] text-slate-500">Standard catalog management, inventory tracking, and customer transactions.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Provision New Staff Member (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                Provision New Admin Staff
              </h2>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Authorize a new staff member with encrypted credentials in PostgreSQL.
            </p>
          </div>

          <form onSubmit={handleCreateStaff} className="space-y-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Full Name <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Dr. Anand Verma"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Corporate Email <span className="text-rose-600">*</span>
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="anand@yuganayurved.com"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Login Password <span className="text-rose-600">*</span>
              </label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Role & Permission Level <span className="text-rose-600">*</span>
              </label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-emerald-500 font-medium"
              >
                <option value="SALES_MANAGER">SALES_MANAGER (B2B Quotes & Tender Desk)</option>
                <option value="ACCOUNT_MANAGER">ACCOUNT_MANAGER (Hospital Orders & Fulfillment)</option>
                <option value="ADMIN">ADMIN (Catalog & Inventory Operations)</option>
                <option value="SUPER_ADMIN">SUPER_ADMIN (Full Platform Governance)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>Admin Secret Key</span>
                <span className="text-[10px] text-emerald-700 font-mono font-bold">BHAIRAVI-ADMIN-KEY-2026</span>
              </label>
              <input
                type="text"
                required
                value={form.adminKey}
                onChange={(e) => setForm({ ...form, adminKey: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-[11px] focus:bg-white focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold transition-all shadow-md shadow-emerald-900/10 hover:shadow-emerald-900/20"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Provisioning in DB...</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>Authorize & Create Account</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

      </div>

    </div>
  );
}
