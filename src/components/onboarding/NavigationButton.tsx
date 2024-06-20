import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { Button } from '@/components/ui/button';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { IoIosArrowRoundForward } from 'react-icons/io';
import { onboardingData } from '@/app/onboarding/[onboarding]/routes';

interface NavigationButtonProps {
  showNext: boolean;
}

const NavigationButton = ({ showNext }: NavigationButtonProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { sections } = onboardingData;
  const currentStep = pathname.split('/').pop() || sections[0].id;

  const currentIndex = sections.findIndex((section) => section.id === currentStep);

  const handleBack = () => {
    if (currentIndex > 0) {
      const prevStep = sections[currentIndex - 1].id;
      router.push(`/onboarding/${prevStep}`);
    }
  };

  const handleNext = () => {
    if (currentIndex < sections.length - 1) {
      const nextStep = sections[currentIndex + 1].id;
      router.push(`/onboarding/${nextStep}`);
    }
  };

  return (
    <div className='flex gap-4 mt-2'>
      {currentIndex > 0 && (
        <Button size='default' className='gap-2 text-default' variant='outline' onClick={handleBack}>
          <IoIosArrowRoundBack className='size-5' /> Back
        </Button>
      )}
      {showNext && currentIndex < sections.length - 1 && (
        <Button size='default' className='gap-2 text-default' variant='outline' onClick={handleNext}>
          Next <IoIosArrowRoundForward className='size-5' />
        </Button>
      )}
    </div>
  );
};

export default NavigationButton;
