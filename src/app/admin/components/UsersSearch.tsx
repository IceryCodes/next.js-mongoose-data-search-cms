import { useCallback } from 'react';

import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/app/global-components/buttons/Button';
import { Input, InputStyleType } from '@/app/global-components/inputs/Input';
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
          render={({ field }) => <Input type={InputStyleType.Email} placeholder="帳號信箱" {...field} />}
        />
        <Button text="搜尋" type="submit" className="whitespace-nowrap" />
      </form>
    </>
  );
};

export default UsersSearch;
