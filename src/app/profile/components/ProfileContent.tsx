'use client';

import { ReactElement, useCallback } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';

import { Button, ButtonStyleType, defaultButtonStyle } from '@/app/global-components/buttons/Button';
import FieldErrorlabel from '@/app/global-components/FieldErrorlabel';
import { ToastStyleType } from '@/app/global-components/Toast';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { GenderType } from '@/domains/interfaces';
import { UserUpdateProps } from '@/domains/user';
import { useUserUpdateMutation } from '@/features/user/hooks/useAuthMutation';
import { useDeleteUserMutation } from '@/features/user/hooks/useDeleteUserMutation';
import { useUserQuery } from '@/features/user/hooks/useUserQuery';
import useLoginProtected from '@/hooks/utils/protections/routes/useLoginProtected';
import { profileValidationSchema } from '@/lib/validation';
import { generateToken } from '@/utils/token';

const ProfileContent = (): ReactElement => {
  useLoginProtected();
  const { user: userStorage, token, logout, login } = useAuth();
  const { showToast } = useToast();
  const { mutateAsync: userDelete } = useDeleteUserMutation();

  const {
    data: { user, manage } = {},
    isLoading: isFetching,
    refetch,
  } = useUserQuery({
    _id: userStorage?._id,
    enabled: !!userStorage?._id,
  });

  const { control, handleSubmit, reset } = useForm<UserUpdateProps>({
    resolver: yupResolver(profileValidationSchema),
    defaultValues: user
      ? {
          firstName: user.firstName,
          lastName: user.lastName,
          gender: user.gender,
        }
      : undefined, // Default values are set only if `user` data exists
  });

  const { isLoading, mutateAsync: userUpdate } = useUserUpdateMutation();

  const handleUpdate = useCallback(
    async (updateData: UserUpdateProps) => {
      if (!token || !user || !manage) return;

      const confirmed = window.confirm(`您確定要更新帳號嗎?`);
      if (!confirmed) return;

      try {
        const result = await userUpdate({ ...updateData, _id: user._id.toString() });
        if (typeof result === 'string') throw new Error(result);

        const newToken: string = await generateToken({ user: { ...user, ...updateData }, manage });
        login({ token: newToken });
        refetch();

        const { message } = result;
        showToast({ message });

        reset(updateData);
      } catch (error) {
        console.error('Update error:', error);
        showToast({ message: '請重新登入再更新!', toastStyle: ToastStyleType.Warning });
      }
    },
    [login, manage, refetch, reset, showToast, token, user, userUpdate]
  );

  const deleteUser = useCallback(async () => {
    if (!user?._id) return;

    const confirmed = window.confirm('您確定要刪除帳號嗎?');
    if (!confirmed) return;

    try {
      const result = await userDelete({ _id: user?._id });
      if (typeof result === 'string') throw new Error(result);

      const { message } = result;
      logout();
      if (message) showToast({ message, toastStyle: ToastStyleType.Warning });
    } catch (error) {
      console.error('Delete error:', error);
    }
  }, [showToast, user?._id, userDelete, logout]);

  if (isFetching) return <label className="mx-auto">讀取中...</label>;

  if (!user) return <label className="mx-auto">找不到帳號</label>;

  return (
    <div className="max-w-md min-w-96 mx-auto p-4 flex flex-col items-center gap-y-4 bg-white rounded-lg shadow-md">
      <form
        className="max-w-md min-w-96 mx-auto p-12 flex flex-col gap-y-4 bg-white rounded-lg shadow-md z-10"
        onSubmit={handleSubmit(handleUpdate)}
      >
        <h2 className="text-2xl font-bold text-center">更新帳號</h2>

        <div className="flex justify-around gap-x-2">
          <Controller
            name="firstName"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <div>
                <input
                  type="text"
                  {...field}
                  placeholder="名字"
                  autoComplete="given-name"
                  required
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <FieldErrorlabel error={error} />
              </div>
            )}
          />

          <Controller
            name="lastName"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <div>
                <input
                  type="text"
                  {...field}
                  placeholder="姓氏"
                  autoComplete="family-name"
                  required
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <FieldErrorlabel error={error} />
              </div>
            )}
          />
        </div>

        <Controller
          name="gender"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <div>
              <div className="flex justify-around gap-x-2">
                <Button
                  element={<span>男</span>}
                  onClick={() => field.onChange(GenderType.Male)}
                  className={`${defaultButtonStyle} w-full p-2 border rounded-md ${field.value === GenderType.Male ? 'bg-blue-400 text-white' : 'bg-white text-gray-700'}`}
                />
                <Button
                  element={<span>女</span>}
                  onClick={() => field.onChange(GenderType.Female)}
                  className={`${defaultButtonStyle} w-full p-2 border rounded-md ${field.value === GenderType.Female ? 'bg-blue-400 text-white' : 'bg-white text-gray-700'}`}
                />
              </div>
              <FieldErrorlabel error={error} />
            </div>
          )}
        />

        <Button text={isLoading ? '更新中...' : '更新'} type="submit" disabled={isLoading} className="w-full" />
      </form>
      <Button
        text="刪除"
        onClick={deleteUser}
        buttonStyle={ButtonStyleType.Red}
        className="transition-all z-0 w-36 -mt-8 hover:mt-0"
      />
    </div>
  );
};

export default ProfileContent;
