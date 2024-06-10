import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import StoreIcon from '@/assets/icons/StoreIcon';
import InputWrapper from '../InputWrapper';
import { Input } from '../ui/input';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Link from 'next/link';
import { Checkbox } from '../ui/checkbox';
import { supabaseBrowserClient } from '@/utils/supabase/client';
import { getUser } from '@/utils/get-user';
import { errorToast } from '@/utils/utils';

export type IPersonalInformation = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  terms: boolean;
};

export const personalInformationSchema = yup.object().shape({
  firstName: yup.string().required('First Name is required'),
  lastName: yup.string().required('Last Name is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  phone: yup.string().required('Phone Number is required'),
  terms: yup
    .boolean()
    .oneOf([true], 'You must accept the terms and conditions')
    .required('You must accept the terms and conditions'),
});

const PersonalInformation = () => {
  const router = useRouter();
  const supabase = supabaseBrowserClient();

  const [isPersonalInfo, setIsPersonalInfo] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IPersonalInformation>({
    resolver: yupResolver(personalInformationSchema),
    defaultValues: {
      terms: false,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const user = await getUser();
      const userId = user?.id;

      const { data, error } = await supabase
        .from('personal_informations')
        .select('*')
        .eq('user_id', userId!)
        .single();

      if (data) {
        setIsPersonalInfo(true);
        setValue('firstName', data.first_name);
        setValue('lastName', data.last_name);
        setValue('email', data.email);
        setValue('phone', data.phone);
        setValue('terms', true);
      }

      if (error) {
        console.error('Error fetching personal information:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, [setValue, supabase]);

  const onHandleFormSubmit = async (data: IPersonalInformation) => {
    setLoading(true);
    const user = await getUser();
    const userId = user?.id;

    if (isPersonalInfo) {
      const { error } = await supabase
        .from('personal_informations')
        .update({
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone: data.phone,
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
        .from('personal_informations')
        .insert({
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone: data.phone,
          user_id: userId!,
        })
        .select('id')
        .single();

      if (error) {
        errorToast(error.message);
        console.error('Error inserting personal information:', error);
        setLoading(false);
        return;
      }

      const { error: insert_onboarding_error } = await supabase.from('onboarding').insert({
        user_id: userId!,
        personal_informations: insert_data.id,
      });

      if (insert_onboarding_error) {
        errorToast(insert_onboarding_error.message);
        console.error('Error inserting onboarding:', insert_onboarding_error);
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    router.push('/onboarding/business_details');
  };

  return (
    <div className='flex flex-col items-center justify-center mt-14'>
      <div className='max-w-[350px] w-full space-y-10 mt-1'>
        <div className='space-y-6 flex flex-col items-center'>
          <div className='border rounded-lg p-3'>
            <StoreIcon />
          </div>
          <div className='space-y-2 text-center'>
            <p className='text-default text-2xl font-semibold leading-7'>Personal Information</p>
            <p className='text-subtle text-sm text-normal leading-5'>
              Please provide basic details about you
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onHandleFormSubmit)}>
          <div className='space-y-6'>
            <div className='space-y-4'>
              <InputWrapper label='First name' required error={errors.firstName?.message}>
                <Input
                  type='text'
                  placeholder='First name'
                  id='firstName'
                  {...register('firstName')}
                  disabled={loading}
                />
              </InputWrapper>
              <InputWrapper label='Last name' required error={errors.lastName?.message}>
                <Input
                  type='text'
                  placeholder='Last name'
                  id='lastName'
                  {...register('lastName')}
                  disabled={loading}
                />
              </InputWrapper>
              <InputWrapper label='Email address' required error={errors.email?.message}>
                <Input
                  type='email'
                  placeholder='Email address'
                  id='email'
                  {...register('email')}
                  disabled={loading}
                />
              </InputWrapper>
              <InputWrapper label='Phone Number' required error={errors.phone?.message}>
                <Input
                  type='text'
                  placeholder='Phone Number'
                  id='phone'
                  {...register('phone')}
                  disabled={loading}
                />
              </InputWrapper>
              <InputWrapper error={errors.terms?.message}>
                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='terms'
                    onCheckedChange={(checked) => setValue('terms', checked as boolean)}
                    {...register('terms')}
                    disabled={loading}
                  />
                  <label htmlFor='terms' className='text-sm font-medium space-x-1'>
                    <span>I agree to</span>
                    <Link href='' className='text-primary'>
                      Camino Terms
                    </Link>
                    <span>&</span>
                    <Link href='' className='text-primary'>
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </InputWrapper>
            </div>
            <div>
              <Button className='w-full' size='lg' type='submit' disabled={loading}>
                {loading ? 'Loading...' : isPersonalInfo ? 'Update' : 'Continue'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonalInformation;
