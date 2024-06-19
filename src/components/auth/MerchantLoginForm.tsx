'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { MdOutlineKeyboardBackspace } from 'react-icons/md';

import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import InputWrapper from '@/components/InputWrapper';
import GoogleAuth from '@/components/auth/GoogleAuth';
import { SubmitButton } from '../SubmitButton';
import { signInWithEmail } from '@/app/merchant-login/actions';
import { errorToast } from '@/utils/utils';

// Yup schema for form validation
const schema = yup.object().shape({
  email: yup.string().email('Invalid email address').required('Email is required'),
});

// Form data type
type ILoginForm = {
  email: string;
};

const MerchantLoginForm = () => {
  const [isOtpSent, setIsOtpSent] = useState(true);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const email = watch('email');

  // Handle form submission
  const handleFormAction = async (data: ILoginForm) => {
    const response = await signInWithEmail(data.email);

    if (typeof response === 'string') {
      return errorToast(response);
    }

    setIsOtpSent(true);
  };

  // Handle back button click
  const handleBack = () => {
    isOtpSent ? setIsOtpSent(false) : router.back();
  };

  return (
    <div className='h-screen flex flex-col bg-light-gray'>
      <Button
        size='default'
        className='gap-2 text-default w-fit mt-12 ml-16'
        variant='outline'
        onClick={handleBack}>
        <MdOutlineKeyboardBackspace className='size-5' /> Back
      </Button>
      <div className='w-full flex flex-col items-center mt-12'>
        <div className='m-4 md:m-0 md:min-w-[350px]'>
          <div className='w-full'>
            <div className='flex flex-col items-center justify-center gap-5 mb-10'>
              <Logo />
              <div className='space-y-2 text-center'>
                <p className='text-2xl font-semibold leading-7 text-default'>
                  {isOtpSent ? 'Welcome to SaveX' : 'Welcome Back'}
                </p>
                <p className='text-sm text-subtle font-medium'>
                  {isOtpSent ? (
                    <span>
                      We have sent a magic link to <br /> <span className='font-semibold'> {email}</span>
                    </span>
                  ) : (
                    'Please enter your below details to login'
                  )}
                </p>
              </div>
            </div>
            {isOtpSent ? (
              <Link href='https://mail.google.com/'>
                <SubmitButton disabled={!isValid || isSubmitting}>Go To mail</SubmitButton>
              </Link>
            ) : (
              <div className='space-y-6'>
                <GoogleAuth />
                <form onSubmit={handleSubmit(handleFormAction)} className='space-y-7'>
                  <InputWrapper label='Email address' required error={errors.email?.message}>
                    <Input
                      type='email'
                      id='email'
                      placeholder='Email address'
                      className='h-11 bg-secondary mt-2'
                      {...register('email')}
                    />
                  </InputWrapper>

                  <SubmitButton disabled={!isValid || isSubmitting}>
                    {isSubmitting ? 'Loading...' : 'Continue'}
                  </SubmitButton>
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
