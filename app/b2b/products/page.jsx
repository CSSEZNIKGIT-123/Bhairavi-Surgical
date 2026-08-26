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
          fetch('/api/categories?mode=b2b'),
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
    const pCat = p.categorySlug || p.category?.slug || '';
    const pTitle = p.name || p.title || '';
    const pDesc = p.shortDescription || p.description || '';
    const pSku = p.sku || '';

    const matchCat = !category || pCat.toLowerCase() === category.toLowerCase();
    const matchSearch =
      !search ||
      pTitle.toLowerCase().includes(search.toLowerCase()) ||
      pSku.toLowerCase().includes(search.toLowerCase()) ||
      pDesc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price-low') {
      const priceA = a.b2bBasePrice || a.pricing?.b2b?.price || 0;
      const priceB = b.b2bBasePrice || b.pricing?.b2b?.price || 0;
      return priceA - priceB;
    }
    if (sortBy === 'price-high') {
      const priceA = a.b2bBasePrice || a.pricing?.b2b?.price || 0;
      const priceB = b.b2bBasePrice || b.pricing?.b2b?.price || 0;
      return priceB - priceA;
    }
    if (sortBy === 'name-asc') {
      const nameA = a.name || a.title || '';
      const nameB = b.name || b.title || '';
      return nameA.localeCompare(nameB);
    }
    if (sortBy === 'name-desc') {
      const nameA = a.name || a.title || '';
      const nameB = b.name || b.title || '';
      return nameB.localeCompare(nameA);
    }
    if (sortBy === 'stock') {
      return (b.stock || 0) - (a.stock || 0);
    }
    if (sortBy === 'moq-low') {
      return (a.moq || 1) - (b.moq || 1);
    }
    // Default 'featured'
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  const activeCategoryObj = categories.find((c) => c.slug === category);

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-6">
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
              { value: 'featured', label: 'Sort by: Featured Volume' },
              { value: 'price-low', label: 'Price: Low to High' },
              { value: 'price-high', label: 'Price: High to Low' },
              { value: 'name-asc', label: 'Alphabetical: A to Z' },
              { value: 'name-desc', label: 'Alphabetical: Z to A' },
              { value: 'stock', label: 'Highest In-Stock' },
              { value: 'moq-low', label: 'Lowest MOQ First' },
            ]}
          />
        </div>
      </div>

      {/* Dynamic Product Count & Active Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-sm font-semibold text-charcoal">
            {loading ? (
              'Loading wholesale formulations...'
            ) : (
              <>
                Showing <span className="text-emerald-800 font-bold">{sorted.length}</span>{' '}
                {sorted.length === 1 ? 'Wholesale Formulation' : 'Wholesale Formulations'}
              </>
            )}
          </span>
          {category && (
            <span className="inline-flex items-center gap-1.5 text-xs bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full font-medium border border-emerald-300">
              <span>Category: {activeCategoryObj?.name || category}</span>
              <button
                type="button"
                onClick={() => setCategory('')}
                className="hover:text-terracotta ml-0.5 font-bold text-sm leading-none"
                aria-label="Remove category filter"
              >
                ×
              </button>
            </span>
          )}
          {search && (
            <span className="inline-flex items-center gap-1.5 text-xs bg-cream-200 text-charcoal px-3 py-1 rounded-full font-medium border border-cream-300">
              <span>Search: "{search}"</span>
              <button
                type="button"
                onClick={() => setSearch('')}
                className="hover:text-terracotta ml-0.5 font-bold text-sm leading-none"
                aria-label="Remove search filter"
              >
                ×
              </button>
            </span>
          )}
        </div>

        {(category || search) && (
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setCategory('');
            }}
            className="text-xs font-bold text-emerald-900 hover:text-terracotta hover:underline self-start sm:self-auto transition-colors"
          >
            Reset All Filters
          </button>
        )}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-80 bg-cream-200/60 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-white rounded-3xl border border-cream-200 shadow-soft">
          <h3 className="text-lg font-bold text-charcoal">No wholesale products found</h3>
          <p className="text-xs text-charcoal-muted font-light">Try adjusting your search query or selected category.</p>
          <button
            onClick={() => {
              setSearch('');
              setCategory('');
            }}
            className="text-xs font-bold text-forest hover:text-forest-dark underline pt-1"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sorted.map((prod) => (
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
