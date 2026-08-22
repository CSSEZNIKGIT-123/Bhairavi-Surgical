'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  User,
  ShoppingBag,
  Heart,
  FileText,
  Menu,
  X,
  ChevronDown,
  Building2,
  Crown,
  Compass,
  ArrowRight,
  Leaf,
  Layers,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useQuote } from '@/context/QuoteContext';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import GlobalSearchPanel from '@/components/search/GlobalSearchPanel';
import { cn } from '@/lib/utils';

export default function Navbar({ mode = 'B2C' }) {
  const pathname = usePathname();
  const { openCart, itemCount } = useCart();
  const { openQuote, quoteCount } = useQuote();
  const { isCustomerLoggedIn, user } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileAccordion, setMobileAccordion] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const closeTimeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown and search on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavHover = (idx) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    // Close search panel when opening mega-menu dropdown
    setSearchOpen(false);
    setActiveDropdown(idx);
  };

  const handleNavLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  // Structured Mode-Specific Navigation & Full-Width Pure-White Dropdown Mega Menus
  const navConfig = {
    B2C: [
      { label: 'Home', href: '/b2c' },
      {
        label: 'Shop',
        href: '/b2c/shop',
        hasDropdown: true,
        dropdown: {
          columns: [
            {
              title: 'SHOP',
              items: [
                { name: 'All Products', href: '/b2c/shop', desc: 'Complete Ayurvedic catalogue' },
                { name: 'Best Sellers', href: '/b2c/shop?filter=bestseller', desc: 'Most trusted classical essentials' },
                { name: 'New Arrivals', href: '/b2c/shop?filter=new', desc: 'Latest botanical formulations' },
                { name: 'Featured Products', href: '/b2c/offers', desc: 'Curated wellness selections' },
              ],
            },
            {
              title: 'CATEGORIES',
              items: [
                { name: 'Ayurvedic Oils', href: '/b2c/shop?category=herbal-oils', desc: 'Mahanarayan, Ksheerabala 101' },
                { name: 'Herbal Products', href: '/b2c/shop?category=herbal-powders', desc: 'Organic Triphala & single herbs' },
                { name: 'Panchkarma Products', href: '/b2c/shop?category=panchkarma-essentials', desc: 'Bronze Kansa bowls & wands' },
                { name: 'Wellness Essentials', href: '/b2c/shop?category=wellness-essentials', desc: 'Daily Kumkumadi saffron elixirs' },
              ],
            },
            {
              title: 'DISCOVER',
              items: [
                { name: 'About Yugan', href: '/b2c/about', desc: 'Our legacy of botanical purity' },
                { name: 'Ayurveda', href: '/b2c/about#principles', desc: 'Ancient Samhita science' },
                { name: 'Panchkarma', href: '/b2c/about#rituals', desc: 'Detoxification & healing rituals' },
                { name: 'Our Story', href: '/b2c/about#story', desc: '72-hour slow brass simmering' },
              ],
            },
          ],
          featured: {
            badge: 'CLASSICAL HERO',
            title: 'Mahanarayan & Ksheerabala 101 Taila',
            desc: 'Simmered over 72 continuous hours in brass cauldrons according to classical Sahasrayogam text.',
            image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80',
            href: '/b2c/products/mahanarayan-taila-classical',
            cta: 'View Classical Formulation',
          },
        },
      },
      {
        label: 'Categories',
        href: '/b2c/categories',
        hasDropdown: true,
        dropdown: {
          columns: [
            {
              title: 'AYURVEDIC OILS',
              items: [
                { name: 'Mahanarayan Taila', href: '/b2c/products/mahanarayan-taila-classical', desc: 'Joint & muscle rejuvenation' },
                { name: 'Ksheerabala 101 Taila', href: '/b2c/products/ksheerabala-101-taila-classical', desc: '101x potent neurological care' },
                { name: 'Kumkumadi Saffron Oil', href: '/b2c/products/kumkumadi-saffron-tailam-classical', desc: 'Radiant skin complexion elixir' },
                { name: 'Dashamula Medicated Oil', href: '/b2c/shop?category=herbal-oils', desc: 'Classical Vata-pacifying blend' },
              ],
            },
            {
              title: 'HERBAL POWDERS',
              items: [
                { name: 'Organic Triphala Churna', href: '/b2c/products/organic-triphala-churna-classical', desc: 'Digestive & detoxifying blend' },
                { name: 'Dashamula Churna (Fine)', href: '/b2c/products/dashamula-churna-classical', desc: 'Ten sacred root formulation' },
                { name: 'Ashwagandha Root Powder', href: '/b2c/shop?category=herbal-powders', desc: 'Vitality & stress adaptogen' },
                { name: 'Brahmi Medhya Churna', href: '/b2c/shop?category=herbal-powders', desc: 'Cognitive clarity & focus' },
              ],
            },
            {
              title: 'PANCHKARMA TOOLS',
              items: [
                { name: 'Bronze Kansa Vataki Set', href: '/b2c/products/kansa-vataki-foot-massage-set', desc: '79:21 copper-tin alloy' },
                { name: 'Brass Shirodhara Pot', href: '/b2c/products/hand-hammered-brass-shirodhara-set', desc: 'Precision brass micro-valve' },
                { name: 'Abhyanga Therapy Accessories', href: '/b2c/shop?category=panchkarma-essentials', desc: 'Herbal massage linens & bowls' },
                { name: 'Copper Neti & Tongue Cleaners', href: '/b2c/shop?category=panchkarma-essentials', desc: 'Daily Dinacharya essentials' },
              ],
            },
          ],
          featured: {
            badge: 'THERAPY ESSENTIAL',
            title: 'Kansa Vataki Bronze Therapy Wand',
            desc: 'Handcrafted with traditional 79:21 bell metal alloy for deep relaxing Padabhyanga foot massage.',
            image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
            href: '/b2c/products/kansa-vataki-foot-massage-set',
            cta: 'Explore Kansa Bronze',
          },
        },
      },
      { label: 'Panchkarma', href: '/b2c/shop?category=panchkarma-essentials' },
      { label: 'Ayurveda', href: '/b2c/about' },
      { label: 'Offers', href: '/b2c/offers', highlight: true },
      { label: 'About', href: '/b2c/about' },
    ],
    B2B: [
      { label: 'Home', href: '/b2b' },
      {
        label: 'Products',
        href: '/b2b/products',
        hasDropdown: true,
        dropdown: {
          columns: [
            {
              title: 'PRODUCTS',
              items: [
                { name: 'Ayurvedic Products', href: '/b2b/products', desc: 'Complete wholesale product catalog' },
                { name: 'Panchkarma Products', href: '/b2b/products?category=panchkarma-essentials', desc: 'Clinical therapy equipment & sets' },
                { name: 'Herbal Oils (5L & 25L)', href: '/b2b/products?category=herbal-oils', desc: 'Direct factory drum supply' },
                { name: 'Herbal Powders', href: '/b2b/products?category=herbal-powders', desc: 'Standardized clinical churnas bulk' },
                { name: 'Wellness Products', href: '/b2b/products?category=wellness-essentials', desc: 'Institutional clinic supply' },
              ],
            },
            {
              title: 'BUSINESS SOLUTIONS',
              items: [
                { name: 'Bulk Orders', href: '/b2b/products?filter=bulk', desc: 'Tiered volume pricing up to 38%' },
                { name: 'Wholesale', href: '/b2b/solutions#wholesale', desc: 'Commercial contract supply' },
                { name: 'Distributors', href: '/b2b/industries#distributors', desc: 'Protected regional territory rights' },
                { name: 'Panchkarma Centers', href: '/b2b/industries#clinics', desc: 'Monthly replenishment contracts' },
                { name: 'Institutional Supply', href: '/b2b/industries#hospitals', desc: 'Ayurvedic hospital IPD procurement' },
              ],
            },
            {
              title: 'SUPPORT',
              items: [
                { name: 'Request a Quote', href: '/b2b/quotes', desc: '4-hour stamped PDF RFQ quotation' },
                { name: 'Contact Sales', href: '/b2b/solutions#contact', desc: 'Direct corporate sales desk' },
                { name: 'Business Account', href: '/account/login', desc: 'Manage purchase orders & GST credit' },
                { name: 'Batch Test Reports', href: '/b2b/solutions#quality', desc: 'NABL heavy-metal test certificates' },
              ],
            },
          ],
          featured: {
            badge: 'INSTITUTIONAL RFQ',
            title: 'Bulk 25L Drum Supply & Custom Tenders',
            desc: 'Direct factory procurement for Ayurvedic hospitals with tiered volume discounts up to 38%.',
            image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=600&q=80',
            href: '/b2b/quotes',
            cta: 'Open RFQ Builder',
          },
        },
      },
      { label: 'Sectors', href: '/b2b/industries' },
      { label: 'Solutions', href: '/b2b/solutions' },
      { label: 'Bulk Orders', href: '/b2b/products?filter=bulk' },
    ],
    SPECIAL: [
      { label: 'Home', href: '/special' },
      {
        label: 'Collections',
        href: '/special/collections',
        hasDropdown: true,
        dropdown: {
          columns: [
            {
              title: 'COLLECTIONS',
              items: [
                { name: 'Signature Collection', href: '/special/collections#sanctuary', desc: 'The Sovereign Sanctuary Turnkey Suite' },
                { name: 'Premium Collection', href: '/special/collections#teak', desc: 'Heirloom Burmese Teak Droni Tables' },
                { name: 'Special Editions', href: '/special/collections#shirodhara', desc: 'Hand-Hammered Solid Brass Vessels' },
              ],
            },
            {
              title: 'BESPOKE',
              items: [
                { name: 'Custom Requirements', href: '/special/bespoke', desc: 'Bespoke timber & monogram engraving' },
                { name: 'Wellness Solutions', href: '/special/services#setup', desc: 'Turnkey spa & sanctuary calibration' },
                { name: 'Institutional Solutions', href: '/special/services#commercial', desc: 'Presidential wellness suites' },
              ],
            },
            {
              title: 'DISCOVER',
              items: [
                { name: 'Our Philosophy', href: '/special/story#philosophy', desc: 'Vedic metallurgy & artisan devotion' },
                { name: 'Ayurveda', href: '/special/story#ayurveda', desc: 'Ancient 101x Avarti Taila Paka' },
                { name: 'Panchkarma', href: '/special/story#panchkarma', desc: 'Sacred healing equipment geometry' },
                { name: 'Our Story', href: '/special/story', desc: 'Hereditary temple craftsmanship' },
              ],
            },
          ],
          featured: {
            badge: 'MASTERWORK COMMISSION',
            title: 'The Sovereign Sanctuary Suite',
            desc: 'Single-log carved solid Burmese teak Droni table paired with a hand-hammered brass Shirodhara arch.',
            image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=600&q=80',
            href: '/special/products/sovereign-sanctuary-suite',
            cta: 'View Bespoke Masterwork',
          },
        },
      },
      { label: 'Bespoke Suites', href: '/special/bespoke' },
      { label: 'Services', href: '/special/services' },
      { label: 'Our Story', href: '/special/story' },
    ],
  };

  const currentNav = navConfig[mode] || navConfig.B2C;

  // Refined Light & Warm Ayurvedic Theme Palettes Across All Modes
  const modeThemes = {
    B2C: {
      navBg: isScrolled ? 'bg-white/95 backdrop-blur-md shadow-soft border-b border-cream-200' : 'bg-[#FAF8F5] border-b border-cream-200/80',
      border: 'border-cream-200',
      logoTagline: 'PANCHKARMA & WELLNESS PRODUCTS',
      tagColor: 'text-forest-light',
    },
    B2B: {
      navBg: isScrolled ? 'bg-white/95 backdrop-blur-md shadow-soft border-b border-cream-200' : 'bg-[#FAF8F5] border-b border-cream-200/80',
      border: 'border-cream-200',
      logoTagline: 'CLINICAL WHOLESALE PROCUREMENT',
      tagColor: 'text-emerald-800 font-semibold',
    },
    SPECIAL: {
      navBg: isScrolled ? 'bg-white/95 backdrop-blur-md shadow-soft border-b border-gold/30' : 'bg-[#FAF8F5] border-b border-gold/20',
      border: 'border-gold/30',
      logoTagline: 'THE SOVEREIGN ATELIER • BESPOKE SUITES',
      tagColor: 'text-gold-dark tracking-widest font-semibold',
    },
  };

  const currentTheme = modeThemes[mode] || modeThemes.B2C;
  const isSpecial = mode === 'SPECIAL';

  return (
    <header
      className={cn('sticky top-0 z-40 w-full transition-all duration-300 relative select-none', currentTheme.navBg)}
      onMouseLeave={handleNavLeave}
    >
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        
        {/* 3-ZONE DESKTOP & MOBILE NAVBAR ARCHITECTURE — STRICT SINGLE ROW */}
        <div className="flex items-center justify-between h-16 sm:h-20 flex-nowrap w-full gap-2 sm:gap-4">
          
          {/* ZONE 1 (LEFT): BRAND LOGO */}
          <Link
            href={mode === 'B2B' ? '/b2b' : mode === 'SPECIAL' ? '/special' : '/b2c'}
            className="flex items-center gap-2 sm:gap-3 group shrink min-w-0"
          >
            <div className={cn(
              'w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm shrink-0',
              isSpecial
                ? 'bg-gradient-to-br from-gold to-gold-dark text-slate-950 shadow-glow'
                : mode === 'B2B'
                ? 'bg-emerald-900 text-emerald-100'
                : 'bg-forest text-cream-50'
            )}>
              {isSpecial ? (
                <Crown className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : mode === 'B2B' ? (
                <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Leaf className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1 sm:gap-1.5 leading-none">
                <span className="text-sm sm:text-lg lg:text-xl font-bold tracking-tight font-poppins text-charcoal group-hover:text-forest truncate">
                  Yugan Ayurved
                </span>
                <span className={cn(
                  'text-[8px] sm:text-[9px] font-bold px-1 sm:px-1.5 py-0.5 rounded border uppercase leading-tight shrink-0',
                  isSpecial
                    ? 'bg-gold/20 text-gold-dark border-gold/40'
                    : mode === 'B2B'
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    : 'bg-forest/10 text-forest border-forest/20'
                )}>
                  {mode}
                </span>
              </div>
              <span className={cn('text-[9px] font-medium tracking-wider uppercase hidden sm:block mt-1 leading-none', currentTheme.tagColor)}>
                {currentTheme.logoTagline}
              </span>
            </div>
          </Link>

          {/* ZONE 2 (CENTER): DESKTOP NAVIGATION LINKS (Flexible, Centered, Single Row) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 shrink-0 flex-nowrap whitespace-nowrap">
            {currentNav.map((link, idx) => {
              const hasDropdown = !!link.hasDropdown;
              const isOpen = activeDropdown === idx;

              return (
                <div
                  key={idx}
                  className="relative"
                  onMouseEnter={() => hasDropdown && handleNavHover(idx)}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      'px-2.5 py-2 text-xs xl:text-sm font-medium transition-all flex items-center gap-1 rounded-xl select-none whitespace-nowrap',
                      pathname === link.href || isOpen
                        ? 'text-forest font-semibold bg-forest/5'
                        : 'text-charcoal hover:text-forest hover:bg-cream-100/70',
                      link.highlight && 'text-forest font-bold'
                    )}
                  >
                    <span>{link.label}</span>
                    {hasDropdown && (
                      <ChevronDown
                        className={cn(
                          'w-3.5 h-3.5 transition-transform duration-200 opacity-60 text-charcoal',
                          isOpen && 'rotate-180 opacity-100 text-forest'
                        )}
                      />
                    )}
                  </Link>
                </div>
              );
            })}
          </nav>

          {/* ZONE 3 (RIGHT): UTILITY CONTROLS + CTA (Rebalanced & Clean) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 whitespace-nowrap">
            
            {/* Search Toggle Button with Active State */}
            <button
              type="button"
              onClick={() => {
                const nextState = !searchOpen;
                setSearchOpen(nextState);
                if (nextState) setActiveDropdown(null);
              }}
              className={cn(
                'p-2 sm:p-2.5 rounded-xl transition-all shrink-0 flex items-center justify-center min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px]',
                searchOpen
                  ? 'bg-forest text-white shadow-sm ring-2 ring-forest/20'
                  : 'text-charcoal hover:text-forest hover:bg-black/5'
              )}
              aria-label="Search catalog"
            >
              {searchOpen ? <X className="w-4 h-4 sm:w-4.5 sm:h-4.5" /> : <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />}
            </button>

            {/* Customer Account Button */}
            <Link
              href={isCustomerLoggedIn ? '/account' : '/account/login'}
              className="p-2 sm:p-2.5 rounded-xl text-charcoal hover:text-forest hover:bg-black/5 transition-colors hidden sm:flex items-center gap-1.5 shrink-0"
              aria-label="Account profile"
            >
              <User className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              {isCustomerLoggedIn && (
                <span className="text-xs font-semibold max-w-[80px] truncate hidden md:inline text-charcoal">
                  {user?.name?.split(' ')[0] || 'Account'}
                </span>
              )}
            </Link>

            {/* B2C Wishlist Button */}
            {mode === 'B2C' && (
              <Link
                href="/account/wishlist"
                className="p-2 sm:p-2.5 rounded-xl text-charcoal hover:text-forest hover:bg-black/5 transition-colors relative hidden md:flex shrink-0 items-center justify-center"
                aria-label="Wishlist"
              >
                <Heart className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </Link>
            )}

            {/* B2B Quote Tray Trigger */}
            {mode === 'B2B' && (
              <button
                type="button"
                onClick={openQuote}
                className="relative p-2 sm:p-2.5 rounded-xl text-charcoal hover:text-forest hover:bg-black/5 transition-colors flex items-center gap-1.5 shrink-0 min-w-[36px] min-h-[36px]"
                aria-label="View RFQ Quote Builder"
              >
                <FileText className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-forest" />
                <span className="text-xs font-bold hidden md:inline text-charcoal">RFQ Tray</span>
                {quoteCount > 0 && (
                  <span className="w-4 h-4 sm:w-5 sm:h-5 bg-terracotta text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                    {quoteCount}
                  </span>
                )}
              </button>
            )}

            {/* B2C Cart Drawer Trigger */}
            {mode === 'B2C' && (
              <button
                type="button"
                onClick={openCart}
                className="relative p-2 sm:p-2.5 rounded-xl text-charcoal hover:text-forest hover:bg-black/5 transition-colors shrink-0 flex items-center justify-center min-w-[36px] min-h-[36px]"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-forest text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                    {itemCount}
                  </span>
                )}
              </button>
            )}

            {/* Mode-Specific Primary Navbar CTA Button */}
            {mode === 'B2B' && (
              <Link href="/b2b/quotes" className="hidden lg:inline-flex shrink-0">
                <Button
                  variant="primary"
                  size="nav"
                  icon={ArrowRight}
                  iconPosition="right"
                  className="whitespace-nowrap shrink-0 uppercase tracking-wider font-bold"
                >
                  Request a Quote
                </Button>
              </Link>
            )}

            {mode === 'SPECIAL' && (
              <Link href="/special/inquiry" className="hidden lg:inline-flex shrink-0">
                <Button
                  variant="gold"
                  size="nav"
                  icon={Compass}
                  className="whitespace-nowrap shrink-0 uppercase tracking-wider text-slate-950 font-bold"
                >
                  Book Consultation
                </Button>
              </Link>
            )}

            {/* Mobile/Tablet Menu Button (Visible < 1024px) */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                if (!mobileMenuOpen) setSearchOpen(false);
              }}
              className="p-2 sm:p-2.5 rounded-xl lg:hidden transition-colors shrink-0 flex items-center justify-center text-charcoal hover:bg-black/5 min-w-[36px] min-h-[36px]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* FULL-WIDTH GLOBAL SEARCH PANEL (Attached to Header at top-full)           */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {searchOpen && (
          <GlobalSearchPanel
            isOpen={searchOpen}
            onClose={() => setSearchOpen(false)}
            mode={mode}
          />
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* ARCHITECTURAL FULL-WIDTH PURE-WHITE DROPDOWN LAYER (Anchored to Header)   */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {activeDropdown !== null && !searchOpen && currentNav[activeDropdown]?.hasDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            onMouseEnter={() => {
              if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
            }}
            onMouseLeave={handleNavLeave}
            className="absolute top-full left-0 right-0 w-full bg-white border-b border-cream-200 shadow-elevated z-50 overflow-hidden text-charcoal"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-12 gap-8 items-start">
                
                {/* 3 Structured Link Columns (Span 8 cols) */}
                <div className="col-span-8 grid grid-cols-3 gap-6">
                  {currentNav[activeDropdown].dropdown.columns.map((col, cIdx) => (
                    <div key={cIdx} className="space-y-3">
                      <span className={cn(
                        'text-[10px] font-bold tracking-wider uppercase block pb-1 border-b',
                        isSpecial ? 'text-gold-dark border-gold/20' : 'text-forest border-cream-200'
                      )}>
                        {col.title}
                      </span>
                      <ul className="space-y-1">
                        {col.items.map((item, iIdx) => (
                          <li key={iIdx}>
                            <Link
                              href={item.href}
                              onClick={() => setActiveDropdown(null)}
                              className={cn(
                                'block p-2 rounded-xl transition-all group',
                                isSpecial ? 'hover:bg-gold/10' : 'hover:bg-cream-50'
                              )}
                            >
                              <div className={cn(
                                'text-xs font-bold font-poppins transition-colors leading-snug',
                                isSpecial ? 'text-charcoal group-hover:text-gold-dark' : 'text-charcoal group-hover:text-forest'
                              )}>
                                {item.name}
                              </div>
                              {item.desc && (
                                <p className="text-[11px] text-charcoal-muted leading-tight mt-0.5 line-clamp-1 font-light">
                                  {item.desc}
                                </p>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* 1 Featured Rich Card (Span 4 cols) */}
                {currentNav[activeDropdown].dropdown.featured && (
                  <div className="col-span-4 pl-6 border-l border-cream-200">
                    <div className="rounded-2xl p-4 border border-cream-200 bg-[#FAF8F5] transition-all space-y-3 shadow-soft">
                      <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-cream-200">
                        <Image
                          src={currentNav[activeDropdown].dropdown.featured.image}
                          alt={currentNav[activeDropdown].dropdown.featured.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2.5 left-2.5">
                          <span className={cn(
                            'text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-sm',
                            isSpecial ? 'bg-gold text-slate-950 font-bold' : 'bg-forest text-white'
                          )}>
                            {currentNav[activeDropdown].dropdown.featured.badge}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold font-poppins text-charcoal">
                          {currentNav[activeDropdown].dropdown.featured.title}
                        </h4>
                        <p className="text-[11px] text-charcoal-muted line-clamp-2 mt-0.5 leading-relaxed font-light">
                          {currentNav[activeDropdown].dropdown.featured.desc}
                        </p>
                      </div>

                      <Link
                        href={currentNav[activeDropdown].dropdown.featured.href}
                        onClick={() => setActiveDropdown(null)}
                        className={cn(
                          'text-xs font-bold inline-flex items-center gap-1.5 group pt-1',
                          isSpecial ? 'text-gold-dark hover:text-forest' : 'text-forest hover:text-forest-dark'
                        )}
                      >
                        <span>{currentNav[activeDropdown].dropdown.featured.cta}</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MOBILE / TABLET ACCORDION DRAWER (Visible < 1024px)                       */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden border-b border-cream-200 overflow-hidden shadow-elevated bg-white text-charcoal max-h-[85vh] overflow-y-auto"
          >
            <div className="max-w-7xl mx-auto px-4 py-5 space-y-4">
              
              {/* Mobile Search Quick Trigger */}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSearchOpen(true);
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-cream-100 border border-cream-200 text-charcoal-muted text-xs font-medium"
              >
                <Search className="w-4 h-4 text-forest shrink-0" />
                <span className="truncate text-left">Search classical oils, churnas, tools...</span>
              </button>

              {/* Mobile Accordion Nav Links */}
              <div className="space-y-1 divide-y divide-cream-200/50">
                {currentNav.map((link, idx) => {
                  const hasDropdown = !!link.hasDropdown;
                  const isExpanded = mobileAccordion === idx;

                  return (
                    <div key={idx} className="pt-2">
                      {hasDropdown ? (
                        <div>
                          <button
                            type="button"
                            onClick={() => setMobileAccordion(isExpanded ? null : idx)}
                            className="w-full flex items-center justify-between py-2 text-sm font-bold text-left text-charcoal"
                          >
                            <span>{link.label}</span>
                            <ChevronDown className={cn('w-4 h-4 transition-transform text-charcoal', isExpanded && 'rotate-180')} />
                          </button>

                          {isExpanded && (
                            <div className="pl-3 py-2 space-y-3 text-xs border-l-2 border-forest/30 ml-2">
                              {link.dropdown.columns.map((col, cIdx) => (
                                <div key={cIdx} className="space-y-1">
                                  <div className="text-[10px] font-bold text-forest uppercase tracking-wider">
                                    {col.title}
                                  </div>
                                  {col.items.map((item, iIdx) => (
                                    <Link
                                      key={iIdx}
                                      href={item.href}
                                      onClick={() => setMobileMenuOpen(false)}
                                      className="block py-1 font-medium text-charcoal hover:text-forest"
                                    >
                                      {item.name}
                                    </Link>
                                  ))}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <Link
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block py-2 text-sm font-bold text-charcoal hover:text-forest"
                        >
                          {link.label}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Mobile Bottom CTAs */}
              <div className="pt-3 border-t border-cream-200 space-y-2">
                {mode === 'B2B' ? (
                  <Link href="/b2b/quotes" onClick={() => setMobileMenuOpen(false)} className="block w-full">
                    <Button variant="primary" size="md" fullWidth icon={ArrowRight} iconPosition="right">
                      Request a Quote
                    </Button>
                  </Link>
                ) : mode === 'SPECIAL' ? (
                  <Link href="/special/inquiry" onClick={() => setMobileMenuOpen(false)} className="block w-full">
                    <Button variant="gold" size="md" fullWidth icon={Compass}>
                      Book Consultation
                    </Button>
                  </Link>
                ) : (
                  <Link href="/b2c/shop" onClick={() => setMobileMenuOpen(false)} className="block w-full">
                    <Button variant="primary" size="md" fullWidth icon={ArrowRight} iconPosition="right">
                      Shop Ayurvedic Products
                    </Button>
                  </Link>
                )}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
