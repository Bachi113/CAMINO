import Logo from '@/components/Logo';
import { redirect } from 'next/navigation';
import React from 'react';
import { getUser } from '../actions/supabase.actions';
import AuthHeader from '@/components/auth/AuthHeader';

type Props = {
  children: React.ReactNode;
};

// Custom layout for login page
const LoginLayout = async ({ children }: Props) => {
  const user = await getUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className='h-screen flex items-center bg-light-purple-gradient'>
      <div className='w-11/12 md:w-[28%] space-y-2 border rounded-lg p-8 mx-auto'>
        <div className='w-full flex flex-col items-center justify-center gap-5'>
          <Logo />
          <AuthHeader />
        </div>

        {children}
      </div>
    </div>
  );
};

export default LoginLayout;
