import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken, getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const { id } = params || {};
    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true, priceTiers: true },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params || {};
    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const body = await request.json();

    const dataToUpdate = {};

    if (body.title !== undefined) dataToUpdate.title = body.title;
    if (body.sku !== undefined) dataToUpdate.sku = body.sku;
    if (body.subtitle !== undefined) dataToUpdate.subtitle = body.subtitle || null;
    if (body.details !== undefined) dataToUpdate.details = body.details || null;
    if (body.description !== undefined) dataToUpdate.description = body.description;
    
    if (body.stock !== undefined) dataToUpdate.stock = parseInt(body.stock, 10) || 0;
    if (body.moq !== undefined) dataToUpdate.moq = parseInt(body.moq, 10) || 1;

    if (body.isB2B !== undefined) dataToUpdate.isB2B = Boolean(body.isB2B);
    if (body.isB2C !== undefined) dataToUpdate.isB2C = Boolean(body.isB2C);
    if (body.isSpecial !== undefined) dataToUpdate.isSpecial = Boolean(body.isSpecial);

    if (body.isFeatured !== undefined) dataToUpdate.isFeatured = Boolean(body.isFeatured);
    if (body.isBestSeller !== undefined) dataToUpdate.isBestSeller = Boolean(body.isBestSeller);
    if (body.isNewArrival !== undefined) dataToUpdate.isNewArrival = Boolean(body.isNewArrival);

    if (body.retailPrice !== undefined) dataToUpdate.retailPrice = parseFloat(body.retailPrice) || 0;
    if (body.salePrice !== undefined) dataToUpdate.salePrice = body.salePrice ? parseFloat(body.salePrice) : null;
    if (body.b2bBasePrice !== undefined) dataToUpdate.b2bBasePrice = body.b2bBasePrice ? parseFloat(body.b2bBasePrice) : null;
    if (body.specialBasePrice !== undefined) dataToUpdate.specialBasePrice = body.specialBasePrice ? parseFloat(body.specialBasePrice) : null;
    
    if (body.badge !== undefined) dataToUpdate.badge = body.badge || null;
    if (body.categoryId !== undefined) dataToUpdate.categoryId = body.categoryId || null;
    if (body.brandId !== undefined) dataToUpdate.brandId = body.brandId || null;

    if (body.images !== undefined) {
      dataToUpdate.images = typeof body.images === 'string' ? body.images : JSON.stringify(body.images);
    } else if (body.imageUrl !== undefined) {
      dataToUpdate.images = JSON.stringify([body.imageUrl]);
    }

    if (body.specifications !== undefined) {
      dataToUpdate.specifications = typeof body.specifications === 'string'
        ? body.specifications
        : JSON.stringify(body.specifications);
    }

    const product = await prisma.product.update({
      where: { id },
      data: dataToUpdate,
      include: {
        category: true,
        brand: true,
        priceTiers: true,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params || {};
    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
