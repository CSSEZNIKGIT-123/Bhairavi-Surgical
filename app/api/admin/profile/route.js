import { NextResponse } from 'next/server';
import prisma, { formatPrismaError } from '@/lib/prisma';
import { getAuthenticatedUser, verifyPassword, hashPassword, signToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER', 'ACCOUNT_MANAGER'];

/**
 * GET /api/admin/profile
 * Retrieves the profile of the currently authenticated administrator.
 */
export async function GET(request) {
  try {
    const auth = await getAuthenticatedUser(request, 'admin');
    if (!auth || !auth.userId || !ADMIN_ROLES.includes(auth.role)) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin credentials required.' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Administrator profile not found in database.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      profile: user,
    });
  } catch (error) {
    const formatted = formatPrismaError(error, 'Get Admin Profile');
    return NextResponse.json(
      { error: formatted.message },
      { status: formatted.status }
    );
  }
}

/**
 * PUT /api/admin/profile
 * Updates personal details and/or password of the currently authenticated administrator.
 */
export async function PUT(request) {
  try {
    const auth = await getAuthenticatedUser(request, 'admin');
    if (!auth || !auth.userId || !ADMIN_ROLES.includes(auth.role)) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin credentials required.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      name,
      email,
      phone,
      avatar,
      currentPassword,
      newPassword,
    } = body;

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Administrator full name is required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email ? email.toLowerCase().trim() : '';
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return NextResponse.json(
        { error: 'A valid corporate email address is required.' },
        { status: 400 }
      );
    }

    // Check if another account is already using the new email
    const existingWithEmail = await prisma.user.findFirst({
      where: {
        email: cleanEmail,
        id: { not: auth.userId },
      },
    });

    if (existingWithEmail) {
      return NextResponse.json(
        { error: 'An account with this corporate email already exists in the system.' },
        { status: 409 }
      );
    }

    // Retrieve current user for password check if password update is requested
    const currentUser = await prisma.user.findUnique({
      where: { id: auth.userId },
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Administrator record not found.' },
        { status: 404 }
      );
    }

    const updateData = {
      name: name.trim(),
      email: cleanEmail,
      phone: phone ? phone.trim() : null,
      avatar: avatar ? avatar.trim() : null,
    };

    // If password change requested
    if (newPassword && newPassword.trim().length > 0) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: 'Current password is required to verify identity before setting a new password.' },
          { status: 400 }
        );
      }

      const isCurrentValid = await verifyPassword(currentPassword, currentUser.passwordHash);
      if (!isCurrentValid) {
        return NextResponse.json(
          { error: 'Current password verification failed. Please enter your correct existing password.' },
          { status: 400 }
        );
      }

      if (newPassword.trim().length < 6) {
        return NextResponse.json(
          { error: 'New password must be at least 6 characters in length.' },
          { status: 400 }
        );
      }

      updateData.passwordHash = await hashPassword(newPassword.trim());
    }

    // Persist changes in PostgreSQL
    const updatedUser = await prisma.user.update({
      where: { id: auth.userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Generate fresh JWT token with updated name/email
    const token = await signToken({
      userId: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
      name: updatedUser.name,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Administrator profile updated successfully in PostgreSQL.',
      user: updatedUser,
      token,
    });

    // Update HTTP-only session cookie
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    const formatted = formatPrismaError(error, 'Update Admin Profile');
    return NextResponse.json(
      { error: formatted.message },
      { status: formatted.status }
    );
  }
}
