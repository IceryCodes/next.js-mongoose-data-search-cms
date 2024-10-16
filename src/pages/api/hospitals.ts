import { MongoClient } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

import { DepartmentsType, HospitalProps } from '@/app/hospitals/interfaces';

const uri = 'mongodb://Zioncare:zioncare2icery@localhost:27017/?authMechanism=DEFAULT&authSource=hospital_search';
const client = new MongoClient(uri);

let clientPromise: Promise<MongoClient> | null = null;

async function connectToDatabase() {
  if (!clientPromise) {
    clientPromise = client.connect(); // Reuse connection
  }
  return clientPromise;
}

interface ApiResponse {
  hospitals: HospitalProps[];
  total: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse | undefined>) {
  const { query, county, departments, page = '1', limit = '10' } = req.query;

  // Parse page and limit as integers
  const currentPage: number = Number(page);
  const pageSize: number = Number(limit);

  // Return undefined if query is invalid
  if (isNaN(currentPage) || currentPage < 1 || isNaN(pageSize) || pageSize < 1) {
    return res.status(400).json(undefined);
  }

  try {
    // Connect to MongoDB using pooled connection
    const client = await connectToDatabase();
    const database = client.db('hospital_search');
    const hospitalsCollection = database.collection<HospitalProps>('hospitals');

    // Build MongoDB query
    const mongoQuery: Record<string, unknown> = {}; // Type-safe object

    // Add query-based filtering (title search)
    if (query && typeof query === 'string') {
      const queryWords = query.toLowerCase().split(' ').filter(Boolean);
      mongoQuery.title = { $regex: queryWords.join('|'), $options: 'i' }; // Case-insensitive search
    }

    // Filter by county if specified
    if (county && typeof county === 'string') {
      mongoQuery.county = county;
    }

    // Filter by departments if specified
    if (departments && typeof departments === 'string') {
      mongoQuery.departments = { $in: [departments as DepartmentsType] };
    }

    // Fetch total count of matching documents before pagination
    const total = await hospitalsCollection.countDocuments(mongoQuery);

    // Fetch hospitals based on filters and apply pagination
    const hospitals = await hospitalsCollection
      .find(mongoQuery)
      .sort({ partner: -1 }) // Sort so partner hospitals come first
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    // Return paginated results along with the total count
    res.status(200).json({
      hospitals,
      total, // Total number of filtered hospitals
    });
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    res.status(500).json(undefined);
  }
}
