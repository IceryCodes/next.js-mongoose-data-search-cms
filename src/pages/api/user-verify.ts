import { ObjectId, UpdateResult } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

import { UserWithPasswordProps } from '@/domains/user';
import { getUsersCollection } from '@/lib/mongodb';
import { UserVerifyReturnType } from '@/services/interfaces';
import { HttpStatus } from '@/utils/api';
import { isExpiredToken, TokenProps, verifyToken } from '@/utils/token';

const handler = async (req: NextApiRequest, res: NextApiResponse<UserVerifyReturnType>) => {
  // renew token
  if (req.method !== 'GET') return res.status(HttpStatus.MethodNotAllowed).json({ message: 'Method not allowed' });
  if (req.headers.authorization) {
    try {
      const isExpired = await isExpiredToken(req.headers.authorization);
      if (isExpired) return res.status(HttpStatus.Unauthorized).json({ message: 'Token expired' });
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(HttpStatus.Unauthorized).json({ message: 'Invalid token' });
    }
  }

  const { token } = req.query;

  if (typeof token !== 'string') return res.status(HttpStatus.BadRequest).json({ message: 'Invalid body' });

  try {
    const { user }: TokenProps = await verifyToken(token);

    const usersCollection = await getUsersCollection();
    const result: UpdateResult<Omit<UserWithPasswordProps, '_id'>> = await usersCollection.updateOne(
      { _id: new ObjectId(user._id) },
      { $set: { isVerified: true } }
    );

    if (result.modifiedCount === 0) return res.status(HttpStatus.NotFound).json({ message: '驗證失效!' });

    res.status(HttpStatus.Ok).json({ message: '驗證成功!' });
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(HttpStatus.InternalServerError).json({ message: `Server error: ${error}` });
  }
};

export default handler;
