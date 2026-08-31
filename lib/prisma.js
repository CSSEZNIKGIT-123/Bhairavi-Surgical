import { PrismaClient } from '@prisma/client';

const PRODUCTION_FALLBACK_DATABASE_URL =
  'postgresql://neondb_owner:npg_TnLgVAx2C7zQ@ep-lucky-shadow-awb046an-pooler.c-12.us-east-1.aws.neon.tech/neondb?sslmode=require';

/**
 * Resolves the database connection string from various environment variable providers
 * (Direct DATABASE_URL, Vercel Postgres, Neon DB, Supabase, or AWS RDS).
 */
export function getDatabaseUrl() {
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== '') {
    return process.env.DATABASE_URL.trim();
  }

  // Check common Vercel / Neon / Supabase aliases
  const candidates = [
    process.env.POSTGRES_PRISMA_URL,
    process.env.POSTGRES_URL,
    process.env.DB_POSTGRES_PRISMA_URL,
    process.env.DB_POSTGRES_URL,
    process.env.DB_DATABASE_URL,
    process.env.dB_POSTGRES_PRISMA_URL,
    process.env.dB_POSTGRES_URL,
    process.env.dB_DATABASE_URL,
    process.env.DATABASE_URL_UNPOOLED,
    process.env.DB_DATABASE_URL_UNPOOLED,
    process.env.POSTGRES_URL_NON_POOLING,
    process.env.dB_POSTGRES_URL_NON_POOLING,
    process.env.DB_POSTGRES_URL_NON_POOLING,
    process.env.DIRECT_URL,
    process.env.POSTGRESQL_URL,
    process.env.NEON_DATABASE_URL,
  ];

  for (const candidate of candidates) {
    if (candidate && typeof candidate === 'string' && candidate.trim() !== '') {
      return candidate.trim();
    }
  }

  // Check if credentials are provided in parts
  const host = process.env.PGHOST || process.env.DB_PGHOST || process.env.dB_PGHOST;
  const user = process.env.PGUSER || process.env.DB_PGUSER || process.env.dB_PGUSER;
  const password = process.env.PGPASSWORD || process.env.DB_PGPASSWORD || process.env.dB_PGPASSWORD;
  const database = process.env.PGDATABASE || process.env.DB_PGDATABASE || process.env.dB_PGDATABASE || 'neondb';

  if (host && user && password) {
    return `postgresql://${user}:${encodeURIComponent(password)}@${host}/${database}?sslmode=require`;
  }

  // Fallback to active Neon database to ensure seamless zero-downtime operations
  return PRODUCTION_FALLBACK_DATABASE_URL;
}

// Ensure process.env.DATABASE_URL is set in the runtime environment
const resolvedDatabaseUrl = getDatabaseUrl();
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = resolvedDatabaseUrl;
}

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: resolvedDatabaseUrl,
      },
    },
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

  const activeUrl = getDatabaseUrl();
  if (!activeUrl) {
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
