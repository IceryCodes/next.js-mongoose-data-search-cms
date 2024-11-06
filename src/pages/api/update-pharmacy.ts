import { Collection, ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

import { ManageCategoryType } from '@/domains/manage';
import { PharmacyProps } from '@/domains/pharmacy';
import { getPharmaciesCollection } from '@/lib/mongodb';
import { HospitalUpdateReturnType } from '@/services/interfaces';
import { HttpStatus } from '@/utils/api';
import { isExpiredToken, isManagerToken } from '@/utils/token';

const handler = async (req: NextApiRequest, res: NextApiResponse<HospitalUpdateReturnType>) => {
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

  // Create an array of keys from PharmacyProps
  const requiredFields = Object.keys({} as PharmacyProps) as (keyof PharmacyProps)[];

  for (const field of requiredFields) {
    if (req.body[field] === undefined) return res.status(HttpStatus.BadRequest).json({ message: `缺少所需資訊: ${field}` });
  }

  if (typeof req.body._id !== 'string' || !ObjectId.isValid(req.body._id))
    return res.status(HttpStatus.BadRequest).json({ message: '更新藥局失敗!' });

  try {
    const pharmaciesCollection: Collection<PharmacyProps> = await getPharmaciesCollection();
    const pharmacyId = new ObjectId(req.body._id as string);
    const updateFields = req.body;

    delete updateFields._id;

    const updateData: Partial<PharmacyProps> = {
      ...req.body,
      createdAt: new Date(req.body.createdAt),
      updatedAt: new Date(),
    };

    const isManager = await isManagerToken({
      authHeader: req.headers.authorization,
      pageId: req.body._id,
      type: ManageCategoryType.Pharmacy,
    });
    if (!isManager) return res.status(HttpStatus.Forbidden).json({ message: '沒有管理權限!' });

    const result = await pharmaciesCollection.updateOne(
      { _id: pharmacyId, $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }] },
      {
        $set: updateData,
      }
    );

    if (result.modifiedCount === 0) return res.status(HttpStatus.NotFound).json({ message: '藥局不存在!' });

    res.status(HttpStatus.Ok).json({ message: `已更新${updateData.title}!` });
  } catch (error) {
    console.error('Error updating pharmacy:', error);
    res.status(HttpStatus.InternalServerError).json({ message: `Server error: ${error}` });
  }
};

export default handler;
