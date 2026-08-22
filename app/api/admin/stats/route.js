import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken, getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const token = getUserFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized admin request' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    const adminRoles = ['SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER', 'ACCOUNT_MANAGER'];
    if (!payload || !adminRoles.includes(payload.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const [
      totalOrders,
      orders,
      totalQuotes,
      pendingQuotes,
      totalInquiries,
      newInquiries,
      totalProducts,
      totalUsers,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.findMany({
        take: 8,
        orderBy: { createdAt: 'desc' },
        include: { items: { include: { product: true } } },
      }),
      prisma.quote.count(),
      prisma.quote.count({ where: { status: 'SUBMITTED' } }),
      prisma.specialInquiry.count(),
      prisma.specialInquiry.count({ where: { status: 'NEW' } }),
      prisma.product.count(),
      prisma.user.count(),
    ]);

    const totalRevenue = orders.reduce((sum, ord) => sum + (ord.totalAmount || 0), 0);

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        totalQuotes,
        pendingQuotes,
        totalInquiries,
        newInquiries,
        totalProducts,
        totalUsers,
      },
      recentOrders: orders,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin stats' },
      { status: 500 }
    );
  }
}
