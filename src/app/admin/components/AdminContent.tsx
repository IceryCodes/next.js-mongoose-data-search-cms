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

const limit: number = 50;

const AdminContent = (): ReactElement => {
  useAdminProtected();
  const { composeManage } = useEnum();

  const [manageType, setManageType] = useState<ManageCategoryType>(ManageCategoryType.Hospital);

  const initHospitalsSearcch = useMemo(
    (): GetHospitalsDto => ({
      query: '',
      county: '',
      departments: '' as DepartmentsType,
      partner: false,
      category:
        manageType.toString() === HospitalCategoryType.Hospital
          ? HospitalCategoryType.Hospital
          : HospitalCategoryType.Clinic,
    }),
    [manageType]
  );

  const initPharmaciesSearcch = useMemo(
    (): GetPharmaciesDto => ({
      query: '',
      county: '',
      partner: false,
      healthInsuranceAuthorized: false,
    }),
    []
  );

  const [startSearch, setStartSearch] = useState<boolean>(false);
  const [usersSearch, setUsersSearch] = useState<GetUsersDto>({ email: '' });
  const [selectedUser, setSelectedUser] = useState<UserProps | null>(null);

  const [hospitalsSearch, setHospitalsSearch] = useState<GetHospitalsDto>(initHospitalsSearcch);

  const [pharmaciesSearch, setPharmaciesSearch] = useState<GetPharmaciesDto>(initPharmaciesSearcch);

  const [selectedHospitals, setSelectedHospitals] = useState<(HospitalProps | PharmacyProps)[]>([]);

  const { data: usersData } = useUsersQuery({
    email: usersSearch.email,
    enabled: startSearch,
  });

  const { data: { hospitals = [] } = {}, refetch: refetchHospitals } = useHospitalsQuery({
    query: hospitalsSearch.query,
    county: hospitalsSearch.county,
    departments: hospitalsSearch.departments,
    partner: hospitalsSearch.partner,
    category: manageType.toString() as HospitalCategoryType,
    limit,
    enabled: manageType === ManageCategoryType.Hospital || manageType === ManageCategoryType.Clinic,
  });

  const { data: { pharmacies = [] } = {}, refetch: refetchPharmacies } = usePharmaciesQuery({
    query: pharmaciesSearch.query,
    county: pharmaciesSearch.county,
    partner: pharmaciesSearch.partner,
    healthInsuranceAuthorized: pharmaciesSearch.healthInsuranceAuthorized,
    limit,
    enabled: manageType === ManageCategoryType.Pharmacy,
  });

  const { data: userData, refetch } = useUserQuery({
    _id: selectedUser?._id,
    enabled: !!selectedUser?._id,
  });

  // Remove deplicate items but keep the selected
  const hospitalList = useMemo(
    (): HospitalProps[] =>
      [...selectedHospitals, ...hospitals].filter(
        (item, index, self) => index === self.findIndex((t) => t._id === item._id)
      ) as HospitalProps[],
    [hospitals, selectedHospitals]
  );
  const pharmacyList = useMemo(
    (): PharmacyProps[] =>
      [...selectedHospitals, ...pharmacies].filter(
        (item, index, self) => index === self.findIndex((t) => t._id === item._id)
      ) as PharmacyProps[],
    [pharmacies, selectedHospitals]
  );

  const searchUsers = useCallback(({ email }: GetUsersDto) => {
    setUsersSearch({ email });
    setSelectedUser(null);
    setStartSearch(!!email);
  }, []);

  const searchHospitals = useCallback(
    (formData: GetHospitalsDto | GetPharmaciesDto) => {
      if (manageType === ManageCategoryType.Hospital || manageType === ManageCategoryType.Clinic) {
        setHospitalsSearch(formData as GetHospitalsDto);
        refetchHospitals();
      } else if (manageType === ManageCategoryType.Pharmacy) {
        setPharmaciesSearch(formData as GetPharmaciesDto);
        refetchPharmacies();
      }
    },
    [manageType, refetchHospitals, refetchPharmacies]
  );

  const onChangeType = useCallback(
    (type: ManageCategoryType) => {
      setUsersSearch({ email: '' });
      setSelectedUser(null);
      setManageType(type);
    },
    [setManageType]
  );

  useEffect(() => {
    if (selectedUser?._id) refetch();
  }, [refetch, selectedUser?._id]);

  useEffect(() => {
    let newSelected: (HospitalProps | PharmacyProps)[] = [];
    if (manageType === ManageCategoryType.Hospital || manageType === ManageCategoryType.Clinic) {
      newSelected = userData?.manage?.hospitals ?? [];
    } else if (manageType === ManageCategoryType.Pharmacy) {
      newSelected = userData?.manage?.pharmacies ?? [];
    }

    setSelectedHospitals(newSelected);
  }, [manageType, userData?.manage?.hospitals, userData?.manage?.pharmacies]);

  useEffect(() => {
    const searchParams = manageType === ManageCategoryType.Pharmacy ? initPharmaciesSearcch : initHospitalsSearcch;
    setSelectedHospitals([]);
    searchHospitals(searchParams);
  }, [manageType, initHospitalsSearcch, initPharmaciesSearcch, searchHospitals]);

  return (
    <div className="p-4 flex flex-col justify-center gap-y-4 w-full">
      <Card>
        <div className="flex gap-x-4">
          {Object.values(ManageCategoryType).map((type: ManageCategoryType) => (
            <Button
              key={type}
              text={composeManage(type)}
              onClick={() => onChangeType(type)}
              disabled={type === manageType}
            />
          ))}
        </div>
      </Card>

      <div className="flex gap-x-4">
        <div className="flex flex-col flex-[1] gap-y-4">
          <Card>
            <div className="flex flex-col gap-y-2">
              <UserSearch searchUsers={searchUsers} />
              <UsersSelect
                users={usersData?.users ?? []}
                selectedUser={selectedUser}
                userData={userData}
                onChange={setSelectedUser}
              />
            </div>
          </Card>
        </div>

        <Card className="flex flex-col flex-[4]">
          {!selectedUser ? (
            <label className="text-red-400">請先選擇帳號</label>
          ) : (
            <>
              <HospitalSearch searchHospitals={searchHospitals} />
              <HospitalsSelect
                hospitals={manageType === ManageCategoryType.Pharmacy ? pharmacyList : hospitalList}
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
