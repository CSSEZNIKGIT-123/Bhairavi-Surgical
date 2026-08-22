import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken, getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      mode = 'B2C',
      customerName,
      customerEmail,
      customerPhone,
      companyName,
      poNumber,
      shippingAddress,
      billingAddress,
      paymentMethod = 'CREDIT_CARD',
      subtotalAmount,
      taxAmount = 0,
      shippingAmount = 0,
      discountAmount = 0,
      totalAmount,
      items = [],
    } = body;

    if (!customerName || !customerEmail || !shippingAddress || items.length === 0) {
      return NextResponse.json(
        { error: 'Customer name, email, shipping address, and items are required' },
        { status: 400 }
      );
    }

    const token = getUserFromRequest(request);
    let userId = null;
    if (token) {
      const payload = await verifyToken(token);
      if (payload) userId = payload.userId;
    }

    const prefix = mode === 'B2B' ? 'PO-B2B' : 'ORD-B2C';
    const orderNumber = `${prefix}-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        mode,
        status: 'PENDING',
        customerName,
        customerEmail: customerEmail.toLowerCase().trim(),
        customerPhone: customerPhone || null,
        companyName: companyName || null,
        poNumber: poNumber || null,
        shippingAddress,
        billingAddress: billingAddress || shippingAddress,
        paymentMethod,
        paymentStatus: 'PAID',
        subtotalAmount: parseFloat(subtotalAmount) || 0,
        taxAmount: parseFloat(taxAmount) || 0,
        shippingAmount: parseFloat(shippingAmount) || 0,
        discountAmount: parseFloat(discountAmount) || 0,
        totalAmount: parseFloat(totalAmount) || 0,
        items: {
          create: items.map((item) => ({
            productId: item.productId || item.product?.id,
            quantity: item.quantity || 1,
            unitPrice: parseFloat(item.unitPrice || item.product?.salePrice || item.product?.retailPrice || 0),
            totalPrice: parseFloat(item.quantity * (item.unitPrice || item.product?.salePrice || item.product?.retailPrice || 0)),
          })),
        },
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
