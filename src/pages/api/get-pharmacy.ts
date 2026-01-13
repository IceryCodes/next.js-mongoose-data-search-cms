import { Collection, ObjectId, WithId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

import { ManageCategoryType } from '@/domains/manage';
import { PharmacyProps } from '@/domains/pharmacy';
import { getPharmaciesCollection } from '@/lib/mongodb';
import { GetPharmacyReturnType } from '@/services/interfaces';
import { HttpStatus } from '@/utils/api';
import { getManageRecordsByCategoryId } from '@/utils/apiFunctions';
import { isExpiredToken } from '@/utils/token';

const handler = async (req: NextApiRequest, res: NextApiResponse<GetPharmacyReturnType>) => {
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

  const { _id } = req.query;

  if (typeof _id !== 'string' || !ObjectId.isValid(_id)) {
    return res.status(HttpStatus.BadRequest).json({ message: 'Invalid body' });
  }

  try {
    const pharmaciesCollection: Collection<PharmacyProps> = await getPharmaciesCollection();

    const pharmacy: WithId<PharmacyProps> | null = await pharmaciesCollection.findOne({
      _id: new ObjectId(_id),
      $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
    });

    const manage = !!(
      pharmacy &&
      (await getManageRecordsByCategoryId({
        id: new ObjectId(_id),
        type: ManageCategoryType.Pharmacy,
      }))
    );

    res.status(HttpStatus.Ok).json({ pharmacy: pharmacy || null, manage, message: 'Success' });
  } catch (error) {
    console.error('Error fetching pharmacy by ID:', error);
    res.status(HttpStatus.InternalServerError).json({ message: `Server error: ${error}` });
  }
};

export default handler;
