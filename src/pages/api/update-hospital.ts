import { Collection, ObjectId } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

import { HospitalProps } from '@/domains/hospital';
import { ManageCategoryType } from '@/domains/manage';
import { getClinicManagesCollection, getHospitalManagesCollection, getHospitalsCollection } from '@/lib/mongodb';
import { HospitalUpdateReturnType } from '@/services/interfaces';
import { HttpStatus } from '@/utils/api';
import { isExpiredToken, isManagerToken } from '@/utils/token';

const handler = async (req: NextApiRequest, res: NextApiResponse<HospitalUpdateReturnType>) => {
  if (req.method !== 'PATCH') {
    res.setHeader('Allow', ['PATCH']);
    return res.status(HttpStatus.MethodNotAllowed).json({ message: `Method ${req.method} not allowed` });
  }

  // Renew token
  if (req.headers.authorization) {
    try {
      const isExpired = await isExpiredToken(req.headers.authorization);
      if (isExpired) return res.status(HttpStatus.Unauthorized).json({ message: 'Token expired' });
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(HttpStatus.Unauthorized).json({ message: 'Invalid token' });
    }
  } else {
    return res.status(HttpStatus.Unauthorized).json({ message: 'Invalid token' });
  }

  // Create an array of keys from HospitalProps
  const requiredFields = Object.keys({} as HospitalProps) as (keyof HospitalProps)[];

  for (const field of requiredFields) {
    if (req.body[field] === undefined) return res.status(HttpStatus.BadRequest).json({ message: `缺少所需資訊: ${field}` });
  }

  if (typeof req.body._id !== 'string' || !ObjectId.isValid(req.body._id))
    return res.status(HttpStatus.BadRequest).json({ message: '更新醫院失敗!' });

  try {
    const hospitalsCollection: Collection<HospitalProps> = await getHospitalsCollection();
    const hospitalId = new ObjectId(req.body._id as string);
    const updateFields = req.body;

    delete updateFields._id;

    const updateData: Partial<HospitalProps> = {
      ...req.body,
      createdAt: new Date(req.body.createdAt),
      updatedAt: new Date(),
    };

    // Fetch the current hospital data to check title
    const currentHospital = await hospitalsCollection.findOne({ _id: hospitalId });

    if (!currentHospital) {
      return res.status(HttpStatus.NotFound).json({ message: '醫院不存在!' });
    }

    const currentTitleIncludesHospital: boolean = currentHospital.title.includes('醫院');
    const newTitleIncludesHospital: boolean | undefined = updateData.title?.includes('醫院');

    const isManager = await isManagerToken({
      authHeader: req.headers.authorization,
      pageId: hospitalId.toString(),
      type: currentTitleIncludesHospital ? ManageCategoryType.Hospital : ManageCategoryType.Clinic,
    });
    if (!isManager) return res.status(HttpStatus.Forbidden).json({ message: '沒有管理權限!' });

    // Update the hospital information
    const result = await hospitalsCollection.updateOne(
      { _id: hospitalId, $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }] },
      {
        $set: updateData,
      }
    );

    if (result.modifiedCount === 0) return res.status(HttpStatus.NotFound).json({ message: '醫院不存在!' });

    if (updateData.title) {
      // Manage records transfer based on title changes
      const hospitalManagesCollection = await getHospitalManagesCollection();
      const clinicManagesCollection = await getClinicManagesCollection();

      if (currentTitleIncludesHospital && !newTitleIncludesHospital) {
        // Move from hospital_manages to clinic_manages
        const managesToMove = await hospitalManagesCollection.find({ hospital_id: hospitalId }).toArray();

        if (managesToMove.length > 0) {
          const clinicManagesToInsert = managesToMove.map((manage) => ({
            _id: new ObjectId(),
            user_id: manage.user_id,
            clinic_id: hospitalId,
            createdAt: manage.createdAt,
            updatedAt: new Date(),
          }));

          await clinicManagesCollection.insertMany(clinicManagesToInsert);
          await hospitalManagesCollection.deleteMany({ hospital_id: hospitalId });
        }
      } else if (!currentTitleIncludesHospital && newTitleIncludesHospital) {
        // Move from clinic_manages to hospital_manages
        const managesToMove = await clinicManagesCollection.find({ clinic_id: hospitalId }).toArray();

        if (managesToMove.length > 0) {
          const hospitalManagesToInsert = managesToMove.map((manage) => ({
            _id: new ObjectId(),
            user_id: manage.user_id,
            hospital_id: hospitalId,
            createdAt: manage.createdAt,
            updatedAt: new Date(),
          }));

          await hospitalManagesCollection.insertMany(hospitalManagesToInsert);
          await clinicManagesCollection.deleteMany({ clinic_id: hospitalId });
        }
      }
    }

    res.status(HttpStatus.Ok).json({ message: `已更新${updateData.title}!` });
  } catch (error) {
    console.error('Error updating hospital:', error);
    res.status(HttpStatus.InternalServerError).json({ message: `Server error: ${error}` });
  }
};

export default handler;
