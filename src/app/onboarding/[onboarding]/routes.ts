import dynamic from 'next/dynamic';

export const onboardingData = {
  sections: [
    { id: 'personal-information', label: 'Personal Information' },
    { id: 'business-details', label: 'Basic Business Details' },
    { id: 'business-address', label: 'Business Address' },
    { id: 'bank-account-details', label: 'Bank Account Details' },
    { id: 'document-verification', label: 'Document Verification' },
  ],
  componentMap: {
    'personal-information': dynamic(() => import('@/components/onboarding/PersonalInformation')),
    'business-details': dynamic(() => import('@/components/onboarding/BusinessDetail')),
    'business-address': dynamic(() => import('@/components/onboarding/BusinessAddress')),
    'bank-account-details': dynamic(() => import('@/components/onboarding/BankDetails')),
    'document-verification': dynamic(() => import('@/components/onboarding/DocumentVerification')),
  } as { [key: string]: any },
};
