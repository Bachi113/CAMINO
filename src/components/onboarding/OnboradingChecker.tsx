'use client';

import { useGetOnboardingData } from '@/app/query-hooks';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { useEffect } from 'react';

type DataKey =
  | 'onboarded_at'
  | 'personal_informations'
  | 'business_addresses'
  | 'business_details'
  | 'bank_details'
  | 'documents';

const OnboardingChecker = () => {
  const router = useRouter();
  const { data, error, isLoading } = useGetOnboardingData();

  useEffect(() => {
    if (isLoading) return;
    if (error) {
      console.error('Error fetching onboarding data:', error);
      return;
    }

    if (!data) {
      router.push('/onboarding/personal-information');
      return;
    }

    const checks: { prop: DataKey; route: string }[] = [
      { prop: 'documents', route: '/onboarding/document-verification' },
      { prop: 'bank_details', route: '/onboarding/bank-account-details' },
      { prop: 'business_addresses', route: '/onboarding/business-address' },
      { prop: 'business_details', route: '/onboarding/business-details' },
      { prop: 'personal_informations', route: '/onboarding/personal-information' },
    ];

    for (const check of checks) {
      if (!data[check.prop]) {
        router.push(check.route);
        return;
      }
    }

    if (data.onboarded_at) {
      router.push('/dashboard/m');
    }
  }, [data, error, isLoading, router]);

  // JSX shows until the redirect happens
  return (
    <Link href='/onboarding/personal-information'>
      <Button>Go to onboarding</Button>
    </Link>
  );
};

export default OnboardingChecker;
