import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken, getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      companyName,
      contactPerson,
      email,
      phone,
      taxId,
      estimatedBudget,
      deliveryTimeline,
      notes,
      items = [],
    } = body;

    if (!companyName || !contactPerson || !email || !phone || items.length === 0) {
      return NextResponse.json(
        { error: 'Company details, contact info, and at least one quote item are required' },
        { status: 400 }
      );
    }

    const token = getUserFromRequest(request);
    let userId = null;
    if (token) {
      const payload = await verifyToken(token);
      if (payload) userId = payload.userId;
    }

    const quoteNumber = `RFQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const quote = await prisma.quote.create({
      data: {
        quoteNumber,
        userId,
        companyName,
        contactPerson,
        email: email.toLowerCase().trim(),
        phone,
        taxId: taxId || null,
        estimatedBudget: estimatedBudget || null,
        deliveryTimeline: deliveryTimeline || null,
        notes: notes || null,
        status: 'SUBMITTED',
        items: {
          create: items.map((item) => ({
            productId: item.productId || item.product?.id,
            quantity: item.quantity || 10,
            targetPrice: item.targetPrice ? parseFloat(item.targetPrice) : null,
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
      message: 'RFQ Quote submitted successfully',
      quote,
    });
  } catch (error) {
    console.error('Quote submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit quote request' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const quotes = await prisma.quote.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    return NextResponse.json({ success: true, quotes });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 });
  }
}
