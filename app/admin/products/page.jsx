'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import {
  Package,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Sparkles,
  Layers,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  Boxes,
  FileText,
  SlidersHorizontal,
  RefreshCw
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import AdminStatusBadge from '@/components/admin/AdminStatusBadge';
import AdminEmptyState from '@/components/admin/AdminEmptyState';
import AdminTableSkeleton from '@/components/admin/AdminTableSkeleton';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';

const ITEMS_PER_PAGE = 15;

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedMode, setSelectedMode] = useState('ALL'); // ALL, B2B, B2C, SPECIAL
  const [selectedStockStatus, setSelectedStockStatus] = useState('ALL'); // ALL, IN_STOCK, LOW_STOCK, OUT_OF_STOCK
  const [currentPage, setCurrentPage] = useState(1);
  const [notification, setNotification] = useState(null);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    sku: '',
    subtitle: '',
    details: '',
    description: '',
    categoryId: '',
    retailPrice: '',
    salePrice: '',
    b2bBasePrice: '',
    specialBasePrice: '',
    stock: 100,
    moq: 1,
    badge: '',
    imageUrl: '',
    isB2B: true,
    isB2C: true,
    isSpecial: false,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    specifications: '',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        fetch('/api/products?limit=200'),
        fetch('/api/categories'),
      ]);
      const prodData = await prodRes.json();
      const catData = await catRes.json();

      if (prodData.success) {
        setProducts(prodData.products || []);
      }
      if (catData.success) {
        setCategories(catData.categories || []);
      }
    } catch (err) {
      console.error('Error loading products catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered products calculation
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // Search
      const searchMatch =
        !searchTerm ||
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.name?.toLowerCase().includes(searchTerm.toLowerCase());

      // Category
      const categoryMatch =
        selectedCategory === 'ALL' || item.categoryId === selectedCategory;

      // Channel Mode
      let modeMatch = true;
      if (selectedMode === 'B2B') modeMatch = Boolean(item.isB2B);
      if (selectedMode === 'B2C') modeMatch = Boolean(item.isB2C);
      if (selectedMode === 'SPECIAL') modeMatch = Boolean(item.isSpecial);

      // Stock Status
      let stockMatch = true;
      if (selectedStockStatus === 'IN_STOCK') stockMatch = item.stock > 20;
      if (selectedStockStatus === 'LOW_STOCK') stockMatch = item.stock > 0 && item.stock <= 20;
      if (selectedStockStatus === 'OUT_OF_STOCK') stockMatch = item.stock === 0;

      return searchMatch && categoryMatch && modeMatch && stockMatch;
    });
  }, [products, searchTerm, selectedCategory, selectedMode, selectedStockStatus]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const showNotification = (type, text) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 3000);
  };

  // Open Edit Modal with full prefilled values
  const handleOpenEdit = (prod) => {
    let specString = '';
    if (typeof prod.specifications === 'string') {
      try {
        const parsed = JSON.parse(prod.specifications);
        specString = JSON.stringify(parsed, null, 2);
      } catch (e) {
        specString = prod.specifications;
      }
    } else if (typeof prod.specifications === 'object' && prod.specifications !== null) {
      specString = JSON.stringify(prod.specifications, null, 2);
    }

    setFormData({
      id: prod.id,
      title: prod.title || '',
      sku: prod.sku || '',
      subtitle: prod.subtitle || '',
      details: prod.details || '',
      description: prod.description || '',
      categoryId: prod.categoryId || (categories[0]?.id || ''),
      retailPrice: prod.retailPrice?.toString() || '',
      salePrice: prod.salePrice ? prod.salePrice.toString() : '',
      b2bBasePrice: prod.b2bBasePrice ? prod.b2bBasePrice.toString() : '',
      specialBasePrice: prod.specialBasePrice ? prod.specialBasePrice.toString() : '',
      stock: prod.stock ?? 100,
      moq: prod.moq ?? 1,
      badge: prod.badge || '',
      imageUrl: Array.isArray(prod.images) ? prod.images[0] : (prod.images ? JSON.parse(prod.images)[0] : ''),
      isB2B: prod.isB2B ?? true,
      isB2C: prod.isB2C ?? true,
      isSpecial: prod.isSpecial ?? false,
      isFeatured: prod.isFeatured ?? false,
      isBestSeller: prod.isBestSeller ?? false,
      isNewArrival: prod.isNewArrival ?? false,
      specifications: specString,
    });
    setEditingProduct(prod);
  };

  // Open Add Product Modal
  const handleOpenAdd = () => {
    setFormData({
      title: '',
      sku: `BS-${Math.floor(1000 + Math.random() * 9000)}`,
      subtitle: '',
      details: '',
      description: '',
      categoryId: categories[0]?.id || '',
      retailPrice: '',
      salePrice: '',
      b2bBasePrice: '',
      specialBasePrice: '',
      stock: 100,
      moq: 1,
      badge: '',
      imageUrl: '/images/products/placeholder.jpg',
      isB2B: true,
      isB2C: true,
      isSpecial: false,
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: true,
      specifications: '{\n  "Material": "Medical Grade SS-304",\n  "Warranty": "2 Years"\n}',
    });
    setEditingProduct(null);
    setIsAddModalOpen(true);
  };

  // Submit Save or Update
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let parsedSpecs = null;
      if (formData.specifications?.trim()) {
        try {
          parsedSpecs = JSON.parse(formData.specifications);
        } catch (e) {
          parsedSpecs = { notes: formData.specifications };
        }
      }

      const payload = {
        title: formData.title,
        sku: formData.sku,
        subtitle: formData.subtitle,
        details: formData.details,
        description: formData.description,
        categoryId: formData.categoryId,
        retailPrice: parseFloat(formData.retailPrice) || 0,
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
        b2bBasePrice: formData.b2bBasePrice ? parseFloat(formData.b2bBasePrice) : null,
        specialBasePrice: formData.specialBasePrice ? parseFloat(formData.specialBasePrice) : null,
        stock: parseInt(formData.stock, 10) || 0,
        moq: parseInt(formData.moq, 10) || 1,
        badge: formData.badge,
        images: formData.imageUrl ? [formData.imageUrl] : [],
        specifications: parsedSpecs,
        isB2B: formData.isB2B,
        isB2C: formData.isB2C,
        isSpecial: formData.isSpecial,
        isFeatured: formData.isFeatured,
        isBestSeller: formData.isBestSeller,
        isNewArrival: formData.isNewArrival,
      };

      if (editingProduct) {
        // PUT update
        const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update product');

        showNotification('success', `Product "${formData.title}" updated in PostgreSQL!`);
      } else {
        // POST create
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to create product');

        showNotification('success', `Product "${formData.title}" added to catalog!`);
      }

      setEditingProduct(null);
      setIsAddModalOpen(false);
      loadData();
    } catch (err) {
      showNotification('error', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Quick Mode Toggle
  const handleToggleMode = async (prod, modeKey) => {
    try {
      const updatedValue = !prod[modeKey];
      const res = await fetch(`/api/admin/products/${prod.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [modeKey]: updatedValue }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === prod.id ? { ...p, [modeKey]: updatedValue } : p))
        );
        showNotification('success', `Toggled ${modeKey} for "${prod.title}"`);
      }
    } catch (err) {
      showNotification('error', 'Failed to toggle mode');
    }
  };

  // Delete product
  const handleDeleteProduct = async (id) => {
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        showNotification('success', 'Product deleted from database');
        setDeleteConfirmId(null);
      }
    } catch (err) {
      showNotification('error', 'Failed to delete product');
    }
  };

  return (
    <div className="space-y-6 font-poppins text-slate-100">
      
      {/* 1. Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Multi-Mode Catalog Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs font-semibold">
              {products.length} SKUs
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage pricing tiers, inventory levels, clinical specifications, and channel visibility across B2B, B2C, and Special Atelier.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadData}
            title="Refresh Catalog"
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-950 hover:shadow-emerald-900 hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-3.5 rounded-2xl border text-xs flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200 ${
            notification.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-700/80 text-emerald-200'
              : 'bg-rose-950/90 border-rose-700/80 text-rose-200'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span className="font-medium">{notification.text}</span>
        </div>
      )}

      {/* 2. Filter, Search & Stock Status Controls */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-xl shadow-lg space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          
          {/* Search Bar */}
          <div className="lg:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search products by title, SKU, or category..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="lg:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
            >
              <option value="ALL">All Categories ({categories.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Level Dropdown */}
          <div className="lg:col-span-3">
            <select
              value={selectedStockStatus}
              onChange={(e) => {
                setSelectedStockStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
            >
              <option value="ALL">All Stock Levels</option>
              <option value="IN_STOCK">In Stock (&gt; 20 units)</option>
              <option value="LOW_STOCK">Low Stock (&le; 20 units)</option>
              <option value="OUT_OF_STOCK">Out of Stock (0 units)</option>
            </select>
          </div>
        </div>

        {/* Mode Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/60 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              Channel Filter:
            </span>
            {[
              { key: 'ALL', label: 'All Modes' },
              { key: 'B2C', label: 'Retail B2C' },
              { key: 'B2B', label: 'Wholesale B2B' },
              { key: 'SPECIAL', label: 'Special Atelier' },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setSelectedMode(tab.key);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedMode === tab.key
                    ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-950'
                    : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-slate-400 font-medium">
            Showing <span className="text-white font-bold">{paginatedProducts.length}</span> of{' '}
            <span className="text-white font-bold">{filteredProducts.length}</span> matched items
          </div>
        </div>
      </div>

      {/* 3. Catalog Products Table */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl overflow-hidden backdrop-blur-xl shadow-xl">
        {loading ? (
          <div className="p-6">
            <AdminTableSkeleton rows={8} cols={6} />
          </div>
        ) : filteredProducts.length === 0 ? (
          <AdminEmptyState
            icon={Package}
            title="No matching products found"
            description="Try clearing your search query or adjusting your channel/category filters."
            actionLabel="Reset All Filters"
            onAction={() => {
              setSearchTerm('');
              setSelectedCategory('ALL');
              setSelectedMode('ALL');
              setSelectedStockStatus('ALL');
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-slate-400 uppercase tracking-wider text-[10px] bg-slate-950/80 border-b border-slate-800/80">
                <tr>
                  <th className="py-3.5 px-4">Item & SKU</th>
                  <th className="py-3.5 px-3">Category</th>
                  <th className="py-3.5 px-3">Inventory</th>
                  <th className="py-3.5 px-3">Pricing Matrix</th>
                  <th className="py-3.5 px-3 text-center">Storefront Visibility</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-slate-200">
                {paginatedProducts.map((prod) => {
                  let img = '/images/products/placeholder.jpg';
                  if (Array.isArray(prod.images) && prod.images.length > 0) {
                    img = prod.images[0];
                  } else if (typeof prod.images === 'string') {
                    try {
                      const p = JSON.parse(prod.images);
                      if (Array.isArray(p) && p.length > 0) img = p[0];
                    } catch (e) {}
                  }

                  const isLow = prod.stock > 0 && prod.stock <= 20;
                  const isOut = prod.stock === 0;

                  return (
                    <tr
                      key={prod.id}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Product & SKU */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-11 h-11 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shrink-0 group-hover:border-emerald-500/40 transition-colors">
                            <Image
                              src={img}
                              alt={prod.title}
                              fill
                              className="object-cover"
                              sizes="44px"
                            />
                          </div>
                          <div className="min-w-0 max-w-xs">
                            <div className="font-bold text-white group-hover:text-emerald-300 transition-colors truncate">
                              {prod.title}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="font-mono text-[10px] text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                                {prod.sku || 'SKU-N/A'}
                              </span>
                              {prod.badge && (
                                <span className="text-[9px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                  {prod.badge}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-3">
                        <span className="text-[11px] font-medium text-slate-300 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                          {prod.category?.name || 'Ayurvedic Instruments'}
                        </span>
                      </td>

                      {/* Stock Level */}
                      <td className="py-3.5 px-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isOut
                                  ? 'bg-rose-500'
                                  : isLow
                                  ? 'bg-amber-400'
                                  : 'bg-emerald-400'
                              }`}
                            />
                            <span className="font-bold text-white font-mono">
                              {prod.stock} units
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400">
                            MOQ: {prod.moq || 1}
                          </div>
                        </div>
                      </td>

                      {/* Pricing Matrix */}
                      <td className="py-3.5 px-3 font-poppins">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400">Retail:</span>
                            <span className="font-bold text-white">
                              {formatCurrency(prod.retailPrice)}
                            </span>
                            {prod.salePrice && (
                              <span className="text-[10px] text-emerald-400 font-semibold">
                                ({formatCurrency(prod.salePrice)})
                              </span>
                            )}
                          </div>
                          {prod.b2bBasePrice && (
                            <div className="text-[10px] text-blue-400">
                              Wholesale: {formatCurrency(prod.b2bBasePrice)}
                            </div>
                          )}
                          {prod.specialBasePrice && (
                            <div className="text-[10px] text-amber-400">
                              Atelier: {formatCurrency(prod.specialBasePrice)}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Channel Visibility Toggles */}
                      <td className="py-3.5 px-3 text-center">
                        <div className="inline-flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
                          <button
                            type="button"
                            onClick={() => handleToggleMode(prod, 'isB2C')}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                              prod.isB2C
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'text-slate-500 hover:text-slate-300'
                            }`}
                            title="Toggle B2C Retail Visibility"
                          >
                            B2C
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleMode(prod, 'isB2B')}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                              prod.isB2B
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                : 'text-slate-500 hover:text-slate-300'
                            }`}
                            title="Toggle B2B Wholesale Visibility"
                          >
                            B2B
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleMode(prod, 'isSpecial')}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                              prod.isSpecial
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'text-slate-500 hover:text-slate-300'
                            }`}
                            title="Toggle Bespoke Atelier Visibility"
                          >
                            Special
                          </button>
                        </div>
                      </td>

                      {/* Actions Column */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(prod)}
                            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-300 hover:bg-emerald-950/30 transition-all"
                            title="Edit Product Details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(prod.id)}
                            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-rose-500/40 text-slate-300 hover:text-rose-400 hover:bg-rose-950/30 transition-all"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* 4. Pagination Controls */}
        {!loading && filteredProducts.length > 0 && (
          <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="text-slate-400">
              Page <span className="text-white font-bold">{currentPage}</span> of{' '}
              <span className="text-white font-bold">{totalPages}</span> ({filteredProducts.length} items total)
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                let pageNum = i + 1;
                if (totalPages > 5 && currentPage > 3) {
                  pageNum = currentPage - 2 + i;
                  if (pageNum > totalPages) pageNum = totalPages - 4 + i;
                }

                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-xl font-bold text-xs transition-colors ${
                      currentPage === pageNum
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 5. Comprehensive Add / Edit Product Modal */}
      {(editingProduct || isAddModalOpen) && (
        <Modal
          isOpen={Boolean(editingProduct || isAddModalOpen)}
          onClose={() => {
            setEditingProduct(null);
            setIsAddModalOpen(false);
          }}
          title={editingProduct ? `Edit Product: ${editingProduct.title}` : 'Add New Surgical / Ayurvedic Product'}
          subtitle="Update product specifications, multi-tier pricing, inventory levels, and visibility across B2B, B2C, and Special Atelier."
          className="bg-slate-900 border-slate-800 text-slate-100 max-w-3xl"
        >
          <form onSubmit={handleSaveProduct} className="space-y-6 text-xs">
            
            {/* Basic Info */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-800">
                <Package className="w-3.5 h-3.5" />
                <span>1. Core Product Information</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Product Title <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. Copper Shirodhara Pot with Control Valve"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    SKU Code <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-emerald-500"
                    placeholder="BS-SHIR-01"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Tagline / Subtitle
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. Pure Virgin Copper with Flow Control"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Category <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Media & Images */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-800">
                <Layers className="w-3.5 h-3.5" />
                <span>2. Media & Image Asset</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Primary Image URL
                  </label>
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                    placeholder="https://... or /images/products/..."
                  />
                </div>

                <div className="flex flex-col items-center">
                  <div className="relative w-16 h-16 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shadow-md">
                    <Image
                      src={formData.imageUrl || '/images/products/placeholder.jpg'}
                      alt="Preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1">Live Preview</span>
                </div>
              </div>
            </div>

            {/* Multi-Tier Pricing & Inventory */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-800">
                <DollarSign className="w-3.5 h-3.5" />
                <span>3. Multi-Tier Pricing & Inventory</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Retail Price (₹) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.retailPrice}
                    onChange={(e) => setFormData({ ...formData, retailPrice: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Sale Price (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Wholesale B2B (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.b2bBasePrice}
                    onChange={(e) => setFormData({ ...formData, b2bBasePrice: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Special Atelier (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.specialBasePrice}
                    onChange={(e) => setFormData({ ...formData, specialBasePrice: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Minimum Order Qty
                  </label>
                  <input
                    type="number"
                    value={formData.moq}
                    onChange={(e) => setFormData({ ...formData, moq: parseInt(e.target.value, 10) || 1 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Badge / Tag
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. ISO 13485, Best Seller, New"
                  />
                </div>
              </div>
            </div>

            {/* Visibility & Mode Toggles */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-800">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>4. Storefront Channel Visibility</span>
              </h4>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isB2C}
                    onChange={(e) => setFormData({ ...formData, isB2C: e.target.checked })}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                  <span className="text-[11px] text-white font-semibold">B2C Retail</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isB2B}
                    onChange={(e) => setFormData({ ...formData, isB2B: e.target.checked })}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                  <span className="text-[11px] text-white font-semibold">B2B Wholesale</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isSpecial}
                    onChange={(e) => setFormData({ ...formData, isSpecial: e.target.checked })}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                  <span className="text-[11px] text-white font-semibold">Special Atelier</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                  <span className="text-[11px] text-white font-semibold">Featured</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isBestSeller}
                    onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                  <span className="text-[11px] text-white font-semibold">Best Seller</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isNewArrival}
                    onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                  <span className="text-[11px] text-white font-semibold">New Arrival</span>
                </label>
              </div>
            </div>

            {/* Descriptions & Specs */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-800">
                <FileText className="w-3.5 h-3.5" />
                <span>5. Description & Clinical Specifications</span>
              </h4>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Full Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Detailed product information, therapeutic applications, and metallurgical composition..."
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Specifications (JSON or Key-Value)
                </label>
                <textarea
                  rows={3}
                  value={formData.specifications}
                  onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-[11px] focus:outline-none focus:border-emerald-500"
                  placeholder='{\n  "Material": "Medical Grade SS-304",\n  "Capacity": "2.5 Litres"\n}'
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  setIsAddModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold transition-all shadow-lg shadow-emerald-950"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving to Database...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{editingProduct ? 'Update & Save Changes' : 'Publish New Product'}</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </Modal>
      )}

      {/* 6. Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <Modal
          isOpen={Boolean(deleteConfirmId)}
          onClose={() => setDeleteConfirmId(null)}
          title="Confirm Product Deletion"
          subtitle="Are you sure you want to permanently delete this product from the database?"
          className="bg-slate-900 border-slate-800 text-slate-100 max-w-md"
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-400">
              This will remove the product and its associated B2B price tiers from PostgreSQL. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteProduct(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-colors"
              >
                Yes, Delete Product
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}
