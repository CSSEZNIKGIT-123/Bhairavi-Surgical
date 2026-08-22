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
} from 'lucide-react';
import { formatCurrency, safeJsonParse } from '@/lib/utils';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

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
    images: ['https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80'],
  });

  const loadData = async () => {
    try {
      const [pRes, cRes] = await Promise.all([
        fetch('/api/admin/products'),
        fetch('/api/categories'),
      ]);
      const pData = await pRes.json();
      const cData = await cRes.json();
      if (pData.success) setProducts(pData.products);
      if (cData.success) setCategories(cData.categories);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Quick toggle mode visibility directly in the table
  const handleToggleMode = async (product, modeKey) => {
    const updatedVal = !product[modeKey];
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
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
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setIsNewModalOpen(false);
        loadData();
        setNotification({ type: 'success', text: 'New product added to catalog' });
        setTimeout(() => setNotification(null), 2500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
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
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Multi-Mode Catalog Management
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure product visibility across B2B, B2C, and SPECIAL storefronts without data duplication.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsNewModalOpen(true)}
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

      {/* Filter search */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Filter products by title, SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-xs text-white placeholder:text-slate-600 focus:outline-none"
        />
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
                  <tr key={prod.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-800 shrink-0">
                        <Image src={images[0]} alt={prod.title} fill className="object-cover" />
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

                    {/* Mode Toggle Checkboxes (Section 35: Mode-Specific Product Visibility) */}
                    <td className="py-3.5 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleMode(prod, 'isB2B')}
                        className={`w-6 h-6 rounded-lg mx-auto flex items-center justify-center transition-colors ${
                          prod.isB2B ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-500'
                        }`}
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
                      >
                        {prod.isSpecial ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create New Multi-Mode Product */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Add Multi-Mode Surgical Product"
        subtitle="Configure title, SKU, pricing, and mode visibility"
        className="bg-slate-950 border-slate-800 text-slate-100"
      >
        <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
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

          <Input
            label="Subtitle / Tagline"
            placeholder="Tungsten carbide micro-grip jaws"
            value={form.subtitle}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            inputClassName="bg-slate-900 border-slate-700 text-white"
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

          <Button type="submit" variant="primary" size="lg" className="w-full">
            SAVE & PUBLISH PRODUCT
          </Button>
        </form>
      </Modal>

    </div>
  );
}
