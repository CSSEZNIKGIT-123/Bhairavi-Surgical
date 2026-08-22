import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken, getUserFromRequest } from '@/lib/auth';

export async function GET(request) {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        brand: true,
        priceTiers: { orderBy: { minQty: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, products });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch admin products' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const token = getUserFromRequest(request);
    const payload = token ? await verifyToken(token) : null;
    if (!payload || !['SUPER_ADMIN', 'ADMIN'].includes(payload.role)) {
      return NextResponse.json({ error: 'Unauthorized to create products' }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      slug,
      subtitle,
      description,
      sku,
      stock = 100,
      moq = 1,
      isB2B = true,
      isB2C = true,
      isSpecial = false,
      retailPrice = 0,
      salePrice = null,
      b2bBasePrice = null,
      specialBasePrice = null,
      badge = null,
      categoryId = null,
      images = '[]',
      specifications = '{}',
      priceTiers = [],
    } = body;

    if (!title || !sku) {
      return NextResponse.json({ error: 'Title and SKU are required' }, { status: 400 });
    }

    const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const product = await prisma.product.create({
      data: {
        title,
        slug: generatedSlug,
        subtitle,
        description: description || '',
        sku,
        stock: parseInt(stock) || 100,
        moq: parseInt(moq) || 1,
        isB2B: !!isB2B,
        isB2C: !!isB2C,
        isSpecial: !!isSpecial,
        retailPrice: parseFloat(retailPrice) || 0,
        salePrice: salePrice ? parseFloat(salePrice) : null,
        b2bBasePrice: b2bBasePrice ? parseFloat(b2bBasePrice) : null,
        specialBasePrice: specialBasePrice ? parseFloat(specialBasePrice) : null,
        badge,
        categoryId: categoryId || null,
        images: typeof images === 'string' ? images : JSON.stringify(images),
        specifications: typeof specifications === 'string' ? specifications : JSON.stringify(specifications),
        priceTiers: {
          create: priceTiers.map((t) => ({
            minQty: parseInt(t.minQty),
            maxQty: t.maxQty ? parseInt(t.maxQty) : null,
            unitPrice: parseFloat(t.unitPrice),
            label: t.label || null,
          })),
        },
      },
      include: { category: true, priceTiers: true },
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Admin product create error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
