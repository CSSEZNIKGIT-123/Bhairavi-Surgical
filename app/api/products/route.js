import { NextResponse } from 'next/server';
import { getProductsByMode, getProductsByCategory, searchProducts } from '@/lib/products';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = (searchParams.get('mode') || 'b2c').toLowerCase();
    const category = searchParams.get('category');
    const search = searchParams.get('search') || searchParams.get('q');
    const filter = searchParams.get('filter'); // 'bestseller', 'new', 'featured', 'bulk'

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

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('Products API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
