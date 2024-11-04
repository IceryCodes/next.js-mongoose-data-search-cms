import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

import { UserRoleType } from '@/domains/interfaces';
import {
  ClinicManageProps,
  CreateManageDto,
  HospitalManageProps,
  ManageCategoryType,
  PharmacyManageProps,
} from '@/domains/manage';
import {
  getClinicManagesCollection,
  getHospitalManagesCollection,
  getPharmacyManagesCollection,
  getUsersCollection,
} from '@/lib/mongodb';
import { HttpStatus } from '@/utils/api';
import { isAdminToken, isExpiredToken } from '@/utils/token';

const handler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method !== 'POST') {
    return res.status(HttpStatus.MethodNotAllowed).json({ message: 'Method not allowed' });
  }

  // renew token
  if (req.headers.authorization) {
    try {
      const isExpired = await isExpiredToken(req.headers.authorization);
      if (isExpired) return res.status(HttpStatus.Unauthorized).json({ message: 'Token expired' });
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(HttpStatus.Unauthorized).json({ message: 'Invalid token' });
    }
  }

  try {
    const isAdmin = await isAdminToken(req.headers.authorization);
    if (!isAdmin) return res.status(HttpStatus.Forbidden).json({ message: 'Insufficient permissions' });
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(HttpStatus.Unauthorized).json({ message: 'Invalid token' });
  }

  // Extract request body and validate the payload type
  const { user_id, entity_type, entity_ids }: CreateManageDto = req.body;

  if (!user_id || !entity_type || !Array.isArray(entity_ids))
    return res.status(HttpStatus.BadRequest).json({ message: 'Invalid request body' });

  try {
    const userObjectId = new ObjectId(user_id);
    const finalEntityObjectIds = entity_ids.map((id) => new ObjectId(id));

    const usersCollection = await getUsersCollection();
    const user = await usersCollection.findOne({
      _id: new ObjectId(user_id),
      $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
    });

    if (!user) {
      console.error('User not found');
      return res.status(HttpStatus.NotFound).json({ message: '帳號不存在!' });
    }

    const updateManagerRole = async () => {
      // Use Promise.all to count documents across all manage collections in parallel
      const [hospitalCount, clinicCount, pharmacyCount] = await Promise.all([
        (await getHospitalManagesCollection()).countDocuments({ user_id: userObjectId }),
        (await getClinicManagesCollection()).countDocuments({ user_id: userObjectId }),
        (await getPharmacyManagesCollection()).countDocuments({ user_id: userObjectId }),
      ]);

      // admin role protect
      if (user.role !== UserRoleType.Admin) {
        // Check if user should be assigned a Manager role
        const isManager = hospitalCount > 0 || clinicCount > 0 || pharmacyCount > 0;
        const userRole: UserRoleType = isManager ? UserRoleType.Manager : UserRoleType.None;

        // Update user role
        await usersCollection.updateOne({ _id: userObjectId }, { $set: { role: userRole } });
      }
    };

    if (entity_type === ManageCategoryType.Hospital) {
      const hospitalManagesCollection = await getHospitalManagesCollection();

      const currentRecords = await hospitalManagesCollection.find({ user_id: userObjectId }).toArray();
      const currentHospitalIds = currentRecords.map((record) => record.hospital_id.toString());

      const toAdd = finalEntityObjectIds.filter((id) => !currentHospitalIds.includes(id.toString()));
      const toRemove = currentHospitalIds.filter(
        (id) => !finalEntityObjectIds.some((entityId) => entityId.toString() === id)
      );

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

      if (toRemove.length > 0) {
        await hospitalManagesCollection.deleteMany({
          user_id: userObjectId,
          hospital_id: { $in: toRemove.map((id) => new ObjectId(id)) },
        });
      }
    } else if (entity_type === ManageCategoryType.Clinic) {
      const clinicManagesCollection = await getClinicManagesCollection();

      const currentRecords = await clinicManagesCollection.find({ user_id: userObjectId }).toArray();
      const currentClinicIds = currentRecords.map((record) => record.clinic_id.toString());

      const toAdd = finalEntityObjectIds.filter((id) => !currentClinicIds.includes(id.toString()));
      const toRemove = currentClinicIds.filter((id) => !finalEntityObjectIds.some((entityId) => entityId.toString() === id));

      if (toAdd.length > 0) {
        const newClinicManages: ClinicManageProps[] = toAdd.map((clinicId) => ({
          _id: new ObjectId(),
          user_id: userObjectId,
          clinic_id: clinicId,
          createdAt: new Date(),
          updatedAt: new Date(),
        }));
        await clinicManagesCollection.insertMany(newClinicManages);
      }

      if (toRemove.length > 0) {
        await clinicManagesCollection.deleteMany({
          user_id: userObjectId,
          clinic_id: { $in: toRemove.map((id) => new ObjectId(id)) },
        });
      }
    } else if (entity_type === ManageCategoryType.Pharmacy) {
      const pharmacyManagesCollection = await getPharmacyManagesCollection();

      const currentRecords = await pharmacyManagesCollection.find({ user_id: userObjectId }).toArray();
      const currentPharmacyIds = currentRecords.map((record) => record.pharmacy_id.toString());

      const toAdd = finalEntityObjectIds.filter((id) => !currentPharmacyIds.includes(id.toString()));
      const toRemove = currentPharmacyIds.filter(
        (id) => !finalEntityObjectIds.some((entityId) => entityId.toString() === id)
      );

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

      if (toRemove.length > 0) {
        await pharmacyManagesCollection.deleteMany({
          user_id: userObjectId,
          pharmacy_id: { $in: toRemove.map((id) => new ObjectId(id)) },
        });
      }
    } else {
      return res.status(HttpStatus.BadRequest).json({ message: 'Invalid entity type' });
    }

    // After making changes, update the user's role
    await updateManagerRole();

    return res.status(HttpStatus.Ok).json({
      message: '更新管理機構成功!',
    });
  } catch (error) {
    console.error('Error updating manage records:', error);
    return res.status(HttpStatus.InternalServerError).json({ message: `Server error: ${error}` });
  }
};

export default handler;
