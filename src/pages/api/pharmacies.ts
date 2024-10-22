import { Collection, WithId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

import { PharmacyProps } from '@/domains/pharmacy';
import { getPharmaciesCollection } from '@/lib/mongodb';
import { GetPharmaciesReturnType } from '@/services/interfaces';
import { HttpStatus } from '@/utils/api';

const handler = async (req: NextApiRequest, res: NextApiResponse<GetPharmaciesReturnType>) => {
  const { query, county, healthInsuranceAuthorized, partner, page = '1', limit = '10' } = req.query;

  const currentPage: number = Number(page);
  const pageSize: number = Number(limit);

  if (isNaN(currentPage) || currentPage < 1 || isNaN(pageSize) || pageSize < 1) {
    return res.status(HttpStatus.BadRequest).json({ message: 'Invalid body' });
  }

  try {
    const pharmaciesCollection: Collection<PharmacyProps> = await getPharmaciesCollection();

    const mongoQuery: Record<string, unknown> = {}; // Type-safe object

    if (partner === 'true') mongoQuery.partner = true;

    if (query && typeof query === 'string') {
      const queryWords = query.toLowerCase().split(' ').filter(Boolean);
      mongoQuery.title = { $regex: queryWords.join('|'), $options: 'i' }; // Case-insensitive search
    }

    if (county && typeof county === 'string') {
      mongoQuery.county = county;
    }

    if (healthInsuranceAuthorized && typeof healthInsuranceAuthorized === 'string' && healthInsuranceAuthorized === 'true') {
      mongoQuery.healthInsuranceAuthorized = true;
    }

    if (process.env.NODE_ENV === 'production') {
      mongoQuery.keywords = { $not: { $all: ['Sample'] } };
    }

    const total: number = await pharmaciesCollection.countDocuments(mongoQuery);

    const pharmacies: WithId<PharmacyProps>[] = await pharmaciesCollection
      .find(mongoQuery)
      .sort({ partner: -1 })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    res.status(HttpStatus.Ok).json({
      pharmacies,
      total,
      message: 'Success',
    });
  } catch (error) {
    console.error('Error fetching pharmacies:', error);
    res.status(HttpStatus.InternalServerError).json({ message: `Server error: ${error}` });
  }
};

export default handler;
