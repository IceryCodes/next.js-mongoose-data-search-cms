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

interface UserRoleAssignProps {
  manageType: ManageCategoryType;
  selectedItems: (HospitalProps | PharmacyProps)[];
  userId?: ObjectId;
  userName?: string;
  refetchUser: () => void;
}

const UserRoleAssign = ({ manageType, selectedItems, userId, userName, refetchUser }: UserRoleAssignProps): ReactElement => {
  const { showToast } = useToast();

  const { isLoading, mutateAsync } = useUpdateManagesMutation();

  const handleUpdate = useCallback(async () => {
    if (!userId) return;
    const confirmed = window.confirm(`您確定要更新${userName}的機構管理權限嗎?`);
    if (!confirmed) return;

    try {
      const result = await mutateAsync({
        user_id: userId?.toString(),
        entity_type: manageType,
        entity_ids: selectedItems.map(({ _id }) => _id.toString()),
      });

      const { message } = result;
      refetchUser();
      showToast({ message });
    } catch (error) {
      console.error('Update error:', error);
      showToast({ message: '更新錯誤!', toastStyle: ToastStyleType.Warning });
    }
  }, [manageType, mutateAsync, refetchUser, selectedItems, showToast, userId, userName]);

  return (
    <>
      {userId && (
        <div className="flex gap-x-4">
          <Card className="flex flex-col min-w-[350px]">
            <>
              <label>{`${userName} 將擁有以下機構之管理權限:`}</label>
              <Button text="確定" onClick={handleUpdate} disabled={!userId || isLoading} />
            </>
          </Card>

          <Card className="flex flex-col w-full">
            <>
              {!selectedItems.length && <label>無任何機構</label>}
              <ul className="flex flex-wrap gap-2">
                {selectedItems.map(({ _id, title }) => (
                  <li key={_id.toString()} className="p-2 rounded bg-blue-500 text-white">
                    {title}
                  </li>
                ))}
              </ul>
            </>
          </Card>
        </div>
      )}
    </>
  );
};

export default UserRoleAssign;
