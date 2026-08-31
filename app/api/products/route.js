import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import {
  normalizeProduct,
  getProductsByMode,
  getProductsByCategory,
  searchProducts,
} from '@/lib/products';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = (searchParams.get('mode') || 'b2c').toLowerCase();
    const category = searchParams.get('category');
    const search = searchParams.get('search') || searchParams.get('q');
    const filter = searchParams.get('filter'); // 'bestseller', 'new', 'featured', 'bulk'

    // 1. Try querying from PostgreSQL via Prisma
    try {
      const where = {};
      if (mode === 'b2b') where.isB2B = true;
      else if (mode === 'special') where.isSpecial = true;
      else if (mode === 'b2c') where.isB2C = true;

      if (category && category !== 'all') {
        where.category = { slug: category };
      }

      if (search && search.trim()) {
        const term = search.trim();
        where.OR = [
          { title: { contains: term, mode: 'insensitive' } },
          { subtitle: { contains: term, mode: 'insensitive' } },
          { description: { contains: term, mode: 'insensitive' } },
          { sku: { contains: term, mode: 'insensitive' } },
        ];
      }

      if (filter === 'bestseller') where.isBestSeller = true;
      else if (filter === 'new') where.isNewArrival = true;
      else if (filter === 'featured') where.isFeatured = true;

      const dbProducts = await prisma.product.findMany({
        where,
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
        return NextResponse.json({ success: true, products, source: 'database' });
      }
    } catch (dbError) {
      console.warn('Prisma query failed in /api/products, falling back to static data:', dbError.message);
    }

    // 2. Fallback to static products if database query fails or is empty
    let products = [];

    if (search) {
      products = searchProducts({ q: search, mode, category });
    } else if (category) {
      products = getProductsByCategory(category, mode);
    } else {
      products = getProductsByMode(mode);
    }

    if (filter === 'bestseller') {
      products = products.filter((p) => p.isBestSeller);
    } else if (filter === 'new') {
      products = products.filter((p) => p.isNewArrival);
    } else if (filter === 'featured') {
      products = products.filter((p) => p.isFeatured);
    }

    return NextResponse.json({ success: true, products, source: 'fallback' });
  } catch (error) {
    console.error('Products API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

