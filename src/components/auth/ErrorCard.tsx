'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { MdOutlineKeyboardBackspace } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import Logo from '../Logo';
import Link from 'next/link';

const ErrorCard = () => {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Read the error message from the cookie
    const cookie = document.cookie.split('; ').find((row) => row.startsWith('auth_error='));

    if (cookie) {
      const error = cookie.split('=')[1];
      console.log('Error from cookie:', error);

      if (error) {
        setErrorMessage(decodeURIComponent(error));

        // Clear the cookie after reading
        document.cookie = 'auth_error=; Max-Age=0; path=/';
      }
    }
  }, []);

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
            </div>
          </div>
          <div className='flex flex-col items-center justify-center space-y-6 mt-10'>
            <h1 className='text-2xl font-semibold text-default'>Error</h1>
            <p className='text-center text-red-500 bg-red-300/60 p-3 rounded-md border border-red-500'>
              {errorMessage || 'An error occurred. Please try again.'}
            </p>
            <Link href='/login' className='text-primary text-sm font-semibold'>
              Go back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorCard;
