import Logo from '@/components/Logo';
import { redirect } from 'next/navigation';
import React from 'react';
import { getUser } from '../actions/supabase.actions';
import { headers } from 'next/headers';

type Props = {
  children: React.ReactNode;
};

// Custom layout for login page
const LoginLayout = async ({ children }: Props) => {
  const user = await getUser();

  if (user) {
    redirect('/dashboard');
  }

  const headersList = headers();
  const pathname = headersList.get('x-current-path') || '';
  const isMerchantLogin = pathname.includes('/merchant/login');
  const isAdminLogin = pathname.includes('/admin/login');

  const loginType = isAdminLogin ? 'Admin' : isMerchantLogin ? 'Merchant' : 'Customer';

  return (
    <div className='h-screen flex items-center bg-light-purple-gradient'>
      <div className='w-11/12 md:w-[28%] space-y-2 border rounded-lg p-8 mx-auto'>
        <div className='w-full flex flex-col items-center justify-center gap-5'>
          <Logo />
          <div className='text-default font-semibold text-center space-y-2 my-4'>
            <p className='py-1 text-center font-normal text-xs text-purple-900 border border-primary/10 bg-primary/5 rounded-md'>
              {loginType} Login
            </p>
            <p className='text-2xl'>Welcome to Camino</p>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
};

export default LoginLayout;
