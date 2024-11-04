'use client';

import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';

import Card from '@/app/global-components/Card';
import { DepartmentsType, GetHospitalsDto, HospitalCategoryType, HospitalProps } from '@/domains/hospital';
import { GetUsersDto, UserProps } from '@/domains/user';
import { useHospitalsQuery } from '@/features/hospitals/hooks/useHospitalsQuery';
import { useUserQuery } from '@/features/user/hooks/useUserQuery';
import { useUsersQuery } from '@/features/user/hooks/useUsersQuery';
import useAdminProtected from '@/hooks/utils/protections/routes/useAdminProtected';

import HospitalSearch from './HospitalSearch';
import HospitalsSelect from './HospitalsSelect';
import UserRoleAsign from './UserRoleAsign';
import UserSearch from './UserSearch';
import UsersSelect from './UsersSelect';

const limit: number = 50;

const AdminContent = (): ReactElement => {
  useAdminProtected();

  const [startSearch, setStartSearch] = useState<boolean>(false);
  const [usersSearch, setUsersSearch] = useState<GetUsersDto>({ email: '' });
  const [selectedUser, setSelectedUser] = useState<UserProps | null>(null);

  const [hospitalsSearch, setHospitalsSearch] = useState<GetHospitalsDto>({
    query: '',
    county: '',
    departments: '' as DepartmentsType,
    partner: false,
    category: HospitalCategoryType.Hospital,
  });
  const [selectedHospitals, setSelectedHospitals] = useState<HospitalProps[]>([]);

  const { data: { users = [] } = {} } = useUsersQuery({
    email: usersSearch.email,
    enabled: startSearch,
  });

  const { data: { hospitals = [] } = {}, refetch: refetchHospitals } = useHospitalsQuery({
    query: hospitalsSearch.query,
    county: hospitalsSearch.county,
    departments: hospitalsSearch.departments,
    partner: hospitalsSearch.partner,
    category: HospitalCategoryType.Hospital,
    limit,
  });

  const { data: userData, refetch } = useUserQuery({
    _id: selectedUser?._id,
    enabled: !!selectedUser?._id,
  });

  // Remove deplicate hospitals but keep the selected
  const hospitalList = useMemo(
    (): HospitalProps[] =>
      [...selectedHospitals, ...hospitals].filter(
        (item, index, self) => index === self.findIndex((t) => t._id === item._id)
      ),
    [hospitals, selectedHospitals]
  );

  const searchUsers = useCallback(({ email }: GetUsersDto) => {
    setUsersSearch({ email });
    setSelectedUser(null);
    setStartSearch(!!email);
  }, []);

  const searchHospitals = useCallback(
    (formData: GetHospitalsDto) => {
      setHospitalsSearch(formData);
      refetchHospitals();
    },
    [refetchHospitals]
  );

  useEffect(() => {
    if (selectedUser?._id) refetch();
  }, [refetch, selectedUser?._id]);

  useEffect(() => {
    setSelectedHospitals(userData?.manage?.hospitals ?? []);
  }, [userData?.manage?.hospitals]);

  return (
    <div className="p-4 flex flex-col justify-center gap-y-4 w-full">
      <div className="flex gap-x-4">
        <div className="flex flex-col flex-[1] gap-y-4">
          <Card>
            <div className="flex flex-col gap-y-2">
              <UserSearch searchUsers={searchUsers} />
              <UsersSelect users={users} selectedUser={selectedUser} userData={userData} onChange={setSelectedUser} />
            </div>
          </Card>
        </div>

        <Card className="flex flex-col flex-[4]">
          <>
            <HospitalSearch searchHospitals={searchHospitals} />
            <HospitalsSelect
              hospitals={hospitalList}
              selectedHospitals={selectedHospitals}
              onChange={setSelectedHospitals}
            />
          </>
        </Card>
      </div>

      <UserRoleAsign
        userId={selectedUser?._id}
        userName={`${selectedUser?.lastName}${selectedUser?.firstName}`}
        selectedHospitals={selectedHospitals}
      />
    </div>
  );
};

export default AdminContent;
