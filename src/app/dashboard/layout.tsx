import Sidebar from '@/components/merchant-dashboard/Sidebar';
import { getUser } from '@/utils/get-user';
import { redirect } from 'next/navigation';
import React from 'react';

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getUser();

  // Redirects to login page if user is not authenticated
  // TODO: handle for different user types
  if (!user) {
    redirect('/merchant/login');
  }

  return (
    <div className='flex'>
      <Sidebar />
      {children}
    </div>
  );
};

export default DashboardLayout;
