import { decodeJwt } from 'jose';
import { ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

import { UserProps } from '@/domains/user';
import { ManageProps } from '@/services/interfaces';
import { HttpStatus } from '@/utils/api';
import { getManageRecordsByUserId } from '@/utils/apiFunctions';
import { generateToken } from '@/utils/token';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Get token from headers

    if (token) {
      // Decode the token without verification
      const decodedToken = decodeJwt(token);

      // Check if the token contains valid data
      if (decodedToken && typeof decodedToken === 'object' && decodedToken._id && decodedToken.role) {
        const user = decodedToken.user as UserProps;
        const manage: ManageProps = await getManageRecordsByUserId(new ObjectId(user._id));

        // Generate a new token
        const newToken: string = await generateToken({ user, manage });
        return res.status(HttpStatus.Ok).json({ token: newToken });
      }
    }

    res.status(HttpStatus.Unauthorized).json({ message: 'Unauthorized' });
  } catch (error) {
    console.error('Renew token error:', error);
    res.status(HttpStatus.InternalServerError).json({ message: `Server error: ${error}` });
  }
}
