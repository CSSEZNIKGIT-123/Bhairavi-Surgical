'use client';

import React, { useState } from 'react';
import { Users, Shield, Plus, KeyRound, CheckCircle2, UserCheck, ShieldAlert } from 'lucide-react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

export default function AdminStaffManagementPage() {
  const [adminsList, setAdminsList] = useState([
    {
      id: '1',
      name: 'Dr. Vaidya Yugan Sharma',
      email: 'admin@yuganayurved.com',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      assignedArea: 'Executive Platform Governance',
    },
    {
      id: '2',
      name: 'Rajesh Malhotra',
      email: 'sales@yuganayurved.com',
      role: 'SALES_MANAGER',
      status: 'ACTIVE',
      assignedArea: 'B2B Wholesale Quotes & RFQ Approvals',
    },
    {
      id: '3',
      name: 'Kavita Sundaram',
      email: 'account@yuganayurved.com',
      role: 'ACCOUNT_MANAGER',
      status: 'ACTIVE',
      assignedArea: 'Panchkarma Center Accounts & POs',
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
              ? 'B2B Quotes & Inquiries'
              : form.role === 'ACCOUNT_MANAGER'
              ? 'Hospital POs'
              : 'General Operations',
        },
      ]);
      setNotification({ type: 'success', text: `Provisioned new ${form.role} account for ${form.name}` });
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
    <div className="space-y-8 font-poppins text-slate-100">
      
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Admin Personnel & Role Governance
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Role-Based Access Control (RBAC) across Super Admin, Normal Admin, Sales Manager, and Account Manager.
        </p>
      </div>

      {notification && (
        <div className={`p-3 border text-xs rounded-xl flex items-center gap-2 animate-slide-up ${
          notification.type === 'success'
            ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
            : 'bg-red-950/80 border-red-700 text-red-300'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <ShieldAlert className="w-4 h-4 text-red-400" />
          )}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Staff List Table */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-soft">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Active Administrative Staff & Responsibilities
          </h2>
          <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-800">
            {adminsList.length} Active Accounts
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-slate-400 uppercase tracking-wider text-[10px] bg-slate-900/80 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">Functional Jurisdiction</th>
                <th className="py-3 px-4">Security Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 text-slate-200">
              {adminsList.map((st) => (
                <tr key={st.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-white">
                    <div>{st.name}</div>
                    <div className="text-[10px] text-slate-400">{st.email}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold">
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full ${
                      st.role === 'SUPER_ADMIN'
                        ? 'bg-purple-950 text-purple-400 border border-purple-800'
                        : st.role === 'SALES_MANAGER'
                        ? 'bg-blue-950 text-blue-400 border border-blue-800'
                        : st.role === 'ACCOUNT_MANAGER'
                        ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}>
                      {st.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    {st.assignedArea}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded">
                      ● Active Verified Session
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provision New Admin / Staff Section */}
      <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-soft max-w-3xl space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
            <Plus className="w-4 h-4" />
            <span>Controlled Security Provisioning</span>
          </div>
          <h2 className="text-xl font-bold text-white">
            Provision New Administrator or Manager
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Super Admin credentials and Master Setup Key are required for creating privileged roles.
          </p>
        </div>

        <form onSubmit={handleCreateStaff} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Staff Full Name"
              required
              placeholder="e.g. Ramesh Kulkarni"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              inputClassName="bg-slate-900 border-slate-700 text-white"
            />
            <Input
              label="Official Work Email"
              type="email"
              required
              placeholder="r.kulkarni@yuganayurved.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              inputClassName="bg-slate-900 border-slate-700 text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Initial Password"
              type="password"
              required
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              inputClassName="bg-slate-900 border-slate-700 text-white"
            />
            <Select
              label="Assigned Role"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              selectClassName="bg-slate-900 border-slate-700 text-white"
              options={[
                { value: 'ADMIN', label: 'Admin (Operations & Catalog)' },
                { value: 'SUPER_ADMIN', label: 'Super Admin (All Privileges)' },
                { value: 'SALES_MANAGER', label: 'Sales Manager (B2B Quotes & Inquiries)' },
                { value: 'ACCOUNT_MANAGER', label: 'Account Manager (Hospital Accounts & Orders)' },
              ]}
            />
          </div>

          <Input
            label="Master Admin Authorization Key"
            type="password"
            required
            value={form.adminKey}
            onChange={(e) => setForm({ ...form, adminKey: e.target.value })}
            inputClassName="bg-slate-900 border-slate-700 text-white font-mono"
            helperText="Controlled secret key for role creation"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={loading}
          >
            PROVISION PRIVILEGED ACCOUNT
          </Button>
        </form>
      </div>

    </div>
  );
}
