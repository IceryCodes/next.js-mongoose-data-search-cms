import { Collection, ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

import { UserUpdateDto, UserWithPasswordProps } from '@/domains/user';
import { getUsersCollection } from '@/lib/mongodb';
import { UserUpdateReturnType } from '@/services/interfaces';
import { HttpStatus } from '@/utils/api';
import { isExpiredToken } from '@/utils/token';

const handler = async (req: NextApiRequest, res: NextApiResponse<UserUpdateReturnType>) => {
  if (req.method !== 'PATCH') {
    res.setHeader('Allow', ['PATCH']);
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

  // Create an array of keys from UserUpdateDto
  const requiredFields = Object.keys({} as UserUpdateDto) as (keyof UserUpdateDto)[];

  for (const field of requiredFields) {
    if (req.body[field] === undefined) return res.status(HttpStatus.BadRequest).json({ message: `缺少所需資訊: ${field}` });
  }

  if (typeof req.body._id !== 'string' || !ObjectId.isValid(req.body._id))
    return res.status(HttpStatus.BadRequest).json({ message: '更新帳號失敗!' });

  try {
    const usersCollection: Collection<Omit<UserWithPasswordProps, '_id'>> = await getUsersCollection();
    const userId = new ObjectId(req.body._id as string);
    const updateFields = req.body;

    delete updateFields._id;

    const updateData: Partial<UserUpdateDto> = {
      ...req.body,
      createdAt: new Date(req.body.createdAt),
      updatedAt: new Date(),
    };

    const result = await usersCollection.updateOne(
      { _id: userId, $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }] },
      {
        $set: updateData,
      }
    );

    if (result.modifiedCount === 0) return res.status(HttpStatus.NotFound).json({ message: '醫院不存在!' });

    res.status(HttpStatus.Ok).json({ message: `已更新${updateData.firstName}${updateData.lastName}!` });
  } catch (error) {
    console.error('Error updating s:', error);
    res.status(HttpStatus.InternalServerError).json({ message: `Server error: ${error}` });
  }
};

export default handler;
