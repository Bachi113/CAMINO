import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { MdOutlineKeyboardBackspace } from 'react-icons/md';
import StoreIcon from '@/assets/icons/StoreIcon';
import InputWrapper from '../InputWrapper';
import { Input } from '../ui/input';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { getUser } from '@/utils/get-user';
import { supabaseBrowserClient } from '@/utils/supabase/client';
import { errorToast } from '@/utils/utils';

export type IBusinessDetail = {
  businessName: string;
  businessType: string;
  registrationType: string;
  vatRegistrationNumber: string;
};

export const businessDetailSchema = yup.object().shape({
  businessName: yup.string().required('Business Name is required'),
  businessType: yup.string().required('Business Type is required'),
  registrationType: yup.string().required('Registration Type is required'),
  vatRegistrationNumber: yup.string().required('VAT Registration Number is required'),
});

const BusinessDetail = () => {
  const router = useRouter();
  const supabase = supabaseBrowserClient();
  const [loading, setLoading] = useState(false);
  const [businessDetailId, setBusinessDetailId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<IBusinessDetail>({
    resolver: yupResolver(businessDetailSchema),
  });

  useEffect(() => {
    const fetchBusinessDetails = async () => {
      setLoading(true);
      const user = await getUser();
      const userId = user?.id;

      const { data, error } = await supabase
        .from('business_details')
        .select('*')
        .eq('user_id', userId!)
        .single();

      if (data) {
        setValue('businessName', data.business_name);
        setValue('businessType', data.business_type);
        setValue('registrationType', data.registration_type);
        setValue('vatRegistrationNumber', data.vat_registration_number);
        setBusinessDetailId(data.id);
      }

      if (error && error.code !== 'PGRST116') {
        errorToast(error.message);
        console.error('Error fetching business details:', error);
      }

      setLoading(false);
    };

    fetchBusinessDetails();
  }, [supabase, setValue]);

  const onHandleFormSubmit = async (data: IBusinessDetail) => {
    setLoading(true);
    const user = await getUser();
    const userId = user?.id;

    if (businessDetailId) {
      const { error } = await supabase
        .from('business_details')
        .update({
          business_name: data.businessName,
          business_type: data.businessType,
          registration_type: data.registrationType,
          vat_registration_number: data.vatRegistrationNumber,
        })
        .eq('user_id', userId!);

      if (error) {
        errorToast(error.message);
        console.error('Error updating personal information:', error);
        setLoading(false);
        return;
      }
    } else {
      const { data: insert_data, error } = await supabase
        .from('business_details')
        .insert({
          business_name: data.businessName,
          business_type: data.businessType,
          registration_type: data.registrationType,
          vat_registration_number: data.vatRegistrationNumber,
          user_id: userId!,
        })
        .select('id')
        .single();

      if (error) {
        errorToast(error.message);
        setLoading(false);
        return;
      }

      const { error: insert_onboarding_error } = await supabase
        .from('onboarding')
        .update({
          user_id: userId!,
          business_details: insert_data.id,
        })
        .eq('user_id', userId!);

      if (insert_onboarding_error) {
        errorToast(insert_onboarding_error.message);
        console.error('Error inserting onboarding:', insert_onboarding_error);
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    router.push('/onboarding/business_address');
  };

  return (
    <>
      <Button
        size='default'
        className='gap-2 text-default'
        variant='outline'
        onClick={() => router.push('/onboarding/personal_information')}>
        <MdOutlineKeyboardBackspace className='size-5' /> Back
      </Button>
      <div className='flex flex-col items-center justify-center mt-6'>
        <div className='max-w-[350px] w-full space-y-10'>
          <div className='space-y-6 flex flex-col items-center'>
            <div className='border rounded-lg p-3'>
              <StoreIcon />
            </div>
            <div className='space-y-2 text-center'>
              <p className='text-default text-2xl font-semibold leading-7'>Business Details</p>
              <p className='text-subtle text-sm text-normal leading-5'>
                Please provide basic details about the business
              </p>
            </div>
          </div>
          <form onSubmit={handleSubmit(onHandleFormSubmit)} className='space-y-6'>
            <div className='space-y-4'>
              <InputWrapper label='Business Name' required error={errors.businessName?.message}>
                <Input
                  type='text'
                  placeholder='Name of your business'
                  id='businessName'
                  {...register('businessName')}
                  disabled={loading}
                />
              </InputWrapper>
              <InputWrapper label='Business type' required error={errors.businessType?.message}>
                <Input
                  type='text'
                  placeholder='Select Company type'
                  id='businessType'
                  {...register('businessType')}
                  disabled={loading}
                />
              </InputWrapper>
              <InputWrapper label='Registration type' required error={errors.registrationType?.message}>
                <Input
                  type='text'
                  placeholder='Select Registration type'
                  id='registrationType'
                  {...register('registrationType')}
                  disabled={loading}
                />
              </InputWrapper>
              <InputWrapper
                label='VAT Registration number'
                required
                error={errors.vatRegistrationNumber?.message}>
                <Input
                  type='text'
                  placeholder='Enter Registration eg: GB123456789'
                  id='vatRegistrationNumber'
                  {...register('vatRegistrationNumber')}
                  disabled={loading}
                />
              </InputWrapper>
            </div>
            <div>
              <Button disabled={loading} className='w-full' size='lg' type='submit'>
                {loading ? 'Loading...' : businessDetailId ? 'Update' : 'Continue'}{' '}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default BusinessDetail;
