'use client';

import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';

import { Button } from '@/app/global-components/buttons/Button';
import Card from '@/app/global-components/Card';
import { DepartmentsType, GetHospitalsDto, HospitalCategoryType, HospitalProps } from '@/domains/hospital';
import { ManageCategoryType } from '@/domains/manage';
import { GetPharmaciesDto, PharmacyProps } from '@/domains/pharmacy';
import { GetUsersDto, UserProps } from '@/domains/user';
import { useHospitalsQuery } from '@/features/hospitals/hooks/useHospitalsQuery';
import { usePharmaciesQuery } from '@/features/pharmacies/hooks/usePharmaciesQuery';
import { useUserQuery } from '@/features/user/hooks/useUserQuery';
import { useUsersQuery } from '@/features/user/hooks/useUsersQuery';
import useAdminProtected from '@/hooks/utils/protections/routes/useAdminProtected';
import { useEnum } from '@/hooks/utils/useEnum';

import HospitalSearch from './HospitalSearch';
import HospitalsSelect from './HospitalsSelect';
import UserRoleAsign from './UserRoleAsign';
import UserSearch from './UserSearch';
import UsersSelect from './UsersSelect';

const limit = 50;

const AdminContent = (): ReactElement => {
  useAdminProtected();
  const { composeManage } = useEnum();

  const [manageType, setManageType] = useState<ManageCategoryType>(ManageCategoryType.Hospital);

  // Separate search params for each manage type
  const initHospitalSearchParams = useMemo(
    (): GetHospitalsDto => ({
      query: '',
      county: '',
      departments: '' as DepartmentsType,
      partner: false,
      category: manageType === ManageCategoryType.Hospital ? HospitalCategoryType.Hospital : HospitalCategoryType.Clinic,
    }),
    [manageType]
  );

  const initPharmacySearchParams = useMemo(
    (): GetPharmaciesDto => ({
      query: '',
      county: '',
      partner: false,
      healthInsuranceAuthorized: false,
    }),
    []
  );

  const [usersSearch, setUsersSearch] = useState<GetUsersDto>({ email: '' });
  const [hospitalsSearch, setHospitalsSearch] = useState<GetHospitalsDto>(initHospitalSearchParams);
  const [pharmaciesSearch, setPharmaciesSearch] = useState<GetPharmaciesDto>(initPharmacySearchParams);
  const [selectedUser, setSelectedUser] = useState<UserProps | null>(null);
  const [selectedHospitals, setSelectedHospitals] = useState<(HospitalProps | PharmacyProps)[]>([]);

  // Queries for each type
  const { data: { users = [], total: totalUsers = 0 } = {}, refetch: refetchUsers } = useUsersQuery({
    email: usersSearch.email,
    enabled: !!usersSearch.email,
  });

  const { data: { hospitals = [], total: totalHospitals = 0 } = {}, refetch: refetchHospitals } = useHospitalsQuery({
    query: hospitalsSearch.query,
    county: hospitalsSearch.county,
    departments: hospitalsSearch.departments,
    partner: hospitalsSearch.partner,
    category: manageType.toString() as HospitalCategoryType,
    limit,
    enabled: manageType === ManageCategoryType.Hospital || manageType === ManageCategoryType.Clinic,
  });

  const { data: { pharmacies = [], total: totalPharmacies = 0 } = {}, refetch: refetchPharmacies } = usePharmaciesQuery({
    query: pharmaciesSearch.query,
    county: pharmaciesSearch.county,
    partner: pharmaciesSearch.partner,
    healthInsuranceAuthorized: pharmaciesSearch.healthInsuranceAuthorized,
    limit,
    enabled: manageType === ManageCategoryType.Pharmacy,
  });

  const { data: userData } = useUserQuery({
    _id: selectedUser?._id,
    enabled: !!selectedUser?._id,
  });

  // Handle hospital and pharmacy searches
  const handleManageSearch = useCallback(
    async (type: ManageCategoryType, formData: GetHospitalsDto | GetPharmaciesDto) => {
      if (manageType !== type) setManageType(type);

      if (type === ManageCategoryType.Hospital || type === ManageCategoryType.Clinic) {
        setHospitalsSearch(formData as GetHospitalsDto);
        refetchHospitals();
      } else if (type === ManageCategoryType.Pharmacy) {
        setPharmaciesSearch(formData as GetPharmaciesDto);
        refetchPharmacies();
      }
    },
    [manageType, refetchHospitals, refetchPharmacies]
  );

  // Handle user search separately
  const handleUserSearch = useCallback(
    async (formData: GetUsersDto) => {
      if (formData.email) {
        setUsersSearch(formData);
        await refetchUsers();
      } else {
        setUsersSearch({ email: '' });
      }
      setSelectedUser(null);
    },
    [refetchUsers]
  );

  // Combine lists while removing duplicates
  const combinedList = useMemo((): (HospitalProps | PharmacyProps)[] => {
    const list = manageType === ManageCategoryType.Pharmacy ? pharmacies : hospitals;
    return [...selectedHospitals, ...list].filter(
      (item, index, self) => index === self.findIndex((t) => t._id === item._id)
    );
  }, [hospitals, pharmacies, selectedHospitals, manageType]);

  useEffect(() => {
    if (manageType === ManageCategoryType.Hospital) {
      setSelectedHospitals(userData?.manage?.hospitals ?? []);
    } else if (manageType === ManageCategoryType.Clinic) {
      setSelectedHospitals(userData?.manage?.clinics ?? []);
    } else if (manageType === ManageCategoryType.Pharmacy) {
      setSelectedHospitals(userData?.manage?.pharmacies ?? []);
    }
  }, [manageType, userData?.manage?.clinics, userData?.manage?.hospitals, userData?.manage?.pharmacies]);

  return (
    <div className="p-4 flex flex-col justify-center gap-y-4 w-full">
      <Card>
        <div className="flex gap-x-4">
          {Object.values(ManageCategoryType).map((type) => (
            <Button
              key={type}
              text={composeManage(type)}
              onClick={() =>
                handleManageSearch(
                  type,
                  type === ManageCategoryType.Hospital ? initHospitalSearchParams : initPharmacySearchParams
                )
              }
              disabled={type === manageType}
            />
          ))}
        </div>
      </Card>

      <div className="flex gap-x-4">
        <div className="flex flex-col flex-[1] gap-y-4">
          <Card>
            <div className="flex flex-col gap-y-2">
              <label>結果: {totalUsers}</label>
              <UserSearch searchUsers={handleUserSearch} />
              <UsersSelect users={users} selectedUser={selectedUser} userData={userData} onChange={setSelectedUser} />
            </div>
          </Card>
        </div>

        <Card className="flex flex-col flex-[4]">
          {!selectedUser ? (
            <label className="text-red-400">請先選擇帳號</label>
          ) : (
            <>
              <label>結果: {manageType === ManageCategoryType.Pharmacy ? totalPharmacies : totalHospitals}</label>
              <HospitalSearch searchHospitals={(formData) => handleManageSearch(manageType, formData)} />
              <HospitalsSelect
                hospitals={combinedList}
                selectedHospitals={selectedHospitals}
                onChange={setSelectedHospitals}
              />
            </>
          )}
        </Card>
      </div>

      <UserRoleAsign
        manageType={manageType}
        userId={selectedUser?._id}
        userName={`${selectedUser?.lastName}${selectedUser?.firstName}`}
        selectedHospitals={selectedHospitals}
      />
    </div>
  );
};

export default AdminContent;
