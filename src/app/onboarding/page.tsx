import { TypeOnboarding } from '@/types/types';
import { supabaseServerClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function Onboarding() {
  const supabase = supabaseServerClient();

  const { data: onboarding } = await supabase.from('onboarding').select('*').single();

  // Redirects based on onboarding status
  if (!onboarding) {
    redirect('/login/merchant');
  } else if (onboarding.onboarded_at) {
    redirect('/dashboard/m');
  } else {
    const steps = [
      { field: 'personal_informations', path: '/onboarding/personal-information' },
      { field: 'business_details', path: '/onboarding/business-details' },
      { field: 'business_addresses', path: '/onboarding/business-address' },
      { field: 'bank_details', path: '/onboarding/bank-account-details' },
    ];

    for (const step of steps) {
      if (!onboarding[step.field as keyof TypeOnboarding]) {
        redirect(step.path);
        return;
      }
    }

    if (!onboarding.documents || !onboarding.onboarded_at) {
      redirect('/onboarding/document-verification');
      return;
    }
  }

  return <></>;
}
