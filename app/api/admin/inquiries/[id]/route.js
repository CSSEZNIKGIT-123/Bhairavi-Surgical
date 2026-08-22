import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status } = body;

    const inquiry = await prisma.specialInquiry.update({
      where: { id },
      data: {
        status: status || undefined,
      },
    });

    return NextResponse.json({ success: true, inquiry });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update inquiry' }, { status: 500 });
  }
}
