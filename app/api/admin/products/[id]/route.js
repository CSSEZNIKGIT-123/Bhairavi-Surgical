import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken, getUserFromRequest } from '@/lib/auth';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    const product = await prisma.product.update({
      where: { id },
      data: {
        title: body.title,
        subtitle: body.subtitle,
        description: body.description,
        stock: body.stock !== undefined ? parseInt(body.stock) : undefined,
        moq: body.moq !== undefined ? parseInt(body.moq) : undefined,
        isB2B: body.isB2B !== undefined ? !!body.isB2B : undefined,
        isB2C: body.isB2C !== undefined ? !!body.isB2C : undefined,
        isSpecial: body.isSpecial !== undefined ? !!body.isSpecial : undefined,
        retailPrice: body.retailPrice !== undefined ? parseFloat(body.retailPrice) : undefined,
        salePrice: body.salePrice !== undefined ? (body.salePrice ? parseFloat(body.salePrice) : null) : undefined,
        b2bBasePrice: body.b2bBasePrice !== undefined ? (body.b2bBasePrice ? parseFloat(body.b2bBasePrice) : null) : undefined,
        specialBasePrice: body.specialBasePrice !== undefined ? (body.specialBasePrice ? parseFloat(body.specialBasePrice) : null) : undefined,
        badge: body.badge !== undefined ? body.badge : undefined,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
