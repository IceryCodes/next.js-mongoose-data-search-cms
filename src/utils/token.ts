import { SignJWT, jwtVerify } from 'jose';

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
    console.error('Invalid token:', error);
    throw new Error('Invalid token');
  }
};
