import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { MdOutlineKeyboardBackspace } from 'react-icons/md';
import StoreIcon from '@/assets/icons/StoreIcon';
import InputWrapper from '../InputWrapper';
import { Input } from '../ui/input';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { errorToast } from '@/utils/utils';
import { getUser } from '@/utils/get-user';
import { supabaseBrowserClient } from '@/utils/supabase/client';

export type TBusinessAddress = {
  streetAddress: string;
  city: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
};

export const businessAddressSchema = yup.object().shape({
  streetAddress: yup.string().required('Street Address is required'),
  city: yup.string().required('City is required'),
  postalCode: yup.string().required('Postal Code is required'),
  country: yup.string().required('Country is required'),
  phoneNumber: yup.string().required('Phone Number is required'),
});

const BusinessAddress = () => {
  const router = useRouter();
  const supabase = supabaseBrowserClient();

  const [isBusinessAddress, isSetBusinessAddress] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TBusinessAddress>({
    resolver: yupResolver(businessAddressSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const user = await getUser();
      const userId = user?.id;

      const { data, error } = await supabase
        .from('business_addresses')
        .select('*')
        .eq('user_id', userId!)
        .single();

      if (data) {
        isSetBusinessAddress(true);
        setValue('streetAddress', data.street_address);
        setValue('city', data.city);
        setValue('postalCode', data.postal_code);
        setValue('country', data.country);
        setValue('phoneNumber', data.phone_number);
      }

      if (error) {
        console.error('Error fetching business address:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, [setValue, supabase]);

  const onHandleFormSubmit = async (data: TBusinessAddress) => {
    setLoading(true);
    const user = await getUser();
    const userId = user?.id;

    if (isBusinessAddress) {
      const { error } = await supabase
        .from('business_addresses')
        .update({
          street_address: data.streetAddress,
          city: data.city,
          postal_code: data.postalCode,
          country: data.country,
          phone_number: data.phoneNumber,
        })
        .eq('user_id', userId!);

      if (error) {
        errorToast(error.message);
        console.error('Error updating business address:', error);
        setLoading(false);
        return;
      }
    } else {
      const { data: insert_data, error } = await supabase
        .from('business_addresses')
        .insert({
          street_address: data.streetAddress,
          city: data.city,
          postal_code: data.postalCode,
          country: data.country,
          phone_number: data.phoneNumber,
          user_id: userId!,
        })
        .select('id')
        .single();

      if (error) {
        errorToast(error.message);
        console.error('Error inserting business address:', error);
        setLoading(false);
        return;
      }

      const { error: insert_onboarding_error } = await supabase
        .from('onboarding')
        .update({
          user_id: userId!,
          business_addresses: insert_data.id,
        })
        .eq('user_id', userId!);

      if (insert_onboarding_error) {
        errorToast(insert_onboarding_error.message);
        console.error('Error updating onboarding:', insert_onboarding_error);
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    router.push('/onboarding/business_information');
  };

  return (
    <>
      <Button
        size='default'
        className='gap-2 text-default'
        variant='outline'
        onClick={() => router.push('/onboarding/business_details')}>
        <MdOutlineKeyboardBackspace className='size-5' /> Back
      </Button>
      <div className='flex flex-col items-center justify-center mt-6'>
        <div className='max-w-[350px] w-full space-y-10'>
          <div className='space-y-6 flex flex-col items-center'>
            <div className='border rounded-lg p-3'>
              <StoreIcon />
            </div>
            <div className='space-y-2 text-center'>
              <p className='text-default text-2xl font-semibold leading-7'>Business Address</p>
              <p className='text-subtle text-sm text-normal leading-5'>
                Please provide location details about your business
              </p>
            </div>
          </div>
          <form onSubmit={handleSubmit(onHandleFormSubmit)}>
            <div className='space-y-6'>
              <div className='space-y-4'>
                <InputWrapper label='Street Address' required error={errors.streetAddress?.message}>
                  <Input
                    type='text'
                    placeholder='Street Address'
                    id='streetAddress'
                    {...register('streetAddress')}
                    disabled={loading}
                  />
                </InputWrapper>
                <InputWrapper label='City' required error={errors.city?.message}>
                  <Input type='text' placeholder='City' id='city' {...register('city')} disabled={loading} />
                </InputWrapper>
                <InputWrapper label='Postal Code' required error={errors.postalCode?.message}>
                  <Input
                    type='text'
                    placeholder='Postal Code'
                    id='postalCode'
                    {...register('postalCode')}
                    disabled={loading}
                  />
                </InputWrapper>
                <InputWrapper label='Country' required error={errors.country?.message}>
                  <Input
                    type='text'
                    placeholder='Country'
                    id='country'
                    {...register('country')}
                    disabled={loading}
                  />
                </InputWrapper>
                <InputWrapper label='Business Phone Number' required error={errors.phoneNumber?.message}>
                  <Input
                    type='text'
                    placeholder='Business Phone Number'
                    id='phoneNumber'
                    {...register('phoneNumber')}
                    disabled={loading}
                  />
                </InputWrapper>
              </div>
              <div>
                <Button className='w-full' size='lg' type='submit' disabled={loading}>
                  {loading ? 'Loading...' : isBusinessAddress ? 'Update' : 'Continue'}
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
