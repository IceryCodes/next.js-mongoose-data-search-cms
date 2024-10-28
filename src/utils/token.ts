import { SignJWT, jwtVerify } from 'jose';
import { JWTExpired } from 'jose/errors';

import { UserRoleType } from '@/domains/interfaces';

const JWT_SECRET = process.env.NEXT_PRIVATE_JWT_SECRET;

export interface TokenProps {
  _id: string;
  role: UserRoleType;
}

export const generateToken = async ({ _id, role }: TokenProps): Promise<string> => {
  if (!JWT_SECRET) throw new Error('JWT secret is missing');

  // Convert secret to Uint8Array
  const secretKey = new TextEncoder().encode(JWT_SECRET);

  // Sign the token using SignJWT from jose
  const token = await new SignJWT({ _id, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1h')
    .sign(secretKey);

  return token;
};

export const verifyToken = async (token: string): Promise<TokenProps> => {
  if (!JWT_SECRET) throw new Error('JWT secret is missing');

  // Convert secret to Uint8Array
  const secretKey = new TextEncoder().encode(JWT_SECRET);
  try {
    const { payload } = await jwtVerify(token, secretKey); // Use the Uint8Array key

    // Validate structure of decoded payload
    if (typeof payload._id !== 'string' || typeof payload.role !== 'number') {
      throw new Error('Invalid token payload');
    }

    return { _id: payload._id, role: payload.role };
  } catch (error) {
    if (error instanceof JWTExpired) {
      console.warn('Token verification failed: Token has expired');
    } else {
      console.warn('Token verification failed:', error);
    }
    throw error;
  }
};

export const isAdminToken = async (authHeader: string | undefined): Promise<boolean> => {
  if (!JWT_SECRET) throw new Error('JWT secret is missing');

  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;

  const token = authHeader.split(' ')[1]; // Extract the token from the header

  try {
    const { role } = await verifyToken(token);

    return role === UserRoleType.Admin;
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
};

export const isExpiredToken = async (authHeader: string | undefined): Promise<boolean> => {
  if (!JWT_SECRET) throw new Error('JWT secret is missing');

  if (!authHeader || !authHeader.startsWith('Bearer ')) return true; // If no token, consider it expired

  const token = authHeader.split(' ')[1]; // Extract the token from the header

  try {
    await verifyToken(token); // Try verifying the token
    return false; // If no error, the token is valid (not expired)
  } catch (error) {
    if (error instanceof JWTExpired) {
      return true; // If the error is a JWTExpired, then it's expired
    }
    // For other errors, you may choose to handle them differently or just return true
    console.warn('Error verifying token:', error);
    return true; // Treat other errors as expired or invalid
  }
};
