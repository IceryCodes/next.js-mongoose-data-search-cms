import { Collection, WithId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

import { DepartmentsType, HospitalCategoryType, HospitalExtraFieldType, HospitalProps } from '@/domains/hospital';
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
    if (category && typeof category === 'string') {
      if (category === HospitalCategoryType.Hospital) {
        mongoQuery.title = { $regex: '醫院', $options: 'i' };
      } else if (category === HospitalCategoryType.Clinic) {
        mongoQuery.title = { $not: { $regex: '醫院', $options: 'i' } };
      } else {
        return res.status(HttpStatus.BadRequest).json({ message: 'Invalid body' });
      }
    }

    if (query && typeof query === 'string') {
      const queryWords = query.toLowerCase().split(' ').filter(Boolean);

      // 檢查查詢詞是否包含職位名稱
      const positionQueries = queryWords.filter((word) =>
        Object.values(HospitalExtraFieldType).some((pos) => pos.includes(word))
      );
      const regularQueries = queryWords.filter(
        (word) => !Object.values(HospitalExtraFieldType).some((pos) => pos.includes(word))
      );

      const searchFields = [
        'title',
        'departments',
        'county',
        'district',
        'address',
        'expert',
        'content',
        'keywords',
        'orgCode',
      ];

      const orConditions: Record<string, unknown>[] = [];

      // 處理一般搜尋欄位
      if (regularQueries.length > 0) {
        const regexPattern = regularQueries.join('|');
        searchFields.forEach((field) => {
          orConditions.push({ [field]: { $regex: regexPattern, $options: 'i' } });
        });
      }

      // 處理職位搜尋
      if (positionQueries.length > 0) {
        positionQueries.forEach((posQuery) => {
          const matchingPositions = Object.values(HospitalExtraFieldType).filter((pos) => pos.includes(posQuery));
          matchingPositions.forEach((position) => {
            orConditions.push({ [position]: { $gt: 0 } });
          });
        });
      }

      if (orConditions.length > 0) {
        if (mongoQuery.title) {
          // 如果已經有 title 條件（來自分類），需要合併條件
          mongoQuery.$and = [{ title: mongoQuery.title }, { $or: orConditions }];
          delete mongoQuery.title;
        } else {
          mongoQuery.$or = orConditions;
        }
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

      mongoQuery.keywords = { $all: keywordsArray };
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
