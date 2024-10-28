import type { NextApiRequest, NextApiResponse } from 'next';

import { HttpStatus } from '@/utils/api';
import { generateToken, TokenProps, verifyToken } from '@/utils/token';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Get token from headers

    if (token) {
      const { _id, role }: TokenProps = await verifyToken(token);
      const newToken: string = await generateToken({ _id: _id.toString(), role });
      return res.status(HttpStatus.Ok).json({ token: newToken });
    }

    res.status(HttpStatus.Unauthorized).json({ message: 'Unauthorized' });
  } catch (error) {
    console.error('Renew token error:', error);
    res.status(HttpStatus.InternalServerError).json({ message: `Server error: ${error}` });
  }
}
