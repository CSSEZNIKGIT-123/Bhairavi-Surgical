'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import { Building2, CheckCircle2, ArrowRight, ShieldCheck, FileSpreadsheet, Leaf } from 'lucide-react';

export default function B2BIndustriesPage() {
  const industries = [
    {
      id: 'hospitals',
      title: 'Ayurvedic Hospitals & Inpatient Sanctuaries',
      subtitle: 'High-Volume Classical Oils & Inpatient Formulations',
      description: 'Turnkey supply of 25L drums of Mahanarayan, Ksheerabala, and Dhanwantharam tailas, bulk organic single-herb churnas, and clinical Swedana herbal decoction packets.',
      benefits: ['Consolidated institutional billing & 30-day PO terms', 'Batch quality test certificates with every dispatch', 'Customized drum volume sizing (5L, 10L, 25L)'],
      image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'clinics',
      title: 'Panchkarma Centers & Daycare Clinics',
      subtitle: 'Authentic Therapy Hardware & Monthly Oil Replenishment',
      description: 'Equipping outpatient Panchkarma clinics with authentic heavy brass Shirodhara vessels, bronze Kansa wands, and reliable monthly subscriptions for Abhyanga tailas.',
      benefits: ['Direct wholesale margins up to 32%', 'Fast Pan-India dispatch within 48 business hours', 'Low minimum order quantities on apparatus'],
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'resorts',
      title: 'Luxury Wellness Spas & Eco-Resorts',
      subtitle: 'Sensory Botanical Massage & Beauty Elixirs',
      description: 'Supplying five-star wellness destinations with fragrant Kumkumadi Saffron beauty elixirs, soothing botanical massage blends, and bespoke guest ritual amenities.',
      benefits: ['Private label and co-branding formulation options', 'Complimentary master therapist training materials', 'Dedicated wellness account manager'],
      image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'distributors',
      title: 'Regional Herbal Distributors & Retail Pharmacies',
      subtitle: 'High-Margin Wholesale Supply Channel',
      description: 'Partner with Yugan Ayurved to distribute classical GMP-certified herbal medicines and wellness products in your designated regional territory.',
      benefits: ['Maximum wholesale margin tiers (up to 38%)', 'Marketing collaterals and demonstration sets provided', 'Protected regional distribution territories'],
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-poppins">
      <AnnouncementBar mode="B2B" />
      <Navbar mode="B2B" />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>Ayurvedic Healthcare Sectors</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-charcoal font-poppins leading-tight">
            Tailored Ayurvedic Supply Solutions for Every Sector
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
            Discover how Yugan Ayurved optimizes clinic procurement cycles, guarantees classical Samhita authenticity, and supports Panchkarma practices across India.
          </p>
        </div>

        <div className="space-y-12">
          {industries.map((ind, idx) => (
            <div
              key={ind.id}
              id={ind.id}
              className={`bg-white rounded-3xl p-6 sm:p-10 border border-cream-300 shadow-soft grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
                idx % 2 === 1 ? 'lg:grid-flow-dense' : ''
              }`}
            >
              <div className={`lg:col-span-6 space-y-4 ${idx % 2 === 1 ? 'lg:col-start-7' : ''}`}>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-md">
                  {ind.subtitle}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-charcoal font-poppins">
                  {ind.title}
                </h2>
                <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
                  {ind.description}
                </p>

                <div className="space-y-2 pt-2">
                  {ind.benefits.map((b, bIdx) => (
                    <div key={bIdx} className="flex items-center gap-2 text-xs font-medium text-charcoal">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <Link href="/b2b/quotes">
                    <Button variant="primary" size="md" icon={FileSpreadsheet}>
                      Request Wholesale Quote for {ind.title.split(' ')[0]}
                    </Button>
                  </Link>
                </div>
              </div>

              <div className={`lg:col-span-6 ${idx % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden shadow-card border border-cream-300">
                  <Image src={ind.image} alt={ind.title} fill className="object-cover" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer mode="B2B" />
    </div>
  );
}
