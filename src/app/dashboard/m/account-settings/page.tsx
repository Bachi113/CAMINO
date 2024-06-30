import React from 'react';
import NavTitle from '@/components/merchant-dashboard/NavTitle';
import AccountSettings from '@/components/merchant-dashboard/account-settings/AccountSettings';

const Page = () => {
  return (
    <div className='p-8 w-full space-y-12'>
      <div>
        <NavTitle />
        <p className='text-slate-500 font-medium mt-2 text-sm'>Access and Manage Details of your account</p>
      </div>

      <AccountSettings />
    </div>
  );
};

export default Page;
