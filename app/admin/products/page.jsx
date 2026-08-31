'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Search,
  CheckCircle2,
  AlertCircle,
  ImageIcon,
} from 'lucide-react';
import { formatCurrency, safeJsonParse } from '@/lib/utils';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

export default function AdminProductsPage() {
  const { adminToken } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [modalError, setModalError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);

  // New product form
  const [form, setForm] = useState({
    title: '',
    sku: '',
    subtitle: '',
    description: '',
    stock: 50,
    moq: 1,
    isB2B: true,
    isB2C: true,
    isSpecial: false,
    retailPrice: 2500,
    b2bBasePrice: 1600,
    specialBasePrice: 4000,
    badge: 'NEW ARRIVAL',
    categoryId: '',
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80',
  });

  // Edit product form
  const [editForm, setEditForm] = useState({
    id: '',
    title: '',
    sku: '',
    subtitle: '',
    details: '',
    description: '',
    stock: 50,
    moq: 1,
    isB2B: true,
    isB2C: true,
    isSpecial: false,
    retailPrice: 0,
    salePrice: '',
    b2bBasePrice: '',
    specialBasePrice: '',
    badge: '',
    categoryId: '',
    imageUrl: '',
  });

  const loadData = async () => {
    try {
      const headers = adminToken ? { Authorization: `Bearer ${adminToken}` } : {};
      const [pRes, cRes] = await Promise.all([
        fetch('/api/admin/products', { headers }),
        fetch('/api/categories'),
      ]);
      const pData = await pRes.json();
      const cData = await cRes.json();
      if (pData.success) setProducts(pData.products);
      if (cData.success) setCategories(cData.categories);
    } catch (e) {
      console.error('Error loading admin catalog data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [adminToken]);

  // Quick toggle mode visibility directly in the table
  const handleToggleMode = async (product, modeKey) => {
    const updatedVal = !product[modeKey];
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
      };
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ [modeKey]: updatedVal }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, [modeKey]: updatedVal } : p))
        );
        setNotification({
          type: 'success',
          text: `Updated ${modeKey} visibility for ${product.title}`,
        });
        setTimeout(() => setNotification(null), 2500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setModalError(null);
    setCreating(true);

    try {
      const headers = {
        'Content-Type': 'application/json',
        ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
      };

      const payload = {
        ...form,
        images: form.imageUrl ? [form.imageUrl] : ['https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80'],
      };

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to create product');
      }

      setIsNewModalOpen(false);
      setForm({
        title: '',
        sku: '',
        subtitle: '',
        description: '',
        stock: 50,
        moq: 1,
        isB2B: true,
        isB2C: true,
        isSpecial: false,
        retailPrice: 2500,
        b2bBasePrice: 1600,
        specialBasePrice: 4000,
        badge: 'NEW ARRIVAL',
        categoryId: '',
        imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80',
      });
      loadData();
      setNotification({ type: 'success', text: 'New product added to catalog and PostgreSQL database!' });
      setTimeout(() => setNotification(null), 2500);
    } catch (e) {
      console.error(e);
      setModalError(e.message);
    } finally {
      setCreating(false);
    }
  };

  const openEditModal = (product) => {
    const images = safeJsonParse(product.images, []);
    setEditingProduct(product);
    setEditForm({
      id: product.id,
      title: product.title || '',
      sku: product.sku || '',
      subtitle: product.subtitle || '',
      details: product.details || '',
      description: product.description || '',
      stock: product.stock ?? 50,
      moq: product.moq ?? 1,
      isB2B: Boolean(product.isB2B),
      isB2C: Boolean(product.isB2C),
      isSpecial: Boolean(product.isSpecial),
      retailPrice: product.retailPrice ?? 0,
      salePrice: product.salePrice ?? '',
      b2bBasePrice: product.b2bBasePrice ?? '',
      specialBasePrice: product.specialBasePrice ?? '',
      badge: product.badge || '',
      categoryId: product.categoryId || '',
      imageUrl: images[0] || product.thumbnail || '',
    });
    setModalError(null);
    setIsEditModalOpen(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setModalError(null);
    setUpdating(true);

    try {
      const headers = {
        'Content-Type': 'application/json',
        ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
      };

      const payload = {
        title: editForm.title,
        sku: editForm.sku,
        subtitle: editForm.subtitle,
        details: editForm.details,
        description: editForm.description,
        stock: editForm.stock,
        moq: editForm.moq,
        isB2B: editForm.isB2B,
        isB2C: editForm.isB2C,
        isSpecial: editForm.isSpecial,
        retailPrice: editForm.retailPrice,
        salePrice: editForm.salePrice ? parseFloat(editForm.salePrice) : null,
        b2bBasePrice: editForm.b2bBasePrice ? parseFloat(editForm.b2bBasePrice) : null,
        specialBasePrice: editForm.specialBasePrice ? parseFloat(editForm.specialBasePrice) : null,
        badge: editForm.badge || null,
        categoryId: editForm.categoryId || null,
        images: editForm.imageUrl ? [editForm.imageUrl] : undefined,
      };

      const res = await fetch(`/api/admin/products/${editForm.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update product');
      }

      setProducts((prev) =>
        prev.map((p) => (p.id === editForm.id ? { ...p, ...data.product } : p))
      );
      setIsEditModalOpen(false);
      setNotification({
        type: 'success',
        text: `Product "${editForm.title}" details successfully updated in database!`,
      });
      setTimeout(() => setNotification(null), 3000);
    } catch (e) {
      console.error(e);
      setModalError(e.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const headers = adminToken ? { Authorization: `Bearer ${adminToken}` } : {};
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE', headers });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        setNotification({ type: 'success', text: 'Product removed' });
        setTimeout(() => setNotification(null), 2500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = products.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-poppins text-slate-100">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Package className="w-6 h-6 text-emerald-400" />
            Catalog Management & Edit Suite
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage, edit product specifications, pricing tiers, and multi-mode visibility across B2B, B2C, and SPECIAL storefronts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setModalError(null);
            setIsNewModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 self-start"
        >
          <Plus className="w-4 h-4" /> Add Multi-Mode Product
        </button>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs rounded-xl flex items-center gap-2 animate-slide-up">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification.text}</span>
        </div>
      )}

      {/* Filter search & counter */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <Search className="w-4 h-4 text-slate-500 shrink-0" />
          <input
            type="text"
            placeholder="Filter products by title, SKU, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-xs text-white placeholder:text-slate-600 focus:outline-none"
          />
        </div>
        <div className="text-[11px] font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 self-start sm:self-auto">
          Showing <span className="text-emerald-400 font-bold">{filtered.length}</span> of {products.length} products
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-slate-400 uppercase tracking-wider text-[10px] bg-slate-900/80 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Item & SKU</th>
                <th className="py-3 px-3">Stock & MOQ</th>
                <th className="py-3 px-3">B2C Retail</th>
                <th className="py-3 px-3">B2B Base</th>
                <th className="py-3 px-3">Special Base</th>
                <th className="py-3 px-3 text-center">B2B Active</th>
                <th className="py-3 px-3 text-center">B2C Active</th>
                <th className="py-3 px-3 text-center">Special Active</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 text-slate-200">
              {filtered.map((prod) => {
                const images = safeJsonParse(prod.images, ['https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=200&q=80']);
                return (
                  <tr key={prod.id} className="hover:bg-slate-900/50 transition-colors group">
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-800 shrink-0 border border-slate-700">
                        <Image src={images[0] || '/placeholder.jpg'} alt={prod.title} fill className="object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-white max-w-xs truncate">{prod.title}</div>
                        <span className="text-[10px] font-mono text-emerald-400">SKU: {prod.sku}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 font-mono">
                      <span className={prod.stock < 10 ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                        {prod.stock} in stock
                      </span>
                      <div className="text-[10px] text-slate-500">MOQ: {prod.moq}</div>
                    </td>

                    <td className="py-3.5 px-3 font-semibold text-slate-100">
                      {formatCurrency(prod.retailPrice)}
                    </td>

                    <td className="py-3.5 px-3 font-semibold text-emerald-400">
                      {formatCurrency(prod.b2bBasePrice || prod.retailPrice)}
                    </td>

                    <td className="py-3.5 px-3 font-semibold text-gold-light">
                      {prod.specialBasePrice ? formatCurrency(prod.specialBasePrice) : '—'}
                    </td>

                    {/* Mode Toggle Checkboxes */}
                    <td className="py-3.5 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleMode(prod, 'isB2B')}
                        className={`w-6 h-6 rounded-lg mx-auto flex items-center justify-center transition-colors ${
                          prod.isB2B ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-500'
                        }`}
                        title="Toggle B2B Storefront Visibility"
                      >
                        {prod.isB2B ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      </button>
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleMode(prod, 'isB2C')}
                        className={`w-6 h-6 rounded-lg mx-auto flex items-center justify-center transition-colors ${
                          prod.isB2C ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-500'
                        }`}
                        title="Toggle B2C Storefront Visibility"
                      >
                        {prod.isB2C ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      </button>
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleMode(prod, 'isSpecial')}
                        className={`w-6 h-6 rounded-lg mx-auto flex items-center justify-center transition-colors ${
                          prod.isSpecial ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-500'
                        }`}
                        title="Toggle SPECIAL Atelier Visibility"
                      >
                        {prod.isSpecial ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      </button>
                    </td>

                    {/* Actions: Edit & Delete */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(prod)}
                          className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-950/50 rounded-lg transition-colors border border-transparent hover:border-emerald-800/50"
                          title="Edit product details"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-950/50 rounded-lg transition-colors border border-transparent hover:border-red-800/50"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Edit Product Details */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setModalError(null);
        }}
        title={`Edit Product: ${editForm.title}`}
        subtitle={`Updating SKU: ${editForm.sku} in live database`}
        className="bg-slate-950 border-slate-800 text-slate-100 max-w-2xl"
      >
        <form onSubmit={handleUpdateProduct} className="space-y-4 text-xs">
          {modalError && (
            <div className="p-3 bg-red-950/80 border border-red-700 text-red-300 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{modalError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              label="Product Title"
              required
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              inputClassName="bg-slate-900 border-slate-700 text-white"
            />
            <Input
              label="SKU Code"
              required
              value={editForm.sku}
              onChange={(e) => setEditForm({ ...editForm, sku: e.target.value })}
              inputClassName="bg-slate-900 border-slate-700 text-white font-mono"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              label="Subtitle / Tagline"
              placeholder="e.g. Premium hospital grade"
              value={editForm.subtitle}
              onChange={(e) => setEditForm({ ...editForm, subtitle: e.target.value })}
              inputClassName="bg-slate-900 border-slate-700 text-white"
            />
            <Select
              label="Category Assignment"
              value={editForm.categoryId}
              onChange={(e) => setEditForm({ ...editForm, categoryId: e.target.value })}
              selectClassName="bg-slate-900 border-slate-700 text-white"
              options={[
                { value: '', label: 'Select Category (Optional)' },
                ...categories.map((c) => ({ value: c.id, label: c.name })),
              ]}
            />
          </div>

          <div>
            <Input
              label="Primary Image URL"
              placeholder="https://... or /images/..."
              value={editForm.imageUrl}
              onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value })}
              inputClassName="bg-slate-900 border-slate-700 text-white font-mono text-[11px]"
              helperText="URL or local path to the product image"
            />
            {editForm.imageUrl && (
              <div className="mt-2 flex items-center gap-3 p-2 bg-slate-900/60 rounded-xl border border-slate-800">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-800 shrink-0 border border-slate-700">
                  <Image src={editForm.imageUrl} alt="Preview" fill className="object-cover" onError={(e) => (e.target.style.display = 'none')} />
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  <span className="text-emerald-400 font-semibold">Image Preview:</span> {editForm.imageUrl}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Textarea
              label="Full Description"
              rows={3}
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              textareaClassName="bg-slate-900 border-slate-700 text-white"
            />
            <Textarea
              label="Details / Specifications Summary"
              rows={3}
              placeholder="Clinical features, packaging specs..."
              value={editForm.details}
              onChange={(e) => setEditForm({ ...editForm, details: e.target.value })}
              textareaClassName="bg-slate-900 border-slate-700 text-white"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Input
              label="Retail Price (B2C)"
              type="number"
              value={editForm.retailPrice}
              onChange={(e) => setEditForm({ ...editForm, retailPrice: e.target.value })}
              inputClassName="bg-slate-900 border-slate-700 text-white"
            />
            <Input
              label="Sale Price (B2C)"
              type="number"
              placeholder="Optional"
              value={editForm.salePrice}
              onChange={(e) => setEditForm({ ...editForm, salePrice: e.target.value })}
              inputClassName="bg-slate-900 border-slate-700 text-white"
            />
            <Input
              label="Wholesale Base (B2B)"
              type="number"
              value={editForm.b2bBasePrice}
              onChange={(e) => setEditForm({ ...editForm, b2bBasePrice: e.target.value })}
              inputClassName="bg-slate-900 border-slate-700 text-white text-emerald-400 font-semibold"
            />
            <Input
              label="Bespoke Base (Special)"
              type="number"
              value={editForm.specialBasePrice}
              onChange={(e) => setEditForm({ ...editForm, specialBasePrice: e.target.value })}
              inputClassName="bg-slate-900 border-slate-700 text-white text-amber-400 font-semibold"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              label="Inventory Stock Count"
              type="number"
              value={editForm.stock}
              onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
              inputClassName="bg-slate-900 border-slate-700 text-white"
            />
            <Input
              label="B2B MOQ (Min Order Qty)"
              type="number"
              value={editForm.moq}
              onChange={(e) => setEditForm({ ...editForm, moq: e.target.value })}
              inputClassName="bg-slate-900 border-slate-700 text-white"
            />
            <Select
              label="Catalog Badge"
              value={editForm.badge}
              onChange={(e) => setEditForm({ ...editForm, badge: e.target.value })}
              selectClassName="bg-slate-900 border-slate-700 text-white"
              options={[
                { value: '', label: 'No Badge' },
                { value: 'BEST SELLER', label: 'Best Seller' },
                { value: 'NEW ARRIVAL', label: 'New Arrival' },
                { value: 'FEATURED', label: 'Featured' },
                { value: 'ISO CERTIFIED', label: 'ISO Certified' },
              ]}
            />
          </div>

          <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-slate-300 uppercase">
              Mode Visibility Activation:
            </span>
            <div className="flex flex-wrap items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editForm.isB2B}
                  onChange={(e) => setEditForm({ ...editForm, isB2B: e.target.checked })}
                  className="rounded text-emerald-600"
                />
                <span>Visible in B2B</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editForm.isB2C}
                  onChange={(e) => setEditForm({ ...editForm, isB2C: e.target.checked })}
                  className="rounded text-emerald-600"
                />
                <span>Visible in B2C</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editForm.isSpecial}
                  onChange={(e) => setEditForm({ ...editForm, isSpecial: e.target.checked })}
                  className="rounded text-amber-600"
                />
                <span>Visible in SPECIAL</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={updating}
              className="bg-emerald-600 hover:bg-emerald-500"
            >
              UPDATE & SAVE CHANGES
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Create New Multi-Mode Product */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => {
          setIsNewModalOpen(false);
          setModalError(null);
        }}
        title="Add Multi-Mode Surgical Product"
        subtitle="Configure title, SKU, category, pricing, and mode visibility"
        className="bg-slate-950 border-slate-800 text-slate-100 max-w-2xl"
      >
        <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
          {modalError && (
            <div className="p-3 bg-red-950/80 border border-red-700 text-red-300 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{modalError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              label="Product Title"
              required
              placeholder="e.g. Titanium Castroviejo Micro Needle Holder"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              inputClassName="bg-slate-900 border-slate-700 text-white"
            />
            <Input
              label="SKU Code"
              required
              placeholder="BS-NH-900"
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
              inputClassName="bg-slate-900 border-slate-700 text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              label="Subtitle / Tagline"
              placeholder="Tungsten carbide micro-grip jaws"
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              inputClassName="bg-slate-900 border-slate-700 text-white"
            />
            <Select
              label="Product Category"
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              selectClassName="bg-slate-900 border-slate-700 text-white"
              options={[
                { value: '', label: 'Select Category (Optional)' },
                ...categories.map((c) => ({ value: c.id, label: c.name })),
              ]}
            />
          </div>

          <Input
            label="Product Image URL"
            placeholder="https://images.unsplash.com/... or CDN link"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            inputClassName="bg-slate-900 border-slate-700 text-white font-mono text-[11px]"
            helperText="Direct image URL for Cloudinary, S3, Unsplash, or external media CDN."
          />

          <Textarea
            label="Description"
            rows={2}
            placeholder="Engineered for delicate cardiovascular microsurgery..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            textareaClassName="bg-slate-900 border-slate-700 text-white"
          />

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Retail Price (B2C)"
              type="number"
              value={form.retailPrice}
              onChange={(e) => setForm({ ...form, retailPrice: e.target.value })}
              inputClassName="bg-slate-900 border-slate-700 text-white"
            />
            <Input
              label="Wholesale Base (B2B)"
              type="number"
              value={form.b2bBasePrice}
              onChange={(e) => setForm({ ...form, b2bBasePrice: e.target.value })}
              inputClassName="bg-slate-900 border-slate-700 text-white"
            />
            <Input
              label="Bespoke Base (Special)"
              type="number"
              value={form.specialBasePrice}
              onChange={(e) => setForm({ ...form, specialBasePrice: e.target.value })}
              inputClassName="bg-slate-900 border-slate-700 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Inventory Stock Count"
              type="number"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              inputClassName="bg-slate-900 border-slate-700 text-white"
            />
            <Input
              label="B2B MOQ (Min Order Qty)"
              type="number"
              value={form.moq}
              onChange={(e) => setForm({ ...form, moq: e.target.value })}
              inputClassName="bg-slate-900 border-slate-700 text-white"
            />
          </div>

          <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-slate-300 uppercase">
              Mode Visibility Activation:
            </span>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isB2B}
                  onChange={(e) => setForm({ ...form, isB2B: e.target.checked })}
                  className="rounded text-emerald-600"
                />
                <span>Visible in B2B</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isB2C}
                  onChange={(e) => setForm({ ...form, isB2C: e.target.checked })}
                  className="rounded text-emerald-600"
                />
                <span>Visible in B2C</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isSpecial}
                  onChange={(e) => setForm({ ...form, isSpecial: e.target.checked })}
                  className="rounded text-amber-600"
                />
                <span>Visible in SPECIAL</span>
              </label>
            </div>
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full" loading={creating}>
            SAVE & PUBLISH PRODUCT
          </Button>
        </form>
      </Modal>

    </div>
  );
}
