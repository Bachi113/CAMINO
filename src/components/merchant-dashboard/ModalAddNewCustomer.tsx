'use client';

import { FC, useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import InputWrapper from '@/components/InputWrapper';
import { Input } from '@/components/ui/input';
import { errorToast } from '@/utils/utils';
import { BarLoader } from 'react-spinners';
import { supabaseBrowserClient } from '@/utils/supabase/client';
import { TypeCreateCustomer } from '@/types/types';
import { addNewCustomer } from '@/app/actions/customers.actions';
import { toast } from '../ui/use-toast';
import { queryClient } from '@/app/providers';

interface ModalAddNewCustomerProps {
  isOpen: boolean;
  handleModalOpen: (value: boolean) => void;
}

const validations = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().required('Email is required'),
  phone: yup.string().required('Phone is required'),
  address: yup.string().required('Address is required'),
});

const ModalAddNewCustomer: FC<ModalAddNewCustomerProps> = ({ isOpen, handleModalOpen }) => {
  const [isPending, setIsPending] = useState(false);

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TypeCreateCustomer>({
    resolver: yupResolver(validations),
  });

  const handleCreateCustomer = async (formData: TypeCreateCustomer) => {
    const supabase = supabaseBrowserClient();

    setIsPending(true);
    try {
      const customer = await addNewCustomer(formData);
      if (customer.error) {
        throw customer.error;
      }

      const { data: customerExists } = await supabase
        .from('merchants_customers')
        .select('*')
        .eq('customer_id', customer.id!)
        .single();

      if (customerExists != null) {
        throw 'Customer already exists with same Email Id';
      }

      const { error: error } = await supabase.from('merchants_customers').insert({
        merchant_id: customer.merchant!,
        customer_id: customer.id!,
      });
      if (error) {
        throw error.message;
      }

      queryClient.invalidateQueries({ queryKey: ['getCustomers'] });
      handleModalOpen(false);
      reset();
      toast({ description: 'Customer added successfully' });
    } catch (error: any) {
      errorToast(error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleModalOpen}>
      {/* <DialogTrigger asChild>
        <Button>Add Customer</Button>
      </DialogTrigger> */}
      <DialogContent>
        <DialogHeader className='mb-4'>
          <DialogTitle>Add New Customer</DialogTitle>
          <DialogDescription className='opacity-75'>
            Add customer details to keep track of your customers.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleCreateCustomer)} className='space-y-4'>
          <div className='flex gap-4'>
            <InputWrapper id='customerName' label='Customer name' required error={errors.name?.message}>
              <Input id='customerName' placeholder='John Doe' {...register('name')} />
            </InputWrapper>
            <InputWrapper id='phone' label='Mobile No' required error={errors.phone?.message}>
              <Input id='phone' placeholder='+44 234324342' {...register('phone')} />
            </InputWrapper>
          </div>

          <div className='flex gap-4'>
            <InputWrapper id='address' label='Address' required error={errors.address?.message}>
              <Input id='address' placeholder='28 Dunmow Road, Grimmet, UK' {...register('address')} />
            </InputWrapper>
            <InputWrapper id='email' label='Email' required error={errors.email?.message}>
              <Input id='email' type='email' placeholder='john.doe@gmail.com' {...register('email')} />
            </InputWrapper>
          </div>

          <DialogFooter className='sm:space-x-4 !mt-8'>
            <DialogClose asChild>
              <Button variant='outline' size='lg' className='w-full'>
                Cancel
              </Button>
            </DialogClose>
            <Button type='submit' size='lg' disabled={isPending} className='w-full'>
              {isPending ? <BarLoader height={1} /> : 'Add'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalAddNewCustomer;
