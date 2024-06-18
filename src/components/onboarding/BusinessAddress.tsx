'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import StoreIcon from '@/assets/icons/StoreIcon';
import InputWrapper from '@/components/InputWrapper';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { errorToast } from '@/utils/utils';
import { IBusinessAddress, businessAddressSchema } from '@/types/validations';
import { useGetBusinessAddress } from '@/app/query-hooks';
import NavigationButton from './NavigationButton';
import { businessAddressFields } from '@/utils/form-fields';
import { saveData, updateData } from '@/app/onboarding/actions';
import { queryClient } from '@/app/providers';
import Heading from './Heading';

const BusinessAddress = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IBusinessAddress>({
    resolver: yupResolver(businessAddressSchema),
  });

  const { data, isLoading } = useGetBusinessAddress();

  useEffect(() => {
    if (data) {
      setValue('streetAddress', data.street_address);
      setValue('city', data.city);
      setValue('postalCode', parseInt(data.postal_code, 10));
      setValue('country', data.country);
      setValue('phoneNumber', parseInt(data.phone_number, 10));
    }
  }, [setValue, data]);

  const handleFormSubmit = async (formData: IBusinessAddress) => {
    setLoading(true);

    const dataToUpdate = {
      street_address: formData.streetAddress,
      city: formData.city,
      postal_code: formData.postalCode,
      country: formData.country,
      phone_number: formData.phoneNumber,
    };
    try {
      if (data) {
        const res = await updateData(JSON.stringify(dataToUpdate), 'business_addresses');
        if (res?.error) throw res.error;

        queryClient.invalidateQueries({ queryKey: ['getBusinessAddress'] });
      } else {
        const res = await saveData(JSON.stringify(dataToUpdate), 'business_addresses');
        if (res?.error) throw res.error;

        queryClient.invalidateQueries({ queryKey: ['getBusinessAddress'] });
      }
      router.push('/onboarding/bank-details');
    } catch (error: any) {
      errorToast(error || 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavigationButton showNext={!!data} />
      <div className='flex flex-col items-center justify-center mt-6 animate-fade-in-left'>
        <div className='max-w-[350px] mr-20 w-full space-y-10'>
          <Heading
            title='Business Address'
            description='Please provide location details about your business'
            icon={<StoreIcon />}
          />
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className='space-y-6'>
              <div className='space-y-4'>
                {businessAddressFields.map((field) => (
                  <InputWrapper key={field.id} label={field.label} required error={errors[field.id]?.message}>
                    <Input
                      type='text'
                      placeholder={field.placeholder}
                      id={field.id}
                      {...register(field.id)}
                      disabled={loading}
                    />
                  </InputWrapper>
                ))}
              </div>
              <div>
                <Button className='w-full' size={'xl'} type='submit' disabled={loading}>
                  {loading ? 'Loading...' : data ? 'Update' : 'Continue'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default BusinessAddress;
