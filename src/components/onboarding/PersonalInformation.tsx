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

type IPersonalInformation = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  terms: boolean;
};

const schema = yup.object().shape({
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

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IPersonalInformation>({
    resolver: yupResolver(schema),
    defaultValues: {
      terms: false,
    },
  });

  const onHandleFormSubmit = async (data: IPersonalInformation) => {
    const user = await getUser();

    const userId = user?.id;

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
      return;
    }

    const { error: insert_onboarding_error } = await supabase.from('onboarding').insert({
      user_id: userId!,
      personal_informations: insert_data.id,
    });

    if (insert_onboarding_error) {
      errorToast(insert_onboarding_error.message);
      console.error('Error inserting onboarding:', insert_onboarding_error);
      return;
    }
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
                <Input type='text' placeholder='First name' id='firstName' {...register('firstName')} />
              </InputWrapper>
              <InputWrapper label='Last name' required error={errors.lastName?.message}>
                <Input type='text' placeholder='Last name' id='lastName' {...register('lastName')} />
              </InputWrapper>
              <InputWrapper label='Email address' required error={errors.email?.message}>
                <Input type='email' placeholder='Email address' id='email' {...register('email')} />
              </InputWrapper>
              <InputWrapper label='Phone Number' required error={errors.phone?.message}>
                <Input type='text' placeholder='Phone Number' id='phone' {...register('phone')} />
              </InputWrapper>
              <InputWrapper error={errors.terms?.message}>
                <div className='flex items-center space-x-2'>
                  {/* TODO fix spacing issue */}
                  <Checkbox id='terms' onCheckedChange={(checked) => setValue('terms', checked as boolean)} />
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
              <Button className='w-full' size='lg' type='submit'>
                Continue
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonalInformation;
