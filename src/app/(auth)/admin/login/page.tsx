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

export default function AdminLoginPage() {
  const [emailAddress, setEmailAddress] = useState('');
  const [isMagicLinkSent, setIsMagicLinkSent] = useState(false);

  const handleFormAction = async (formData: FormData) => {
    try {
      const email = formData.get('email') as string;
      if (!email) {
        throw 'Email is required';
      }
      if (!email.endsWith('@savex.me')) {
        throw 'The entered email is not authorised for admin login';
      }

      setEmailAddress(email);
      const error = await signInWithMagicLink(email, 'admin');
      if (error) {
        throw error;
      }

      setIsMagicLinkSent(true);
    } catch (error) {
      errorToast(`${error}`);
    }
  };

  return (
    <div className='w-full space-y-8'>
      <p className='text-sm text-subtle text-center'>
        {isMagicLinkSent ? (
          <span>
            We have sent a magic link to <br /> <span className='font-medium'>{emailAddress}</span>
          </span>
        ) : (
          'Please enter the authorised email to login'
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
