import { Collection } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

import { PharmacyProps } from '@/domains/pharmacy';
import { getPharmaciesCollection } from '@/lib/mongodb';
import { PharmacyUpdateReturnType } from '@/services/interfaces';
import { HttpStatus } from '@/utils/api';
import { isAdminToken, isExpiredToken } from '@/utils/token';

const handler = async (req: NextApiRequest, res: NextApiResponse<PharmacyUpdateReturnType>) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
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

  const requiredFields = Object.keys({} as PharmacyProps) as (keyof PharmacyProps)[];
  for (const field of requiredFields) {
    if (req.body[field] === undefined) return res.status(HttpStatus.BadRequest).json({ message: `缺少所需資訊: ${field}` });
  }

  try {
    const pharmaciesCollection: Collection<PharmacyProps> = await getPharmaciesCollection();

    const newPharmacy: PharmacyProps = {
      ...req.body,
      managers: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await pharmaciesCollection.insertOne(newPharmacy);

    if (result.insertedId) {
      return res.status(HttpStatus.Created).json({ message: `已新增${newPharmacy.title}!` });
    } else {
      return res.status(HttpStatus.InternalServerError).json({ message: '新增藥局失敗!' });
    }
  } catch (error) {
    console.error('Error creating pharmacy:', error);
    res.status(HttpStatus.InternalServerError).json({ message: `Server error: ${error}` });
  }
};

export default handler;
