import { Collection, ObjectId } from 'mongodb';

import { HospitalProps } from '@/domains/hospital';
import { ClinicManageProps, HospitalManageProps, ManageCategoryType, PharmacyManageProps } from '@/domains/manage';
import { PharmacyProps } from '@/domains/pharmacy';
import {
  getClinicManagesCollection,
  getHospitalManagesCollection,
  getHospitalsCollection,
  getPharmaciesCollection,
  getPharmacyManagesCollection,
} from '@/lib/mongodb';
import { ManageProps } from '@/services/interfaces';

async function getManageRecordsByUserId(userId: ObjectId): Promise<ManageProps> {
  // Initialize collections
  const hospitalManageCollection: Collection<HospitalManageProps> = await getHospitalManagesCollection();
  const clinicManageCollection: Collection<ClinicManageProps> = await getClinicManagesCollection();
  const pharmacyManageCollection: Collection<PharmacyManageProps> = await getPharmacyManagesCollection();
  const hospitalsCollection: Collection<HospitalProps> = await getHospitalsCollection();
  const pharmaciesCollection: Collection<PharmacyProps> = await getPharmaciesCollection();

  // Fetch manage records for hospitals, clinics, and pharmacies
  const hospitalManageRecords = await hospitalManageCollection.find({ user_id: userId }).toArray();
  const hospitalIds = hospitalManageRecords.map((record) => record.hospital_id);
  const clinicManageRecords = await clinicManageCollection.find({ user_id: userId }).toArray();
  const clinicIds = clinicManageRecords.map((record) => record.clinic_id);
  const pharmacyManageRecords = await pharmacyManageCollection.find({ user_id: userId }).toArray();
  const pharmacyIds = pharmacyManageRecords.map((record) => record.pharmacy_id);

  const managedHospitals: HospitalProps[] = await hospitalsCollection.find({ _id: { $in: hospitalIds } }).toArray();
  const managedClinics: HospitalProps[] = await hospitalsCollection.find({ _id: { $in: clinicIds } }).toArray();
  const managedPharmacies: PharmacyProps[] = await pharmaciesCollection.find({ _id: { $in: pharmacyIds } }).toArray();

  // Map records to IDs
  const manage: ManageProps = {
    [ManageCategoryType.Hospital]: managedHospitals,
    [ManageCategoryType.Clinic]: managedClinics,
    [ManageCategoryType.Pharmacy]: managedPharmacies,
  };

  return manage;
}

export default getManageRecordsByUserId;
