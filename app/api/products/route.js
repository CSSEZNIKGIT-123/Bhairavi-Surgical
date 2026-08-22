import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode'); // 'b2b', 'b2c', 'special'
    const categorySlug = searchParams.get('category');
    const search = searchParams.get('search');
    const filter = searchParams.get('filter'); // 'bestseller', 'new', 'featured', 'bulk'

    const where = {};

    // Mode-specific visibility filtering
    if (mode === 'b2b') {
      where.isB2B = true;
    } else if (mode === 'b2c') {
      where.isB2C = true;
    } else if (mode === 'special') {
      where.isSpecial = true;
    }

    // Category filter
    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    // Search filter (title, subtitle, description, SKU)
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { subtitle: { contains: search } },
        { description: { contains: search } },
        { sku: { contains: search } },
      ];
    }

    // Tag filters
    if (filter === 'bestseller') {
      where.isBestSeller = true;
    } else if (filter === 'new') {
      where.isNewArrival = true;
    } else if (filter === 'featured') {
      where.isFeatured = true;
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        brand: true,
        priceTiers: {
          orderBy: { minQty: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('Products API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
