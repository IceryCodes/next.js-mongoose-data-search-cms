import { Collection, ObjectId, WithId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

import { HospitalProps } from '@/domains/hospital';
import { getHospitalsCollection } from '@/lib/mongodb';
import { GetHospitalReturnType } from '@/services/interfaces';
import { HttpStatus } from '@/utils/api';

const handler = async (req: NextApiRequest, res: NextApiResponse<GetHospitalReturnType>) => {
  const { _id } = req.query;

  if (typeof _id !== 'string' || !ObjectId.isValid(_id)) {
    return res.status(HttpStatus.BadRequest).json({ message: 'Invalid body' });
  }

  try {
    const hospitalsCollection: Collection<HospitalProps> = await getHospitalsCollection();

    const hospital: WithId<HospitalProps> | null = await hospitalsCollection.findOne({ _id: new ObjectId(_id) });

    res.status(HttpStatus.Ok).json({ hospital: hospital || null, message: 'Success' });
  } catch (error) {
    console.error('Error fetching hospital by ID:', error);
    res.status(HttpStatus.InternalServerError).json({ message: `Server error: ${error}` });
  }
};

export default handler;
