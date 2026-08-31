import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { normalizeProduct, searchProducts } from '@/lib/products';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || searchParams.get('search') || '';
    const mode = (searchParams.get('mode') || 'all').toLowerCase();
    const category = searchParams.get('category') || '';
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')) : null;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')) : null;
    const inStock = searchParams.get('inStock') === 'true';
    const limit = Math.min(parseInt(searchParams.get('limit') || '12', 10), 30);

    // 1. Try querying Prisma PostgreSQL
    try {
      const where = {};
      if (mode === 'b2b') where.isB2B = true;
      else if (mode === 'special') where.isSpecial = true;
      else if (mode === 'b2c') where.isB2C = true;

      if (category && category !== 'all') {
        where.category = { slug: category };
      }

      if (inStock) {
        where.stock = { gt: 0 };
      }

      if (q && q.trim()) {
        const term = q.trim();
        where.OR = [
          { title: { contains: term, mode: 'insensitive' } },
          { subtitle: { contains: term, mode: 'insensitive' } },
          { description: { contains: term, mode: 'insensitive' } },
          { sku: { contains: term, mode: 'insensitive' } },
        ];
      }

      if (minPrice !== null || maxPrice !== null) {
        where.retailPrice = {};
        if (minPrice !== null) where.retailPrice.gte = minPrice;
        if (maxPrice !== null) where.retailPrice.lte = maxPrice;
      }

      const dbProducts = await prisma.product.findMany({
        where,
        take: limit,
        include: {
          category: true,
          brand: true,
          priceTiers: { orderBy: { minQty: 'asc' } },
          variants: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      if (dbProducts && dbProducts.length > 0) {
        const products = dbProducts.map((p) => normalizeProduct(p));
        return NextResponse.json({
          success: true,
          products,
          totalCount: products.length,
          query: q,
          mode,
          source: 'database',
        });
      }
    } catch (dbErr) {
      console.warn('Prisma search query failed, using static fallback:', dbErr.message);
    }

    // 2. Fallback to static products
    const products = searchProducts({
      q,
      mode,
      category,
      minPrice,
      maxPrice,
      inStock,
      limit,
    });

    return NextResponse.json({
      success: true,
      products,
      totalCount: products.length,
      query: q,
      mode,
      source: 'fallback',
    });
  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 }
    );
  }
}

