'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import {
  User,
  Package,
  FileSpreadsheet,
  Heart,
  Settings,
  LogOut,
  Building2,
  Crown,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';

export default function CustomerAccountDashboard() {
  const router = useRouter();
  const { user, isCustomerLoggedIn, logoutCustomer } = useAuth();
  const [orders, setOrders] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [ordRes, qRes, inqRes] = await Promise.all([
          fetch('/api/orders'),
          fetch('/api/quotes'),
          fetch('/api/inquiries'),
        ]);
        const ordData = await ordRes.json();
        const qData = await qRes.json();
        const inqData = await inqRes.json();

        if (ordData.success) setOrders(ordData.orders);
        if (qData.success) setQuotes(qData.quotes);
        if (inqData.success) setInquiries(inqData.inquiries);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleLogout = () => {
    logoutCustomer();
    router.push('/account/login');
  };

  const isB2B = !!user?.businessProfile;
  const isSpecial = !!user?.specialProfile;

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-poppins">
      <AnnouncementBar mode="B2C" />
      <Navbar mode="B2C" />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
        
        {/* Profile Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream-300 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-forest text-white flex items-center justify-center text-2xl font-bold font-poppins shadow-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-charcoal font-poppins">
                  {user?.name || 'Customer Portal'}
                </h1>
                {isB2B && (
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full border border-emerald-300">
                    B2B VERIFIED
                  </span>
                )}
                {isSpecial && (
                  <span className="text-[10px] font-bold bg-charcoal text-gold-light px-2 py-0.5 rounded-full border border-gold/40">
                    ATELIER CLIENT
                  </span>
                )}
              </div>
              <p className="text-xs text-charcoal-muted mt-0.5">
                {user?.email || 'Logged In'} • Phone: {user?.phone || 'Not provided'}
              </p>
              {user?.businessProfile?.companyName && (
                <p className="text-xs font-semibold text-forest mt-0.5">
                  {user.businessProfile.companyName} (GST: {user.businessProfile.taxGstNumber || 'N/A'})
                </p>
              )}
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={handleLogout} icon={LogOut}>
            Sign Out
          </Button>
        </div>

        {/* 3 Overview KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-cream-300 shadow-soft space-y-2">
            <div className="flex items-center justify-between text-forest">
              <Package className="w-6 h-6" />
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-muted">Orders</span>
            </div>
            <div className="text-3xl font-bold text-charcoal font-poppins">{orders.length}</div>
            <p className="text-xs text-charcoal-muted">Total placed clinical orders</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-cream-300 shadow-soft space-y-2">
            <div className="flex items-center justify-between text-emerald-800">
              <FileSpreadsheet className="w-6 h-6" />
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-muted">B2B Quotes</span>
            </div>
            <div className="text-3xl font-bold text-charcoal font-poppins">{quotes.length}</div>
            <p className="text-xs text-charcoal-muted">Active RFQ inquiries</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-cream-300 shadow-soft space-y-2">
            <div className="flex items-center justify-between text-gold-dark">
              <Crown className="w-6 h-6" />
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-muted">Special Consultations</span>
            </div>
            <div className="text-3xl font-bold text-charcoal font-poppins">{inquiries.length}</div>
            <p className="text-xs text-charcoal-muted">Bespoke commissions</p>
          </div>
        </div>

        {/* Orders & Quotes Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Recent Orders (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-cream-300 shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-cream-200">
              <h2 className="text-base font-bold text-charcoal font-poppins">Recent Orders</h2>
              <Link href="/b2c/shop" className="text-xs font-bold text-forest hover:underline">
                Order Again →
              </Link>
            </div>

            {orders.length === 0 ? (
              <div className="py-8 text-center text-xs text-charcoal-muted">
                No orders placed yet.
              </div>
            ) : (
              <div className="divide-y divide-cream-200">
                {orders.slice(0, 5).map((ord) => (
                  <div key={ord.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-charcoal font-mono">{ord.orderNumber}</div>
                      <div className="text-charcoal-muted text-[11px]">
                        {new Date(ord.createdAt).toLocaleDateString()} • {ord.items?.length || 1} items
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-forest">{formatCurrency(ord.totalAmount)}</div>
                      <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        {ord.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Quotes & Inquiries (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-cream-300 shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-cream-200">
              <h2 className="text-base font-bold text-charcoal font-poppins">Quotes & Inquiries</h2>
              <Link href="/b2b/quotes" className="text-xs font-bold text-emerald-800 hover:underline">
                New RFQ →
              </Link>
            </div>

            {quotes.length === 0 && inquiries.length === 0 ? (
              <div className="py-8 text-center text-xs text-charcoal-muted">
                No pending quotes or bespoke inquiries.
              </div>
            ) : (
              <div className="divide-y divide-cream-200">
                {quotes.map((q) => (
                  <div key={q.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-charcoal font-mono">{q.quoteNumber}</div>
                      <div className="text-charcoal-muted text-[11px]">{q.companyName}</div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded">
                      {q.status}
                    </span>
                  </div>
                ))}

                {inquiries.map((inq) => (
                  <div key={inq.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-charcoal font-mono">{inq.inquiryNumber}</div>
                      <div className="text-charcoal-muted text-[11px]">{inq.requirementType}</div>
                    </div>
                    <span className="text-[10px] font-bold text-gold-dark bg-[#181D19] text-gold-light px-2 py-0.5 rounded">
                      {inq.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </main>

      <Footer mode="B2C" />
    </div>
  );
}
