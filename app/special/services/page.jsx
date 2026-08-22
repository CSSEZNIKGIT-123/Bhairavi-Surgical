'use client';

import React from 'react';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { Crown, Compass, ShieldCheck, Wrench, Sparkles, Building2, Leaf } from 'lucide-react';

export default function SpecialServicesPage() {
  const services = [
    {
      icon: Building2,
      title: 'Ayurvedic Sanctuary Architecture & Vastu Layout',
      desc: 'Complete engineering of therapy suites according to classical Ayurvedic spatial principles, acoustic isolation, and seamless warm-oil drainage conduits.',
    },
    {
      icon: Wrench,
      title: 'Custom Teak Droni Carving & Botanical Resealing',
      desc: 'Single-trunk Burmese teak tables carved to specific clinic dimensions and conditioned with traditional herbal oil sealants for lifelong therapeutic resilience.',
    },
    {
      icon: Sparkles,
      title: 'Hand-Hammered Brass Flow-Valve Calibration',
      desc: 'Precision needle-valve tuning for Shirodhara vessels ensuring a laminar, non-turbulent medicated oil stream on the forehead at 38–40°C.',
    },
    {
      icon: Crown,
      title: 'Private Master Vaidya Formulation Consulting',
      desc: 'Exclusive small-batch creation of 101-times potentiated Avarti tailas and proprietary classical herb blends for luxury wellness sanctuaries.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-charcoal flex flex-col font-poppins selection:bg-gold selection:text-charcoal">
      <AnnouncementBar mode="SPECIAL" />
      <Navbar mode="SPECIAL" />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-semibold text-gold-dark bg-gold/15 px-4 py-1.5 rounded-full border border-gold/30 uppercase tracking-widest">
            The Atelier White-Glove Services
          </span>
          <h1 className="text-3xl sm:text-5xl font-light text-charcoal font-poppins leading-tight">
            Holistic Sanctuary Engineering & Master Craft
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted max-w-xl mx-auto font-light">
            Dedicated architectural and metallurgical services for premier Ayurvedic doctors and wellness destinations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-8 border border-gold/25 hover:border-gold transition-all duration-300 shadow-soft hover:shadow-card space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-gold/15 text-gold-dark flex items-center justify-center border border-gold/30">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-medium text-charcoal font-poppins">
                    {srv.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed font-light">
                    {srv.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-cream-200">
                  <Link href="/special/inquiry">
                    <Button variant="gold" size="sm" icon={Compass} className="font-bold uppercase tracking-wider">
                      Commission Service
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Centered Pre-Footer CTA */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gold/30 shadow-soft text-center max-w-3xl mx-auto flex flex-col items-center justify-center space-y-5">
          <div className="w-12 h-12 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold-dark">
            <Crown className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-normal text-charcoal font-poppins">
              Ready to Discuss Your Sanctuary Requirements?
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-muted max-w-lg mx-auto font-light">
              Connect with our master craft team to design your therapeutic spaces with authentic Vedic proportions.
            </p>
          </div>
          <Link href="/special/inquiry">
            <Button variant="gold" size="md" icon={Compass} className="font-bold uppercase tracking-wider">
              Book Consultation
            </Button>
          </Link>
        </div>
      </main>

      <Footer mode="SPECIAL" />
    </div>
  );
}
