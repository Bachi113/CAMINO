import { supabaseServerClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import React from 'react';

type Props = {
  children: React.ReactNode;
};

// Custom layout for login page
const OnboardingLayout = async ({ children }: Props) => {
  const supabase = supabaseServerClient();

  const { data: onboarding } = await supabase.from('onboarding').select('*').single();

  if (!onboarding) {
    redirect('/merchant/login');
  } else if (onboarding.onboarded_at) {
    redirect('/dashboard');
  }

  return children;
};

export default OnboardingLayout;
