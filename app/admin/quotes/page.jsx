'use client';

import React, { useState, useEffect } from 'react';
import { FileSpreadsheet, Eye, Check, X, Building2, Send, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [offeredTotal, setOfferedTotal] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [quoteStatus, setQuoteStatus] = useState('QUOTED');
  const [updating, setUpdating] = useState(false);
  const [notification, setNotification] = useState(null);

  const loadQuotes = async () => {
    try {
      const res = await fetch('/api/quotes');
      const data = await res.json();
      if (data.success) setQuotes(data.quotes);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuotes();
  }, []);

  const handleOpenQuote = (quote) => {
    setSelectedQuote(quote);
    setOfferedTotal(quote.offeredTotal || '');
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
        setNotification({ type: 'success', text: `Quote #${selectedQuote.quoteNumber} updated successfully` });
        setSelectedQuote(null);
        loadQuotes();
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
          B2B Quotations & RFQ Pipeline
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Review institutional tenders, evaluate buyer target prices, and issue formal PDF quotations.
        </p>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs rounded-xl flex items-center gap-2 animate-slide-up">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification.text}</span>
        </div>
      )}

      {/* Quotes Table */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-slate-400 uppercase tracking-wider text-[10px] bg-slate-900/80 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">RFQ Number</th>
                <th className="py-3 px-4">Organization / Hospital</th>
                <th className="py-3 px-3">Contact Officer</th>
                <th className="py-3 px-3">Line Items</th>
                <th className="py-3 px-3">Budget / Timeline</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 text-slate-200">
              {quotes.map((q) => (
                <tr key={q.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                    {q.quoteNumber}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-white">
                    {q.companyName}
                    {q.taxId && (
                      <span className="text-[10px] text-slate-500 block font-mono">
                        GST: {q.taxId}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-3">
                    <div>{q.contactPerson}</div>
                    <div className="text-[10px] text-slate-400">{q.email}</div>
                  </td>
                  <td className="py-3.5 px-3 font-semibold">
                    {q.items?.length || 1} line items
                  </td>
                  <td className="py-3.5 px-3 text-slate-400">
                    <div>{q.estimatedBudget || 'Standard'}</div>
                    <div className="text-[10px] text-slate-500">{q.deliveryTimeline}</div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      q.status === 'SUBMITTED'
                        ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : q.status === 'QUOTED'
                        ? 'bg-blue-950 text-blue-400 border border-blue-800'
                        : q.status === 'ACCEPTED'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {q.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleOpenQuote(q)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-200 transition-colors font-bold text-xs inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> Review RFQ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quote Review & Evaluation Modal */}
      {selectedQuote && (
        <Modal
          isOpen={!!selectedQuote}
          onClose={() => setSelectedQuote(null)}
          title={`RFQ Evaluation #${selectedQuote.quoteNumber}`}
          subtitle={`Client: ${selectedQuote.companyName} • Officer: ${selectedQuote.contactPerson}`}
          className="bg-slate-950 border-slate-800 text-slate-100 max-w-3xl"
        >
          <form onSubmit={handleSaveQuote} className="space-y-5 text-xs">
            
            {/* Line items review table */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                Requested Line Items:
              </h4>
              <div className="bg-slate-900 rounded-2xl border border-slate-800 divide-y divide-slate-800 overflow-hidden">
                {selectedQuote.items?.map((it, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">{it.product?.title}</div>
                      <span className="text-[10px] font-mono text-slate-400">SKU: {it.product?.sku}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-400">Qty: {it.quantity} units</div>
                      <div className="text-[10px] text-slate-400">
                        Target Price: {it.targetPrice ? formatCurrency(it.targetPrice) : 'Default Wholesale'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Buyer Notes */}
            {selectedQuote.notes && (
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="font-bold text-slate-400 text-[10px] uppercase">Buyer Tender Notes:</span>
                <p className="text-slate-200">{selectedQuote.notes}</p>
              </div>
            )}

            {/* Manager Pricing Evaluation */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800">
              <Input
                label="Offered Total Amount (₹ Excl. GST)"
                type="number"
                placeholder="e.g. 195000"
                value={offeredTotal}
                onChange={(e) => setOfferedTotal(e.target.value)}
                inputClassName="bg-slate-900 border-slate-700 text-white font-bold"
              />

              <Select
                label="RFQ Workflow Status"
                value={quoteStatus}
                onChange={(e) => setQuoteStatus(e.target.value)}
                selectClassName="bg-slate-900 border-slate-700 text-white"
                options={[
                  { value: 'UNDER_REVIEW', label: 'Under Technical Review' },
                  { value: 'QUOTED', label: 'Quoted (Offer Dispatched)' },
                  { value: 'ACCEPTED', label: 'Accepted by Hospital' },
                  { value: 'REJECTED', label: 'Rejected / Expired' },
                ]}
              />
            </div>

            <Textarea
              label="Manager Terms & Technical Evaluation Notes"
              rows={2}
              placeholder="Include warranty terms, delivery schedule, and GST breakdown..."
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              textareaClassName="bg-slate-900 border-slate-700 text-white"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              loading={updating}
              icon={Send}
            >
              UPDATE RFQ STATUS & DISPATCH OFFER
            </Button>
          </form>
        </Modal>
      )}

    </div>
  );
}
