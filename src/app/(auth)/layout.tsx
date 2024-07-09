import Logo from '@/components/Logo';
import { redirect } from 'next/navigation';
import React from 'react';
import { getUser } from '../actions/supabase.actions';

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
    <div className='h-screen bg-light-purple-gradient pt-28'>
      <div className='w-[28%] space-y-2 border rounded-lg p-8 mx-auto'>
        <div className='w-full flex flex-col items-center justify-center gap-5'>
          <Logo />
          <p className='text-2xl text-default font-semibold text-center'>Welcome Back</p>
        </div>

        {children}
      </div>
    </div>
  );
};

export default LoginLayout;
