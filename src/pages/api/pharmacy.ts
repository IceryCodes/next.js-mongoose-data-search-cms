import { Collection, ObjectId, WithId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

import { PharmacyProps } from '@/app/pharmacies/interfaces';
import { getPharmaciesCollection } from '@/lib/mongodb';

type ApiResponse = PharmacyProps | null;

const handler = async (req: NextApiRequest, res: NextApiResponse<ApiResponse>) => {
  const { _id } = req.query;

  // Validate ObjectId
  if (typeof _id !== 'string' || !ObjectId.isValid(_id)) {
    return res.status(400).json(null); // Invalid or missing ID
  }

  try {
    const pharmaciesCollection: Collection<PharmacyProps> = await getPharmaciesCollection();

    // Find pharmacy by ID
    const pharmacy: WithId<PharmacyProps> | null = await pharmaciesCollection.findOne({ _id: new ObjectId(_id) });

    // Return the found pharmacy or null if not found
    res.status(200).json(pharmacy || null);
  } catch (error) {
    console.error('Error fetching pharmacy by ID:', error);
    res.status(500).json(null); // Return null on server error
  }
};

export default handler;
