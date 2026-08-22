'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import B2BProductCard from '@/components/products/B2BProductCard';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { Search, Building2, Layers, FileSpreadsheet } from 'lucide-react';
import Link from 'next/link';

function B2BProductsContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || '';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    if (initialQuery) setSearch(initialQuery);
    if (initialCategory) setCategory(initialCategory);
  }, [initialQuery, initialCategory]);

  useEffect(() => {
    async function load() {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch('/api/products?mode=b2b'),
          fetch('/api/categories'),
        ]);
        const prodData = await prodRes.json();
        const catData = await catRes.json();
        if (prodData.success) setProducts(prodData.products);
        if (catData.success) setCategories(catData.categories);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = products.filter((p) => {
    const matchCat = !category || p.category?.slug === category;
    const matchSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Header with RFQ Tray Quick Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-cream-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>Direct Wholesale Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-charcoal font-poppins">
            B2B Wholesale Formulations & Tiered Supply
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-1 font-light">
            Select bulk quantities to unlock institutional volume pricing, or add items directly to your RFQ quote tray.
          </p>
        </div>

        <Link href="/b2b/quotes" className="shrink-0">
          <button className="px-5 py-2.5 rounded-xl bg-forest hover:bg-forest-dark text-white text-xs font-bold transition-all shadow-soft flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4" /> Open RFQ Builder
          </button>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-cream-300 shadow-soft grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        <div className="sm:col-span-6">
          <Input
            placeholder="Search by formulation name, SKU, or category..."
            icon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="sm:col-span-3">
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="All Wholesale Categories"
            options={categories.map((c) => ({ value: c.slug, label: c.name }))}
          />
        </div>

        <div className="sm:col-span-3">
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            options={[
              { value: 'featured', label: 'Sort by: Volume Tier Priority' },
              { value: 'stock', label: 'Highest In-Stock' },
              { value: 'sku', label: 'Sort by SKU' },
            ]}
          />
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-80 bg-cream-200/60 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-white rounded-3xl border border-cream-200">
          <h3 className="text-lg font-bold text-charcoal">No wholesale products found</h3>
          <p className="text-xs text-charcoal-muted">Try adjusting your search query or selected category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((prod) => (
            <B2BProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}
    </main>
  );
}

export default function B2BProductsCatalogPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-poppins text-charcoal">
      <AnnouncementBar mode="B2B" />
      <Navbar mode="B2B" />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center p-12"><div className="w-8 h-8 border-4 border-forest border-t-transparent rounded-full animate-spin" /></div>}>
        <B2BProductsContent />
      </Suspense>
      <Footer mode="B2B" />
    </div>
  );
}
