import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

if (!process.env.DATABASE_URL) {
  console.warn('[Prisma Warning] DATABASE_URL is not defined in process.env. Database operations will fail.');
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
} else {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = prisma;
  }
}

/**
 * Formats Prisma and Database errors into clean, informative messages
 * for server logs and client responses without exposing credentials.
 */
export function formatPrismaError(error, contextName = 'Database operation') {
  const code = error?.code;
  const message = error?.message || String(error);

  console.error(`[${contextName} Error]`, {
    code: code || 'UNKNOWN',
    name: error?.name,
    message: message,
    meta: error?.meta,
  });

  if (!process.env.DATABASE_URL) {
    return {
      status: 500,
      message: 'DATABASE_URL environment variable is missing on Vercel. Please add DATABASE_URL in Vercel Project Settings.',
    };
  }

  if (code === 'P2002') {
    const target = Array.isArray(error?.meta?.target)
      ? error.meta.target.join(', ')
      : error?.meta?.target || 'field';
    return {
      status: 409,
      message: `An account or record with this ${target} already exists.`,
    };
  }

  if (
    code === 'P2021' ||
    message.includes('does not exist in the current database') ||
    (message.includes('relation') && message.includes('does not exist'))
  ) {
    const table = error?.meta?.table || 'required table';
    return {
      status: 500,
      message: `PostgreSQL database table '${table}' does not exist. Please run 'npx prisma db push' to create tables in your database.`,
    };
  }

  if (code === 'P1001' || message.includes("Can't reach database server")) {
    return {
      status: 503,
      message: 'Cannot reach PostgreSQL database server. Please check your DATABASE_URL host, port, or connection pooler (e.g. Supabase port 6543 / pgbouncer).',
    };
  }

  if (code === 'P1000' || message.includes('Authentication failed')) {
    return {
      status: 401,
      message: 'Database authentication failed. Please verify your PostgreSQL username and password in DATABASE_URL.',
    };
  }

  if (code === 'P1002' || message.includes('timed out')) {
    return {
      status: 504,
      message: 'Database connection timed out. Please check PostgreSQL server availability and connection limits.',
    };
  }

  if (code === 'P2022') {
    return {
      status: 500,
      message: `Database column does not exist: ${error?.meta?.column || 'unknown'}. Run 'npx prisma db push' to sync database schema.`,
    };
  }

  return {
    status: 500,
    message: error?.message?.length < 150
      ? error.message
      : 'Database connection or operation error. Check Vercel runtime logs for details.',
  };
}

export default prisma;


