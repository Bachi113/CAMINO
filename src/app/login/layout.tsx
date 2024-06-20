import Logo from '@/components/Logo';
import { getUser } from '@/utils/get-user';
import { redirect } from 'next/navigation';
import React from 'react';

type Props = {
  children: React.ReactNode;
};

// Custom layout for login page
const LoginLayout = async ({ children }: Props) => {
  const user = await getUser();

  // Redirects to login page if user is not authenticated
  if (user) {
    redirect('/');
  }

  return (
    <div className='h-screen bg-light-gray pt-28'>
      <div className='w-1/4 flex flex-col items-center justify-center gap-5 mx-auto'>
        <Logo />
        <p className='text-2xl font-semibold text-center'>Welcome to SaveX</p>

        {children}
      </div>
    </div>
  );
};

export default LoginLayout;
