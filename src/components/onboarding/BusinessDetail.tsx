'use client';

import { useState, useEffect } from 'react';
import StoreIcon from '@/assets/icons/StoreIcon';
import InputWrapper from '@/components/InputWrapper';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { errorToast } from '@/utils/utils';
import NavigationButton from '@/components/onboarding/NavigationButton';
import { useGetBuinessDetail } from '@/app/query-hooks';
import { IBusinessDetail, businessDetailSchema } from '@/types/validations';
import { businessDetailsFields } from '@/utils/form-fields';
import { saveData, updateData } from '@/app/onboarding/actions';
import { queryClient } from '@/app/providers';
import Heading from '@/components/onboarding/Heading';
import { SubmitButton } from '@/components/SubmitButton';

const BusinessDetail = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<IBusinessDetail>({
    resolver: yupResolver(businessDetailSchema),
  });

  const { data } = useGetBuinessDetail();

  useEffect(() => {
    if (data) {
      setValue('businessName', data.business_name);
      setValue('businessType', data.business_type);
      setValue('registrationType', data.registration_type);
      setValue('vatRegistrationNumber', data.vat_registration_number);
    }
  }, [data, setValue]);

  // handle form submit
  const handleFormSubmit = async (formData: IBusinessDetail) => {
    setLoading(true);
    try {
      const dataToUpdate = {
        business_name: formData.businessName,
        business_type: formData.businessType,
        registration_type: formData.registrationType,
        vat_registration_number: formData.vatRegistrationNumber,
      };

      if (data) {
        const res = await updateData(JSON.stringify(dataToUpdate), 'business_details');
        if (res?.error) throw res.error;
      } else {
        const res = await saveData(JSON.stringify(dataToUpdate), 'business_details');
        if (res?.error) throw res.error;
      }

      queryClient.invalidateQueries({ queryKey: ['getBusinessDetail'] });

      router.push('/onboarding/business-address');
    } catch (error: any) {
      errorToast(error || 'An unknown error occurred.');
      setLoading(false);
    }
  };

  return (
    <>
      <NavigationButton showNext={!!data} />
      <div className='flex flex-col items-center justify-center mt-6 animate-fade-in-left'>
        <div className='max-w-[350px] mr-20 w-full space-y-10'>
          <Heading
            title='Business Details'
            description='Please provide basic details about the business'
            icon={<StoreIcon />}
          />
          <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-6'>
            <div className='space-y-4'>
              {businessDetailsFields.map((field) => (
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
            <SubmitButton disabled={loading}>{data ? 'Update' : 'Continue'}</SubmitButton>
          </form>
        </div>
      </div>
    </>
  );
};

export default BusinessDetail;
