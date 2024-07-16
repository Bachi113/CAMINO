import Sidebar from '@/components/dashboard/sidebar/Sidebar';
import { redirect } from 'next/navigation';
import React from 'react';
import { supabaseServerClient } from '@/utils/supabase/server';
import { getUserRoleFromCookie } from '@/utils/user-role';
import { TypeUserType } from '@/types/types';

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const userType = (await getUserRoleFromCookie()) as TypeUserType;

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
