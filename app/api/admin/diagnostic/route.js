import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const diagnostic = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
    databaseConfigured: Boolean(process.env.DATABASE_URL),
    databaseUrlType: process.env.DATABASE_URL
      ? process.env.DATABASE_URL.startsWith('postgresql://') || process.env.DATABASE_URL.startsWith('postgres://')
        ? 'PostgreSQL'
        : 'Other'
      : 'Missing',
    connectionStatus: 'pending',
    tables: {},
    errors: [],
  };

  if (!process.env.DATABASE_URL) {
    diagnostic.connectionStatus = 'FAILED_MISSING_DATABASE_URL';
    diagnostic.errors.push('DATABASE_URL environment variable is not set in Vercel environment.');
    return NextResponse.json(diagnostic, { status: 500 });
  }

  // Test 1: Raw connection test
  try {
    const rawResult = await prisma.$queryRaw`SELECT 1 as connected`;
    diagnostic.connectionStatus = 'CONNECTED';
    diagnostic.rawPing = rawResult ? 'OK' : 'EMPTY';
  } catch (err) {
    diagnostic.connectionStatus = 'FAILED_CONNECTION';
    diagnostic.errors.push({
      step: 'Raw Query Ping',
      code: err?.code || 'UNKNOWN',
      message: err?.message || String(err),
    });
    return NextResponse.json(diagnostic, { status: 500 });
  }

  // Test 2: Check User table
  try {
    const userCount = await prisma.user.count();
    diagnostic.tables.User = { ready: true, count: userCount };
  } catch (err) {
    diagnostic.tables.User = { ready: false, error: err?.message };
    diagnostic.errors.push({
      step: 'User Table Check',
      code: err?.code || 'UNKNOWN',
      message: err?.message || String(err),
    });
  }

  // Test 3: Check Product table
  try {
    const productCount = await prisma.product.count();
    diagnostic.tables.Product = { ready: true, count: productCount };
  } catch (err) {
    diagnostic.tables.Product = { ready: false, error: err?.message };
  }

  // Test 4: Check Category table
  try {
    const categoryCount = await prisma.category.count();
    diagnostic.tables.Category = { ready: true, count: categoryCount };
  } catch (err) {
    diagnostic.tables.Category = { ready: false, error: err?.message };
  }

  const allTablesReady = Object.values(diagnostic.tables).every((t) => t.ready);
  const httpStatus = allTablesReady ? 200 : 500;

  return NextResponse.json(
    {
      ...diagnostic,
      allTablesReady,
      recommendation: !allTablesReady
        ? 'Database is connected, but tables have not been created yet. Run "npx prisma db push" with your production DATABASE_URL to create all tables in PostgreSQL.'
        : 'Database and all core tables are healthy and operational.',
    },
    { status: httpStatus }
  );
}
