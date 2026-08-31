const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function importAllProducts() {
  console.log('=== Starting Full 92-Product Import to Neon PostgreSQL ===');

  const dataPath = path.join(__dirname, '..', 'data', 'products.json');
  if (!fs.existsSync(dataPath)) {
    throw new Error(`products.json not found at: ${dataPath}`);
  }

  const raw = fs.readFileSync(dataPath, 'utf-8');
  const products = JSON.parse(raw);
  console.log(`Loaded ${products.length} products from products.json`);

  // 1. Ensure Categories
  const categoryMap = new Map();
  for (const p of products) {
    const catSlug = p.categorySlug || p.category?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'general';
    const catName = p.category || 'Clinical & Surgical Essentials';
    
    if (!categoryMap.has(catSlug)) {
      const category = await prisma.category.upsert({
        where: { slug: catSlug },
        update: { name: catName },
        create: {
          name: catName,
          slug: catSlug,
          description: `Comprehensive range of authentic ${catName} supplied by Bhairavi Surgical and Yugan International.`,
          image: p.thumbnail || p.images?.[0] || '/images/categories/general.jpg',
        },
      });
      categoryMap.set(catSlug, category.id);
      console.log(`Category verified: [${catSlug}] ${catName}`);
    }
  }

  // 2. Ensure Brands
  const brandMap = new Map();
  for (const p of products) {
    const brandName = p.brand || 'Bhairavi Surgical';
    const brandSlug = brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    if (!brandMap.has(brandSlug)) {
      const brand = await prisma.brand.upsert({
        where: { slug: brandSlug },
        update: { name: brandName },
        create: {
          name: brandName,
          slug: brandSlug,
          description: `Certified products by ${brandName} distributed by Bhairavi Surgical.`,
        },
      });
      brandMap.set(brandSlug, brand.id);
      console.log(`Brand verified: [${brandSlug}] ${brandName}`);
    }
  }

  // 3. Upsert All Products
  let importedCount = 0;
  for (const p of products) {
    const catSlug = p.categorySlug || p.category?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'general';
    const categoryId = categoryMap.get(catSlug) || null;

    const brandName = p.brand || 'Bhairavi Surgical';
    const brandSlug = brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const brandId = brandMap.get(brandSlug) || null;

    const retailPrice = typeof p.pricing?.b2c?.price === 'number'
      ? p.pricing.b2c.price
      : typeof p.pricing?.b2b?.price === 'number'
      ? p.pricing.b2b.price
      : 0;

    const salePrice = typeof p.pricing?.b2c?.salePrice === 'number' ? p.pricing.b2c.salePrice : null;
    const b2bBasePrice = typeof p.pricing?.b2b?.price === 'number' ? p.pricing.b2b.price : null;
    const specialBasePrice = typeof p.pricing?.special?.price === 'number' ? p.pricing.special.price : null;

    const isB2B = p.websiteAvailability?.b2b ?? p.pricing?.b2b?.enabled ?? true;
    const isB2C = p.websiteAvailability?.b2c ?? p.pricing?.b2c?.enabled ?? true;
    const isSpecial = p.websiteAvailability?.special ?? p.pricing?.special?.enabled ?? false;

    const badge = p.isBestSeller ? 'BEST SELLER' : p.isNewArrival ? 'NEW ARRIVAL' : p.isFeatured ? 'FEATURED' : null;

    const imagesArray = Array.isArray(p.images) && p.images.length > 0
      ? p.images
      : [p.thumbnail || '/placeholder.jpg'];

    const specsObj = p.specifications || {};
    if (Array.isArray(p.benefits) && p.benefits.length > 0) {
      specsObj['Key Clinical Benefits'] = p.benefits.join('; ');
    }
    if (p.subcategory) {
      specsObj['Subcategory'] = p.subcategory;
    }

    const productData = {
      title: p.name,
      slug: p.slug,
      sku: p.sku || `SKU-${p.slug}`,
      subtitle: p.subtitle || null,
      details: p.shortDescription || p.subtitle || null,
      description: p.description || p.shortDescription || p.name,
      stock: typeof p.stock === 'number' ? p.stock : 500,
      moq: p.moq || p.pricing?.b2b?.minimumOrderQuantity || 1,
      isB2B: Boolean(isB2B),
      isB2C: Boolean(isB2C),
      isSpecial: Boolean(isSpecial),
      retailPrice: parseFloat(retailPrice) || 0,
      salePrice: salePrice ? parseFloat(salePrice) : null,
      b2bBasePrice: b2bBasePrice ? parseFloat(b2bBasePrice) : null,
      specialBasePrice: specialBasePrice ? parseFloat(specialBasePrice) : null,
      rating: typeof p.rating === 'number' ? p.rating : 4.8,
      reviewCount: typeof p.reviewCount === 'number' ? p.reviewCount : 15,
      badge: badge,
      isFeatured: Boolean(p.isFeatured),
      isBestSeller: Boolean(p.isBestSeller),
      isNewArrival: Boolean(p.isNewArrival),
      images: JSON.stringify(imagesArray),
      specifications: JSON.stringify(specsObj),
      categoryId: categoryId,
      brandId: brandId,
    };

    const savedProduct = await prisma.product.upsert({
      where: { slug: p.slug },
      update: productData,
      create: productData,
    });

    // Handle B2B Price Tiers
    if (Array.isArray(p.pricing?.b2b?.tiers) && p.pricing.b2b.tiers.length > 0) {
      await prisma.priceTier.deleteMany({
        where: { productId: savedProduct.id },
      });

      for (const tier of p.pricing.b2b.tiers) {
        if (typeof tier.unitPrice === 'number' && typeof tier.minQty === 'number') {
          await prisma.priceTier.create({
            data: {
              productId: savedProduct.id,
              minQty: tier.minQty,
              maxQty: tier.maxQty || null,
              unitPrice: tier.unitPrice,
              label: tier.label || `${tier.minQty}+ units`,
            },
          });
        }
      }
    }

    importedCount++;
    if (importedCount % 10 === 0 || importedCount === products.length) {
      console.log(`Progress: [${importedCount}/${products.length}] products upserted...`);
    }
  }

  console.log(`\n=== Import Completed Successfully! ===`);
  const finalProductCount = await prisma.product.count();
  const finalCategoryCount = await prisma.category.count();
  const finalBrandCount = await prisma.brand.count();
  const finalTierCount = await prisma.priceTier.count();

  console.log(`Total Products in Database: ${finalProductCount}`);
  console.log(`Total Categories in Database: ${finalCategoryCount}`);
  console.log(`Total Brands in Database: ${finalBrandCount}`);
  console.log(`Total Price Tiers in Database: ${finalTierCount}`);
}

importAllProducts()
  .catch((e) => {
    console.error('Error importing products:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
