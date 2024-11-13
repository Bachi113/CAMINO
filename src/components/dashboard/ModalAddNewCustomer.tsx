'use client';

import { FC, useEffect, useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import InputWrapper from '@/components/InputWrapper';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { errorToast } from '@/utils/utils';
import { BarLoader } from 'react-spinners';
import { supabaseBrowserClient } from '@/utils/supabase/client';
import { TypeCreateCustomer } from '@/types/types';
import { addNewCustomer } from '@/app/actions/customers.actions';
import { toast } from '../ui/use-toast';
import { queryClient } from '@/app/providers';
import { HiPlus } from 'react-icons/hi';
import { countryOptions } from '@/utils/contsants/country-codes';
import ReactCountryFlag from 'react-country-flag';

interface ModalAddNewCustomerProps {
  openModal?: boolean;
  handleCustomerModal?: (value: boolean) => void;
  triggerButton?: boolean;
}

export const customerValidations = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  phoneCode: yup.string().required('Country code is required'),
  address: yup.string().required('Address is required'),
});

// Helper function to format full phone number
const getFullPhoneNumber = (phoneNumber: string, phoneCode: string) => {
  const country = countryOptions.find((c) => c.code === phoneCode);
  if (!country) {
    throw new Error('Please select the country code');
  }
  return `${country.phoneCode}${phoneNumber}`;
};

const ModalAddNewCustomer: FC<ModalAddNewCustomerProps> = ({
  openModal,
  handleCustomerModal,
  triggerButton,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isPending, setIsPending] = useState(false);

  const {
    reset,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TypeCreateCustomer & { phoneCode: string }>({
    resolver: yupResolver(customerValidations),
    defaultValues: {
      phoneCode: '',
    },
  });

  const handleCreateCustomer = async (formData: TypeCreateCustomer & { phoneCode: string }) => {
    const supabase = supabaseBrowserClient();

    setIsPending(true);
    try {
      // Format the phone number with country code
      const fullPhoneNumber = getFullPhoneNumber(formData.phone, formData.phoneCode);

      const customerData = {
        ...formData,
        phone: fullPhoneNumber,
      };

      const customer = await addNewCustomer(customerData);
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

      queryClient.invalidateQueries({ queryKey: ['getMerchantCustomers'] });
      queryClient.invalidateQueries({ queryKey: ['getCustomers'] });
      setIsOpen(false);
      handleCustomerModal?.(false);
      reset();
      toast({ description: 'Customer added successfully' });
    } catch (error: any) {
      errorToast(error);
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    if (openModal) {
      setIsOpen(openModal);
    }
  }, [openModal]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(value) => {
        setIsOpen(value);
        handleCustomerModal?.(value);
      }}>
      {triggerButton && (
        <DialogTrigger asChild>
          <Button size='lg' className='gap-2'>
            <HiPlus size={18} />
            Add Customer
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className='max-w-xl'>
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
            <InputWrapper
              id='phone'
              label='Mobile No'
              required
              error={errors.phone?.message || errors.phoneCode?.message}>
              <div className='flex gap-2'>
                <Select onValueChange={(val) => setValue('phoneCode', val)}>
                  <SelectTrigger className='w-24'>
                    <SelectValue placeholder='Code' />
                  </SelectTrigger>
                  <SelectContent>
                    {countryOptions.map((option) => (
                      <SelectItem key={option.code} value={option.code}>
                        <div className='flex items-center gap-2'>
                          <ReactCountryFlag
                            svg
                            countryCode={option.code}
                            style={{
                              width: '1.2em',
                              height: '1.2em',
                            }}
                          />
                          <span>{option.name}</span>
                          <span>({option.phoneCode})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input id='phone' placeholder='123456789' className='flex-1' {...register('phone')} />
              </div>
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
