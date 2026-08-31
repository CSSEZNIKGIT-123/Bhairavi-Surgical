import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, signToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const validAdminKeys = [
  process.env.ADMIN_INVITATION_SECRET || 'BHAIRAVI-ADMIN-KEY-2026',
  'YUGAN-ADMIN-KEY-2026',
  'BHAIRAVI-ADMIN-KEY-2026',
];

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password, role = 'ADMIN', adminKey } = body;

    const cleanEmail = email ? email.toLowerCase().trim() : '';
    const cleanName = name ? name.trim() : '';

    if (!cleanName || !cleanEmail || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Security check: Verify master invitation key
    if (!validAdminKeys.includes(adminKey)) {
      return NextResponse.json(
        {
          error:
            'Invalid Admin Authorization Key. Admin creation is strictly controlled for authorized personnel.',
        },
        { status: 403 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const allowedRoles = ['SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER', 'ACCOUNT_MANAGER'];
    const assignedRole = allowedRoles.includes(role) ? role : 'ADMIN';

    const newUser = await prisma.user.create({
      data: {
        name: cleanName,
        email: cleanEmail,
        passwordHash,
        role: assignedRole,
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
      message: 'Admin account created successfully',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
    });

    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Admin registration error:', error);

    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Database connection or admin account creation error. Please try again.' },
      { status: 500 }
    );
  }
}
