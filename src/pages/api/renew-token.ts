import { decodeJwt } from 'jose';
import type { NextApiRequest, NextApiResponse } from 'next';

import { UserRoleType } from '@/domains/interfaces';
import { HttpStatus } from '@/utils/api';
import { generateToken } from '@/utils/token';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Get token from headers

    if (token) {
      // Decode the token without verification
      const decodedToken = decodeJwt(token);

      // Check if the token contains valid data
      if (decodedToken && typeof decodedToken === 'object' && decodedToken._id && decodedToken.role) {
        const _id = decodedToken._id as string; // Cast to string if necessary
        const role = decodedToken.role as UserRoleType; // Role should be of type UserRoleType

        // Generate a new token
        const newToken: string = await generateToken({ _id, role });
        return res.status(HttpStatus.Ok).json({ token: newToken });
      }
    }

    res.status(HttpStatus.Unauthorized).json({ message: 'Unauthorized' });
  } catch (error) {
    console.error('Renew token error:', error);
    res.status(HttpStatus.InternalServerError).json({ message: `Server error: ${error}` });
  }
}
