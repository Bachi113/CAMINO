import dynamic from 'next/dynamic';
import Logo from '@/components/Logo';
import { cn } from '@/utils/utils';
import { FaCheck } from 'react-icons/fa';
import { MdOutlineEmail } from 'react-icons/md';
import Link from 'next/link';

type Section = {
  title: string;
  description: string;
  id: string;
};

type TypeParams = {
  params: { onboarding: string };
};

const sections: Section[] = [
  {
    title: 'Personal Information',
    description: 'Please provide basic details about you',
    id: 'personal-information',
  },
  {
    title: 'Basic Business Details',
    description: 'Please provide basic details about the business',
    id: 'business-details',
  },
  {
    title: 'Business Address',
    description: 'Please provide location details about your business',
    id: 'business-address',
  },
  {
    title: 'Business Information',
    description: 'Please provide other info about your business',
    id: 'business-information',
  },
  {
    title: 'Bank Account Details',
    description: 'Please provide your banking details to verify',
    id: 'bank-details',
  },
  {
    title: 'Document Verification',
    description: 'Please provide the mentioned documents for verification',
    id: 'document-verification',
  },
];

const ActiveStepFormComponent = (step: string) => {
  const componentMap: { [key: string]: any } = {
    'personal-information': dynamic(() => import('@/components/onboarding/PersonalInformation')),
    'business-details': dynamic(() => import('@/components/onboarding/BusinessDetail')),
    'business-address': dynamic(() => import('@/components/onboarding/BusinessAddress')),
    'business-information': dynamic(() => import('@/components/onboarding/BusinessInformation')),
    'bank-details': dynamic(() => import('@/components/onboarding/BankDetails')),
    'document-verification': dynamic(() => import('@/components/onboarding/DocumentVerification')),
  };

  const StepComponent = componentMap[step];
  return StepComponent ? <StepComponent /> : null;
};

export default function OnBoarding({ params }: TypeParams) {
  const activeStep = params.onboarding;

  return (
    <div className='flex h-screen'>
      <div className='w-full md:w-2/5 md:border-r py-14 px-16 mx-2 flex flex-col justify-between bg-light-purple-gradient'>
        <div className='space-y-12'>
          <Logo />
          <div className='space-y-2 pt-2'>
            {sections.map((section, index) => {
              const activeIndex = sections.findIndex((sec) => sec.id === activeStep);
              const isActive = index <= activeIndex;
              return (
                <div key={index} className='p-2 flex items-center gap-4'>
                  <FaCheck
                    className={cn(
                      isActive ? 'bg-primary' : 'bg-slate-400',
                      'rounded-full size-5 p-1 text-white'
                    )}
                  />
                  <div className='space-y-1'>
                    <p
                      className={cn(
                        isActive ? 'text-slate-800 font-semibold' : 'text-slate-400 font-semibold',
                        'text-lg leading-7'
                      )}>
                      {section.title}
                    </p>
                    <p
                      className={cn(
                        isActive ? 'text-slate-600' : 'text-slate-400',
                        'text-sm font-medium leading-5'
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
      <div className='w-full md:w-3/5 py-6 px-9 overflow-auto'>{ActiveStepFormComponent(activeStep)}</div>
    </div>
  );
}
