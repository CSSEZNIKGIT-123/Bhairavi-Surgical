'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  FileSpreadsheet,
  Building2,
  Send,
  CheckCircle2,
  AlertCircle,
  Search,
  Check,
  X,
  RefreshCw,
  Eye,
  DollarSign,
  Clock,
  Briefcase
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import AdminStatusBadge from '@/components/admin/AdminStatusBadge';
import AdminEmptyState from '@/components/admin/AdminEmptyState';
import AdminTableSkeleton from '@/components/admin/AdminTableSkeleton';
import Modal from '@/components/ui/Modal';

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [offeredTotal, setOfferedTotal] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [quoteStatus, setQuoteStatus] = useState('QUOTED');
  const [updating, setUpdating] = useState(false);
  const [notification, setNotification] = useState(null);

  const loadQuotes = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/quotes');
      const data = await res.json();
      if (data.success) {
        setQuotes(data.quotes || []);
      }
    } catch (e) {
      console.error('Error loading quotes:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuotes();
  }, []);

  const showNotification = (type, text) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleOpenQuote = (quote) => {
    setSelectedQuote(quote);
    setOfferedTotal(quote.offeredTotal || quote.targetTotal || '');
    setAdminNotes(quote.adminNotes || '');
    setQuoteStatus(quote.status || 'UNDER_REVIEW');
  };

  const handleSaveQuote = async (e) => {
    e.preventDefault();
    if (!selectedQuote) return;
    setUpdating(true);

    try {
      const res = await fetch(`/api/admin/quotes/${selectedQuote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: quoteStatus,
          offeredTotal: offeredTotal ? parseFloat(offeredTotal) : null,
          adminNotes,
        }),
      });

      if (res.ok) {
        showNotification('success', `RFQ #${selectedQuote.quoteNumber} pricing updated successfully!`);
        setSelectedQuote(null);
        loadQuotes();
      } else {
        throw new Error('Failed to update quote');
      }
    } catch (e) {
      showNotification('error', e.message);
    } finally {
      setUpdating(false);
    }
  };

  // Filtered calculation
  const filteredQuotes = useMemo(() => {
    return quotes.filter((q) => {
      const searchMatch =
        !searchTerm ||
        q.quoteNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const statusMatch =
        selectedStatus === 'ALL' ||
        String(q.status).toUpperCase() === selectedStatus;

      return searchMatch && statusMatch;
    });
  }, [quotes, searchTerm, selectedStatus]);

  return (
    <div className="space-y-6 font-poppins text-slate-900">
      
      {/* 1. Header (Pure Light) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              B2B Institutional RFQs & Pricing Desk
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 font-mono text-xs font-bold">
              {quotes.length} RFQs
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review hospital tenders, evaluate bulk wholesale target pricing, and issue binding formal PDF quotations.
          </p>
        </div>

        <button
          type="button"
          onClick={loadQuotes}
          title="Refresh Quotes"
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
              placeholder="Search by RFQ #, hospital, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 transition-colors"
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
            {['ALL', 'UNDER_REVIEW', 'QUOTED', 'APPROVED', 'REJECTED'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  selectedStatus === st
                    ? 'bg-blue-600 text-white font-bold shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 border border-slate-200/60'
                }`}
              >
                {st === 'ALL'
                  ? 'All RFQs'
                  : st === 'UNDER_REVIEW'
                  ? 'Under Review'
                  : st === 'QUOTED'
                  ? 'Formal Quoted'
                  : st === 'APPROVED'
                  ? 'PO Approved'
                  : 'Declined'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Quotes Table (Pure Light) */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-6">
            <AdminTableSkeleton rows={5} cols={6} />
          </div>
        ) : filteredQuotes.length === 0 ? (
          <AdminEmptyState
            icon={FileSpreadsheet}
            title="No quotations found"
            description="Submitted wholesale RFQs from hospitals and Panchkarma clinics will appear here."
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
                  <th className="py-3.5 px-4">RFQ Ref & Date</th>
                  <th className="py-3.5 px-4">Institution / Hospital</th>
                  <th className="py-3.5 px-3">Contact Person</th>
                  <th className="py-3.5 px-3">Target Price</th>
                  <th className="py-3.5 px-3">Offered Price</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredQuotes.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-sky-700">{q.quoteNumber}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {q.createdAt ? new Date(q.createdAt).toLocaleDateString() : 'Recent'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <div>
                          <div className="font-bold">{q.companyName || 'Institutional Buyer'}</div>
                          {q.gstNumber && (
                            <div className="text-[10px] text-slate-500 font-mono">GST: {q.gstNumber}</div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="text-slate-900 font-semibold">{q.contactName}</div>
                      <div className="text-[10px] text-slate-500">{q.email}</div>
                    </td>

                    <td className="py-3.5 px-3 font-mono font-medium text-slate-700">
                      {q.targetTotal ? formatCurrency(q.targetTotal) : 'Unspecified'}
                    </td>

                    <td className="py-3.5 px-3 font-mono font-bold text-emerald-700">
                      {q.offeredTotal ? formatCurrency(q.offeredTotal) : '—'}
                    </td>

                    <td className="py-3.5 px-3">
                      <AdminStatusBadge status={q.status || 'UNDER_REVIEW'} type="quote" />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenQuote(q)}
                        className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-sky-300 text-slate-700 hover:text-sky-800 hover:bg-sky-50 transition-all font-semibold text-xs shadow-2xs"
                      >
                        Evaluate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. Quotation Evaluation & Formal Pricing Modal (Pure Light) */}
      {selectedQuote && (
        <Modal
          isOpen={Boolean(selectedQuote)}
          onClose={() => setSelectedQuote(null)}
          title={`Evaluate B2B RFQ #${selectedQuote.quoteNumber}`}
          subtitle={`Client: ${selectedQuote.companyName} (${selectedQuote.contactName})`}
          className="bg-white border-slate-200 text-slate-900 max-w-2xl shadow-2xl"
        >
          <form onSubmit={handleSaveQuote} className="space-y-5 text-xs">
            
            {/* Hospital snapshot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Institution Details</span>
                <div className="font-bold text-slate-900 text-sm">{selectedQuote.companyName}</div>
                <div className="text-slate-600">Contact: {selectedQuote.contactName} ({selectedQuote.phone})</div>
                <div className="text-slate-600">Email: {selectedQuote.email}</div>
              </div>

              <div className="space-y-1 sm:border-l sm:border-slate-200 sm:pl-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Requirements Summary</span>
                <div className="text-slate-700 font-medium">{selectedQuote.requirements || 'Standard wholesale procurement request'}</div>
                {selectedQuote.targetTotal && (
                  <div className="text-amber-800 font-mono mt-1 font-bold">
                    Client Target Budget: {formatCurrency(selectedQuote.targetTotal)}
                  </div>
                )}
              </div>
            </div>

            {/* Pricing Offer & Pipeline Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Offered Formal Quote Total (₹) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={offeredTotal}
                  onChange={(e) => setOfferedTotal(e.target.value)}
                  placeholder="e.g. 145000"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-sm focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Pipeline Stage / Decision <span className="text-rose-600">*</span>
                </label>
                <select
                  value={quoteStatus}
                  onChange={(e) => setQuoteStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-blue-500 font-medium"
                >
                  <option value="UNDER_REVIEW">UNDER_REVIEW (Pending Sales Eval)</option>
                  <option value="QUOTED">QUOTED (Formal Price Issued)</option>
                  <option value="APPROVED">APPROVED (Purchase Order Accepted)</option>
                  <option value="REJECTED">REJECTED (Declined / Unfeasible)</option>
                </select>
              </div>
            </div>

            {/* Admin & Delivery Notes */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Executive & Logistics Notes (Terms of Delivery & Validity)
              </label>
              <textarea
                rows={3}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="e.g. 18% GST included, CIF Hospital dock delivery within 14 business days. Quote valid for 30 days."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedQuote(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updating}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold transition-all shadow-md shadow-blue-900/10"
              >
                {updating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Updating RFQ...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Confirm & Issue Quote</span>
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
