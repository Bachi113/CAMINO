import { getUser } from '@/utils/get-user';
import { redirect } from 'next/navigation';
import React from 'react';

type Props = {
  children: React.ReactNode;
};

// Custom layout for login page
const LoginLayout = async ({ children }: Props) => {
  const user = await getUser();

  // Redirects to login page if user is not authenticated
  if (user) {
    redirect('/home');
  }

  return children;
};

export default LoginLayout;
