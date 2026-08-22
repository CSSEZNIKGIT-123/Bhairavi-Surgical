'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, ShieldCheck, Check, Truck, ArrowRight, Heart, Leaf } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Rating from '@/components/ui/Rating';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';
import { formatCurrency, safeJsonParse } from '@/lib/utils';

export default function ProductQuickView({ product, isOpen, onClose }) {
  const { addItem } = useCart();
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const images = safeJsonParse(product.images, [
    'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
  ]);
  const specs = safeJsonParse(product.specifications, {});

  const handleAddToCart = () => {
    addItem(product, quantity, 'B2C');
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start font-poppins">
        
        {/* Left: Product Images Gallery */}
        <div className="md:col-span-6 space-y-3">
          <div className="relative aspect-square w-full rounded-2xl bg-cream-100 overflow-hidden border border-cream-200">
            <Image
              src={images[selectedImgIndex] || images[0]}
              alt={product.title}
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {product.badge && (
              <div className="absolute top-3 left-3">
                <Badge variant="bestseller" size="sm">
                  {product.badge}
                </Badge>
              </div>
            )}
          </div>

          {/* Thumbnail list */}
          {images.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImgIndex(idx)}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImgIndex === idx
                      ? 'border-forest ring-2 ring-forest/20'
                      : 'border-cream-300 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt="Thumbnail" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Purchase Form */}
        <div className="md:col-span-6 space-y-4">
          <div>
            <span className="text-xs font-semibold text-charcoal-light uppercase tracking-wider">
              SKU: {product.sku}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-charcoal leading-tight mt-1">
              {product.title}
            </h2>
            {product.subtitle && (
              <p className="text-xs sm:text-sm text-charcoal-muted italic mt-0.5">
                {product.subtitle}
              </p>
            )}
          </div>

          <Rating
            value={product.rating || 5}
            reviewCount={product.reviewCount || 100}
            size="sm"
            showNumber
          />

          {/* Pricing */}
          <div className="flex items-baseline gap-3 pt-1 pb-2 border-b border-cream-200">
            <span className="text-2xl font-bold text-charcoal">
              {formatCurrency(product.salePrice || product.retailPrice)}
            </span>
            {product.salePrice && product.salePrice < product.retailPrice && (
              <span className="text-sm text-charcoal-light line-through">
                {formatCurrency(product.retailPrice)}
              </span>
            )}
            <Badge variant="success" size="sm">
              In Stock (Fresh Ayurvedic Batch)
            </Badge>
          </div>

          <p className="text-xs sm:text-sm text-charcoal leading-relaxed">
            {product.description}
          </p>

          {/* Key Specs Table */}
          {Object.keys(specs).length > 0 && (
            <div className="bg-cream-50 p-3 rounded-xl border border-cream-200 text-xs space-y-1.5">
              <h5 className="font-bold text-charcoal uppercase tracking-wider text-[10px]">
                Classical Formulation & Lab Verification:
              </h5>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(specs).map(([key, val], idx) => (
                  <div key={idx} className="text-charcoal-muted">
                    <span className="font-medium text-charcoal">{key}: </span>
                    {val}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Cart Action */}
          <div className="pt-3 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-cream-300 rounded-xl bg-white p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center font-bold text-charcoal hover:bg-cream-100 rounded-lg"
                >
                  -
                </button>
                <span className="w-10 text-center text-sm font-bold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center font-bold text-charcoal hover:bg-cream-100 rounded-lg"
                >
                  +
                </button>
              </div>

              <Button
                variant={added ? 'secondary' : 'primary'}
                className="flex-1"
                size="lg"
                onClick={handleAddToCart}
                icon={added ? Check : ShoppingBag}
              >
                {added ? 'ADDED TO CART' : 'ADD TO CART'}
              </Button>
            </div>

            <div className="flex items-center justify-between text-xs text-charcoal-muted pt-2 border-t border-cream-200">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-forest" /> Fast Pan-India Dispatch
              </span>
              <span className="flex items-center gap-1">
                <Leaf className="w-3.5 h-3.5 text-forest" /> 100% Classical Recipe
              </span>
              <Link
                href={`/b2c/products/${product.slug}`}
                onClick={onClose}
                className="text-forest font-semibold hover:underline flex items-center gap-1"
              >
                Full Details <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </Modal>
  );
}
