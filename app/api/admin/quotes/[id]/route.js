import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status, offeredTotal, adminNotes } = body;

    const quote = await prisma.quote.update({
      where: { id },
      data: {
        status: status || undefined,
        offeredTotal: offeredTotal !== undefined ? parseFloat(offeredTotal) : undefined,
        adminNotes: adminNotes !== undefined ? adminNotes : undefined,
      },
    });

    return NextResponse.json({ success: true, quote });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update quote' }, { status: 500 });
  }
}
