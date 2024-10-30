import { Collection, ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

import { HospitalProps } from '@/domains/hospital';
import { getHospitalsCollection } from '@/lib/mongodb';
import { HttpStatus } from '@/utils/api';
import { isAdminToken, isExpiredToken } from '@/utils/token';

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

  try {
    const isAdmin = await isAdminToken(req.headers.authorization);
    if (!isAdmin) return res.status(HttpStatus.Forbidden).json({ message: 'Insufficient permissions' });
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(HttpStatus.Unauthorized).json({ message: 'Invalid token' });
  }

  if (typeof req.body._id !== 'string' || !ObjectId.isValid(req.body._id))
    return res.status(HttpStatus.BadRequest).json({ message: '刪除醫院失敗!' });

  try {
    const hospitalsCollection: Collection<HospitalProps> = await getHospitalsCollection();
    const hospital = await hospitalsCollection.findOne({
      _id: new ObjectId(req.body._id as string),
      $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
    });
    if (!hospital) return res.status(HttpStatus.NotFound).json({ message: '醫院不存在' });

    const result = await hospitalsCollection.updateOne(
      { _id: new ObjectId(req.body._id as string) },
      { $set: { deletedAt: new Date() } }
    );

    if (result.modifiedCount === 0) {
      return res.status(HttpStatus.NotFound).json({ message: '醫院不存在!' });
    }

    res.status(HttpStatus.Ok).json({ message: `已刪除${hospital.title}!` });
  } catch (error) {
    console.error('Error soft deleting hospital:', error);
    res.status(HttpStatus.InternalServerError).json({ message: `Server error: ${error}` });
  }
};

export default handler;
