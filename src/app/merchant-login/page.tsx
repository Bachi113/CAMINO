import MerchantLoginForm from '@/components/auth/MerchantLoginForm';
import { getUser } from '@/utils/get-user';
import { redirect } from 'next/navigation';
import React from 'react';

const Page = async () => {
  const user = await getUser();

  // Redirects to login page if user is not authenticated
  if (user) {
    redirect('/');
  }
  return <MerchantLoginForm />;
};

export default Page;
