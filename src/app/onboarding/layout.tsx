import { getUser } from '@/utils/get-user';
import { supabaseServerClient } from '@/utils/supabase/server';
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

  const supabase = supabaseServerClient();
  const { data: onboarding } = await supabase.from('onboarding').select('*').single();

  // TODO: logic for redirection.

  return children;
};

export default OnboardingLayout;
