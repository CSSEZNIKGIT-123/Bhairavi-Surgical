import { NextResponse } from 'next/server';
import prisma, { formatPrismaError } from '@/lib/prisma';
import { verifyPassword, signToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const cleanEmail = email ? email.toLowerCase().trim() : '';

    if (!cleanEmail || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid admin credentials' },
        { status: 401 }
      );
    }

    // Verify user has admin/management role
    const adminRoles = ['SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER', 'ACCOUNT_MANAGER'];
    if (!adminRoles.includes(user.role)) {
      return NextResponse.json(
        { error: 'Access denied. Account is not authorized for administration portal.' },
        { status: 403 }
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid admin credentials' },
        { status: 401 }
      );
    }

    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Admin authentication successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    // Set HTTP-only cookie
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    const formatted = formatPrismaError(error, 'Admin Login');
    return NextResponse.json(
      { error: formatted.message },
      { status: formatted.status }
    );
  }
}
