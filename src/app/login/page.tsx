'use client';
// This page represents the login screen of the application.
// It displays a central form allowing users to log in or register either through email or Google authentication.
// The application name is dynamically fetched from the config and displayed at the top.
// The `EmailAuth` and `GoogleAuth` components are used here for handling the respective authentication methods.

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signInWithEmail } from './actions';
import GoogleAuth from '@/components/auth/GoogleAuth';
import InputWrapper from '@/components/InputWrapper';
import { errorToast } from '@/utils/utils';
import Link from 'next/link';

type ILoginForm = {
  email: string;
};

const schema = yup.object().shape({
  email: yup.string().email('Invalid email address').required('Email is required'),
});

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting, isSubmitSuccessful },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const handleFormAction = async (data: ILoginForm) => {
    const response = await signInWithEmail(data.email);

    if (typeof response === 'string') {
      errorToast(response);
      return;
    }
  };

  const email = watch('email');

  return (
    <div className='h-screen flex flex-col bg-light-purple-gradient'>
      <div className='w-full flex flex-col items-center mt-36'>
        <div className='m-4 md:m-0 md:min-w-[414px]'>
          <div className='space-y-10 w-full'>
            <div className='space-y-6 flex flex-col items-center justify-center'>
              <Logo />
              <div className='space-y-2 text-center'>
                <p className='text-2xl font-semibold leading-7 text-default'>Welcome back</p>
                <p className='text-sm text-subtle'>
                  {isSubmitSuccessful ? (
                    <span>
                      We have sent a magic link to <br /> {email}
                    </span>
                  ) : (
                    'Please enter your below details to login'
                  )}
                </p>
              </div>
            </div>
            {isSubmitSuccessful ? (
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
                        size={10}
                        {...register('email')}
                      />
                    </InputWrapper>
                  </div>
                  <div>
                    <Button size='lg' className='w-full' type='submit' disabled={!isValid || isSubmitting}>
                      {isSubmitSuccessful ? 'Go To mail' : 'Continue'}
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
}
