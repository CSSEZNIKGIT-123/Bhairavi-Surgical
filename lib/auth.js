import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

function getJwtSecret() {
  const secret = process.env.JWT_SECRET || 'bhairavi-surgical-super-secure-jwt-secret-key-2026';
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password) {
  if (!password || typeof password !== 'string') {
    throw new Error('Password must be a valid string');
  }
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password, hashedPassword) {
  if (!password || !hashedPassword) return false;
  return bcrypt.compare(password, hashedPassword);
}

export async function signToken(payload, expiresIn = '7d') {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getJwtSecret());
}

export async function verifyToken(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload;
  } catch (error) {
    return null;
  }
}

export function getUserFromRequest(request, preferredType = null) {
  if (!request) return null;

  // 1. Check Authorization Bearer header
  const authHeader = request.headers?.get ? request.headers.get('authorization') : null;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    if (token) return token;
  }

  // 2. Check cookies
  const cookies = request.cookies;
  if (cookies && typeof cookies.get === 'function') {
    const adminToken = cookies.get('admin_token')?.value;
    const authToken = cookies.get('auth_token')?.value;

    const url = request.url || '';
    const isAdminPath = preferredType === 'admin' || url.includes('/api/admin');

    if (isAdminPath) {
      return adminToken || authToken || null;
    }

    if (preferredType === 'customer') {
      return authToken || adminToken || null;
    }

    return authToken || adminToken || null;
  }

  return null;
}

export async function getAuthenticatedUser(request, preferredType = null) {
  const token = getUserFromRequest(request, preferredType);
  if (!token) return null;
  return verifyToken(token);
}

