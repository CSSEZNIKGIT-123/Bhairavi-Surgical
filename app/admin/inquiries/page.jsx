'use client';

import React, { useState, useEffect } from 'react';
import { Crown, Phone, Mail, CheckCircle2, Clock } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [inquiryStatus, setInquiryStatus] = useState('CONTACTED');
  const [updating, setUpdating] = useState(false);
  const [notification, setNotification] = useState(null);

  const loadInquiries = async () => {
    try {
      const res = await fetch('/api/inquiries');
      const data = await res.json();
      if (data.success) setInquiries(data.inquiries);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedInquiry) return;
    setUpdating(true);

    try {
      const res = await fetch(`/api/admin/inquiries/${selectedInquiry.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: inquiryStatus }),
      });
      if (res.ok) {
        setNotification({ type: 'success', text: `Inquiry #${selectedInquiry.inquiryNumber} updated` });
        setSelectedInquiry(null);
        loadInquiries();
        setTimeout(() => setNotification(null), 2500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6 font-poppins text-slate-100">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Special Bespoke Commissions & Consultations
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Private requests for single-log carved Burmese teak Dronis, brass Shirodhara apparatus, and bespoke Ayurvedic sanctuary suites.
        </p>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs rounded-xl flex items-center gap-2 animate-slide-up">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification.text}</span>
        </div>
      )}

      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-slate-400 uppercase tracking-wider text-[10px] bg-slate-900/80 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Inquiry Ref</th>
                <th className="py-3 px-4">Vaidya / Client</th>
                <th className="py-3 px-3">Organization</th>
                <th className="py-3 px-3">Requirement Type</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 text-slate-200">
              {inquiries.map((inq) => (
                <tr key={inq.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-gold-light">
                    {inq.inquiryNumber}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-white">
                    <div>{inq.name}</div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>{inq.phone}</span> • <span>{inq.email}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-slate-300">
                    {inq.organization || 'Private Practice'}
                  </td>
                  <td className="py-3.5 px-3 font-medium text-emerald-400 max-w-xs truncate">
                    {inq.requirementType}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                      {inq.urgency}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {inq.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedInquiry(inq);
                        setInquiryStatus(inq.status);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-gold-dark hover:text-white text-slate-200 transition-colors font-bold text-xs"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedInquiry && (
        <Modal
          isOpen={!!selectedInquiry}
          onClose={() => setSelectedInquiry(null)}
          title={`Inquiry Details #${selectedInquiry.inquiryNumber}`}
          subtitle={`Client: ${selectedInquiry.name} • ${selectedInquiry.phone}`}
          className="bg-slate-950 border-slate-800 text-slate-100"
        >
          <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
            <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
              <div className="font-bold text-gold-light text-sm">{selectedInquiry.requirementType}</div>
              <p className="text-slate-300 leading-relaxed">{selectedInquiry.description}</p>
            </div>

            <Select
              label="Consultation Status"
              value={inquiryStatus}
              onChange={(e) => setInquiryStatus(e.target.value)}
              selectClassName="bg-slate-900 border-slate-700 text-white"
              options={[
                { value: 'NEW', label: 'New Inquiry' },
                { value: 'CONTACTED', label: 'Surgeon Contacted by Phone/Email' },
                { value: 'SCHEDULED', label: 'Consultation Meeting Scheduled' },
                { value: 'COMPLETED', label: 'Commission Completed' },
                { value: 'ARCHIVED', label: 'Archived' },
              ]}
            />

            <Button type="submit" variant="luxury" size="lg" className="w-full" loading={updating}>
              SAVE INQUIRY STATUS
            </Button>
          </form>
        </Modal>
      )}

    </div>
  );
}
