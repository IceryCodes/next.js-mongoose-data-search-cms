import { Collection, WithId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

import { PharmacyProps } from '@/app/pharmacies/interfaces';
import { getPharmaciesCollection } from '@/lib/mongodb';

interface ApiResponse {
  pharmacies: PharmacyProps[];
  total: number;
}

const handler = async (req: NextApiRequest, res: NextApiResponse<ApiResponse | undefined>) => {
  const { query, county, healthInsuranceAuthorized = 'false', page = '1', limit = '10' } = req.query;

  // Parse page and limit as integers
  const currentPage: number = Number(page);
  const pageSize: number = Number(limit);

  // Return undefined if query is invalid
  if (isNaN(currentPage) || currentPage < 1 || isNaN(pageSize) || pageSize < 1) {
    return res.status(400).json(undefined);
  }

  try {
    // Use the shared pharmacies collection
    const pharmaciesCollection: Collection<PharmacyProps> = await getPharmaciesCollection();

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

    // Filter by healthInsuranceAuthorized if specified
    if (healthInsuranceAuthorized && typeof healthInsuranceAuthorized === 'string' && healthInsuranceAuthorized === 'true') {
      mongoQuery.healthInsuranceAuthorized = true;
    }

    // Filter out sample by keyword if production
    if (process.env.NODE_ENV === 'production') {
      mongoQuery.keywords = { $not: { $all: ['Sample'] } };
    }

    // Fetch total count of matching documents before pagination
    const total: number = await pharmaciesCollection.countDocuments(mongoQuery);

    // Fetch pharmacies based on filters and apply pagination
    const pharmacies: WithId<PharmacyProps>[] = await pharmaciesCollection
      .find(mongoQuery)
      .sort({ partner: -1 }) // Sort so partner pharmacies come first
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    // Return paginated results along with the total count
    res.status(200).json({
      pharmacies,
      total, // Total number of filtered pharmacies
    });
  } catch (error) {
    console.error('Error fetching pharmacies:', error);
    res.status(500).json(undefined);
  }
};

export default handler;
