'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import InputWrapper from '@/components/InputWrapper';
import { errorToast } from '@/utils/utils';
import { signInWithMagicLink } from '@/app/actions/login.actions';

import { MdOutlineKeyboardBackspace } from 'react-icons/md';
import { Button } from '@/components/ui/button';
import { SubmitButton } from '@/components/SubmitButton';

export default function CustomerLoginMagicLinkPage() {
  const [emailAddress, setEmailAddress] = useState('');
  const [isMagicLinkSent, setIsMagicLinkSent] = useState(false);

  // Handle form submission
  const handleFormAction = async (formData: FormData) => {
    const email = formData.get('email') as string;
    if (!email) {
      errorToast('Email is required');
      return;
    }

    setEmailAddress(email);
    const response = await signInWithMagicLink(email, 'customer');

    if (typeof response === 'string') {
      errorToast(response);
      return;
    }
    setIsMagicLinkSent(true);
  };

  return (
    <>
      <Link href='/customer/login'>
        <Button variant='outline' className='font-normal absolute left-20 top-10'>
          <MdOutlineKeyboardBackspace className='mr-2' />
          Go back
        </Button>
      </Link>

      <div className='w-full space-y-8'>
        <p className='text-sm text-subtle text-center'>
          {isMagicLinkSent ? (
            <span>
              We have sent a magic link to <br /> <span className='font-medium'>{emailAddress}</span>
            </span>
          ) : (
            'Please enter your email address to login'
          )}
        </p>
        {isMagicLinkSent ? (
          <div className='flex flex-col justify-center gap-1'>
            <Link href='https://mail.google.com' target='_blank' className='block'>
              <Button size='xl'>Go To mail</Button>
            </Link>
            <Button variant='link' onClick={() => setIsMagicLinkSent(false)} className='font-normal'>
              <MdOutlineKeyboardBackspace className='mr-2' />
              Change email
            </Button>
          </div>
        ) : (
          <form className='space-y-7'>
            <InputWrapper label='Email address' required>
              <Input
                type='email'
                id='email'
                name='email'
                placeholder='john@gmail.com'
                className='h-11 bg-secondary mt-2'
              />
            </InputWrapper>

            <SubmitButton formAction={handleFormAction}>Continue</SubmitButton>
          </form>
        )}
      </div>
    </>
  );
}
