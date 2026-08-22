import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || searchParams.get('search') || '';
    const mode = (searchParams.get('mode') || 'all').toLowerCase();
    const category = searchParams.get('category') || '';
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')) : null;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')) : null;
    const minRating = searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')) : null;
    const inStock = searchParams.get('inStock') === 'true';
    const limit = Math.min(parseInt(searchParams.get('limit') || '8', 10), 30);

    const where = {};

    // 1. Mode Visibility
    if (mode === 'b2b') {
      where.isB2B = true;
    } else if (mode === 'b2c') {
      where.isB2C = true;
    } else if (mode === 'special') {
      where.isSpecial = true;
    }

    // 2. Keyword Search (Partial Matching Across Title, Subtitle, Description, SKU)
    if (q.trim()) {
      const term = q.trim();
      where.OR = [
        { title: { contains: term } },
        { subtitle: { contains: term } },
        { description: { contains: term } },
        { sku: { contains: term } },
        {
          category: {
            name: { contains: term },
          },
        },
      ];
    }

    // 3. Category Filter
    if (category) {
      where.category = {
        slug: category,
      };
    }

    // 4. Rating Filter
    if (minRating !== null && !isNaN(minRating)) {
      where.rating = {
        gte: minRating,
      };
    }

    // 5. Stock / Availability
    if (inStock) {
      where.stock = {
        gt: 0,
      };
    }

    // 6. Price Range Filter
    if (minPrice !== null || maxPrice !== null) {
      const priceField = mode === 'b2b' ? 'b2bBasePrice' : mode === 'special' ? 'specialBasePrice' : 'retailPrice';
      where[priceField] = {};
      if (minPrice !== null && !isNaN(minPrice)) {
        where[priceField].gte = minPrice;
      }
      if (maxPrice !== null && !isNaN(maxPrice)) {
        where[priceField].lte = maxPrice;
      }
    }

    // Fetch matching products with total count
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        take: limit,
        include: {
          category: true,
          brand: true,
          priceTiers: {
            orderBy: { minQty: 'asc' },
          },
        },
        orderBy: [
          { isFeatured: 'desc' },
          { isBestSeller: 'desc' },
          { rating: 'desc' },
          { createdAt: 'desc' },
        ],
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      products,
      totalCount,
      query: q,
      mode,
    });
  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 }
    );
  }
}
