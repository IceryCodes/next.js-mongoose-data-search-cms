'use client';

import { ReactElement, useCallback } from 'react';

import { ObjectId } from 'mongodb';

import { Button } from '@/app/global-components/buttons/Button';
import Card from '@/app/global-components/Card';
import { ToastStyleType } from '@/app/global-components/Toast';
import { useToast } from '@/contexts/ToastContext';
import { HospitalProps } from '@/domains/hospital';
import { ManageCategoryType } from '@/domains/manage';
import { PharmacyProps } from '@/domains/pharmacy';
import { useUpdateManagesMutation } from '@/features/manages/hooks/useUpdateManagesMutation';

interface UserRoleAsignProps {
  manageType: ManageCategoryType;
  userId?: ObjectId;
  userName?: string;
  selectedHospitals: (HospitalProps | PharmacyProps)[];
}

const UserRoleAsign = ({ manageType, userId, userName, selectedHospitals }: UserRoleAsignProps): ReactElement => {
  const { showToast } = useToast();

  const { isLoading, mutateAsync } = useUpdateManagesMutation();

  const handleUpdate = useCallback(async () => {
    if (!userId) return;

    try {
      const result = await mutateAsync({
        user_id: userId?.toString(),
        entity_type: manageType,
        entity_ids: selectedHospitals.map(({ _id }) => _id.toString()),
      });

      const { message } = result;
      showToast({ message });
    } catch (error) {
      console.error('Update error:', error);
      showToast({ message: '更新錯誤!', toastStyle: ToastStyleType.Warning });
    }
  }, [manageType, mutateAsync, selectedHospitals, showToast, userId]);

  return (
    <div className="w-full">
      {!userId && (
        <Card>
          <label className="text-center">請選擇帳號</label>
        </Card>
      )}
      {userId && (
        <div className="flex gap-x-4">
          <Card className="flex flex-col flex-[1]">
            <>
              <label>{`${userName} 將擁有以下機構之管理權:`}</label>
              <Button text="確定" onClick={handleUpdate} disabled={!userId || isLoading} />
            </>
          </Card>

          <Card className="flex flex-[4]">
            <>
              {!selectedHospitals.length && <label>無任何機構</label>}
              <ul className="flex flex-wrap gap-2">
                {selectedHospitals.map(({ _id, title }) => (
                  <li key={_id.toString()} className="p-2 rounded bg-blue-500 text-white">
                    {title}
                  </li>
                ))}
              </ul>
            </>
          </Card>
        </div>
      )}
    </div>
  );
};

export default UserRoleAsign;
