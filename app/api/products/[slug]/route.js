import { NextResponse } from 'next/server';
import { getProductBySlug, getRelatedProducts } from '@/lib/products';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const { slug } = params || {};
    if (!slug) {
      return NextResponse.json({ error: 'Product slug is required' }, { status: 400 });
    }

    const product = getProductBySlug(slug);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const mode = (searchParams.get('mode') || 'b2c').toLowerCase();
    const relatedProducts = getRelatedProducts(product, mode, 4);

    return NextResponse.json({
      success: true,
      product,
      relatedProducts,
    });
  } catch (error) {
    console.error('Product details API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product details' },
      { status: 500 }
    );
  }
}
