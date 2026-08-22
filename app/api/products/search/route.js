import { NextResponse } from 'next/server';
import { searchProducts } from '@/lib/products';

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
    });
  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json(
      { error: 'Failed to search products' },
      { status: 500 }
    );
  }
}
