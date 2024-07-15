'use client';

import InputWrapper from '@/components/InputWrapper';
import { Input } from '@/components/ui/input';
import { useGetAdminData } from '@/hooks/query';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import ModalDeleteAccount from './ModalDeleteAccount';

const AdminAccountSettings = () => {
  const { data, isLoading } = useGetAdminData();

  if (isLoading) {
    return <AiOutlineLoading3Quarters className='size-4 animate-spin' />;
  }

  return (
    <div className='mt-6'>
      <div className='w-1/3 space-y-4 mb-20'>
        <InputWrapper id='email' label='Email address' required>
          <Input id='email' disabled value={data?.email || ''} />
        </InputWrapper>
      </div>

      <ModalDeleteAccount className='p-0' />
    </div>
  );
};

export default AdminAccountSettings;
