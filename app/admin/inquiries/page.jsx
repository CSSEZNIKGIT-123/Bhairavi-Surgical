'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Crown,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  Search,
  MessageSquare,
  Calendar,
  Clock,
  Check,
  X,
  RefreshCw,
  Sparkles,
  User,
  Building2
} from 'lucide-react';
import AdminStatusBadge from '@/components/admin/AdminStatusBadge';
import AdminEmptyState from '@/components/admin/AdminEmptyState';
import AdminTableSkeleton from '@/components/admin/AdminTableSkeleton';
import Modal from '@/components/ui/Modal';

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [inquiryStatus, setInquiryStatus] = useState('CONTACTED');
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [notification, setNotification] = useState(null);

  const loadInquiries = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/inquiries');
      const data = await res.json();
      if (data.success) {
        setInquiries(data.inquiries || []);
      }
    } catch (e) {
      console.error('Error loading inquiries:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  const showNotification = (type, text) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleOpenInquiry = (inq) => {
    setSelectedInquiry(inq);
    setInquiryStatus(inq.status || 'CONTACTED');
    setAdminNotes(inq.adminNotes || '');
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedInquiry) return;
    setUpdating(true);

    try {
      const res = await fetch(`/api/admin/inquiries/${selectedInquiry.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: inquiryStatus,
          adminNotes,
        }),
      });

      if (res.ok) {
        showNotification('success', `Inquiry #${selectedInquiry.inquiryNumber} updated successfully!`);
        setSelectedInquiry(null);
        loadInquiries();
      } else {
        throw new Error('Failed to update inquiry');
      }
    } catch (e) {
      showNotification('error', e.message);
    } finally {
      setUpdating(false);
    }
  };

  // Filtered calculation
  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      const searchMatch =
        !searchTerm ||
        inq.inquiryNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inq.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inq.organization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inq.requirementType?.toLowerCase().includes(searchTerm.toLowerCase());

      const statusMatch =
        selectedStatus === 'ALL' ||
        String(inq.status).toUpperCase() === selectedStatus;

      return searchMatch && statusMatch;
    });
  }, [inquiries, searchTerm, selectedStatus]);

  return (
    <div className="space-y-6 font-poppins text-slate-900">
      
      {/* 1. Header (Pure Light) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Special Bespoke Commissions & Consultations
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-mono text-xs font-bold">
              {inquiries.length} Commissions
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Private requests for single-log carved Burmese teak Droni tables, hand-beaten brass Shirodhara apparatus, and sanctuary suites.
          </p>
        </div>

        <button
          type="button"
          onClick={loadInquiries}
          title="Refresh Inquiries"
          className="self-start md:self-auto p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
        </button>
      </div>

      {/* Notification */}
      {notification && (
        <div
          className={`p-3.5 rounded-2xl border text-xs flex items-center gap-2.5 animate-in fade-in duration-200 ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span className="font-semibold">{notification.text}</span>
        </div>
      )}

      {/* 2. Filters & Status Tabs (Pure Light) */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm space-y-3.5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search client, organization, inquiry #..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-amber-500 transition-colors"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {['ALL', 'NEW', 'CONTACTED', 'CONSULTATION_SCHEDULED', 'COMMISSIONED', 'CLOSED'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  selectedStatus === st
                    ? 'bg-amber-600 text-white font-bold shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 border border-slate-200/60'
                }`}
              >
                {st === 'ALL'
                  ? 'All Inquiries'
                  : st === 'NEW'
                  ? 'New Inquiries'
                  : st === 'CONTACTED'
                  ? 'Contacted'
                  : st === 'CONSULTATION_SCHEDULED'
                  ? 'Consultation'
                  : st === 'COMMISSIONED'
                  ? 'Commissioned'
                  : 'Closed'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Inquiries Table (Pure Light) */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-6">
            <AdminTableSkeleton rows={5} cols={6} />
          </div>
        ) : filteredInquiries.length === 0 ? (
          <AdminEmptyState
            icon={Crown}
            title="No bespoke inquiries found"
            description="Bespoke artisan consultation requests will appear here when submitted from the Special Atelier portal."
            actionLabel={searchTerm || selectedStatus !== 'ALL' ? 'Reset Filters' : null}
            onAction={() => {
              setSearchTerm('');
              setSelectedStatus('ALL');
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-slate-500 uppercase tracking-wider text-[10px] bg-slate-50 border-b border-slate-200 font-bold">
                <tr>
                  <th className="py-3.5 px-4">Ref & Date</th>
                  <th className="py-3.5 px-4">Vaidya / Patron</th>
                  <th className="py-3.5 px-3">Organization</th>
                  <th className="py-3.5 px-3">Requirement</th>
                  <th className="py-3.5 px-3">Priority</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredInquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-amber-800">{inq.inquiryNumber}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {inq.createdAt ? new Date(inq.createdAt).toLocaleDateString() : 'Recent'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div className="font-bold">{inq.name}</div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>{inq.phone}</span>
                        <span>•</span>
                        <span>{inq.email}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-slate-700 font-medium">
                      {inq.organization || 'Private Sanctuary'}
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {inq.requirementType || 'Custom Artisan Commission'}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        inq.priority === 'URGENT'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : inq.priority === 'HIGH'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {inq.priority || 'NORMAL'}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <AdminStatusBadge status={inq.status || 'NEW'} type="inquiry" />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenInquiry(inq)}
                        className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-amber-300 text-slate-700 hover:text-amber-800 hover:bg-amber-50 transition-all font-semibold text-xs shadow-2xs"
                      >
                        Consult
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. Consultation & Status Modal (Pure Light) */}
      {selectedInquiry && (
        <Modal
          isOpen={Boolean(selectedInquiry)}
          onClose={() => setSelectedInquiry(null)}
          title={`Consultation: Ref #${selectedInquiry.inquiryNumber}`}
          subtitle={`Client: ${selectedInquiry.name} • ${selectedInquiry.organization || 'Private'}`}
          className="bg-white border-slate-200 text-slate-900 max-w-2xl shadow-2xl"
        >
          <form onSubmit={handleUpdateStatus} className="space-y-5 text-xs">
            
            {/* Contact quick actions */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="text-sm font-bold text-slate-900">{selectedInquiry.name}</div>
                  <div className="text-slate-500">{selectedInquiry.email} • {selectedInquiry.phone}</div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/${selectedInquiry.phone?.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-600 hover:text-white transition-all font-semibold text-xs shadow-2xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={`tel:${selectedInquiry.phone}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors font-semibold text-xs shadow-2xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>
                </div>
              </div>

              {selectedInquiry.message && (
                <div className="pt-2.5 border-t border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Client Requirements / Vision
                  </span>
                  <p className="text-slate-800 leading-relaxed bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                    {selectedInquiry.message}
                  </p>
                </div>
              )}
            </div>

            {/* Status selector & Notes */}
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Commission Pipeline Status <span className="text-rose-600">*</span>
                </label>
                <select
                  value={inquiryStatus}
                  onChange={(e) => setInquiryStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-amber-500 font-medium"
                >
                  <option value="NEW">NEW (Awaiting First Review)</option>
                  <option value="CONTACTED">CONTACTED (Initial Discovery Sent)</option>
                  <option value="CONSULTATION_SCHEDULED">CONSULTATION_SCHEDULED (Vaidya Appt Booked)</option>
                  <option value="COMMISSIONED">COMMISSIONED (Wood Carving / Crafting Started)</option>
                  <option value="CLOSED">CLOSED (Completed & Delivered)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Master Artisan Consultation Notes
                </label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Record wood specifications (e.g. Single teak log 7.5ft x 3ft), brass gauge preferences, delivery schedule..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updating}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold transition-all shadow-md shadow-amber-900/10"
              >
                {updating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Save Consultation Record</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </Modal>
      )}

    </div>
  );
}
