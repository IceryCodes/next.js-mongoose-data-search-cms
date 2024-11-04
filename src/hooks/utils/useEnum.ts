import { useCallback, useMemo } from 'react';

import { HospitalExtraFieldType } from '@/domains/hospital';
import { GenderType, UserRoleType } from '@/domains/interfaces';
import { ManageCategoryType } from '@/domains/manage';

interface UsePatientSelectionTicketEnumReturnType {
  roleMap: Record<UserRoleType, string>;
  composeRole: (genderToTrans: UserRoleType) => string;
  manageMap: Record<ManageCategoryType, string>;
  composeManage: (genderToTrans: ManageCategoryType) => string;
  genderMap: Record<GenderType, string>;
  composeGender: (genderToTrans: GenderType) => string;
  hospitalExtraFieldMap: Record<HospitalExtraFieldType, string>;
  composeHospitalExtraField: (fieldToTrans: HospitalExtraFieldType) => string;
}

export const useEnum = (): UsePatientSelectionTicketEnumReturnType => {
  const roleMap = useMemo<Record<UserRoleType, string>>(() => {
    return {
      [UserRoleType.None]: '一般用戶',
      [UserRoleType.Admin]: '網站管理員',
      [UserRoleType.Manager]: '管理人員',
    };
  }, []);

  const composeRole = useCallback(
    (roleToTrans: UserRoleType): string => {
      return roleMap[roleToTrans] ?? 'Unknown';
    },
    [roleMap]
  );

  const manageMap = useMemo<Record<ManageCategoryType, string>>(() => {
    return {
      [ManageCategoryType.Hospital]: '管理醫院',
      [ManageCategoryType.Clinic]: '管理診所',
      [ManageCategoryType.Pharmacy]: '管理藥局',
    };
  }, []);

  const composeManage = useCallback(
    (manageToTrans: ManageCategoryType): string => {
      return manageMap[manageToTrans] ?? 'Unknown';
    },
    [manageMap]
  );

  const genderMap = useMemo<Record<GenderType, string>>(() => {
    return {
      [GenderType.None]: '',
      [GenderType.Male]: '先生',
      [GenderType.Female]: '小姐',
    };
  }, []);

  const composeGender = useCallback(
    (genderToTrans: GenderType): string => {
      return genderMap[genderToTrans] ?? 'Unknown';
    },
    [genderMap]
  );

  const hospitalExtraFieldMap = useMemo<Record<HospitalExtraFieldType, string>>(() => {
    return {
      [HospitalExtraFieldType.SpeechTherapist]: '語言治療師',
      [HospitalExtraFieldType.DentalTechnician]: '牙體技術師',
      [HospitalExtraFieldType.Audiologist]: '聽力師',
      [HospitalExtraFieldType.DentalTechnicianAssistant]: '牙體技術士',
      [HospitalExtraFieldType.Optometrist]: '驗光師',
      [HospitalExtraFieldType.OptometricAssistant]: '驗光生',
      [HospitalExtraFieldType.Physician]: '醫師',
      [HospitalExtraFieldType.ChineseMedicineDoctor]: '中醫師',
      [HospitalExtraFieldType.Dentist]: '牙醫師',
      [HospitalExtraFieldType.Pharmacist]: '藥師',
      [HospitalExtraFieldType.PharmacyAssistant]: '藥劑生',
      [HospitalExtraFieldType.RegisteredNurse]: '護理師',
      [HospitalExtraFieldType.Nurse]: '護士',
      [HospitalExtraFieldType.Midwife]: '助產士',
      [HospitalExtraFieldType.MidwiferyAssistant]: '助產師',
      [HospitalExtraFieldType.MedicalLaboratoryTechnologist]: '醫事檢驗師',
      [HospitalExtraFieldType.MedicalLaboratoryAssistant]: '醫事檢驗生',
      [HospitalExtraFieldType.PhysicalTherapist]: '物理治療師',
      [HospitalExtraFieldType.OccupationalTherapist]: '職能治療師',
      [HospitalExtraFieldType.RadiologicTechnologist]: '醫事放射師',
      [HospitalExtraFieldType.RadiologicAssistant]: '醫事放射士',
      [HospitalExtraFieldType.PhysicalTherapyAssistant]: '物理治療生',
      [HospitalExtraFieldType.OccupationalTherapyAssistant]: '職能治療生',
      [HospitalExtraFieldType.RespiratoryTherapist]: '呼吸治療師',
      [HospitalExtraFieldType.CounselingPsychologist]: '諮商心理師',
      [HospitalExtraFieldType.ClinicalPsychologist]: '臨床心理師',
      [HospitalExtraFieldType.Dietitian]: '營養師',
    };
  }, []);

  const composeHospitalExtraField = useCallback(
    (fieldToTrans: HospitalExtraFieldType): string => {
      return hospitalExtraFieldMap[fieldToTrans] ?? 'Unknown';
    },
    [hospitalExtraFieldMap]
  );

  return useMemo<UsePatientSelectionTicketEnumReturnType>(() => {
    return {
      roleMap,
      composeRole,
      manageMap,
      composeManage,
      genderMap,
      composeGender,
      hospitalExtraFieldMap,
      composeHospitalExtraField,
    };
  }, [
    roleMap,
    composeRole,
    manageMap,
    composeManage,
    genderMap,
    composeGender,
    hospitalExtraFieldMap,
    composeHospitalExtraField,
  ]);
};
