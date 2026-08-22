'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
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
  Star,
  Layers,
  ArrowRight,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Button from '@/components/ui/Button';
import BuyOnWhatsAppButton from '@/components/ui/BuyOnWhatsAppButton';
import Rating from '@/components/ui/Rating';
import Badge from '@/components/ui/Badge';
import B2CProductCard from '@/components/products/B2CProductCard';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/utils';
import { getProductBySlug, getRelatedProducts } from '@/lib/products';

export default function B2CProductDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (slug) {
      const prod = getProductBySlug(slug);
      if (prod) {
        setProduct(prod);
        if (prod.variants && prod.variants.length > 0) {
          setSelectedVariant(prod.variants[0]);
        }
        const rel = getRelatedProducts(prod, 'b2c', 4);
        setRelated(rel);
      }
      setLoading(false);
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-poppins">
        <AnnouncementBar mode="B2C" />
        <Navbar mode="B2C" />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-forest border-t-transparent rounded-full animate-spin" />
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
        <main className="flex-1 max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-forest/10 text-forest flex items-center justify-center mx-auto">
            <Leaf className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-charcoal">Classical Product Not Found</h1>
          <p className="text-sm text-charcoal-muted max-w-md mx-auto">
            The Ayurvedic formulation you requested is either unavailable or has been archived.
          </p>
          <Link href="/b2c/shop">
            <Button variant="primary" size="lg">Explore Ayurvedic Catalog</Button>
          </Link>
        </main>
        <Footer mode="B2C" />
      </div>
    );
  }

  const activePrice = selectedVariant?.price || product.salePrice || product.retailPrice;
  const originalPrice = product.retailPrice;
  const hasDiscount = product.salePrice && product.salePrice < product.retailPrice;

  const handleAddToCart = () => {
    const itemToAdd = {
      ...product,
      selectedVariant,
      unitPrice: activePrice,
    };
    addItem(itemToAdd, quantity, 'B2C');
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };


  return (
    <div className="min-h-screen bg-[#FAF8F5] text-charcoal flex flex-col font-poppins">
      <AnnouncementBar mode="B2C" />
      <Navbar mode="B2C" />

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full text-xs text-charcoal-muted flex items-center gap-2 flex-wrap">
        <Link href="/b2c" className="hover:text-forest">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/b2c/shop" className="hover:text-forest">Shop</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/b2c/shop?category=${product.categorySlug}`} className="hover:text-forest">
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-charcoal font-semibold truncate max-w-[200px] sm:max-w-xs">{product.name}</span>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-16">
        
        {/* Main Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* LEFT: Image Gallery (5 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Primary Main Image Frame */}
            <div className="relative aspect-square w-full rounded-3xl bg-white overflow-hidden border border-cream-300 shadow-card">
              <Image
                src={product.images[selectedImgIndex] || product.thumbnail}
                alt={product.name}
                fill
                priority
                className="object-cover object-center transition-all duration-300"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />

              {product.badge && (
                <div className="absolute top-4 left-4 z-10">
                  <Badge variant={product.badge.includes('BEST') ? 'bestseller' : 'default'} size="md">
                    {product.badge}
                  </Badge>
                </div>
              )}

              <button
                type="button"
                onClick={() => setIsWishlisted(!isWishlisted)}
                aria-label="Add to wishlist"
                className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/90 backdrop-blur-md text-charcoal hover:text-terracotta transition-colors shadow-soft"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-terracotta text-terracotta' : ''}`} />
              </button>
            </div>

            {/* Thumbnail Carousel */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImgIndex(idx)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 bg-white ${
                      selectedImgIndex === idx
                        ? 'border-forest ring-2 ring-forest/20 shadow-sm'
                        : 'border-cream-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt={`View ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Quality Seals */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="bg-white p-3.5 rounded-2xl border border-cream-200 text-center space-y-1 shadow-soft">
                <Leaf className="w-5 h-5 text-forest mx-auto" />
                <div className="text-[11px] font-bold text-charcoal">100% Classical</div>
                <div className="text-[9px] text-charcoal-muted">Bhaishajya Ratnavali</div>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-cream-200 text-center space-y-1 shadow-soft">
                <ShieldCheck className="w-5 h-5 text-forest mx-auto" />
                <div className="text-[11px] font-bold text-charcoal">AYUSH GMP</div>
                <div className="text-[9px] text-charcoal-muted">Batch Certified QA</div>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-cream-200 text-center space-y-1 shadow-soft">
                <Truck className="w-5 h-5 text-forest mx-auto" />
                <div className="text-[11px] font-bold text-charcoal">Pan-India Express</div>
                <div className="text-[9px] text-charcoal-muted">3-5 Day Dispatch</div>
              </div>
            </div>
          </div>

          {/* RIGHT: Product Information & Purchase Controls (7 Cols) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Title & Ratings */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[11px] font-semibold text-charcoal-muted bg-cream-200 px-2.5 py-0.5 rounded-md">
                  SKU: {product.sku}
                </span>
                <span className="text-emerald-800 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  In Stock ({product.stock} units)
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-charcoal font-poppins leading-tight">
                {product.name}
              </h1>

              {product.subtitle && (
                <p className="text-xs sm:text-sm text-forest font-medium italic">
                  {product.subtitle}
                </p>
              )}

              <div className="flex items-center gap-3 pt-1">
                <Rating value={product.rating} reviewCount={product.reviewCount} size="sm" />
                <span className="text-xs text-charcoal-muted font-light">| 100% Authentic Classical</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-cream-300 shadow-soft space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-bold text-forest font-poppins">
                  {formatCurrency(activePrice)}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-sm sm:text-base text-charcoal-muted line-through">
                      {formatCurrency(originalPrice)}
                    </span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      Save {Math.round(((originalPrice - activePrice) / originalPrice) * 100)}%
                    </span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-charcoal-muted">
                Inclusive of all taxes. Free shipping on orders above ₹999.
              </p>
            </div>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed font-light">
              {product.shortDescription || product.description}
            </p>

            {/* Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-charcoal uppercase tracking-wider block">
                  Select Pack Size / Dosage Form:
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2.5 rounded-xl border text-xs font-semibold font-poppins transition-all ${
                        selectedVariant?.id === v.id
                          ? 'bg-forest text-white border-forest shadow-sm'
                          : 'bg-white text-charcoal border-cream-300 hover:border-forest'
                      }`}
                    >
                      {v.name} — {formatCurrency(v.price)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & Primary CTAs */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <label className="text-xs font-bold text-charcoal uppercase tracking-wider">Quantity:</label>
                <div className="flex items-center border border-cream-300 rounded-xl bg-white p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center font-bold text-charcoal hover:bg-cream-100 rounded-lg text-sm"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-charcoal">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center font-bold text-charcoal hover:bg-cream-100 rounded-lg text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleAddToCart}
                  icon={added ? Check : ShoppingBag}
                  className="w-full font-bold uppercase tracking-wider"
                >
                  {added ? 'ADDED TO CART' : 'ADD TO CART'}
                </Button>

                <BuyOnWhatsAppButton
                  product={product}
                  selectedVariant={selectedVariant}
                  quantity={quantity}
                  mode="B2C"
                  className="w-full"
                />
              </div>
            </div>

          </div>

        </div>

        {/* Product Depth Details Tabs/Panels */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-cream-300 shadow-soft space-y-8">
          
          {/* Full Description */}
          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-charcoal font-poppins flex items-center gap-2">
              <Award className="w-5 h-5 text-forest" />
              Classical Formulation & Heritage
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed font-light">
              {product.description}
            </p>
          </div>

          {/* Benefits Grid */}
          {product.benefits && product.benefits.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-cream-200">
              <h3 className="text-sm font-bold uppercase tracking-wider text-forest flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-forest" />
                Therapeutic Ayurvedic Benefits
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.benefits.map((b, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-cream-50/70 border border-cream-200 text-xs">
                    <Check className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                    <span className="text-charcoal leading-relaxed font-medium">{b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Botanicals / Ingredients */}
          {product.ingredients && product.ingredients.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-cream-200">
              <h3 className="text-sm font-bold uppercase tracking-wider text-forest flex items-center gap-2">
                <Leaf className="w-4 h-4 text-forest" />
                Classical Herbal Ingredients
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map((ing, idx) => (
                  <span key={idx} className="bg-[#FAF8F5] border border-cream-300 px-3 py-1.5 rounded-xl text-xs font-semibold text-charcoal">
                    🌿 {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Specifications Table */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="space-y-3 pt-4 border-t border-cream-200">
              <h3 className="text-sm font-bold uppercase tracking-wider text-forest flex items-center gap-2">
                <Layers className="w-4 h-4 text-forest" />
                Formulation & Manufacturing Specifications
              </h3>
              <div className="rounded-2xl border border-cream-200 overflow-hidden text-xs divide-y divide-cream-200">
                {Object.entries(product.specifications).map(([key, val], idx) => (
                  <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 p-3.5 bg-white even:bg-cream-50/50">
                    <span className="font-bold text-charcoal sm:col-span-1">{key}</span>
                    <span className="text-charcoal-muted sm:col-span-2">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Related Classical Formulations */}
        {related.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-charcoal font-poppins">
                  Related Classical Formulations
                </h2>
                <p className="text-xs text-charcoal-muted font-light mt-0.5">
                  Complementary Ayurvedic oils and wellness products from the same category
                </p>
              </div>
              <Link href="/b2c/shop" className="text-xs font-bold text-forest hover:text-forest-dark flex items-center gap-1">
                <span>View Full Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 min-[440px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {related.map((relProduct) => (
                <B2CProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </div>
        )}

      </main>

      <Footer mode="B2C" />
    </div>
  );
}
