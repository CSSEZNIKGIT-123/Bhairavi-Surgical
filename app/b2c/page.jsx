'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import B2CHero from '@/components/hero/B2CHero';
import B2CProductCard from '@/components/products/B2CProductCard';
import ProductQuickView from '@/components/products/ProductQuickView';
import {
  Sparkles,
  ShieldCheck,
  Award,
  Leaf,
  HeartHandshake,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Star,
  BookOpen,
} from 'lucide-react';
import Button from '@/components/ui/Button';

export default function B2CHomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch('/api/products?mode=b2c'),
          fetch('/api/categories'),
        ]);
        const prodData = await prodRes.json();
        const catData = await catRes.json();

        if (prodData.success) setProducts(prodData.products);
        if (catData.success) setCategories(catData.categories);
      } catch (err) {
        console.error('Failed to load B2C data', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Circular categories matching reference design ("Shop by Herbal Tradition / Remedy")
  const circularCategories = [
    {
      name: 'Medicated Oils',
      subtitle: 'Abhyanga & therapy',
      image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=300&q=80',
      href: '/b2c/shop?category=herbal-oils',
    },
    {
      name: 'Herbal Churnas',
      subtitle: 'Wildcrafted powders',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80',
      href: '/b2c/shop?category=herbal-powders',
    },
    {
      name: 'Panchkarma Tools',
      subtitle: 'Kansa bowls & wands',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=300&q=80',
      href: '/b2c/shop?category=panchkarma-essentials',
    },
    {
      name: 'Saffron Elixirs',
      subtitle: 'Kumkumadi radiant oil',
      image: 'https://images.unsplash.com/photo-1512290900672-1f486431e784?auto=format&fit=crop&w=300&q=80',
      href: '/b2c/shop?category=wellness-essentials',
    },
    {
      name: 'Shirodhara Gear',
      subtitle: 'Hand-hammered brass',
      image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=300&q=80',
      href: '/b2c/shop?category=shirodhara-suites',
    },
    {
      name: 'Classical Ghee',
      subtitle: 'Herbal A2 preparations',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80',
      href: '/b2c/shop?category=ghrits-asavas',
    },
    {
      name: 'Daily Rituals',
      subtitle: 'Dinacharya wellness',
      image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=300&q=80',
      href: '/b2c/shop?category=wellness-essentials',
    },
  ];

  // 6 feature pillars (Reference design: "Why Choose Yugan Ayurved")
  const featurePillars = [
    {
      icon: Leaf,
      title: '100% Classical Samhita Recipes',
      desc: 'Formulated strictly according to Charaka Samhita, Bhaishajya Ratnavali, and Sahasrayogam.',
    },
    {
      icon: ShieldCheck,
      title: 'Slow 72-Hour Taila Paka',
      desc: 'Simmered gently in traditional brass vessels to maximize herbal phytonutrient extraction.',
    },
    {
      icon: Award,
      title: 'Heavy Metal Tested & Pure',
      desc: 'Every batch is third-party lab tested with NABL certification to ensure zero contaminants.',
    },
    {
      icon: Sparkles,
      title: 'Wildcrafted Botanical Sourcing',
      desc: 'Herbs harvested ethically from organic Himalayan and Western Ghats conservation sanctuaries.',
    },
    {
      icon: HeartHandshake,
      title: 'Panchkarma Center Approved',
      desc: 'Trusted and utilized daily by 450+ certified Ayurvedic hospitals and wellness sanctuaries.',
    },
    {
      icon: ShieldCheck,
      title: 'Solvent & Paraben Free',
      desc: 'Zero artificial fragrances, synthetic preservatives, or petroleum derivatives.',
    },
  ];

  // Room / Wellness Ritual Inspiration
  const roomInspirations = [
    {
      title: 'Classical Shirodhara Suite',
      image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=500&q=80',
    },
    {
      title: 'Abhyanga Herbal Body Massage',
      image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=500&q=80',
    },
    {
      title: 'Kansa Padabhyanga Foot Care',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=500&q=80',
    },
    {
      title: 'Traditional Swedana Steam Therapy',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80',
    },
    {
      title: 'Daily Dinacharya Home Rituals',
      image: 'https://images.unsplash.com/photo-1512290900672-1f486431e784?auto=format&fit=crop&w=500&q=80',
    },
  ];

  // Testimonials
  const testimonials = [
    {
      quote:
        '“The Mahanarayan and Ksheerabala 101 oils from Yugan Ayurved have outstanding potency, aroma, and therapeutic texture. Our Panchkarma patients constantly compliment their soothing warmth.”',
      author: 'Dr. Vaidya Meera Nair, BAMS, MD (Ayu)',
      image: 'https://images.unsplash.com/photo-1594824813689-f53835fae16c?auto=format&fit=crop&w=200&q=80',
    },
    {
      quote:
        '“Finding genuine heavy-metal-tested Triphala and Dashamula churna with fine mesh consistency was hard until we partnered with Yugan. Their quality standards are unmatched.”',
      author: 'Dr. Alok Joshi, Director, Veda Health Sanctuary',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80',
    },
    {
      quote:
        '“The Kumkumadi Saffron tailam and Kansa bronze bowl have become my essential evening self-care ritual. Pure, calming, and visibly nourishing.”',
      author: 'Sunita Raman, Holistic Wellness Practitioner',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80',
    },
  ];

  // Ayurvedic Wisdom & Guides
  const blogGuides = [
    {
      tag: 'DAILY RITUAL',
      title: 'The Art of Dinacharya: Morning Ayurvedic Abhyanga',
      desc: 'Step-by-step classical guidelines for warm oil self-massage to ground Vata and rejuvenate vitality.',
      image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=400&q=80',
    },
    {
      tag: 'PANCHKARMA GUIDE',
      title: 'Shirodhara Protocols: Optimizing Oil Temperature & Flow',
      desc: 'Understanding the therapeutic dynamics of continuous medicated oil streams on the Ajna chakra.',
      image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=400&q=80',
    },
    {
      tag: 'HERBAL WISDOM',
      title: 'Triphala: The Classical Tridoshic Cleanser',
      desc: 'Exploring the synergistic balancing benefits of Amalaki, Bibhitaki, and Haritaki in daily wellness.',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
    },
    {
      tag: 'CRAFT & METALLURGY',
      title: 'The Healing Properties of Kansa Bronze Alloy',
      desc: 'Why 79:21 copper-tin bronze is traditionally celebrated for drawing out excess Pitta heat.',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-poppins">
      <AnnouncementBar mode="B2C" />
      <Navbar mode="B2C" />

      {/* 1. Full-Width B2C Video Hero */}
      <B2CHero />

      <main className="flex-1 w-full space-y-16 sm:space-y-24 py-12 sm:py-16">
        
        {/* 2. Circular Category Carousel ("Shop by Herbal Tradition") */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-charcoal font-poppins">
                Explore by Ayurvedic Tradition
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-muted mt-0.5">
                Classical medicated oils, wildcrafted churnas, and Panchkarma therapy tools
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="w-9 h-9 rounded-full border border-cream-300 bg-white flex items-center justify-center text-charcoal hover:bg-forest hover:text-white transition-colors"
                aria-label="Previous categories"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="w-9 h-9 rounded-full border border-cream-300 bg-white flex items-center justify-center text-charcoal hover:bg-forest hover:text-white transition-colors"
                aria-label="Next categories"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 sm:gap-6 text-center">
            {circularCategories.map((cat, idx) => (
              <Link
                key={idx}
                href={cat.href}
                className="group flex flex-col items-center space-y-2.5 transition-transform hover:-translate-y-1"
              >
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-cream-300 group-hover:border-forest shadow-soft transition-all duration-300 bg-[#F4EFE6]">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="120px"
                  />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-charcoal group-hover:text-forest transition-colors leading-tight">
                    {cat.name}
                  </h4>
                  <span className="text-[10px] text-charcoal-muted block mt-0.5">
                    {cat.subtitle}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 3. Featured Products Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8 pb-4 border-b border-cream-200">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-charcoal font-poppins">
                Featured Classical Formulations
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
                Authentic medicated tailas, organic single herbs & Panchkarma essentials
              </p>
            </div>
            <Link
              href="/b2c/shop"
              className="text-xs sm:text-sm font-bold text-forest hover:text-forest-dark flex items-center gap-1 group"
            >
              <span>View all formulations</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 min-[440px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-80 bg-cream-200/60 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 min-[440px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.slice(0, 8).map((prod) => (
                <B2CProductCard
                  key={prod.id}
                  product={prod}
                  onQuickView={setQuickViewProduct}
                />
              ))}
            </div>
          )}
        </section>

        {/* 4. Feature Highlights Grid */}
        <section className="bg-cream-100/70 border-t border-b border-cream-200 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-charcoal font-poppins">
                Why Vaidyas & Seekers Trust Yugan
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-muted mt-2">
                Uncompromising commitment to classical Vedic texts, 72-hour slow preparation, and certified purity.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featurePillars.map((pillar, idx) => {
                const Icon = pillar.icon;
                return (
                  <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-white/70 border border-cream-200 shadow-soft">
                    <div className="w-11 h-11 rounded-xl bg-forest/10 flex items-center justify-center text-forest shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-charcoal font-poppins">
                        {pillar.title}
                      </h4>
                      <p className="text-xs text-charcoal-muted leading-relaxed">
                        {pillar.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 5. Editorial Banner (Panchkarma Routine Kit) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#EFE8DC] rounded-3xl overflow-hidden border border-cream-300 p-8 sm:p-12 relative shadow-card">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-block bg-white/80 border border-cream-300 px-3 py-1 rounded-full text-xs font-semibold text-forest">
                  Complete Panchkarma Home Sanctuary Kit
                </div>

                <div className="space-y-2">
                  <h3 className="text-3xl sm:text-4xl font-bold text-charcoal font-poppins leading-tight">
                    Traditional Self-Care Rituals for Holistic Balance
                  </h3>
                  <p className="text-sm text-charcoal-muted max-w-lg leading-relaxed">
                    A curated ritual bundle featuring Mahanarayan Taila, pure Kansa massage wand, organic Triphala, and fragrant botanical body ubtan.
                  </p>
                </div>

                <div className="space-y-2.5 text-xs text-charcoal font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-forest text-white flex items-center justify-center text-[10px]">✓</div>
                    <span>Prepared with cold-pressed organic black sesame oil</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-forest text-white flex items-center justify-center text-[10px]">✓</div>
                    <span>Includes genuine 79:21 copper-tin bronze Kansa wand</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-forest text-white flex items-center justify-center text-[10px]">✓</div>
                    <span>Complimentary Dinacharya Abhyanga guidebook included</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link href="/b2c/shop">
                    <Button variant="primary" size="lg">
                      EXPLORE WELLNESS KITS
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 relative">
                <div className="relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden shadow-elevated border border-cream-300">
                  <Image
                    src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80"
                    alt="Panchkarma Wellness Kit"
                    fill
                    className="object-cover"
                  />

                  <div className="absolute top-4 left-4 w-20 h-20 rounded-full bg-white shadow-elevated flex flex-col items-center justify-center border border-cream-200">
                    <span className="text-[9px] uppercase font-bold text-charcoal-muted tracking-wider">FROM</span>
                    <span className="text-base font-bold text-forest leading-none">₹1,850</span>
                    <span className="text-[8px] text-charcoal-light">/set</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 6. Sanctuary Room & Therapy Inspiration */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-charcoal font-poppins">
              Inspiration for Panchkarma & Self-Care Sanctuaries
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
              Explore traditional Ayurvedic therapy setups powered by Yugan products
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {roomInspirations.map((room, idx) => (
              <div key={idx} className="group space-y-2">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-cream-200 shadow-soft border border-cream-300">
                  <Image
                    src={room.image}
                    alt={room.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="250px"
                  />
                </div>
                <h4 className="text-xs font-bold text-charcoal group-hover:text-forest transition-colors leading-snug">
                  {room.title}
                </h4>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Vaidya & Seeker Testimonials */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-cream-200 shadow-soft space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-charcoal leading-relaxed italic">
                    {t.quote}
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-cream-200">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-forest/20 shrink-0">
                    <Image src={t.image} alt={t.author} fill className="object-cover" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-charcoal">{t.author}</h5>
                    <span className="text-[10px] text-emerald-700 font-semibold">Verified Practitioner</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 8. Ayurvedic Wisdom & Care Guides */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8 pb-4 border-b border-cream-200">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-charcoal font-poppins">
                Ayurvedic Wisdom & Clinical Insights
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
                Dinacharya guides, classical Taila Paka methods, and Panchkarma protocols
              </p>
            </div>
            <Link href="/b2c/about" className="text-xs sm:text-sm font-bold text-forest hover:underline">
              View all articles →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {blogGuides.map((guide, idx) => (
              <div
                key={idx}
                className="group bg-white rounded-2xl overflow-hidden border border-cream-200 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full bg-cream-100 overflow-hidden">
                    <Image
                      src={guide.image}
                      alt={guide.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="300px"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="bg-white/90 backdrop-blur-sm text-forest font-bold text-[9px] px-2 py-0.5 rounded-md uppercase tracking-wider">
                        {guide.tag}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-1.5">
                    <h4 className="text-sm font-bold text-charcoal group-hover:text-forest transition-colors font-poppins leading-snug">
                      {guide.title}
                    </h4>
                    <p className="text-xs text-charcoal-muted line-clamp-2">
                      {guide.desc}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <span className="text-xs font-bold text-forest group-hover:underline inline-flex items-center gap-1">
                    Read Wisdom Article →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 9. Terracotta 15% OFF Seasonal Wellness Promotion */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-terracotta rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-elevated">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 mx-auto sm:mx-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold font-poppins">
                  Seasonal Abhyanga Care — 15% OFF Classical Oils!
                </h3>
                <p className="text-xs sm:text-sm text-white/90 mt-0.5">
                  Use coupon code: <span className="font-mono font-bold bg-white/20 px-2 py-0.5 rounded">VEDA15</span> during checkout. Complimentary guide on orders over ₹999.
                </p>
              </div>
            </div>

            <Link href="/b2c/shop" className="shrink-0 w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-white hover:bg-cream-100 text-terracotta font-bold text-xs px-6 py-3 rounded-xl transition-all uppercase tracking-wider shadow-sm">
                EXPLORE AYURVEDIC SHOP
              </button>
            </Link>
          </div>
        </section>

      </main>

      <Footer mode="B2C" />

      {/* Quick View Modal */}
      {quickViewProduct && (
        <ProductQuickView
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
}
