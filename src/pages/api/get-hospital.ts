import { Collection, ObjectId, WithId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

import { HospitalProps } from '@/domains/hospital';
import { ManageCategoryType } from '@/domains/manage';
import { getHospitalsCollection } from '@/lib/mongodb';
import { GetHospitalReturnType } from '@/services/interfaces';
import { HttpStatus } from '@/utils/api';
import { getManageRecordsByCategoryId } from '@/utils/apiFunctions';
import { isExpiredToken } from '@/utils/token';

const handler = async (req: NextApiRequest, res: NextApiResponse<GetHospitalReturnType>) => {
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
    const hospitalsCollection: Collection<HospitalProps> = await getHospitalsCollection();

    const hospital: WithId<HospitalProps> | null = await hospitalsCollection.findOne({
      _id: new ObjectId(_id),
      $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
    });

    const manage: boolean = !!(
      hospital &&
      (await getManageRecordsByCategoryId({
        id: new ObjectId(_id),
        type: hospital?.title.includes('醫院') ? ManageCategoryType.Hospital : ManageCategoryType.Clinic,
      }))
    );

    res.status(HttpStatus.Ok).json({ hospital: hospital || null, manage, message: 'Success' });
  } catch (error) {
    console.error('Error fetching hospital by ID:', error);
    res.status(HttpStatus.InternalServerError).json({ message: `Server error: ${error}` });
  }
};

export default handler;
