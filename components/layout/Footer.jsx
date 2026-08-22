'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Leaf,
  ShieldCheck,
  Truck,
  Building2,
  Crown,
  Compass,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import CTAGroup from '@/components/ui/CTAGroup';
import { cn } from '@/lib/utils';

export default function Footer({ mode = 'B2C' }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const isSpecial = mode === 'SPECIAL';

  // Mode specific final callout content
  const ctaContent = {
    B2C: {
      eyebrow: 'DAILY VEDIC WELLNESS',
      heading: 'Explore Yugan Ayurvedic Wellness',
      description:
        'Discover authentic classical medicated oils, wildcrafted churnas, and traditional self-care rituals crafted according to revered Vedic Samhita principles.',
      primaryBtn: 'Shop Collection',
      primaryHref: '/b2c/shop',
      primaryVariant: 'primary',
      primaryIcon: ArrowRight,
      secondaryBtn: 'Our Heritage Story',
      secondaryHref: '/b2c/about',
    },
    B2B: {
      eyebrow: 'CLINICAL WHOLESALE SUPPLY',
      heading: 'Looking for Ayurvedic & Panchkarma products in bulk?',
      description:
        'Partner with Yugan Ayurved for direct factory volume-tiered pricing, bulk drum supply (5L to 25L), certified batch test reports, and 18% GST input credit.',
      primaryBtn: 'Request a Quote',
      primaryHref: '/b2b/quotes',
      primaryVariant: 'primary',
      primaryIcon: ArrowRight,
      secondaryBtn: 'Explore B2B Products',
      secondaryHref: '/b2b/products',
    },
    SPECIAL: {
      eyebrow: 'READY TO DISCUSS YOUR REQUIREMENTS?',
      heading: 'Explore a More Personalized Ayurvedic & Wellness Experience',
      description:
        'Connect directly with our Master Vaidya and master craftsmen to commission turnkey Panchkarma sanctuary outfitting, custom teak tables, and personalized brassware.',
      primaryBtn: 'Book Consultation',
      primaryHref: '/special/inquiry',
      primaryVariant: 'gold',
      primaryIcon: Compass,
      secondaryBtn: 'Explore Signature Collection',
      secondaryHref: '/special/collections',
    },
  };

  const currentCTA = ctaContent[mode] || ctaContent.B2C;

  return (
    <footer className="w-full font-poppins select-none">
      
      {/* 1. TOP CTA SECTION — Mode-Specific Centered Callout */}
      <section className="bg-white text-charcoal border-t border-cream-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center justify-center space-y-5">
            
            <div className={cn(
              'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider',
              isSpecial ? 'bg-gold/15 text-gold-dark border border-gold/30' : 'bg-forest/10 text-forest'
            )}>
              {isSpecial ? <Crown className="w-3.5 h-3.5" /> : <Leaf className="w-3.5 h-3.5" />}
              <span>{currentCTA.eyebrow}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-normal text-charcoal font-poppins leading-tight">
              {currentCTA.heading}
            </h2>

            <p className="text-xs sm:text-sm text-charcoal-muted max-w-xl mx-auto leading-relaxed font-light">
              {currentCTA.description}
            </p>

            <div className="pt-2">
              <CTAGroup className="justify-center">
                <Link href={currentCTA.primaryHref}>
                  <Button
                    variant={currentCTA.primaryVariant}
                    size="lg"
                    icon={currentCTA.primaryIcon}
                    iconPosition="right"
                    className="uppercase tracking-wider font-bold shadow-soft"
                  >
                    {currentCTA.primaryBtn}
                  </Button>
                </Link>
                <Link href={currentCTA.secondaryHref}>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="uppercase tracking-wider border-cream-300 text-charcoal hover:bg-cream-100"
                  >
                    {currentCTA.secondaryBtn}
                  </Button>
                </Link>
              </CTAGroup>
            </div>

          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITION PILLARS BAR */}
      <div className="bg-[#FAF8F5] border-t border-b border-cream-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-charcoal">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-forest/10 flex items-center justify-center text-forest shrink-0">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal">100% Classical</h4>
              <p className="text-[11px] text-charcoal-muted mt-0.5 font-light">Authentic Samhita texts</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-forest/10 flex items-center justify-center text-forest shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal">Heavy Metal Tested</h4>
              <p className="text-[11px] text-charcoal-muted mt-0.5 font-light">NABL certified batches</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-forest/10 flex items-center justify-center text-forest shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal">Pan-India Dispatch</h4>
              <p className="text-[11px] text-charcoal-muted mt-0.5 font-light">Secure clinical packaging</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-forest/10 flex items-center justify-center text-forest shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal">Wholesale & PO Terms</h4>
              <p className="text-[11px] text-charcoal-muted mt-0.5 font-light">GST 18% billing credit</p>
            </div>
          </div>

        </div>
      </div>

      {/* 3. MAIN DEEP FOREST MULTI-COLUMN FOOTER */}
      <div className="bg-[#142217] text-cream-100 pt-16 pb-12 px-4 sm:px-6 lg:px-8 border-t border-forest-light/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Brand Col (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-forest-light/30 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0">
                <Leaf className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white font-poppins">Yugan Ayurved</span>
                <p className="text-[9px] text-emerald-300/90 tracking-widest uppercase">PANCHKARMA & WELLNESS PRODUCTS</p>
              </div>
            </div>

            <p className="text-xs text-cream-200/80 leading-relaxed font-light">
              "Rooted in Ayurvedic tradition, crafted for modern wellness." We formulate classical medicated oils, wildcrafted churnas, and hand-forged Panchkarma apparatus for homes, clinics, and sanctuaries.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 block">
                Ayurvedic Formulations & Insights
              </span>
              {subscribed ? (
                <div className="flex items-center gap-2 text-xs text-emerald-300 font-semibold">
                  <CheckCircle2 className="w-4 h-4" /> Subscribed successfully to Vedic insights!
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter professional or clinic email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/10 border border-white/20 px-3.5 py-2.5 rounded-xl text-xs text-white placeholder:text-cream-200/50 focus:outline-none focus:border-emerald-400 flex-1 font-poppins"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center"
                    aria-label="Subscribe to newsletter"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Quick Links Column (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-300 block">
              B2C Retail
            </span>
            <ul className="space-y-2 text-xs text-cream-200/80">
              <li>
                <Link href="/b2c/shop" className="hover:text-white transition-colors">Classical Tailas</Link>
              </li>
              <li>
                <Link href="/b2c/shop?category=herbal-powders" className="hover:text-white transition-colors">Organic Churnas</Link>
              </li>
              <li>
                <Link href="/b2c/shop?category=panchkarma-essentials" className="hover:text-white transition-colors">Kansa Bronze Wands</Link>
              </li>
              <li>
                <Link href="/b2c/offers" className="hover:text-white transition-colors">Seasonal Wellness Offers</Link>
              </li>
              <li>
                <Link href="/b2c/about" className="hover:text-white transition-colors">72-Hour Taila Paka</Link>
              </li>
            </ul>
          </div>

          {/* B2B Procurement Column (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-300 block">
              B2B Wholesale
            </span>
            <ul className="space-y-2 text-xs text-cream-200/80">
              <li>
                <Link href="/b2b/quotes" className="hover:text-white transition-colors">Request a Quote (RFQ)</Link>
              </li>
              <li>
                <Link href="/b2b/products?filter=bulk" className="hover:text-white transition-colors">Bulk Drums (5L–25L)</Link>
              </li>
              <li>
                <Link href="/b2b/industries" className="hover:text-white transition-colors">Hospital IPD Supply</Link>
              </li>
              <li>
                <Link href="/b2b/solutions" className="hover:text-white transition-colors">Distributorship Terms</Link>
              </li>
              <li>
                <Link href="/account/login" className="hover:text-white transition-colors">Institutional Account</Link>
              </li>
            </ul>
          </div>

          {/* SPECIAL Atelier Column (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-300 block">
              Atelier Suites
            </span>
            <ul className="space-y-2 text-xs text-cream-200/80">
              <li>
                <Link href="/special/collections" className="hover:text-white transition-colors">Sovereign Suites</Link>
              </li>
              <li>
                <Link href="/special/bespoke" className="hover:text-white transition-colors">Teak Droni Configurator</Link>
              </li>
              <li>
                <Link href="/special/inquiry" className="hover:text-white transition-colors">Book Consultation</Link>
              </li>
              <li>
                <Link href="/special/services" className="hover:text-white transition-colors">White-Glove Setup</Link>
              </li>
              <li>
                <Link href="/special/story" className="hover:text-white transition-colors">Vedic Metallurgy</Link>
              </li>
            </ul>
          </div>

          {/* Contact Col (2 cols) */}
          <div className="lg:col-span-2 space-y-3 text-xs text-cream-200/80">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-300 block">
              Ayurvedic Desk
            </span>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Ayurvedic Pharmacy & Foundry, Kerala / Gujarat, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>contact@yuganayurved.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Mon–Sat: 9:00 AM – 7:00 PM</span>
              </div>
            </div>
          </div>

        </div>

        {/* 4. BOTTOM COPYRIGHT STRIP */}
        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-forest-light/20 flex flex-col sm:flex-row items-center justify-between text-xs text-cream-200/60 gap-4">
          <p>© {new Date().getFullYear()} Yugan Ayurved & Panchkarma Products. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/b2c/about" className="hover:text-white transition-colors">Quality Standards</Link>
            <Link href="/b2c/about" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/b2b/solutions" className="hover:text-white transition-colors">Terms of Supply</Link>
          </div>
        </div>

      </div>

    </footer>
  );
}
