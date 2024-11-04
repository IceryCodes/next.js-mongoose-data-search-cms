import { useCallback } from 'react';

import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/app/global-components/buttons/Button';
import { GetUsersDto } from '@/domains/user';

interface UsersSearchProps {
  searchUsers: (formData: GetUsersDto) => void;
}

const UsersSearch = ({ searchUsers }: UsersSearchProps) => {
  const { control, handleSubmit, reset } = useForm<GetUsersDto>({
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = useCallback(
    (formData: GetUsersDto) => {
      searchUsers(formData);
      reset();
    },
    [reset, searchUsers]
  );

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-x-2 flex-grow h-[100px]">
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <input type="email" placeholder="帳號信箱" {...field} className="border rounded px-4 py-2 flex-grow" />
          )}
        />
        <Button text="搜尋" type="submit" className="whitespace-nowrap" />
      </form>
    </>
  );
};

export default UsersSearch;
