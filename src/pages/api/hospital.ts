import { MongoClient, ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

import { HospitalProps } from '@/app/hospitals/interfaces';

const uri = 'mongodb://Zioncare:zioncare2icery@localhost:27017/?authMechanism=DEFAULT&authSource=hospital_search';
const client = new MongoClient(uri);

let clientPromise: Promise<MongoClient> | null = null;

async function connectToDatabase() {
  if (!clientPromise) {
    clientPromise = client.connect(); // Reuse connection
  }
  return clientPromise;
}

type ResponseData = HospitalProps | null;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const { _id } = req.query;

  // Validate ObjectId
  if (typeof _id !== 'string' || !ObjectId.isValid(_id)) {
    return res.status(400).json(null); // Invalid or missing ID
  }

  try {
    // Connect to MongoDB using connection pooling
    const client = await connectToDatabase();
    const database = client.db('hospital_search');
    const hospitalsCollection = database.collection<HospitalProps>('hospitals');

    // Find hospital by ID
    const hospital = await hospitalsCollection.findOne({ _id: new ObjectId(_id) });

    // Return the found hospital or null if not found
    res.status(200).json(hospital || null);
  } catch (error) {
    console.error('Error fetching hospital by ID:', error);
    res.status(500).json(null); // Return null on server error
  }
}
