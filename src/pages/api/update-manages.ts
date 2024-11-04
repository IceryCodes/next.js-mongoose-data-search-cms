import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

import { CreateManageDto, HospitalManageProps, ManageCategoryType, PharmacyManageProps } from '@/domains/manage';
import { getHospitalManagesCollection, getPharmacyManagesCollection } from '@/lib/mongodb';
import { HttpStatus } from '@/utils/api';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(HttpStatus.MethodNotAllowed).json({ message: 'Method not allowed' });
  }

  const { user_id, entity_type, entity_ids }: CreateManageDto = req.body;

  if (!user_id || !entity_type || !Array.isArray(entity_ids)) {
    return res.status(HttpStatus.BadRequest).json({ message: 'Invalid request body' });
  }

  try {
    const userObjectId = new ObjectId(user_id);
    const finalEntityObjectIds = entity_ids.map((id) => new ObjectId(id));

    if (entity_type === ManageCategoryType.Hospital) {
      const hospitalManagesCollection = await getHospitalManagesCollection();

      // Fetch current managed hospital records for the user
      const currentRecords = await hospitalManagesCollection.find({ user_id: userObjectId }).toArray();
      const currentHospitalIds = currentRecords.map((record) => record.hospital_id.toString());

      // Determine which records to add or remove based on final entity_ids
      const toAdd = finalEntityObjectIds.filter((id) => !currentHospitalIds.includes(id.toString()));
      // const toKeep = finalEntityObjectIds.filter((id) => currentHospitalIds.includes(id.toString()));
      const toRemove = currentHospitalIds.filter(
        (id) => !finalEntityObjectIds.some((entityId) => entityId.toString() === id)
      );

      // Insert new records for hospitals not yet managed by the user
      if (toAdd.length > 0) {
        const newHospitalManages: HospitalManageProps[] = toAdd.map((hospitalId) => ({
          _id: new ObjectId(),
          user_id: userObjectId,
          hospital_id: hospitalId,
          createdAt: new Date(),
          updatedAt: new Date(),
        }));

        await hospitalManagesCollection.insertMany(newHospitalManages);
      }

      // Remove records for hospitals that are no longer in the final entity_ids list
      if (toRemove.length > 0) {
        await hospitalManagesCollection.deleteMany({
          user_id: userObjectId,
          hospital_id: { $in: toRemove.map((id) => new ObjectId(id)) },
        });
      }

      return res.status(HttpStatus.Ok).json({
        message: '更新管理機構成功!',
      });
    } else if (entity_type === ManageCategoryType.Pharmacy) {
      const pharmacyManagesCollection = await getPharmacyManagesCollection();

      // Fetch current managed pharmacy records for the user
      const currentRecords = await pharmacyManagesCollection.find({ user_id: userObjectId }).toArray();
      const currentPharmacyIds = currentRecords.map((record) => record.pharmacy_id.toString());

      // Determine which records to add, keep, or remove based on final entity_ids
      const toAdd = finalEntityObjectIds.filter((id) => !currentPharmacyIds.includes(id.toString()));
      // const toKeep = finalEntityObjectIds.filter((id) => currentPharmacyIds.includes(id.toString()));
      const toRemove = currentPharmacyIds.filter(
        (id) => !finalEntityObjectIds.some((entityId) => entityId.toString() === id)
      );

      // Insert new records for pharmacies not yet managed by the user
      if (toAdd.length > 0) {
        const newPharmacyManages: PharmacyManageProps[] = toAdd.map((pharmacyId) => ({
          _id: new ObjectId(),
          user_id: userObjectId,
          pharmacy_id: pharmacyId,
          createdAt: new Date(),
          updatedAt: new Date(),
        }));

        await pharmacyManagesCollection.insertMany(newPharmacyManages);
      }

      // Remove records for pharmacies that are no longer in the final entity_ids list
      if (toRemove.length > 0) {
        await pharmacyManagesCollection.deleteMany({
          user_id: userObjectId,
          pharmacy_id: { $in: toRemove.map((id) => new ObjectId(id)) },
        });
      }

      return res.status(HttpStatus.Ok).json({
        message: '更新管理機構成功!',
      });
    } else {
      return res.status(HttpStatus.BadRequest).json({ message: 'Invalid entity type' });
    }
  } catch (error) {
    console.error('Error updating manage records:', error);
    return res.status(HttpStatus.InternalServerError).json({ message: `Server error: ${error}` });
  }
};

export default handler;
