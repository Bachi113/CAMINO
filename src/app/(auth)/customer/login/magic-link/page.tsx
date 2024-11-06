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
  const [isResending, setIsResending] = useState(false);

  // Handle form submission
  const handleFormAction = async (formData: FormData) => {
    const email = formData.get('email') as string;
    if (!email) {
      errorToast('Email is required');
      return;
    }

    setEmailAddress(email);
    const error = await signInWithMagicLink(email, 'customer');
    if (error) {
      errorToast(error);
      return;
    }
    setIsMagicLinkSent(true);
  };

  // Handle resend magic link
  const handleResend = async () => {
    setIsResending(true);
    try {
      const error = await signInWithMagicLink(emailAddress, 'customer');
      if (error) {
        errorToast(error);
        return;
      }
      errorToast('Magic link has been resent!', 'success');
    } catch (error) {
      errorToast('Failed to resend magic link');
    } finally {
      setIsResending(false);
    }
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
          <div className='flex flex-col justify-center gap-3'>
            <Link href='https://mail.google.com' target='_blank' className='block'>
              <Button size='xl' className='w-full'>
                Check your Email
              </Button>
            </Link>
            <div className='flex flex-col gap-8 items-center'>
              <Button variant='ghost' onClick={handleResend} disabled={isResending} className='w-full'>
                {isResending ? 'Resending...' : 'Resend magic link'}
              </Button>
              <Button variant='link' onClick={() => setIsMagicLinkSent(false)} className='font-normal'>
                <MdOutlineKeyboardBackspace className='mr-2' />
                Change email
              </Button>
            </div>
          </div>
        ) : (
          <form className='space-y-7'>
            <InputWrapper id='email' label='Email address' required>
              <Input type='email' id='email' name='email' placeholder='john@gmail.com' className='h-11' />
            </InputWrapper>

            <SubmitButton formAction={handleFormAction}>Continue</SubmitButton>
          </form>
        )}
      </div>
    </>
  );
}
