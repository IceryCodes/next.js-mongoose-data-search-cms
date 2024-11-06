import { decodeJwt } from 'jose';
import { ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

import { ManageProps } from '@/services/interfaces';
import { HttpStatus } from '@/utils/api';
import { getManageRecordsByUserId, getUserByUserId } from '@/utils/apiFunctions';
import { generateToken, TokenProps } from '@/utils/token';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      const {
        user: { _id },
      }: TokenProps = decodeJwt(token);

      // Check if the token contains valid data
      if (_id) {
        const user = await getUserByUserId(new ObjectId(_id));
        const manage: ManageProps = await getManageRecordsByUserId(new ObjectId(_id));

        if (!user) return res.status(HttpStatus.Unauthorized).json({ message: 'Unauthorized' });
        // Generate a new token
        const newToken: string = await generateToken({ user, manage });

        return res.status(HttpStatus.Ok).json({ token: newToken });
      } else {
        return res.status(HttpStatus.Unauthorized).json({ message: 'Unauthorized' });
      }
    }

    return res.status(HttpStatus.Unauthorized).json({ message: 'Unauthorized' });
  } catch (error) {
    console.error('Renew token error:', error);
    return res.status(HttpStatus.InternalServerError).json({ message: `Server error: ${error}` });
  }
}
