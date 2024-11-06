import axios from 'axios';
import { SignJWT, jwtVerify } from 'jose';
import { JWTExpired } from 'jose/errors';

import { HospitalProps } from '@/domains/hospital';
import { UserRoleType } from '@/domains/interfaces';
import { ManageCategoryType } from '@/domains/manage';
import { PharmacyProps } from '@/domains/pharmacy';
import { UserProps } from '@/domains/user';
import { ManageProps } from '@/services/interfaces';

const JWT_SECRET = process.env.NEXT_PRIVATE_JWT_SECRET;

export interface TokenProps {
  user: UserProps;
  manage: ManageProps;
}

interface IsManagerTokenProps {
  authHeader: string | undefined;
  pageId: string;
  type: ManageCategoryType;
}

export const generateToken = async ({ user, manage }: TokenProps): Promise<string> => {
  if (!JWT_SECRET) throw new Error('JWT secret is missing');

  // Convert secret to Uint8Array
  const secretKey = new TextEncoder().encode(JWT_SECRET);

  // Sign the token using SignJWT from jose
  const token = await new SignJWT({ user, manage })
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
    const decodedPayload = payload as { user: UserProps; manage: ManageProps };

    // Create an array of keys from HospitalProps
    const requiredFields = Object.keys({} as UserProps) as (keyof UserProps)[];

    for (const field of requiredFields) {
      if (decodedPayload.user[field] === undefined) throw new Error('Invalid token payload');
    }

    // Validate structure of decoded payload
    if (
      !(
        decodedPayload.manage &&
        decodedPayload.manage[ManageCategoryType.Hospital] &&
        decodedPayload.manage[ManageCategoryType.Clinic] &&
        decodedPayload.manage[ManageCategoryType.Pharmacy]
      )
    ) {
      throw new Error('Invalid token payload');
    }

    return decodedPayload;
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
    const { user } = await verifyToken(token);

    return user.role === UserRoleType.Admin;
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
};

export const isManagerToken = async ({ authHeader, pageId, type }: IsManagerTokenProps): Promise<boolean> => {
  if (!JWT_SECRET) throw new Error('JWT secret is missing');

  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;

  const token = authHeader.split(' ')[1]; // Extract the token from the header

  const isMatch = (items: (HospitalProps | PharmacyProps)[]): boolean => items.some((obj) => obj._id.toString() === pageId);
  try {
    const {
      user,
      manage: { hospital, clinic, pharmacy },
    } = await verifyToken(token);
    if (typeof user._id === 'string' && user.role === UserRoleType.Admin) return true;

    const usedItems: (HospitalProps | PharmacyProps)[] =
      type === ManageCategoryType.Hospital ? hospital : type === ManageCategoryType.Clinic ? clinic : pharmacy;

    return isMatch(usedItems);
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

export const renewToken = async (token: string | null): Promise<string | null> => {
  if (!token) return null; // Return null if no token is provided

  try {
    const renewResponse = await axios.post(
      '/api/renew-token',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const newToken = renewResponse.data.token;
    sessionStorage.setItem('token', newToken); // Store the new token
    return newToken; // Return the new token
  } catch (error) {
    console.error('Token renewal failed:', error);
    return null; // Return null if renewal fails
  }
};
