'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const ErrorCard = () => {
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Read the error message from the cookie
    const cookie = document.cookie.split('; ').find((row) => row.startsWith('auth_error='));

    if (cookie) {
      const error = cookie.split('=')[1];
      if (error) {
        setErrorMessage(decodeURIComponent(error));
        // Clear the cookie after reading
        document.cookie = 'auth_error=; Max-Age=0; path=/';
      }
    }
  }, []);

  return (
    <div className='flex flex-col items-center justify-center space-y-6 mt-4'>
      <p className='text-center text-red-500 bg-red-300/60 p-3 rounded-md border border-red-500'>
        {errorMessage || 'An error occurred. Please try again.'}
      </p>

      {/* TODO: Handle for multiple login system. Currently it is specific to merchant login */}
      <Link href={`/login/merchant`} className='text-primary text-sm font-semibold'>
        Go back to login
      </Link>
    </div>
  );
};

export default ErrorCard;
