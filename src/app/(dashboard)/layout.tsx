import Sidebar from '@/components/dashboard/sidebar/Sidebar';
import { redirect } from 'next/navigation';
import React from 'react';
import { supabaseServerClient } from '@/utils/supabase/server';
import { getUserRoleFromCookie } from '@/utils/user-role';
import { TypeUserType } from '@/types/types';
import { getCustomer, getMerchant } from '../actions/supabase.actions';

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const userType = (await getUserRoleFromCookie()) as TypeUserType;

  if (userType == null) {
    redirect('/');
  }

  let userName;
  if (userType === 'merchant') {
    const { data } = await supabaseServerClient().from('onboarding').select().single();

    if (!data?.onboarded_at) {
      redirect('/onboarding');
    }

    const merchant = await getMerchant();
    userName = merchant?.first_name;
  } else if (userType === 'customer') {
    const customer = await getCustomer();
    userName = customer?.customer_name;
  } else {
    const { data: admin } = await supabaseServerClient().from('admins').select().single();
    userName = admin?.email;
  }

  return (
    <div className='flex'>
      <Sidebar userType={userType} userName={userName || 'there'} />
      {children}
    </div>
  );
};

export default DashboardLayout;
