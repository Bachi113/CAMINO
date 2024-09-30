'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import InputWrapper from '@/components/InputWrapper';
import GoogleAuth from '@/components/auth/GoogleAuth';
import { errorToast } from '@/utils/utils';
import { signInWithMagicLink } from '@/app/actions/login.actions';
import { MdOutlineKeyboardBackspace } from 'react-icons/md';
import { Button } from '@/components/ui/button';
import { SubmitButton } from '@/components/SubmitButton';

export default function MerchantLoginPage() {
  const [emailAddress, setEmailAddress] = useState('');
  const [isMagicLinkSent, setIsMagicLinkSent] = useState(false);

  const handleFormAction = async (formData: FormData) => {
    const email = formData.get('email') as string;
    if (!email) {
      errorToast('Email is required');
      return;
    }

    setEmailAddress(email);
    const error = await signInWithMagicLink(email, 'merchant');

    if (error) {
      errorToast(error);
      return;
    }
    setIsMagicLinkSent(true);
  };

  return (
    <div className='w-full space-y-8'>
      <p className='text-sm text-subtle text-center'>
        {isMagicLinkSent ? (
          <span>
            We have sent a magic link to <br /> <span className='font-medium'>{emailAddress}</span>
          </span>
        ) : (
          'Please enter your below details to login'
        )}
      </p>
      {isMagicLinkSent ? (
        <div className='flex flex-col justify-center gap-1'>
          <Link href='https://mail.google.com' target='_blank' className='block'>
            <Button size='xl'>Check your Email</Button>
          </Link>
          <Button variant='link' onClick={() => setIsMagicLinkSent(false)} className='font-normal'>
            <MdOutlineKeyboardBackspace className='mr-2' />
            Go back
          </Button>
        </div>
      ) : (
        <div className='w-full space-y-6'>
          <GoogleAuth />

          <div className='flex items-center gap-2'>
            <hr className='w-full' />
            <span>or</span>
            <hr className='w-full' />
          </div>

          <form className='space-y-7'>
            <InputWrapper label='Email address' required>
              <Input
                type='email'
                id='email'
                name='email'
                placeholder='john@gmail.com'
                className='h-11 mt-2'
              />
            </InputWrapper>

            <SubmitButton formAction={handleFormAction}>Verify & Login</SubmitButton>
          </form>
        </div>
      )}
    </div>
  );
}
