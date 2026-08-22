'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Eye, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Rating from '@/components/ui/Rating';
import Badge from '@/components/ui/Badge';
import { formatCurrency, safeJsonParse } from '@/lib/utils';

export default function B2CProductCard({ product, onQuickView }) {
  const { addItem } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [added, setAdded] = useState(false);

  const images = safeJsonParse(product.images, [
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80',
  ]);
  const primaryImg = images[0];
  const secondaryImg = images[1] || images[0];

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1, 'B2C');
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white rounded-2xl p-3 sm:p-4 border border-cream-200 hover:border-forest/30 transition-all duration-300 hover:shadow-card flex flex-col justify-between"
    >
      <div>
        {/* Card Media Container */}
        <div className="relative w-full aspect-square rounded-xl bg-[#F7F5F0] overflow-hidden mb-3.5">
          
          {/* Top Badges (Reference design exact layout: Left Badge, Right Wishlist Heart) */}
          <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1">
            {product.badge && (
              <Badge
                variant={product.badge.includes('BEST') ? 'bestseller' : 'default'}
                size="sm"
              >
                {product.badge}
              </Badge>
            )}
          </div>

          <button
            type="button"
            onClick={handleWishlist}
            className="absolute top-2.5 right-2.5 z-10 p-1.5 rounded-full bg-white/90 backdrop-blur-sm text-charcoal-light hover:text-terracotta transition-colors shadow-sm"
            aria-label="Add to wishlist"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isWishlisted ? 'fill-terracotta text-terracotta' : ''
              }`}
            />
          </button>

          {/* Product Images with 2-Image Hover Transition */}
          <Link href={`/b2c/products/${product.slug}`} className="block w-full h-full">
            <Image
              src={primaryImg}
              alt={product.title}
              fill
              className={`object-cover object-center transition-all duration-500 ${
                isHovered && secondaryImg !== primaryImg
                  ? 'opacity-0 scale-105'
                  : 'opacity-100 scale-100'
              }`}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            {secondaryImg && secondaryImg !== primaryImg && (
              <Image
                src={secondaryImg}
                alt={`${product.title} Alternate View`}
                fill
                className={`object-cover object-center transition-all duration-500 ${
                  isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
                }`}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            )}
          </Link>

          {/* Quick View Button on Hover */}
          {onQuickView && (
            <div className="absolute inset-x-2 bottom-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onQuickView(product);
                }}
                className="w-full bg-white/95 backdrop-blur-sm text-charcoal text-xs font-semibold py-2 rounded-lg shadow-sm hover:bg-forest hover:text-white transition-colors flex items-center justify-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" /> Quick View
              </button>
            </div>
          )}
        </div>

        {/* Product Details (Reference design typography & hierarchy) */}
        <div className="space-y-1">
          <Link href={`/b2c/products/${product.slug}`} className="block group-hover:text-forest transition-colors">
            <h3 className="text-sm sm:text-base font-bold text-charcoal font-poppins leading-snug line-clamp-1">
              {product.title}
            </h3>
          </Link>

          {product.subtitle && (
            <p className="text-xs text-charcoal-muted line-clamp-1 italic font-light">
              {product.subtitle}
            </p>
          )}

          {/* Rating */}
          <div className="py-1">
            <Rating
              value={product.rating || 5}
              reviewCount={product.reviewCount || 100}
              size="xs"
            />
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 pt-0.5">
            <span className="text-sm sm:text-base font-bold text-charcoal">
              {formatCurrency(product.salePrice || product.retailPrice)}
            </span>
            {product.salePrice && product.salePrice < product.retailPrice && (
              <span className="text-xs text-charcoal-light line-through font-normal">
                {formatCurrency(product.retailPrice)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Outlined / Filled ADD TO CART Button (Reference design: Outlined styled button with cart icon) */}
      <div className="mt-4 pt-2">
        <button
          type="button"
          onClick={handleAddToCart}
          className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold font-poppins tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 ${
            added
              ? 'bg-emerald-700 text-white border-emerald-700'
              : 'border-cream-300 text-charcoal hover:bg-forest hover:text-white hover:border-forest active:scale-[0.98]'
          }`}
        >
          {added ? (
            <>
              <Check className="w-3.5 h-3.5" /> ADDED
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" /> ADD TO CART
            </>
          )}
        </button>
      </div>

    </div>
  );
}
