import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken, getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      organization,
      email,
      phone,
      requirementType = 'Heirloom Panchkarma Suite',
      description,
      urgency = 'STANDARD',
    } = body;

    if (!name || !email || !phone || !description) {
      return NextResponse.json(
        { error: 'Name, email, phone, and requirement description are required' },
        { status: 400 }
      );
    }

    const token = getUserFromRequest(request);
    let userId = null;
    if (token) {
      const payload = await verifyToken(token);
      if (payload) userId = payload.userId;
    }

    const inquiryNumber = `INQ-SP-${Math.floor(100 + Math.random() * 900)}`;

    const inquiry = await prisma.specialInquiry.create({
      data: {
        inquiryNumber,
        userId,
        name,
        organization: organization || null,
        email: email.toLowerCase().trim(),
        phone,
        requirementType,
        description,
        urgency,
        status: 'NEW',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Private consultation request received. Our Master Vaidya and Atelier consultant will reach out within 24 hours.',
      inquiry,
    });
  } catch (error) {
    console.error('Inquiry submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit inquiry' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const inquiries = await prisma.specialInquiry.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, inquiries });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 });
  }
}
