import Sidebar from '@/components/dashboard/Sidebar';
import { redirect } from 'next/navigation';
import React from 'react';
import { getUser } from '../actions/supabase.actions';

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
