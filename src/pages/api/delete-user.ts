import { Collection, ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

import { UserWithPasswordProps } from '@/domains/user';
import { getUsersCollection } from '@/lib/mongodb';
import { HttpStatus } from '@/utils/api';
import { isExpiredToken } from '@/utils/token';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'DELETE') {
    res.setHeader('Allow', ['DELETE']);
    return res.status(HttpStatus.MethodNotAllowed).json({ message: `Method ${req.method} not allowed` });
  }

  // renew token
  if (req.headers.authorization) {
    try {
      const isExpired = await isExpiredToken(req.headers.authorization);
      if (isExpired) return res.status(HttpStatus.Unauthorized).json({ message: 'Token expired' });
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(HttpStatus.Unauthorized).json({ message: 'Invalid token' });
    }
  }

  if (typeof req.body._id !== 'string' || !ObjectId.isValid(req.body._id))
    return res.status(HttpStatus.BadRequest).json({ message: '刪除帳號失敗!' });

  try {
    const usersCollection: Collection<Omit<UserWithPasswordProps, '_id'>> = await getUsersCollection();
    const user = await usersCollection.findOne({
      _id: new ObjectId(req.body._id as string),
      $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
    });
    if (!user) return res.status(HttpStatus.NotFound).json({ message: '帳號不存在' });

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(req.body._id as string) },
      { $set: { deletedAt: new Date() } }
    );

    if (result.modifiedCount === 0) {
      return res.status(HttpStatus.NotFound).json({ message: '帳號不存在!' });
    }

    res.status(HttpStatus.Ok).json({ message: `已刪除${user.firstName}${user.lastName}!` });
  } catch (error) {
    console.error('Error soft deleting user:', error);
    res.status(HttpStatus.InternalServerError).json({ message: `Server error: ${error}` });
  }
};

export default handler;
