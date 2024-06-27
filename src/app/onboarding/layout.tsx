import { getUser } from '@/utils/get-user';
import { redirect } from 'next/navigation';
import React from 'react';

type Props = {
  children: React.ReactNode;
};

// Custom layout for login page
const OnboardingLayout = async ({ children }: Props) => {
  const user = await getUser();

  // Redirects to login page if user is not authenticated
  if (!user) {
    redirect('/login/merchant');
  }

  return children;
};

export default OnboardingLayout;
