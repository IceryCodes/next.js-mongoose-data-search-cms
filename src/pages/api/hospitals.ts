import { Collection, WithId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

import { DepartmentsType, HospitalCategoryType, HospitalProps } from '@/app/hospitals/interfaces';
import { getHospitalsCollection } from '@/lib/mongodb';

interface ApiResponse {
  hospitals: HospitalProps[];
  total: number;
}

const handler = async (req: NextApiRequest, res: NextApiResponse<ApiResponse | undefined>) => {
  const { query, county, departments, partner, category, page = '1', limit = '10' } = req.query;

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

    // Filter by partner if specified
    if (partner === 'true') mongoQuery.partner = true;

    // Filter by title with HospitalCategoryType
    // 1. First, apply the category filter (Hospital or Clinic) using HospitalCategoryType
    if (category && typeof category === 'string') {
      if (category === HospitalCategoryType.Hospital) {
        mongoQuery.title = { $regex: '醫院', $options: 'i' }; // Case-insensitive search for "醫院"
      } else if (category === HospitalCategoryType.Clinic) {
        mongoQuery.title = { $not: { $regex: '醫院', $options: 'i' } }; // Exclude "醫院"
      } else {
        return res.status(400).json(undefined); // Invalid category value
      }
    }

    // 2. After applying category, apply the query-based filtering (title search)
    if (query && typeof query === 'string') {
      const queryWords = query.toLowerCase().split(' ').filter(Boolean);

      // If category filter is applied, combine it with the query filter using $and
      if (mongoQuery.title) {
        mongoQuery.$and = [
          { title: mongoQuery.title }, // Category-based filtering
          { title: { $regex: queryWords.join('|'), $options: 'i' } }, // Query-based search
        ];
        delete mongoQuery.title; // Remove top-level title query since it’s now in $and
      } else {
        // If no category-based title filter, just apply the query-based filter
        mongoQuery.title = { $regex: queryWords.join('|'), $options: 'i' };
      }
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
