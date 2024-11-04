import { Collection, WithId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

import { UserProps, UserWithPasswordProps } from '@/domains/user';
import { getUsersCollection } from '@/lib/mongodb';
import { GetUsersReturnType } from '@/services/interfaces';
import { HttpStatus } from '@/utils/api';
import { isAdminToken, isExpiredToken } from '@/utils/token';

const handler = async (req: NextApiRequest, res: NextApiResponse<GetUsersReturnType>) => {
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

  try {
    const isAdmin = await isAdminToken(req.headers.authorization);
    if (!isAdmin) return res.status(HttpStatus.Forbidden).json({ message: 'Insufficient permissions' });
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(HttpStatus.Unauthorized).json({ message: 'Invalid token' });
  }

  const { email } = req.query;
  if (!email) res.status(HttpStatus.NotFound).json({ message: '找不到帳號！' });

  try {
    const usersCollection: Collection<Omit<UserWithPasswordProps, '_id'>> = await getUsersCollection();

    const mongoQuery: Record<string, unknown> = {}; // Type-safe object
    mongoQuery.$or = [{ deletedAt: null }, { deletedAt: { $exists: false } }];

    if (email && typeof email === 'string') {
      mongoQuery.email = { $regex: decodeURIComponent(email), $options: 'i' };
    }

    const total: number = await usersCollection.countDocuments(mongoQuery);

    const users: WithId<UserProps>[] = await usersCollection.find(mongoQuery).toArray();

    res.status(HttpStatus.Ok).json({
      users,
      total,
      message: 'Success',
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(HttpStatus.InternalServerError).json({ message: `Server error: ${error}` });
  }
};

export default handler;
