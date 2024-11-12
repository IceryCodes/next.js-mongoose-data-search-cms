import { Collection, WithId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

import { DepartmentsType, HospitalCategoryType, HospitalProps } from '@/domains/hospital';
import { getHospitalsCollection } from '@/lib/mongodb';
import { GetHospitalsReturnType } from '@/services/interfaces';
import { HttpStatus } from '@/utils/api';
import { isExpiredToken } from '@/utils/token';

const handler = async (req: NextApiRequest, res: NextApiResponse<GetHospitalsReturnType>) => {
  // renew token
  if (req.method !== 'GET') return res.status(HttpStatus.MethodNotAllowed).json({ message: 'Method not allowed' });
  if (req.headers.authorization) {
    try {
      const isExpired = await isExpiredToken(req.headers.authorization);
      if (isExpired) return res.status(HttpStatus.Unauthorized).json({ message: 'Token expired' });
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(HttpStatus.Unauthorized).json({ message: 'Invalid token' });
    }
  }

  const { query, county, departments, keywords, partner, category, page = '1', limit = '10' } = req.query;

  // Parse page and limit as integers
  const currentPage: number = Number(page);
  const pageSize: number = Number(limit);

  // Return undefined if query is invalid
  if (isNaN(currentPage) || currentPage < 1 || isNaN(pageSize) || pageSize < 1) {
    return res.status(HttpStatus.BadRequest).json({ message: 'Invalid body' });
  }

  try {
    const hospitalsCollection: Collection<HospitalProps> = await getHospitalsCollection();

    const mongoQuery: Record<string, unknown> = {}; // Type-safe object
    mongoQuery.$or = [{ deletedAt: null }, { deletedAt: { $exists: false } }];

    if (partner === 'true') mongoQuery.partner = true;

    // Filter by title with HospitalCategoryType
    // 1. First, apply the category filter (Hospital or Clinic) using HospitalCategoryType
    if (category && typeof category === 'string') {
      if (category === HospitalCategoryType.Hospital) {
        mongoQuery.title = { $regex: '醫院', $options: 'i' }; // Case-insensitive search for "醫院"
      } else if (category === HospitalCategoryType.Clinic) {
        mongoQuery.title = { $not: { $regex: '醫院', $options: 'i' } }; // Exclude "醫院"
      } else {
        return res.status(HttpStatus.BadRequest).json({ message: 'Invalid body' }); // Invalid category value
      }
    }

    // 2. After applying category, apply the query-based filtering (title search)
    if (query && typeof query === 'string') {
      const queryWords = query.toLowerCase().split(' ').filter(Boolean);

      if (mongoQuery.title) {
        mongoQuery.$and = [{ title: mongoQuery.title }, { title: { $regex: queryWords.join('|'), $options: 'i' } }];
        delete mongoQuery.title;
      } else {
        mongoQuery.title = { $regex: queryWords.join('|'), $options: 'i' };
      }
    }

    if (county && typeof county === 'string') {
      mongoQuery.county = county;
    }

    if (departments && typeof departments === 'string') {
      mongoQuery.departments = { $in: [departments as DepartmentsType] };
    }

    if (keywords && typeof keywords === 'string') {
      const keywordsArray = keywords
        .toLowerCase()
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean);

      mongoQuery.keywords = {
        $all: keywordsArray.map((kw) => new RegExp(kw, 'i')), // Ensure all keywords match (case-insensitive)
      };
    }

    if (process.env.NODE_ENV === 'production') {
      mongoQuery.keywords = { $not: { $all: ['Sample'] } };
    }

    const total: number = await hospitalsCollection.countDocuments(mongoQuery);

    const hospitals: WithId<HospitalProps>[] = await hospitalsCollection
      .find(mongoQuery)
      .sort({ partner: -1 })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    res.status(HttpStatus.Ok).json({
      hospitals,
      total,
      message: 'Success',
    });
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    res.status(HttpStatus.InternalServerError).json({ message: `Server error: ${error}` });
  }
};

export default handler;
