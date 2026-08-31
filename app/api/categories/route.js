import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCategories } from '@/lib/products';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = (searchParams.get('mode') || 'b2c').toLowerCase();

    // 1. Try querying categories from PostgreSQL via Prisma
    try {
      const modeProductFilter =
        mode === 'b2b'
          ? { isB2B: true }
          : mode === 'special'
          ? { isSpecial: true }
          : mode === 'b2c'
          ? { isB2C: true }
          : {};

      const dbCategories = await prisma.category.findMany({
        orderBy: { sortOrder: 'asc' },
        include: {
          products: {
            where: modeProductFilter,
            select: { id: true },
          },
        },
      });

      if (dbCategories && dbCategories.length > 0) {
        const categories = dbCategories.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          subtitle: c.subtitle,
          description: c.description,
          image: c.image,
          mode: c.mode,
          productCount: c.products?.length || 0,
        }));
        return NextResponse.json({ success: true, categories, source: 'database' });
      }
    } catch (dbErr) {
      console.warn('Prisma query failed in /api/categories, falling back to static:', dbErr.message);
    }

    // 2. Fallback to static categories
    const categories = getCategories(mode);
    return NextResponse.json({ success: true, categories, source: 'fallback' });
  } catch (error) {
    console.error('Categories API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

