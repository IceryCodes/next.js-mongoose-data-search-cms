import { ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

import { HospitalProps } from '@/app/hospitals/interfaces';
import { getHospitalsCollection } from '@/lib/mongodb';

type ApiResponse = HospitalProps | null;

const handler = async (req: NextApiRequest, res: NextApiResponse<ApiResponse>) => {
  const { _id } = req.query;

  // Validate ObjectId
  if (typeof _id !== 'string' || !ObjectId.isValid(_id)) {
    return res.status(400).json(null); // Invalid or missing ID
  }

  try {
    const hospitalsCollection = await getHospitalsCollection();

    // Find hospital by ID
    const hospital = await hospitalsCollection.findOne({ _id: new ObjectId(_id) });

    // Return the found hospital or null if not found
    res.status(200).json(hospital || null);
  } catch (error) {
    console.error('Error fetching hospital by ID:', error);
    res.status(500).json(null); // Return null on server error
  }
};

export default handler;
