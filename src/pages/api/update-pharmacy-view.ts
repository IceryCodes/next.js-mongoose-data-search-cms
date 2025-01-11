import { Collection, ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

import { HospitalProps } from '@/domains/hospital';
import { getHospitalsCollection } from '@/lib/mongodb';
import { HttpStatus } from '@/utils/api';
import { isExpiredToken } from '@/utils/token';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') return res.status(HttpStatus.MethodNotAllowed).end();

  if (req.headers.authorization) {
    try {
      const isExpired = await isExpiredToken(req.headers.authorization);
      if (isExpired) return res.status(HttpStatus.Unauthorized).end();
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(HttpStatus.Unauthorized).end();
    }
  }

  const { _id } = req.body;

  if (typeof _id !== 'string' || !ObjectId.isValid(_id)) {
    return res.status(HttpStatus.BadRequest).end();
  }

  try {
    const hospitalsCollection: Collection<HospitalProps> = await getHospitalsCollection();

    await hospitalsCollection.updateOne(
      {
        _id: new ObjectId(_id),
        $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
      },
      {
        $inc: { viewed: 1 },
      },
      {
        upsert: true,
      }
    );

    res.status(HttpStatus.Ok).end().json({ message: `已更新瀏覽次數!` });
  } catch (error) {
    console.error('Error updating hospital view:', error);
    res.status(HttpStatus.InternalServerError).end();
  }
};

export default handler;
