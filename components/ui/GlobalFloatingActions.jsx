'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export default function GlobalFloatingActions() {
  const pathname = usePathname();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Monitor scroll position for Scroll-To-Top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 250);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Determine mode-specific WhatsApp inquiry message & contextual tooltip
  const isB2B = pathname.startsWith('/b2b');
  const isSpecial = pathname.startsWith('/special');

  const getWhatsAppDetails = () => {
    if (isB2B) {
      return {
        message: 'Hello Yugan Ayurved B2B team, I would like to inquire about wholesale bulk supply, hospital procurement, and quotation pricing.',
        label: 'Inquire on WhatsApp',
        tooltip: 'Chat with B2B Wholesale Desk',
        badge: 'Wholesale RFQ',
      };
    }
    if (isSpecial) {
      return {
        message: 'Hello Sovereign Atelier team, I would like to request a private consultation regarding heirloom Teak Dronis, brass Shirodhara suites, and bespoke formulations.',
        label: 'Book Consultation on WhatsApp',
        tooltip: 'Consult with Master Vaidya',
        badge: 'Private Atelier',
      };
    }
    return {
      message: 'Hello Yugan Ayurved, I would like guidance on authentic classical Ayurvedic oils, churnas, and wellness formulations.',
      label: 'Chat on WhatsApp',
      tooltip: 'Ayurvedic Wellness Support',
      badge: 'Online Support',
    };
  };

  const waDetails = getWhatsAppDetails();
  const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(waDetails.message)}`;

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. LEFT SIDE: SCROLL TO TOP FLOATING BUTTON                               */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 15 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed bottom-4 left-3 sm:bottom-8 sm:left-8 z-40"
          >
            <div className="relative group">
              <button
                type="button"
                onClick={scrollToTop}
                aria-label="Scroll to top of page"
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 backdrop-blur-md border border-cream-300 text-charcoal shadow-elevated hover:shadow-card hover:bg-forest hover:text-white hover:border-forest transition-all duration-300 flex items-center justify-center active:scale-95"
              >
                <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
              </button>

              {/* Desktop Hover Tooltip */}
              <span className="hidden sm:inline-block pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-charcoal text-white text-[11px] font-semibold rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-soft font-poppins">
                Scroll to Top
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 2. RIGHT SIDE: PREMIUM CIRCULAR WHATSAPP FLOATING BUTTON                  */}
      {/* ========================================================================= */}
      <div className="fixed bottom-4 right-3 sm:bottom-8 sm:right-8 z-40">
        <div
          className="relative flex items-center justify-center"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Subtle Pulse Ripple Ring Animation Behind Circular Button */}
          <span
            className="absolute -inset-1.5 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none"
            style={{ animationDuration: '3s' }}
          />

          {/* Circular Button */}
          <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Contact us on WhatsApp (${waDetails.tooltip})`}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-elevated hover:shadow-glow transition-colors duration-200 border-2 border-white/30 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
          >
            {/* Official Crisp WhatsApp Brand Logo */}
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7 fill-current shrink-0 drop-shadow-sm"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
          </motion.a>

          {/* Premium Desktop Tooltip (Reveals on Hover / Focus) */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, x: 10, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 10, scale: 0.95 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="hidden sm:flex items-center gap-2 pointer-events-none absolute right-full top-1/2 -translate-y-1/2 mr-3 px-3.5 py-2 bg-[#1B271E] text-white text-xs rounded-2xl whitespace-nowrap shadow-elevated border border-emerald-800/40 font-poppins"
              >
                <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse shrink-0" />
                <span className="font-semibold">{waDetails.tooltip}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
