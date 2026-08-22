'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  SlidersHorizontal,
  Star,
  ArrowRight,
  Sparkles,
  Loader2,
  CheckCircle2,
  Tag,
  Package,
  TrendingUp,
  RotateCcw,
  ChevronDown,
} from 'lucide-react';
import { formatCurrency, safeJsonParse } from '@/lib/utils';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';

export default function GlobalSearchPanel({ isOpen, onClose, mode = 'B2C' }) {
  const router = useRouter();
  const inputRef = useRef(null);

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [results, setResults] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [mobileFiltersExpanded, setMobileFiltersExpanded] = useState(false);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState(''); // '', 'under-500', '500-1000', '1000-2500', '2500-plus'
  const [minRating, setMinRating] = useState(null); // null, 4, 4.5
  const [inStockOnly, setInStockOnly] = useState(false);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Load categories on mount
  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCategories(data.categories);
      })
      .catch(console.error);
  }, []);

  // Debounce search query (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Execute search API request
  const fetchSearchResults = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('mode', mode.toLowerCase());
      params.set('limit', '8');

      if (debouncedQuery.trim()) {
        params.set('q', debouncedQuery.trim());
      }
      if (selectedCategory) {
        params.set('category', selectedCategory);
      }
      if (minRating) {
        params.set('minRating', minRating.toString());
      }
      if (inStockOnly) {
        params.set('inStock', 'true');
      }

      // Price mapping
      if (priceRange === 'under-500') {
        params.set('maxPrice', '500');
      } else if (priceRange === '500-1000') {
        params.set('minPrice', '500');
        params.set('maxPrice', '1000');
      } else if (priceRange === '1000-2500') {
        params.set('minPrice', '1000');
        params.set('maxPrice', '2500');
      } else if (priceRange === '2500-plus') {
        params.set('minPrice', '2500');
      }

      const res = await fetch(`/api/products/search?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setResults(data.products || []);
        setTotalCount(data.totalCount || 0);
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, mode, selectedCategory, priceRange, minRating, inStockOnly]);

  // Trigger search on query or filter changes
  useEffect(() => {
    if (isOpen) {
      fetchSearchResults();
    }
  }, [fetchSearchResults, isOpen]);

  // Handle Enter submission -> navigate to full search page
  const handleFormSubmit = (e) => {
    e.preventDefault();
    navigateToSearchPage();
  };

  const navigateToSearchPage = (customQuery = null) => {
    const q = customQuery !== null ? customQuery : query;
    const basePath = mode === 'B2B' ? '/b2b/products' : mode === 'SPECIAL' ? '/special/collections' : '/b2c/shop';
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    if (selectedCategory) params.set('category', selectedCategory);

    onClose();
    router.push(`${basePath}?${params.toString()}`);
  };

  const clearAllFilters = () => {
    setSelectedCategory('');
    setPriceRange('');
    setMinRating(null);
    setInStockOnly(false);
  };

  const activeFilterCount = [selectedCategory, priceRange, minRating, inStockOnly].filter(Boolean).length;
  const hasActiveFilters = activeFilterCount > 0;

  // Popular search suggestions by mode
  const popularSearches = {
    B2C: ['Mahanarayan Taila', 'Ksheerabala 101', 'Triphala Churna', 'Kansa Bronze Wand', 'Kumkumadi Saffron', 'Shirodhara Pot'],
    B2B: ['Bulk Medicated Oils', '5L Classical Tailas', '25L Bulk Drums', 'Clinical Churna Sacks', 'Brass Shirodhara Apparatus'],
    SPECIAL: ['The Sovereign Sanctuary Suite', 'Burma Teak Droni', '101x Avarti Taila', 'Hand-Hammered Brass Arch', 'Kansa Bronze Suite'],
  };

  const currentPopular = popularSearches[mode] || popularSearches.B2C;

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="absolute top-full left-0 right-0 w-full bg-white border-b border-cream-200 shadow-elevated z-50 max-h-[85vh] sm:max-h-[80vh] overflow-y-auto text-charcoal font-poppins"
    >
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-7 space-y-4 sm:space-y-6">
        
        {/* ========================================================================= */}
        {/* 1. TOP SEARCH BAR INPUT AREA (Responsive Full-Width Form)                 */}
        {/* ========================================================================= */}
        <form onSubmit={handleFormSubmit} className="relative flex items-center gap-2 sm:gap-3">
          <div className="relative flex-1 min-w-0">
            <div className="absolute inset-y-0 left-0 pl-3.5 sm:pl-4 flex items-center pointer-events-none text-forest">
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                mode === 'B2B'
                  ? 'Search bulk classical oils, clinical churnas, drums, or SKU...'
                  : mode === 'SPECIAL'
                  ? 'Search bespoke Burmese teak suites, 101x Avarti elixirs...'
                  : 'Search classical oils (Mahanarayan, Ksheerabala), Triphala, Kansa...'
              }
              className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-3.5 rounded-2xl border border-cream-300 bg-[#FAF8F5] focus:bg-white text-xs sm:text-sm font-poppins text-charcoal placeholder:text-charcoal-muted focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/10 transition-all shadow-inner"
            />

            {/* Clear Query Button */}
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  inputRef.current?.focus();
                }}
                className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-charcoal-muted hover:text-charcoal"
                aria-label="Clear search input"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 p-0.5 rounded-full hover:bg-cream-200 transition-colors" />
              </button>
            )}
          </div>

          {/* Desktop Search Button */}
          <Button
            type="submit"
            variant="primary"
            size="md"
            className="hidden sm:inline-flex shrink-0 font-bold uppercase tracking-wider h-11 px-5"
          >
            Search
          </Button>

          {/* Mobile Filter Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileFiltersExpanded(!mobileFiltersExpanded)}
            className={cn(
              'lg:hidden p-2.5 rounded-2xl border transition-all flex items-center gap-1 text-xs font-bold shrink-0',
              mobileFiltersExpanded || hasActiveFilters
                ? 'bg-forest text-white border-forest shadow-sm'
                : 'bg-cream-100 text-charcoal border-cream-300 hover:bg-cream-200'
            )}
            aria-label="Toggle filters"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
            {hasActiveFilters && (
              <span className="w-4 h-4 rounded-full bg-terracotta text-white text-[10px] flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Close Panel Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-2.5 sm:p-3 rounded-2xl text-charcoal hover:bg-cream-100 hover:text-forest transition-colors shrink-0"
            aria-label="Close search panel"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </form>

        {/* ========================================================================= */}
        {/* 2. ACTIVE FILTER CHIPS (Wrap cleanly on mobile)                           */}
        {/* ========================================================================= */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-1 border-t border-cream-200/60">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-charcoal-muted mr-1">
              Active Filters:
            </span>

            {selectedCategory && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-forest/10 text-forest border border-forest/20">
                <span className="max-w-[120px] sm:max-w-none truncate">{categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}</span>
                <button type="button" onClick={() => setSelectedCategory('')} aria-label="Remove category filter">
                  <X className="w-3.5 h-3.5 hover:text-forest-dark" />
                </button>
              </span>
            )}

            {priceRange && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-forest/10 text-forest border border-forest/20">
                <span>
                  {priceRange === 'under-500'
                    ? 'Under ₹500'
                    : priceRange === '500-1000'
                    ? '₹500 – ₹1k'
                    : priceRange === '1000-2500'
                    ? '₹1k – ₹2.5k'
                    : '₹2,500+'}
                </span>
                <button type="button" onClick={() => setPriceRange('')} aria-label="Remove price filter">
                  <X className="w-3.5 h-3.5 hover:text-forest-dark" />
                </button>
              </span>
            )}

            {minRating && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-forest/10 text-forest border border-forest/20">
                <span>★ {minRating}+</span>
                <button type="button" onClick={() => setMinRating(null)} aria-label="Remove rating filter">
                  <X className="w-3.5 h-3.5 hover:text-forest-dark" />
                </button>
              </span>
            )}

            {inStockOnly && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-forest/10 text-forest border border-forest/20">
                <span>In Stock</span>
                <button type="button" onClick={() => setInStockOnly(false)} aria-label="Remove in-stock filter">
                  <X className="w-3.5 h-3.5 hover:text-forest-dark" />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={clearAllFilters}
              className="text-[11px] sm:text-xs font-bold text-terracotta hover:underline ml-1 sm:ml-2 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Clear All
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. MAIN GRID: FILTERS (3 Cols) + RESULTS (9 Cols)                         */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start pt-1">
          
          {/* LEFT SIDEBAR: FILTERS (Always visible on lg:, Collapsible on mobile/tablet) */}
          <div className={cn(
            'lg:col-span-3 space-y-5 lg:border-r border-cream-200 lg:pr-6',
            mobileFiltersExpanded ? 'block bg-cream-50 p-4 rounded-2xl border border-cream-200 lg:bg-transparent lg:p-0 lg:border-0' : 'hidden lg:block'
          )}>
            
            {/* Category Filter */}
            <div className="space-y-2">
              <span className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-forest block">
                Product Category
              </span>
              <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('')}
                  className={cn(
                    'w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between',
                    !selectedCategory ? 'bg-forest text-white font-bold' : 'text-charcoal hover:bg-cream-100'
                  )}
                >
                  <span>All Categories</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={cn(
                      'w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between',
                      selectedCategory === cat.slug ? 'bg-forest text-white font-bold' : 'text-charcoal hover:bg-cream-100'
                    )}
                  >
                    <span className="truncate">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-2">
              <span className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-forest block">
                Price Range
              </span>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-1">
                {[
                  { id: '', label: 'Any Price' },
                  { id: 'under-500', label: 'Under ₹500' },
                  { id: '500-1000', label: '₹500 – ₹1,000' },
                  { id: '1000-2500', label: '₹1,000 – ₹2,500' },
                  { id: '2500-plus', label: '₹2,500+' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPriceRange(item.id)}
                    className={cn(
                      'text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-all',
                      priceRange === item.id ? 'bg-forest/10 text-forest font-bold border border-forest/20' : 'text-charcoal hover:bg-cream-100'
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating & Availability */}
            <div className="space-y-2">
              <span className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-forest block">
                Rating & Availability
              </span>
              <div className="space-y-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => setMinRating(minRating === 4 ? null : 4)}
                  className={cn(
                    'w-full text-left px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5',
                    minRating === 4 ? 'bg-forest/10 text-forest font-bold border border-forest/20' : 'text-charcoal hover:bg-cream-100'
                  )}
                >
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>4 Stars & Above</span>
                </button>

                <button
                  type="button"
                  onClick={() => setInStockOnly(!inStockOnly)}
                  className={cn(
                    'w-full text-left px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5',
                    inStockOnly ? 'bg-forest/10 text-forest font-bold border border-forest/20' : 'text-charcoal hover:bg-cream-100'
                  )}
                >
                  <CheckCircle2 className={cn('w-3.5 h-3.5', inStockOnly ? 'text-forest' : 'text-charcoal-muted')} />
                  <span>In Stock Only</span>
                </button>
              </div>
            </div>

          </div>

          {/* RIGHT CONTENT: LIVE RESULTS & DISCOVERY */}
          <div className="lg:col-span-9 space-y-4 min-w-0">
            
            {/* Header / Status Line */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-cream-200">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-charcoal">
                  {loading ? (
                    <span className="flex items-center gap-2 text-forest">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Searching products...
                    </span>
                  ) : debouncedQuery ? (
                    <span>
                      Results for <strong className="text-forest">"{debouncedQuery}"</strong> ({totalCount})
                    </span>
                  ) : (
                    <span>Popular Classical Formulations ({totalCount})</span>
                  )}
                </span>
              </div>

              {totalCount > 0 && (
                <button
                  type="button"
                  onClick={() => navigateToSearchPage()}
                  className="text-xs font-bold text-forest hover:text-forest-dark hover:underline flex items-center gap-1 self-start sm:self-auto"
                >
                  <span>View all ({totalCount}) results</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Popular Suggestions Row (When query is empty) */}
            {!debouncedQuery && (
              <div className="flex flex-wrap items-center gap-1.5 py-1">
                <span className="text-[11px] font-semibold text-charcoal-muted flex items-center gap-1 mr-1">
                  <TrendingUp className="w-3 h-3 text-forest shrink-0" /> Popular:
                </span>
                {currentPopular.map((term, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setQuery(term);
                      setDebouncedQuery(term);
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs bg-cream-100 hover:bg-forest/10 hover:text-forest text-charcoal transition-colors border border-cream-200/80 font-medium"
                  >
                    {term}
                  </button>
                ))}
              </div>
            )}

            {/* Results Grid / Empty State (Responsive: 1 col on mobile, 2 cols on tablet, 4 on desktop) */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 py-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-44 bg-[#FAF8F5] rounded-2xl animate-pulse border border-cream-200" />
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {results.map((product) => {
                  const images = safeJsonParse(product.images, ['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=400&q=80']);
                  const productHref =
                    mode === 'B2B'
                      ? `/b2b/products/${product.slug}`
                      : mode === 'SPECIAL'
                      ? `/special/products/${product.slug}`
                      : `/b2c/products/${product.slug}`;

                  const displayPrice =
                    mode === 'B2B'
                      ? product.b2bBasePrice || product.retailPrice
                      : mode === 'SPECIAL'
                      ? product.specialBasePrice || product.retailPrice * 1.5
                      : product.salePrice || product.retailPrice;

                  return (
                    <Link
                      key={product.id}
                      href={productHref}
                      onClick={onClose}
                      className="group bg-[#FAF8F5] hover:bg-white rounded-2xl p-3 border border-cream-200 hover:border-forest/40 transition-all duration-200 shadow-soft hover:shadow-card flex flex-col justify-between"
                    >
                      <div className="space-y-2.5">
                        <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-cream-200">
                          <Image
                            src={images[0]}
                            alt={product.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          />
                          {product.badge && (
                            <div className="absolute top-2 left-2">
                              <span className="bg-forest/90 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm uppercase">
                                {product.badge}
                              </span>
                            </div>
                          )}
                        </div>

                        <div>
                          <span className="text-[10px] text-charcoal-muted uppercase tracking-wider block truncate">
                            {product.category?.name || 'Ayurvedic Formulation'}
                          </span>
                          <h4 className="text-xs font-bold text-charcoal font-poppins group-hover:text-forest transition-colors line-clamp-2 leading-snug">
                            {product.title}
                          </h4>
                        </div>
                      </div>

                      <div className="pt-2 mt-2 border-t border-cream-200/60 flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-forest font-poppins">
                            {formatCurrency(displayPrice)}
                          </span>
                          {mode === 'B2B' && (
                            <span className="text-[9px] text-charcoal-muted block leading-none">Min Qty: {product.moq || 1}</span>
                          )}
                        </div>

                        <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{product.rating ? product.rating.toFixed(1) : '5.0'}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              /* No Results State */
              <div className="py-8 sm:py-12 text-center space-y-3 sm:space-y-4 bg-[#FAF8F5] rounded-3xl border border-cream-200 p-6 sm:p-8">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-cream-200 flex items-center justify-center mx-auto text-charcoal-muted">
                  <Search className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs sm:text-sm font-bold text-charcoal font-poppins">
                    No products found for "{debouncedQuery}"
                  </h4>
                  <p className="text-[11px] sm:text-xs text-charcoal-muted max-w-sm mx-auto font-light">
                    Try searching for classical ingredients like "Mahanarayan", "Ksheerabala", "Triphala", "Brass", or clear your active filters.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-2">
                  <Button type="button" variant="secondary" size="sm" onClick={clearAllFilters}>
                    Clear Filters
                  </Button>
                  <Button type="button" variant="primary" size="sm" onClick={() => navigateToSearchPage('')}>
                    View All Products
                  </Button>
                </div>
              </div>
            )}

            {/* Bottom Footer CTA in Dropdown */}
            {results.length > 0 && (
              <div className="pt-2 sm:pt-3 border-t border-cream-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <span className="text-charcoal-muted text-[11px] sm:text-xs">
                  Showing top {results.length} of {totalCount} matching products
                </span>
                <button
                  type="button"
                  onClick={() => navigateToSearchPage()}
                  className="font-bold text-forest hover:text-forest-dark hover:underline inline-flex items-center gap-1.5 self-start sm:self-auto text-[11px] sm:text-xs"
                >
                  <span>Explore full catalog with these filters</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

          </div>

        </div>

      </div>
    </motion.div>
  );
}
