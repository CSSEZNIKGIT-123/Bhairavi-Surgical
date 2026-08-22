'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ArrowRight, Leaf } from 'lucide-react';

export default function B2CCategoriesPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCategories(data.categories);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-poppins">
      <AnnouncementBar mode="B2C" />
      <Navbar mode="B2C" />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-10">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-cream-200 px-3 py-1 rounded-full text-xs font-semibold text-forest mb-2">
            <Leaf className="w-3.5 h-3.5 text-forest" />
            <span>Classical Ayurvedic Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-charcoal font-poppins">
            Ayurvedic & Panchkarma Categories
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
            Explore authentic medicated oils, wildcrafted churnas, and traditional therapy tools.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/b2c/shop?category=${cat.slug}`}
              className="group bg-white rounded-3xl overflow-hidden border border-cream-300 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-[16/10] w-full bg-cream-100 overflow-hidden">
                <Image
                  src={cat.image || 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80'}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-charcoal group-hover:text-forest transition-colors font-poppins">
                    {cat.name}
                  </h3>
                  {cat.subtitle && (
                    <p className="text-xs font-medium text-emerald-800 italic">
                      {cat.subtitle}
                    </p>
                  )}
                  {cat.description && (
                    <p className="text-xs text-charcoal-muted leading-relaxed line-clamp-2">
                      {cat.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs font-bold text-forest pt-2 border-t border-cream-200">
                  <span>Explore Formulations</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer mode="B2C" />
    </div>
  );
}
