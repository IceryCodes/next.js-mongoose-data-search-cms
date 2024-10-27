import { Collection, ObjectId, WithId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

import { PharmacyProps } from '@/domains/pharmacy';
import { getPharmaciesCollection } from '@/lib/mongodb';
import { GetPharmacyReturnType } from '@/services/interfaces';
import { HttpStatus } from '@/utils/api';

const handler = async (req: NextApiRequest, res: NextApiResponse<GetPharmacyReturnType>) => {
  const { _id } = req.query;

  if (typeof _id !== 'string' || !ObjectId.isValid(_id)) {
    return res.status(HttpStatus.BadRequest).json({ message: 'Invalid body' });
  }

  try {
    const pharmaciesCollection: Collection<PharmacyProps> = await getPharmaciesCollection();

    const pharmacy: WithId<PharmacyProps> | null = await pharmaciesCollection.findOne({ _id: new ObjectId(_id) });

    res.status(HttpStatus.Ok).json({ pharmacy: pharmacy || null, message: 'Success' });
  } catch (error) {
    console.error('Error fetching pharmacy by ID:', error);
    res.status(HttpStatus.InternalServerError).json({ message: `Server error: ${error}` });
  }
};

export default handler;
