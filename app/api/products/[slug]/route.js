import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { normalizeProduct, getProductBySlug, getRelatedProducts } from '@/lib/products';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const { slug } = params || {};
    if (!slug) {
      return NextResponse.json({ error: 'Product slug is required' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const mode = (searchParams.get('mode') || 'b2c').toLowerCase();

    // 1. Try querying from PostgreSQL via Prisma
    try {
      const dbProduct = await prisma.product.findUnique({
        where: { slug },
        include: {
          category: true,
          brand: true,
          priceTiers: { orderBy: { minQty: 'asc' } },
          variants: true,
        },
      });

      if (dbProduct) {
        const product = normalizeProduct(dbProduct);

        // Fetch related products from DB
        const relatedModeWhere = {};
        if (mode === 'b2b') relatedModeWhere.isB2B = true;
        else if (mode === 'special') relatedModeWhere.isSpecial = true;
        else if (mode === 'b2c') relatedModeWhere.isB2C = true;

        const relatedDb = await prisma.product.findMany({
          where: {
            id: { not: dbProduct.id },
            categoryId: dbProduct.categoryId,
            ...relatedModeWhere,
          },
          take: 4,
          include: { category: true, brand: true, priceTiers: true },
        });

        const relatedProducts = relatedDb.map((p) => normalizeProduct(p));

        return NextResponse.json({
          success: true,
          product,
          relatedProducts,
          source: 'database',
        });
      }
    } catch (dbErr) {
      console.warn('Prisma query failed in /api/products/[slug], falling back to static:', dbErr.message);
    }

    // 2. Fallback to static products
    const product = getProductBySlug(slug);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const relatedProducts = getRelatedProducts(product, mode, 4);

    return NextResponse.json({
      success: true,
      product,
      relatedProducts,
      source: 'fallback',
    });
  } catch (error) {
    console.error('Product details API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product details' },
      { status: 500 }
    );
  }
}

