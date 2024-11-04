import { Collection, ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

import { HospitalProps } from '@/domains/hospital';
import { HospitalManageProps, PharmacyManageProps } from '@/domains/manage';
import { PharmacyProps } from '@/domains/pharmacy';
import { UserWithPasswordProps } from '@/domains/user';
import {
  getHospitalManagesCollection,
  getHospitalsCollection,
  getPharmaciesCollection,
  getPharmacyManagesCollection,
  getUsersCollection,
} from '@/lib/mongodb';
import { GetUserReturnType } from '@/services/interfaces';
import { HttpStatus } from '@/utils/api';
import { isAdminToken, isExpiredToken } from '@/utils/token';

const handler = async (req: NextApiRequest, res: NextApiResponse<GetUserReturnType>) => {
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

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    console.error('Unauthorized');
    return res.status(HttpStatus.Unauthorized).json({ message: 'Unauthorized' });
  }

  try {
    const isAdmin = await isAdminToken(req.headers.authorization);
    if (!isAdmin) return res.status(HttpStatus.Forbidden).json({ message: 'Insufficient permissions' });
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(HttpStatus.Unauthorized).json({ message: 'Invalid token' });
  }

  const { _id } = req.query;

  if (typeof _id !== 'string') {
    return res.status(HttpStatus.BadRequest).json({ message: 'Invalid body' });
  }

  try {
    const usersCollection: Collection<Omit<UserWithPasswordProps, '_id'>> = await getUsersCollection();
    const hospitalManageCollection: Collection<HospitalManageProps> = await getHospitalManagesCollection();
    const pharmacyManageCollection: Collection<PharmacyManageProps> = await getPharmacyManagesCollection();
    const hospitalsCollection: Collection<HospitalProps> = await getHospitalsCollection();
    const pharmaciesCollection: Collection<PharmacyProps> = await getPharmaciesCollection();

    // Find the user by _id
    const user = await usersCollection.findOne({
      _id: new ObjectId(_id),
      $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
    });

    if (!user) {
      console.error('User not found');
      return res.status(HttpStatus.NotFound).json({ message: '帳號不存在!' });
    }

    // Fetch hospital manages and get hospital IDs
    const hospitalManageRecords = await hospitalManageCollection.find({ user_id: new ObjectId(_id) }).toArray();
    const hospitalIds = hospitalManageRecords.map((record) => record.hospital_id);

    // Fetch pharmacy manages and get pharmacy IDs
    const pharmacyManageRecords = await pharmacyManageCollection.find({ user_id: new ObjectId(_id) }).toArray();
    const pharmacyIds = pharmacyManageRecords.map((record) => record.pharmacy_id);

    // Fetch hospital details
    const managedHospitals = await hospitalsCollection.find({ _id: { $in: hospitalIds } }).toArray();

    // Fetch pharmacy details
    const managedPharmacies = await pharmaciesCollection.find({ _id: { $in: pharmacyIds } }).toArray();

    // Return user details with managed hospitals and pharmacies
    res.status(HttpStatus.Ok).json({
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        gender: user.gender,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      manage: {
        hospitals: managedHospitals,
        pharmacies: managedPharmacies,
      },
      message: 'Success',
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(HttpStatus.InternalServerError).json({ message: `Server error: ${error}` });
  }
};

export default handler;
