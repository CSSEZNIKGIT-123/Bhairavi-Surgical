import productsData from '@/data/products.json';
import { safeJsonParse } from '@/lib/utils';

/**
 * Normalizes a product object to ensure safe fallbacks for missing fields.
 */
export function normalizeProduct(product) {
  if (!product) return null;

  const rawImages = typeof product.images === 'string'
    ? safeJsonParse(product.images, [])
    : product.images;

  const images = Array.isArray(rawImages) && rawImages.length > 0
    ? rawImages
    : [product.thumbnail || 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80'];

  const thumbnail = product.thumbnail || images[0];

  const rawSpecs = typeof product.specifications === 'string'
    ? safeJsonParse(product.specifications, {})
    : (product.specifications || {});

  const rawVariants = typeof product.variants === 'string'
    ? safeJsonParse(product.variants, [])
    : (Array.isArray(product.variants) ? product.variants : []);

  const pricing = product.pricing || {
    b2c: { enabled: true, price: product.retailPrice || 0, salePrice: product.salePrice, currency: 'INR' },
    b2b: { enabled: true, price: product.b2bBasePrice || 0, minimumOrderQuantity: product.moq || 5, tiers: [] },
    special: { enabled: true, price: product.specialBasePrice || 0 },
  };

  const websiteAvailability = product.websiteAvailability || {
    b2b: product.isB2B ?? true,
    b2c: product.isB2C ?? true,
    special: product.isSpecial ?? false,
  };

  const salesMode = product.salesMode || {
    b2b: 'quote',
    b2c: 'cart',
    special: 'order',
  };

  return {
    ...product,
    id: product.id || product.slug,
    title: product.title || product.name,
    name: product.title || product.name,
    category: product.category?.name || product.category || 'Ayurvedic Classical',
    categorySlug: product.category?.slug || product.categorySlug || 'herbal-oils',
    brand: product.brand?.name || product.brand || 'Yugan Classical',
    brandSlug: product.brand?.slug || product.brandSlug || 'yugan-classical',
    images,
    thumbnail,
    pricing,
    websiteAvailability,
    salesMode,
    variants: rawVariants,
    benefits: Array.isArray(product.benefits) ? product.benefits : [],
    ingredients: Array.isArray(product.ingredients) ? product.ingredients : [],
    specifications: rawSpecs,
    rating: product.rating || 4.9,
    reviewCount: product.reviewCount || 30,
    stock: product.stock !== undefined ? product.stock : 100,
    moq: product.moq || pricing.b2b?.minimumOrderQuantity || 1,
    retailPrice: product.retailPrice || pricing.b2c?.price || 0,
    salePrice: product.salePrice || pricing.b2c?.salePrice || null,
    b2bBasePrice: product.b2bBasePrice || pricing.b2b?.price || null,
    specialBasePrice: product.specialBasePrice || pricing.special?.price || null,
    priceTiers: product.priceTiers || pricing.b2b?.tiers || product.tiers || [],
  };
}

/**
 * Get all normalized products.
 */
export function getAllProducts() {
  return productsData.map(normalizeProduct);
}

/**
 * Find a single product by unique slug.
 */
export function getProductBySlug(slug) {
  if (!slug) return null;
  const match = productsData.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
  return normalizeProduct(match);
}

/**
 * Find a single product by unique ID.
 */
export function getProductById(id) {
  if (!id) return null;
  const match = productsData.find((p) => p.id === id);
  return normalizeProduct(match);
}

/**
 * Get products available for a specific mode ('b2b', 'b2c', 'special').
 */
export function getProductsByMode(mode = 'b2c') {
  const m = mode.toLowerCase();
  const all = getAllProducts();
  return all.filter((p) => {
    if (m === 'b2b') return p.websiteAvailability?.b2b === true;
    if (m === 'special') return p.websiteAvailability?.special === true;
    return p.websiteAvailability?.b2c === true;
  });
}

/**
 * Get products by category slug and mode.
 */
export function getProductsByCategory(categorySlug, mode = 'b2c') {
  const products = getProductsByMode(mode);
  if (!categorySlug || categorySlug === 'all') return products;
  return products.filter(
    (p) => p.categorySlug?.toLowerCase() === categorySlug.toLowerCase()
  );
}

/**
 * Get relevant related products from same category/mode.
 */
export function getRelatedProducts(currentProduct, mode = 'b2c', limit = 4) {
  if (!currentProduct) return [];
  const normalized = normalizeProduct(currentProduct);
  const products = getProductsByMode(mode);

  const related = products
    .filter((p) => p.id !== normalized.id && p.categorySlug === normalized.categorySlug)
    .slice(0, limit);

  // If not enough in same category, backfill with featured products from same mode
  if (related.length < limit) {
    const backfill = products
      .filter((p) => p.id !== normalized.id && !related.find((r) => r.id === p.id))
      .slice(0, limit - related.length);
    return [...related, ...backfill];
  }

  return related;
}

/**
 * Multi-faceted instant product search.
 */
export function searchProducts({
  q = '',
  mode = 'all',
  category = '',
  minPrice = null,
  maxPrice = null,
  inStock = false,
  limit = 20,
} = {}) {
  let list = getAllProducts();
  const m = mode.toLowerCase();

  // Mode filter
  if (m === 'b2b') {
    list = list.filter((p) => p.websiteAvailability?.b2b === true);
  } else if (m === 'special') {
    list = list.filter((p) => p.websiteAvailability?.special === true);
  } else if (m === 'b2c') {
    list = list.filter((p) => p.websiteAvailability?.b2c === true);
  }

  // Category filter
  if (category && category !== 'all') {
    list = list.filter((p) => p.categorySlug === category);
  }

  // Text search
  if (q.trim()) {
    const term = q.trim().toLowerCase();
    list = list.filter((p) => {
      const matchName = p.name?.toLowerCase().includes(term);
      const matchSub = p.subtitle?.toLowerCase().includes(term);
      const matchDesc = p.description?.toLowerCase().includes(term);
      const matchSku = p.sku?.toLowerCase().includes(term);
      const matchCat = p.category?.toLowerCase().includes(term);
      const matchIng = p.ingredients?.some((ing) => ing.toLowerCase().includes(term));
      return matchName || matchSub || matchDesc || matchSku || matchCat || matchIng;
    });
  }

  // Stock filter
  if (inStock) {
    list = list.filter((p) => p.stock > 0);
  }

  // Price filter
  if (minPrice !== null && !isNaN(minPrice)) {
    list = list.filter((p) => {
      const price = m === 'b2b' ? p.b2bBasePrice : m === 'special' ? p.specialBasePrice : p.salePrice || p.retailPrice;
      return price >= minPrice;
    });
  }

  if (maxPrice !== null && !isNaN(maxPrice)) {
    list = list.filter((p) => {
      const price = m === 'b2b' ? p.b2bBasePrice : m === 'special' ? p.specialBasePrice : p.salePrice || p.retailPrice;
      return price <= maxPrice;
    });
  }

  return list.slice(0, limit);
}

/**
 * Get distinct categories available for a specific mode.
 */
export function getCategories(mode = 'b2c') {
  const products = getProductsByMode(mode);
  const map = new Map();

  for (const p of products) {
    if (p.categorySlug && !map.has(p.categorySlug)) {
      map.set(p.categorySlug, {
        slug: p.categorySlug,
        name: p.category,
        image: p.thumbnail,
        productCount: 1,
      });
    } else if (p.categorySlug) {
      const existing = map.get(p.categorySlug);
      existing.productCount += 1;
    }
  }

  return Array.from(map.values());
}
