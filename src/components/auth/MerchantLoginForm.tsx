'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MdOutlineKeyboardBackspace } from 'react-icons/md';
import InputWrapper from '@/components/InputWrapper';
import Link from 'next/link';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { errorToast } from '@/utils/utils';
import GoogleAuth from '@/components/auth/GoogleAuth';
import { useRouter } from 'next/navigation';
import { signInWithEmail } from '@/app/merchant-login/actions';

type ILoginForm = {
  email: string;
};

const schema = yup.object().shape({
  email: yup.string().email('Invalid email address').required('Email is required'),
});

const MerchantLoginForm = () => {
  const [isOtpSent, setIsOtpSent] = useState(false);

  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleFormAction = async (data: ILoginForm) => {
    const response = await signInWithEmail(data.email);

    if (typeof response === 'string') {
      return errorToast(response);
    }

    setIsOtpSent(true);
  };

  const email = watch('email');

  return (
    <div className='h-screen flex flex-col bg-light-gray'>
      <Button
        size='default'
        className='gap-2 text-default w-fit mt-12 ml-16'
        variant='outline'
        onClick={() => router.back()}>
        <MdOutlineKeyboardBackspace className='size-5' /> Back
      </Button>
      <div className='w-full flex flex-col items-center mt-12'>
        <div className='m-4 md:m-0 md:min-w-[414px]'>
          <div className='space-y-5 w-full'>
            <div className='space-y-6 flex flex-col items-center justify-center'>
              <Logo />
              <div className='space-y-2 text-center'>
                <p className='text-2xl font-semibold leading-7 text-default'>Welcome back</p>
                <p className='text-sm text-subtle font-medium'>
                  {isOtpSent ? (
                    <span>
                      We have sent a magic link to <br /> {email}
                    </span>
                  ) : (
                    'Please enter your below details to login'
                  )}
                </p>
              </div>
            </div>
            {isOtpSent ? (
              <div>
                <Link href='https://mail.google.com/'>
                  <Button size='lg' className='w-full' type='submit'>
                    Go To mail
                  </Button>
                </Link>
              </div>
            ) : (
              <div className='space-y-6'>
                <GoogleAuth />
                <form onSubmit={handleSubmit(handleFormAction)} className='space-y-6'>
                  <div>
                    <InputWrapper label='Email address' required error={errors.email?.message}>
                      <Input
                        type='email'
                        id='email'
                        placeholder='Email address'
                        className='h-11 bg-secondary'
                        {...register('email')}
                      />
                    </InputWrapper>
                  </div>
                  <div>
                    <Button size='xl' className='w-full' type='submit' disabled={!isValid || isSubmitting}>
                      {isOtpSent ? 'Go To mail' : 'Continue'}
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantLoginForm;
