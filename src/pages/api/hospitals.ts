import { Collection, WithId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

import { DepartmentsType, HospitalProps } from '@/app/hospitals/interfaces';
import { getHospitalsCollection } from '@/lib/mongodb';

interface ApiResponse {
  hospitals: HospitalProps[];
  total: number;
}

const handler = async (req: NextApiRequest, res: NextApiResponse<ApiResponse | undefined>) => {
  const { query, county, departments, page = '1', limit = '10' } = req.query;

  // Parse page and limit as integers
  const currentPage: number = Number(page);
  const pageSize: number = Number(limit);

  // Return undefined if query is invalid
  if (isNaN(currentPage) || currentPage < 1 || isNaN(pageSize) || pageSize < 1) {
    return res.status(400).json(undefined);
  }

  try {
    // Use the shared hospitals collection
    const hospitalsCollection: Collection<HospitalProps> = await getHospitalsCollection();

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

    // Filter out sample by keyword if production
    if (process.env.NODE_ENV === 'production') {
      mongoQuery.keywords = { $not: { $all: ['Sample'] } };
    }

    // Fetch total count of matching documents before pagination
    const total: number = await hospitalsCollection.countDocuments(mongoQuery);

    // Fetch hospitals based on filters and apply pagination
    const hospitals: WithId<HospitalProps>[] = await hospitalsCollection
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
};

export default handler;
