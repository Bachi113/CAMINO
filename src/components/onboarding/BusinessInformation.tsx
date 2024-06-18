'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import InputWrapper from '@/components/InputWrapper';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import { yupResolver } from '@hookform/resolvers/yup';
import { errorToast } from '@/utils/utils';
import { IBusinessInformation, businessInformationSchema } from '@/types/validations';
import { useGetBusinessInformation } from '@/app/query-hooks';
import NavigationButton from './NavigationButton';
import StoreIcon from '@/assets/icons/StoreIcon';
import { saveData, updateData } from '@/app/onboarding/actions';
import { queryClient } from '@/app/providers';
import Heading from './Heading';

const BusinessInformation = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [businessInformationId, setBusinessInformationId] = useState<string | null>(null);
  const [showOtherInput, setShowOtherInput] = useState(false);

  // TODO show error message if user not select any checkbox
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IBusinessInformation>({
    resolver: yupResolver(businessInformationSchema),
  });

  const { data, isLoading } = useGetBusinessInformation();

  useEffect(() => {
    if (data) {
      setValue('insideUk', data.inside_uk);
      setValue('outsideUk', data.outside_uk);
      setValue('courierCompany', data.courier_company);
      setValue('selfDelivery', data.self_delivery);
      setValue('onlineService', data.online_service);
      setValue('other', data.other || undefined);
      setBusinessInformationId(data.id);

      if (data.other) {
        setShowOtherInput(true);
      }
    }
  }, [data, setValue]);

  const handleFormSubmit = async (formData: IBusinessInformation) => {
    setLoading(true);
    const dataToUpdate = {
      inside_uk: formData.insideUk,
      outside_uk: formData.outsideUk,
      courier_company: formData.courierCompany,
      self_delivery: formData.selfDelivery,
      online_service: formData.onlineService,
      other: formData.other,
    };
    try {
      if (data) {
        const res = await updateData(JSON.stringify(dataToUpdate), 'business_informations');
        if (res?.error) throw res.error;

        queryClient.invalidateQueries({ queryKey: ['getBusinessInformation'] });
      } else {
        const res = await saveData(JSON.stringify(dataToUpdate), 'business_informations');
        if (res?.error) throw res.error;

        queryClient.invalidateQueries({ queryKey: ['getBusinessInformation'] });
      }
      router.push('/onboarding/bank-details');
    } catch (error: any) {
      console.error('Error during form submission:', error);
      errorToast(error || 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const otherLength = watch('other')?.length;

  return (
    <>
      <NavigationButton showNext={!!data} />
      <div className='flex flex-col items-center justify-center mt-6 animate-fade-in-left'>
        <div className='max-w-[350px] mr-20 w-full space-y-10'>
          <Heading
            title='Business Information'
            description='Please provide other info about your business'
            icon={<StoreIcon />}
          />

          <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-6'>
            <div className='space-y-4'>
              <InputWrapper label='Where are your target customers' required>
                <div className='space-y-2 mt-2'>
                  <div className='flex items-center gap-2.5'>
                    <Checkbox
                      id='insideUk'
                      value='Inside UK'
                      onCheckedChange={(checked) => {
                        setValue('insideUk', checked as boolean);
                      }}
                      checked={watch('insideUk') || false}
                      disabled={loading}
                    />
                    <label htmlFor='insideUk' className='text-sm text-muted-foreground'>
                      Inside UK
                    </label>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Checkbox
                      id='outsideUk'
                      onCheckedChange={(checked) => {
                        setValue('outsideUk', checked as boolean);
                      }}
                      value='Outside UK'
                      checked={watch('outsideUk') || false}
                      disabled={loading}
                    />
                    <label htmlFor='outsideUk' className='text-sm text-muted-foreground'>
                      Outside UK
                    </label>
                  </div>
                </div>
                {(errors as any)['']?.type === 'atLeastOneTargetCustomer' && (
                  <p className='text-red-500 text-sm mt-2'>{(errors as any)['']?.message}</p>
                )}
              </InputWrapper>
              <InputWrapper label='How do you deliver your goods/services?' required>
                <div className='space-y-2 mt-2'>
                  <div className='flex items-center gap-2.5'>
                    <Checkbox
                      id='courierCompany'
                      onCheckedChange={(checked) => {
                        setValue('courierCompany', checked as boolean);
                      }}
                      value='Courier company (e.g. TCS, Leopard)'
                      checked={watch('courierCompany') || false}
                      disabled={loading}
                    />
                    <label htmlFor='courierCompany' className='text-sm text-muted-foreground'>
                      Courier company (e.g. TCS, Leopard)
                    </label>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Checkbox
                      id='selfDelivery'
                      onCheckedChange={(checked) => {
                        setValue('selfDelivery', checked as boolean);
                      }}
                      value='Self Delivery (e.g. Glovo)'
                      checked={watch('selfDelivery') || false}
                      disabled={loading}
                    />
                    <label htmlFor='selfDelivery' className='text-sm text-muted-foreground'>
                      Self Delivery (e.g. Glovo)
                    </label>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Checkbox
                      id='onlineService'
                      onCheckedChange={(checked) => {
                        setValue('onlineService', checked as boolean);
                      }}
                      value='Online Services - no delivery required'
                      checked={watch('onlineService') || false}
                      disabled={loading}
                    />
                    <label htmlFor='onlineService' className='text-sm text-muted-foreground'>
                      Online Services - no delivery required
                    </label>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Checkbox
                      id='other'
                      value='Other'
                      onClick={() => setShowOtherInput(!showOtherInput)}
                      checked={otherLength! > 1 || showOtherInput || false}
                      disabled={loading}
                      onCheckedChange={() => {
                        businessInformationId && setValue('other', '');
                      }}
                    />
                    <label htmlFor='other' className='text-sm text-muted-foreground'>
                      Other
                    </label>
                  </div>
                  {showOtherInput && (
                    <Input
                      {...register('other')}
                      placeholder='Other...'
                      className='mt-3'
                      disabled={loading}
                    />
                  )}
                </div>
              </InputWrapper>
              {(errors as any)['']?.type === 'atLeastOneDeliveryMethod' && (
                <p className='text-red-500 text-sm mt-2'>{(errors as any)['']?.message}</p>
              )}
            </div>
            <div>
              <Button className='w-full' size={'xl'} type='submit' disabled={loading}>
                {loading ? 'Loading...' : businessInformationId ? 'Update' : 'Continue'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default BusinessInformation;
