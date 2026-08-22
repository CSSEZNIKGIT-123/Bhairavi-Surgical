'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import B2CProductCard from '@/components/products/B2CProductCard';
import ProductQuickView from '@/components/products/ProductQuickView';
import { Search } from 'lucide-react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

function B2CShopContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || '';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [search, setSearch] = useState(initialQuery);
  const [sortBy, setSortBy] = useState('featured');
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    if (initialQuery) setSearch(initialQuery);
    if (initialCategory) setSelectedCategory(initialCategory);
  }, [initialQuery, initialCategory]);

  useEffect(() => {
    async function load() {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch('/api/products?mode=b2c'),
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

  // Filtered & sorted products
  const filteredProducts = products.filter((p) => {
    const pCat = p.categorySlug || p.category?.slug || '';
    const pTitle = p.name || p.title || '';
    const pDesc = p.shortDescription || p.description || '';
    const pSku = p.sku || '';

    const matchesCat = !selectedCategory || pCat.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      !search ||
      pTitle.toLowerCase().includes(search.toLowerCase()) ||
      pSku.toLowerCase().includes(search.toLowerCase()) ||
      pDesc.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return (a.salePrice || a.retailPrice) - (b.salePrice || b.retailPrice);
    if (sortBy === 'price-high') return (b.salePrice || b.retailPrice) - (a.salePrice || a.retailPrice);
    if (sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
    return 0;
  });

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-charcoal font-poppins">
          Classical Ayurvedic Formulations & Panchkarma Catalog
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-muted mt-1 font-light">
          Browse authentic classical medicated oils, wildcrafted churnas, and traditional therapy apparatus.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-cream-300 shadow-soft mb-8 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        <div className="sm:col-span-5">
          <Input
            placeholder="Search classical oils, churnas, Kansa tools, SKU..."
            icon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="sm:col-span-4">
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            placeholder="All Categories"
            options={categories.map((c) => ({ value: c.slug, label: c.name }))}
          />
        </div>

        <div className="sm:col-span-3">
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            options={[
              { value: 'featured', label: 'Sort by: Featured' },
              { value: 'price-low', label: 'Price: Low to High' },
              { value: 'price-high', label: 'Price: High to Low' },
              { value: 'rating', label: 'Highest Rated' },
            ]}
          />
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 min-[440px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-80 bg-cream-200/60 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-white rounded-3xl border border-cream-200">
          <h3 className="text-lg font-bold text-charcoal">No formulations match your filter</h3>
          <p className="text-xs text-charcoal-muted max-w-sm mx-auto font-light">
            Try resetting your search query or selecting a different category.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('');
            }}
            className="text-xs font-bold text-forest underline"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 min-[440px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {sortedProducts.map((product) => (
            <B2CProductCard
              key={product.id}
              product={product}
              onQuickView={setQuickViewProduct}
            />
          ))}
        </div>
      )}

      {quickViewProduct && (
        <ProductQuickView
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </main>
  );
}

export default function B2CShopPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-poppins text-charcoal">
      <AnnouncementBar mode="B2C" />
      <Navbar mode="B2C" />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center p-12"><div className="w-8 h-8 border-4 border-forest border-t-transparent rounded-full animate-spin" /></div>}>
        <B2CShopContent />
      </Suspense>
      <Footer mode="B2C" />
    </div>
  );
}
