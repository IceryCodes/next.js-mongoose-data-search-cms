import type { NextApiRequest, NextApiResponse } from 'next';

import { HttpStatus } from '@/utils/api';
import { generateToken, verifyToken } from '@/utils/token';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Get token from headers

    if (token) {
      const userId: string = verifyToken(token);
      const newToken = generateToken(userId.toString());
      return res.status(HttpStatus.Ok).json({ token: newToken });
    }

    res.status(HttpStatus.Unauthorized).json({ message: 'Unauthorized' });
  } catch (error) {
    console.error('Renew token error:', error);
    res.status(HttpStatus.InternalServerError).json({ message: `Server error: ${error}` });
  }
}
