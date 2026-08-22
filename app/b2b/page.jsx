'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import B2BHero from '@/components/hero/B2BHero';
import B2BProductCard from '@/components/products/B2BProductCard';
import {
  Building2,
  FileSpreadsheet,
  Layers,
  CheckCircle2,
  ShieldCheck,
  Truck,
  ArrowRight,
  Download,
  PhoneCall,
  Clock,
  Leaf,
} from 'lucide-react';
import Button from '@/components/ui/Button';

export default function B2BHomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products?mode=b2b')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProducts(data.products);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const industries = [
    {
      title: 'Ayurvedic Hospitals & Inpatient Wings',
      desc: 'Bulk 25L drums of classical medicated oils, high-volume Kashayam decoctions, and inpatient therapy supplies.',
      image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=400&q=80',
      stats: '180+ Hospital Partners',
    },
    {
      title: 'Panchkarma Centers & Daycare Clinics',
      desc: 'Authentic brass Shirodhara pots, bronze Kansa bowls, and monthly replenishment subscriptions for Abhyanga tailas.',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80',
      stats: '450+ Clinic Networks',
    },
    {
      title: 'Wellness Spas & Eco-Resorts',
      desc: 'Luxury herbal massage oils, radiant Kumkumadi saffron beauty elixirs, and bespoke guest wellness amenities.',
      image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=400&q=80',
      stats: '95+ Luxury Sanctuaries',
    },
    {
      title: 'Regional Herbal Distributors',
      desc: 'Exclusive territory distribution rights with maximum wholesale margins and marketing collateral support.',
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=400&q=80',
      stats: 'Pan-India Distribution',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-poppins text-charcoal selection:bg-forest selection:text-white">
      <AnnouncementBar mode="B2B" />
      <Navbar mode="B2B" />

      {/* 1. Full-Width B2B Procurement Video Hero */}
      <B2BHero />

      <main className="flex-1 w-full space-y-16 sm:space-y-24 py-12 sm:py-16">
        
        {/* 2. Procurement Metrics Bar (Light & Clean) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white text-charcoal rounded-3xl p-6 sm:p-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-center border border-cream-200 shadow-soft">
            <div className="space-y-1">
              <div className="text-2xl sm:text-4xl font-bold font-poppins text-forest">450+</div>
              <div className="text-xs text-charcoal-muted uppercase font-medium">Panchkarma Centers Supplied</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-4xl font-bold font-poppins text-forest">10,000L+</div>
              <div className="text-xs text-charcoal-muted uppercase font-medium">Monthly Medicated Oil Capacity</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-4xl font-bold font-poppins text-forest">Up to 38%</div>
              <div className="text-xs text-charcoal-muted uppercase font-medium">Direct Wholesale Margin</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-4xl font-bold font-poppins text-forest">4 Hours</div>
              <div className="text-xs text-charcoal-muted uppercase font-medium">Guaranteed RFQ Turnaround</div>
            </div>
          </div>
        </section>

        {/* 3. Industry Solutions Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8 pb-4 border-b border-cream-200">
            <div>
              <span className="text-xs font-bold text-forest uppercase tracking-widest bg-forest/10 px-3 py-1 rounded-full">
                Tailored Institutional Supply
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-charcoal font-poppins mt-2">
                Supply by Healthcare & Wellness Sector
              </h2>
            </div>
            <Link href="/b2b/industries" className="text-xs sm:text-sm font-bold text-forest hover:underline">
              View all sector solutions →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {industries.map((ind, idx) => (
              <div
                key={idx}
                className="group bg-white rounded-3xl overflow-hidden border border-cream-200 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full bg-cream-100 overflow-hidden">
                    <Image
                      src={ind.image}
                      alt={ind.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="bg-forest/90 text-white font-bold text-[10px] px-2.5 py-1 rounded-lg shadow-sm">
                        {ind.stats}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="text-base font-bold text-charcoal group-hover:text-forest transition-colors font-poppins">
                      {ind.title}
                    </h3>
                    <p className="text-xs text-charcoal-muted leading-relaxed font-light">
                      {ind.desc}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link href="/b2b/quotes" className="text-xs font-bold text-forest hover:underline flex items-center gap-1">
                    Request Sector Pricing <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Featured B2B Tiered Wholesale Products */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8 pb-4 border-b border-cream-200">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-charcoal font-poppins">
                Wholesale Catalog & Quantity Tiers
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-muted mt-1 font-light">
                Direct manufacturing unit pricing with live bulk discount calculator
              </p>
            </div>
            <Link
              href="/b2b/products"
              className="text-xs sm:text-sm font-bold text-forest hover:underline flex items-center gap-1"
            >
              <span>View Full Wholesale Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-80 bg-white rounded-2xl animate-pulse border border-cream-200" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {products.slice(0, 6).map((prod) => (
                <B2BProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}
        </section>

        {/* 5. Direct RFQ Builder Callout Banner (Refined Light Theme) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-charcoal shadow-soft border border-cream-200">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <span className="text-xs font-bold text-forest uppercase tracking-widest bg-forest/10 px-3 py-1 rounded-full border border-forest/20">
                  INSTITUTIONAL TENDER & RFQ SYSTEM
                </span>
                <h3 className="text-2xl sm:text-4xl font-normal text-charcoal font-poppins leading-tight">
                  Need a Comprehensive Hospital or Clinic Supply Quote?
                </h3>
                <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed max-w-xl font-light">
                  Upload your monthly requirement list or add products to your online RFQ tray. Our Ayurvedic institutional sales team will prepare a formal stamped quotation with GST breakdown within 4 business hours.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link href="/b2b/quotes">
                    <Button variant="primary" size="lg" icon={FileSpreadsheet} className="font-bold uppercase tracking-wider">
                      Launch RFQ Builder
                    </Button>
                  </Link>
                  <a href="tel:+919876543210" className="inline-flex items-center gap-2 text-xs font-bold text-forest hover:underline transition-colors">
                    <PhoneCall className="w-4 h-4" /> Direct Helpline: +91 98765 43210
                  </a>
                </div>
              </div>

              <div className="lg:col-span-4 bg-[#FAF8F5] rounded-2xl p-6 border border-cream-200 space-y-3 text-xs">
                <h4 className="font-bold text-forest text-sm">Wholesale Advantages:</h4>
                <ul className="space-y-2 text-charcoal">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-forest shrink-0" />
                    <span>30-Day Institutional Credit Period</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-forest shrink-0" />
                    <span>Direct GST 18% Input Tax Credit</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-forest shrink-0" />
                    <span>Batch Test Certificates with Every Order</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-forest shrink-0" />
                    <span>Dedicated Regional Vaidya Account Manager</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer mode="B2B" />
    </div>
  );
}
