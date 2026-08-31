import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
} else {
  // In serverless environments like Vercel, attach to globalThis to reuse connection across warm lambdas
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = prisma;
  }
}

export default prisma;

