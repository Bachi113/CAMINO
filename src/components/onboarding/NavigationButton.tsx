import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { MdOutlineKeyboardBackspace, MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { Button } from '@/components/ui/button'; // Assuming you have a Button component

const sections = [
  'personal-information',
  'business-details',
  'business-address',
  'business-information',
  'bank-details',
  'document-verification',
];

interface NavigationButtonProps {
  showNext: boolean;
}
const NavigationButton = ({ showNext }: NavigationButtonProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const currentStep = pathname.split('/').pop() || sections[0];
  console.log('Current step:', currentStep);

  const currentIndex = sections.indexOf(currentStep);

  const handleBack = () => {
    if (currentIndex > 0) {
      const prevStep = sections[currentIndex - 1];
      router.push(`/onboarding/${prevStep}`);
    }
  };

  const handleNext = () => {
    if (currentIndex < sections.length - 1) {
      console.log('Current index:', currentIndex);

      const nextStep = sections[currentIndex + 1];
      console.log('Next step:', nextStep);

      router.push(`/onboarding/${nextStep}`);
    }
  };

  return (
    <div className='flex gap-4 mt-2'>
      {currentIndex > 0 && (
        <Button size='default' className='gap-2 text-default' variant='outline' onClick={handleBack}>
          <MdOutlineKeyboardBackspace className='size-5' /> Back
        </Button>
      )}
      {showNext && currentIndex < sections.length - 1 && (
        <Button size='default' className='gap-2 text-default' variant='outline' onClick={handleNext}>
          Next <MdOutlineKeyboardArrowRight className='size-5' />
        </Button>
      )}
    </div>
  );
};

export default NavigationButton;
