'use client';

import React from 'react';
import Link from 'next/link';
import { Building2, ShoppingBag, Crown, ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ModeSelector() {
  const modes = [
    {
      id: 'b2b',
      title: 'B2B Wholesale & Clinic Supply',
      subtitle: 'Ayurvedic Clinics • Panchkarma Centers • Wellness Spas • Distributors',
      description:
        'Volume-tiered pricing on classical oils & churnas, bulk RFQ quotation tray, 18% GST input credit invoices, dedicated account managers, and Panchkarma apparatus supply.',
      href: '/b2b',
      badge: 'CLINICAL WHOLESALE',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      icon: Building2,
      cardBg: 'bg-white hover:bg-emerald-50/40 border-cream-300 hover:border-emerald-700/50',
      iconBg: 'bg-emerald-900 text-emerald-100',
      features: ['Tiered bulk pricing (5L to 25L drums)', 'Request for Quote (RFQ) Tray', '30-Day PO terms & GST credit invoices'],
    },
    {
      id: 'b2c',
      title: 'B2C Ayurvedic Retail Experience',
      subtitle: 'Individual Consumers • Daily Self-Care • Holistic Living',
      description:
        'Explore authentic classical medicated oils, wildcrafted single-herb churnas, Kumkumadi radiant saffron tailam, and traditional kansa self-care essentials with express home delivery.',
      href: '/b2c',
      badge: 'CONSUMER STOREFRONT',
      badgeColor: 'bg-forest-light/10 text-forest border-forest/20',
      icon: ShoppingBag,
      cardBg: 'bg-white hover:bg-cream-100/60 border-cream-300 hover:border-forest/50',
      iconBg: 'bg-forest text-cream-50',
      features: ['1-Click cart & fast checkout', '100% Authentic classical formulations', 'Free Pan-India shipping over ₹999'],
    },
    {
      id: 'special',
      title: 'SPECIAL Sovereign Atelier',
      subtitle: 'Bespoke Therapy Suites • Carved Teak Dronis • Private Sanctuary Outfitting',
      description:
        'Handcrafted solid Burmese teak therapy Dronis, hand-hammered pure brass Shirodhara vessels, 101-times potentiated rare Avarti tailas, and private sanctuary consultations.',
      href: '/special',
      badge: 'EXCLUSIVE ATELIER',
      badgeColor: 'bg-charcoal text-gold-light border-gold/30',
      icon: Crown,
      cardBg: 'bg-[#181D19] hover:bg-[#202722] border-gold/30 hover:border-gold shadow-md text-cream-100',
      iconBg: 'bg-gradient-to-br from-gold/30 to-gold/10 text-gold-light border border-gold/40',
      features: ['Bespoke carved teak Droni therapy tables', 'Pure brass Shirodhara vessels & stands', 'Private master Vaidya consultation'],
    },
  ];

  return (
    <div className="space-y-6 font-poppins">
      
      {/* Section Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 bg-cream-200 px-3 py-1 rounded-full text-xs font-semibold text-forest mb-2">
          <Leaf className="w-3.5 h-3.5 text-forest" />
          <span>Commerce Ecosystem Selector</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-charcoal tracking-tight">
          Select Your Experience
        </h2>
        <p className="text-sm text-charcoal-muted mt-1 leading-relaxed">
          Choose the specialized Ayurvedic commerce portal tailored for your purchasing requirements.
        </p>
      </div>

      {/* 3 Interactive Cards */}
      <div className="space-y-4">
        {modes.map((m, idx) => {
          const Icon = m.icon;
          const isSpecial = m.id === 'special';

          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <Link
                href={m.href}
                className={`group block p-5 sm:p-6 rounded-2xl border transition-all duration-300 hover:shadow-card ${m.cardBg}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  
                  {/* Icon & Details */}
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${m.iconBg}`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${m.badgeColor}`}>
                          {m.badge}
                        </span>
                        <span className={`text-xs font-medium ${isSpecial ? 'text-cream-200/60' : 'text-charcoal-light'}`}>
                          {m.subtitle}
                        </span>
                      </div>

                      <h3 className={`text-lg sm:text-xl font-bold font-poppins transition-colors ${
                        isSpecial ? 'text-white group-hover:text-gold-light' : 'text-charcoal group-hover:text-forest'
                      }`}>
                        {m.title}
                      </h3>

                      <p className={`text-xs leading-relaxed max-w-xl ${
                        isSpecial ? 'text-cream-200/70' : 'text-charcoal-muted'
                      }`}>
                        {m.description}
                      </p>

                      {/* Feature bullets */}
                      <div className="pt-2 flex flex-wrap gap-x-4 gap-y-1">
                        {m.features.map((feat, fIdx) => (
                          <span
                            key={fIdx}
                            className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                              isSpecial ? 'text-gold-light/90' : 'text-forest'
                            }`}
                          >
                            <CheckCircle2 className="w-3 h-3 shrink-0" />
                            {feat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Arrow CTA */}
                  <div className="sm:self-center shrink-0 flex items-center justify-end">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1.5 ${
                      isSpecial
                        ? 'bg-gold/20 text-gold-light border border-gold/40'
                        : 'bg-cream-200 text-charcoal group-hover:bg-forest group-hover:text-white'
                    }`}>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>

                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
}
