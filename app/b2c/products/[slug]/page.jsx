'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ChevronRight,
  ShieldCheck,
  Truck,
  Leaf,
  Sparkles,
  ShoppingBag,
  Heart,
  Check,
  Award,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Button from '@/components/ui/Button';
import Rating from '@/components/ui/Rating';
import Badge from '@/components/ui/Badge';
import B2CProductCard from '@/components/products/B2CProductCard';
import { useCart } from '@/context/CartContext';
import { formatCurrency, safeJsonParse } from '@/lib/utils';

export default function B2CProductDetailPage() {
  const params = useParams();
  const { slug } = params;
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${slug}`);
        const data = await res.json();
        if (data.product) {
          setProduct(data.product);
          setRelated(data.related || []);
        }
      } catch (err) {
        console.error('Failed to load product:', err);
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-poppins">
        <AnnouncementBar mode="B2C" />
        <Navbar mode="B2C" />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-forest font-semibold text-sm">
            Loading authentic Ayurvedic formulation...
          </div>
        </div>
        <Footer mode="B2C" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-poppins">
        <AnnouncementBar mode="B2C" />
        <Navbar mode="B2C" />
        <div className="flex-1 flex flex-col items-center justify-center py-16 px-4 text-center">
          <h2 className="text-2xl font-bold text-charcoal">Formulation Not Found</h2>
          <p className="text-xs text-charcoal-muted mt-2">
            The requested Ayurvedic formulation or Panchkarma product is unavailable.
          </p>
          <Link href="/b2c/shop" className="mt-4">
            <Button variant="primary" size="md">
              Return to Catalog
            </Button>
          </Link>
        </div>
        <Footer mode="B2C" />
      </div>
    );
  }

  const images = safeJsonParse(product.images, [
    'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
  ]);
  const specs = safeJsonParse(product.specifications, {});

  const handleAddToCart = () => {
    addItem(product, quantity, 'B2C');
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-poppins">
      <AnnouncementBar mode="B2C" />
      <Navbar mode="B2C" />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full text-xs text-charcoal-muted flex items-center gap-1.5">
        <Link href="/b2c" className="hover:text-forest">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/b2c/shop" className="hover:text-forest">Ayurvedic Formulations</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-charcoal font-semibold truncate max-w-xs">{product.title}</span>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-16">
        
        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left: Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square w-full rounded-3xl bg-white overflow-hidden border border-cream-300 shadow-card">
              <Image
                src={images[selectedImgIndex] || images[0]}
                alt={product.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {product.badge && (
                <div className="absolute top-4 left-4">
                  <Badge variant="bestseller" size="md">
                    {product.badge}
                  </Badge>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex items-center gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImgIndex(idx)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                      selectedImgIndex === idx
                        ? 'border-forest ring-2 ring-forest/20'
                        : 'border-cream-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt="Thumb" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details & Purchase Form */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-charcoal-light">
                <span>SKU: {product.sku}</span>
                <span className="text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                  <Leaf className="w-3 h-3 text-emerald-600" />
                  GMP CERTIFIED AYURVEDIC
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-charcoal font-poppins leading-tight mt-2">
                {product.title}
              </h1>

              {product.subtitle && (
                <p className="text-sm text-charcoal-muted italic mt-1 font-light">
                  {product.subtitle}
                </p>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3 pb-3 border-b border-cream-200">
              <Rating
                value={product.rating || 5}
                reviewCount={product.reviewCount || 100}
                size="sm"
                showNumber
              />
              <span className="text-xs text-charcoal-light">|</span>
              <span className="text-xs text-emerald-800 font-semibold">
                In Stock ({product.stock} units available)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-charcoal font-poppins">
                {formatCurrency(product.salePrice || product.retailPrice)}
              </span>
              {product.salePrice && product.salePrice < product.retailPrice && (
                <span className="text-lg text-charcoal-light line-through font-normal">
                  {formatCurrency(product.retailPrice)}
                </span>
              )}
              <span className="text-xs text-charcoal-muted">(Inclusive of all taxes)</span>
            </div>

            <p className="text-sm text-charcoal leading-relaxed">
              {product.description}
            </p>

            {product.details && (
              <p className="text-xs text-charcoal-muted leading-relaxed bg-cream-50 p-3.5 rounded-xl border border-cream-200">
                {product.details}
              </p>
            )}

            {/* Quantity Selector & Add to Cart */}
            <div className="pt-4 space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-cream-300 rounded-xl bg-white p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 flex items-center justify-center font-bold text-charcoal hover:bg-cream-100 rounded-lg text-sm"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-sm font-bold">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 flex items-center justify-center font-bold text-charcoal hover:bg-cream-100 rounded-lg text-sm"
                  >
                    +
                  </button>
                </div>

                <Button
                  variant={added ? 'secondary' : 'primary'}
                  size="lg"
                  className="flex-1 whitespace-nowrap"
                  onClick={handleAddToCart}
                  icon={added ? Check : ShoppingBag}
                >
                  {added ? 'ADDED TO CART' : 'ADD TO CART'}
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-cream-200 text-[11px] text-charcoal-muted">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-forest shrink-0" />
                  <span>24-48h Dispatch</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-forest shrink-0" />
                  <span>Heavy Metal Tested</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-forest shrink-0" />
                  <span>100% Classical</span>
                </div>
              </div>
            </div>

            {/* Technical Specifications Table */}
            {Object.keys(specs).length > 0 && (
              <div className="pt-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal mb-2">
                  Classical Formulation Specifications
                </h3>
                <div className="rounded-2xl border border-cream-200 overflow-hidden text-xs divide-y divide-cream-200">
                  {Object.entries(specs).map(([key, val], idx) => (
                    <div key={idx} className="grid grid-cols-2 p-3 bg-white even:bg-cream-50">
                      <span className="font-semibold text-charcoal">{key}</span>
                      <span className="text-charcoal-muted">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="pt-12 border-t border-cream-200">
            <h2 className="text-2xl font-bold text-charcoal mb-6">
              Complementary Ayurvedic Essentials
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {related.map((rel) => (
                <B2CProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </section>
        )}

      </main>

      <Footer mode="B2C" />
    </div>
  );
}
