'use client';

import InputWrapper from '@/components/InputWrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGetCustomerData } from '@/hooks/query';
import { FormEvent, useEffect, useState } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import ModalDeleteAccount from './ModalDeleteAccount';
import { supabaseBrowserClient } from '@/utils/supabase/client';
import { errorToast } from '@/utils/utils';
import { toast } from '@/components/ui/use-toast';
import { queryClient } from '@/app/providers';

const CustomerAccountSettings = () => {
  const [fullName, setFullName] = useState<string>();

  const { data, isLoading } = useGetCustomerData();

  useEffect(() => {
    if (data) {
      const name = data.customer_name;
      setFullName(name || '');
    }
  }, [data]);

  const handleUpdateAccount = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const supabase = await supabaseBrowserClient();

    const customerId = data?.id;
    const { error } = await supabase
      .from('customers')
      .update({ customer_name: fullName })
      .eq('id', customerId!);

    if (error) {
      errorToast('Error updating account details');
    }

    toast({ description: 'Account details updated successfully' });
    queryClient.invalidateQueries({ queryKey: ['getCustomer'] });
  };

  if (isLoading) {
    return <AiOutlineLoading3Quarters className='size-4 animate-spin' />;
  }

  return (
    <div className='mt-6'>
      <form onSubmit={handleUpdateAccount} className='w-1/3 space-y-4 mb-20'>
        <InputWrapper id='name' label='Full name' required>
          <Input id='name' value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </InputWrapper>
        <InputWrapper id='email' label='Email address' required>
          <Input id='email' disabled value={data?.email || ''} />
        </InputWrapper>
        <InputWrapper id='phone' label='Phone number' required>
          <Input id='phone' disabled value={data?.phone || ''} />
        </InputWrapper>

        <Button variant='secondary' disabled={data?.customer_name === fullName}>
          Update
        </Button>
      </form>

      <ModalDeleteAccount className='p-0' />
    </div>
  );
};

export default CustomerAccountSettings;
