'use client';

import { ReactElement, useCallback, useMemo, useState } from 'react';

import { ObjectId } from 'mongodb';

import { Button } from '@/app/global-components/buttons/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { useDeleteHospitalMutation } from '@/features/hospitals/hooks/useDeleteHospitalMutation';

import Popup from '../Popup';
import { ToastStyleType } from '../Toast';

interface ManageRegisterButtonProps {
  _id: ObjectId;
  title: string;
}

const ManageRegisterButton = ({ _id, title }: ManageRegisterButtonProps) => {
  const { isAuthenticated } = useAuth();
  const { isLoading } = useDeleteHospitalMutation();
  const { showToast } = useToast();

  const [display, setDisplay] = useState<boolean>(false);

  const onSubmit = useCallback(async () => {
    const confirmed = window.confirm(`確定要申請${title}的管理權限嗎?`);
    if (!confirmed) return;

    showToast({ message: '尚未開放此功能', toastStyle: ToastStyleType.Warning });
    setDisplay(false);
  }, [showToast, title]);

  const form = useMemo(
    (): ReactElement => (
      <Popup title={`申請管理權限`} display={display} onClose={() => setDisplay(false)}>
        {!isAuthenticated ? (
          <label>請先登入以便進行申請!</label>
        ) : (
          <div className="flex flex-col min-w-[500px]">
            {isLoading && <label>送出中...</label>}

            <div className="flex flex-col justify-center items-center mx-auto">
              <label>{`確定要申請${title}的管理權限嗎?`}</label>
              <Button text="確定" onClick={onSubmit} />
            </div>
          </div>
        )}
      </Popup>
    ),
    [display, isAuthenticated, isLoading, onSubmit, title]
  );

  const onClick = () => setDisplay(true);

  return (
    <>
      <label onClick={onClick} className="cursor-pointer">
        📝
      </label>
      {form}
    </>
  );
};

export default ManageRegisterButton;
