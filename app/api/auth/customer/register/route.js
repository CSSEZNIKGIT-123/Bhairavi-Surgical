import { NextResponse } from 'next/server';
import prisma, { formatPrismaError } from '@/lib/prisma';
import { hashPassword, signToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      mode = 'B2C',
      email,
      password,
      name,
      phone,
      // B2C specific
      firstName,
      lastName,
      // B2B specific
      companyName,
      contactPerson,
      businessType,
      taxGstNumber,
      industry,
      companyAddress,
      // SPECIAL specific
      organization,
      requirementType,
      requirementDescription,
    } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    if (typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email address already exists' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const fullName = name || (firstName ? `${firstName} ${lastName || ''}`.trim() : contactPerson || 'Customer');

    // Create user with mode-specific profile
    const userData = {
      email: cleanEmail,
      passwordHash,
      name: fullName,
      phone: phone ? String(phone).trim() : null,
      role: 'CUSTOMER',
    };

    if (mode === 'B2C') {
      userData.customerProfile = {
        create: {
          firstName: firstName || fullName.split(' ')[0],
          lastName: lastName || fullName.split(' ').slice(1).join(' '),
        },
      };
    } else if (mode === 'B2B') {
      userData.businessProfile = {
        create: {
          companyName: companyName || 'Unspecified Company',
          contactPerson: contactPerson || fullName,
          businessType: businessType || 'Healthcare Provider',
          taxGstNumber: taxGstNumber || null,
          industry: industry || 'Hospital & Clinical',
          companyAddress: companyAddress || null,
          accountStatus: 'VERIFIED',
        },
      };
    } else if (mode === 'SPECIAL') {
      userData.specialProfile = {
        create: {
          organization: organization || companyName || 'Private Practice',
          requirementType: requirementType || 'Bespoke Surgical Suite',
          notes: requirementDescription || null,
        },
      };
    }

    const newUser = await prisma.user.create({
      data: userData,
      include: {
        customerProfile: true,
        businessProfile: true,
        specialProfile: true,
      },
    });

    const token = await signToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Account registration completed',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        customerProfile: newUser.customerProfile,
        businessProfile: newUser.businessProfile,
        specialProfile: newUser.specialProfile,
      },
    });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    const formatted = formatPrismaError(error, 'Customer Registration');
    return NextResponse.json(
      { error: formatted.message },
      { status: formatted.status }
    );
  }
}

