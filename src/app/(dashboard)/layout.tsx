import Sidebar from '@/components/dashboard/sidebar/Sidebar';
import { redirect } from 'next/navigation';
import React from 'react';
import { getUserType } from '../actions/supabase.actions';
import { supabaseServerClient } from '@/utils/supabase/server';

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const userType = await getUserType();

  if (userType == null) {
    redirect('/');
  }

  if (userType === 'merchant') {
    const { data } = await supabaseServerClient().from('onboarding').select().single();

    if (!data?.onboarded_at) {
      redirect('/onboarding');
    }
  }

  return (
    <div className='flex'>
      <Sidebar userType={userType} />
      {children}
    </div>
  );
};

export default DashboardLayout;
