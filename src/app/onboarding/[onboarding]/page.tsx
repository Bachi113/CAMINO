'use client';

import BusinessDetail from '@/components/onboarding/BusinessDetail';
import BusinessAddress from '@/components/onboarding/BusinessAddress';
import PersonalInformation from '@/components/onboarding/PersonalInformation';
import BusinessInformation from '@/components/onboarding/BusinessInformation';
import BankDetails from '@/components/onboarding/BankDetails';
import DocumentVerification from '@/components/onboarding/DocumentVerification';
import Logo from '@/components/Logo';
import { cn } from '@/utils/utils';
import { FaCheck } from 'react-icons/fa';
import { MdOutlineEmail } from 'react-icons/md';
import Link from 'next/link';

type TypeParams = {
  params: { onboarding: string };
  searchParams?: { form: string };
};

function ActiveStepFormComponent(step: string) {
  switch (step) {
    case 'personal_information':
      return <PersonalInformation />;
    case 'business_details':
      return <BusinessDetail />;
    case 'business_address':
      return <BusinessAddress />;
    case 'business_information':
      return <BusinessInformation />;
    case 'bank_details':
      return <BankDetails />;
    case 'document_verification':
      return <DocumentVerification />;
    default:
      return null;
  }
}

const sections = [
  {
    title: 'Personal Information',
    description: 'Please provide basic details about you',
    id: 'personal_information',
  },
  {
    title: 'Basic Business Details',
    description: 'Please provide basic details about the business',
    id: 'business_details',
  },
  {
    title: 'Business Address',
    description: 'Please provide location details about your business',
    id: 'business_address',
  },
  {
    title: 'Business Information',
    description: 'Please provide other info about your business',
    id: 'business_information',
  },
  {
    title: 'Bank Account Details',
    description: 'Please provide your banking details to verify',
    id: 'bank_details',
  },
  {
    title: 'Document Verification',
    description: 'Please provide the mentioned documents for verification',
    id: 'document_verification',
  },
];

export default function OnBoarding({ params }: TypeParams) {
  const activeStep = params.onboarding;

  return (
    <div className='flex'>
      <div className='w-full md:w-1/3 md:border-r py-14 px-16 flex flex-col justify-between bg-light-purple-gradient'>
        <div className='space-y-14'>
          <Logo />
          <div className='space-y-4'>
            {sections.map((section, index) => {
              const activeIndex = sections.findIndex((sec) => sec.id === activeStep);
              const isActive = index <= activeIndex;
              return (
                <div key={index} className='p-2 flex items-center gap-4'>
                  <FaCheck
                    className={cn(
                      isActive ? 'bg-primary text-white' : 'text-muted-foreground',
                      'rounded-full size-5 p-1'
                    )}
                  />
                  <div className='space-y-2'>
                    <p
                      className={cn(
                        isActive ? 'text-default' : 'text-muted-foreground',
                        'text-lg font-semibold leading-6'
                      )}>
                      {section.title}
                    </p>
                    <p
                      className={cn(
                        isActive ? 'text-subtle' : 'text-muted-foreground',
                        'text-sm font-normal leading-5'
                      )}>
                      {section.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <Link
          href='mailto:contact@camino.com'
          className='flex items-center gap-2 text-default text-sm font-normal leading-5 mt-5'>
          <MdOutlineEmail className='size-5' />
          <p>contact@camino.com</p>
        </Link>
      </div>
      <div className='w-full md:w-2/3 py-6 px-9'>{ActiveStepFormComponent(activeStep)}</div>
    </div>
  );
}
