import { NextResponse } from 'next/server';
import { getCategories } from '@/lib/products';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = (searchParams.get('mode') || 'b2c').toLowerCase();
    const categories = getCategories(mode);

    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error('Categories API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
