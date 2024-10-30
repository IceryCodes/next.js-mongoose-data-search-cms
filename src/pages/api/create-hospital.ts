import { Collection } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

import { HospitalProps } from '@/domains/hospital';
import { getHospitalsCollection } from '@/lib/mongodb';
import { HttpStatus } from '@/utils/api';
import { isAdminToken, isExpiredToken } from '@/utils/token';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
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

  // Validate required fields in the request body
  const requiredFields = Object.keys({} as HospitalProps) as (keyof HospitalProps)[];
  for (const field of requiredFields) {
    if (req.body[field] === undefined) return res.status(HttpStatus.BadRequest).json({ message: `缺少所需資訊: ${field}` });
  }

  // Create the hospital record
  try {
    const hospitalsCollection: Collection<HospitalProps> = await getHospitalsCollection();

    // Set createdAt and updatedAt fields
    const newHospital: HospitalProps = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await hospitalsCollection.insertOne(newHospital);

    if (result.insertedId) {
      return res.status(HttpStatus.Created).json({ message: `已新增${newHospital.title}!`, hospitalId: result.insertedId });
    } else {
      return res.status(HttpStatus.InternalServerError).json({ message: '新增醫院失敗!' });
    }
  } catch (error) {
    console.error('Error creating hospital:', error);
    res.status(HttpStatus.InternalServerError).json({ message: `Server error: ${error}` });
  }
};

export default handler;
