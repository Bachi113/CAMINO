'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MdOutlineKeyboardBackspace } from 'react-icons/md';
import InputWrapper from '@/components/InputWrapper';
import { signInWithPhone, signInWithEmail } from './actions';
import Link from 'next/link';
import { MdLocalPhone } from 'react-icons/md';
import { MdOutlineEmail } from 'react-icons/md';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { errorToast } from '@/utils/utils';

type LoginFormValues = {
  email: string;
};

const schema = yup.object().shape({
  email: yup.string().email('Invalid email address').required('Email is required'),
});

export default function Login() {
  const [loginMethod, setLoginMethod] = useState<'otp' | 'magic' | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isSubmitting, isSubmitSuccessful },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(schema),
  });

  const handleSendOTP = async (data: { phone: string }) => {
    try {
      await signInWithPhone(data.phone);
      setOtpSent(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFormAction = async (data: LoginFormValues) => {
    try {
      const response = await signInWithEmail(data.email);

      if (typeof response === 'string') {
        errorToast(response);
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const email = watch('email');

  return (
    <div className='h-screen flex flex-col bg-light-gray'>
      <Button
        size='default'
        className='gap-2 text-default w-fit mt-16 ml-20'
        variant='outline'
        onClick={() => setLoginMethod(null)}>
        <MdOutlineKeyboardBackspace className='size-5' /> Back
      </Button>
      <div className='w-full flex flex-col items-center mt-9'>
        <div className='m-4 md:m-0 md:w-[414px] border rounded-lg p-8'>
          <div className='space-y-10 w-full'>
            <div className='space-y-6 flex flex-col items-center justify-center'>
              <Logo />
              <div className='space-y-2 text-center'>
                <p className='text-2xl font-semibold leading-7 text-default'>Welcome back</p>
                <p className='text-sm text-subtle font-medium'>
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
            {/* {loginMethod === 'otp' && (
              <form onSubmit={handleSubmit(handleFormAction)} className='space-y-2'>
                <InputWrapper label='Phone number' required>
                  <Input
                    type='tel'
                    placeholder='Phone number'
                    {...register('phone', { required: true })}
                    className='w-full h-11 bg-secondary'
                  />
                </InputWrapper>
                {!otpSent ? (
                  <Button size='lg' className='w-full' onClick={handleSubmit(handleSendOTP)}>
                    Send OTP
                  </Button>
                ) : (
                  <div className='space-y-6'>
                    <InputWrapper
                      label='OTP'
                      required
                      description='We have sent you an OTP. Please enter the OTP here to login.'>
                      <Input
                        type='text'
                        placeholder='OTP'
                        {...register('otp', { required: true })}
                        className='w-full'
                      />
                    </InputWrapper>
                    <Button size='lg' type='submit' className='w-full'>
                      Login
                    </Button>
                  </div>
                )}
              </form>
            )} */}
            {loginMethod === 'magic' && (
              <div className=''>
                {isSubmitSuccessful ? (
                  <div>
                    <Link href='https://mail.google.com/'>
                      <Button size='xl' className='w-full' type='submit'>
                        Go To mail
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className='space-y-6'>
                    <form onSubmit={handleSubmit(handleFormAction)} className='space-y-6'>
                      <div>
                        <InputWrapper
                          label='Email address'
                          required
                          error={errors.email?.message}
                          description='Click on continue to get the magic link'
                          className='font-medium'>
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
                        <Button
                          size='xl'
                          className='w-full'
                          type='submit'
                          disabled={!isValid || isSubmitting}>
                          {isSubmitSuccessful ? 'Go To mail' : 'Continue'}
                        </Button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}
            {!loginMethod && (
              <div className='space-y-2'>
                <Button
                  size='xl'
                  variant='secondary'
                  className='w-full border h-11 bg-muted/50 gap-2 font-semibold text-slate-700'
                  onClick={() => setLoginMethod('magic')}>
                  <MdLocalPhone className='size-5' />
                  Login with OTP
                </Button>
                <Button
                  size='xl'
                  variant='secondary'
                  className='w-full border h-11 bg-muted/50 gap-2 font-semibold text-slate-700'
                  onClick={() => setLoginMethod('magic')}>
                  <MdOutlineEmail className='size-5' /> Login with Magic link
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
