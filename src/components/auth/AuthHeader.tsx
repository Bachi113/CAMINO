'use client';

import { usePathname } from 'next/navigation';

const AuthHeader = () => {
  const pathname = usePathname();
  const isMerchantLogin = pathname.includes('/merchant/login');
  const isAdminLogin = pathname.includes('/admin/login');

  const loginType = isAdminLogin ? 'Admin' : isMerchantLogin ? 'Business' : 'Customer';

  return (
    <div className='text-default font-semibold text-center space-y-2 my-4'>
      <p className='py-1 text-center font-normal text-xs text-purple-900 border border-primary/10 bg-primary/5 rounded-md'>
        {loginType} Login/Register
      </p>
      <p className='text-2xl'>Welcome to Camino</p>
    </div>
  );
};

export default AuthHeader;
