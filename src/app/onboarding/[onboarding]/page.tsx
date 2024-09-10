import Logo from '@/components/Logo';
import { cn } from '@/utils/utils';
import { FaCheck } from 'react-icons/fa';
import { MdOutlineEmail } from 'react-icons/md';
import Link from 'next/link';
import { onboardingData } from './routes';

type Section = {
  title: string;
  description: string;
  id: string;
};

type TypeParams = {
  params: { onboarding: string };
};

const sections: Section[] = onboardingData.sections.map((section) => ({
  title: section.label,
  description: `Please provide ${section.label.toLowerCase().startsWith('business') ? 'details about' : 'the mentioned'} ${section.label.toLowerCase().replace('details', '').replace('verify', '').replace('provide', '')} `,
  id: section.id,
}));

const ActiveStepFormComponent = (step: string) => {
  const StepComponent = onboardingData.componentMap[step];
  return StepComponent ? <StepComponent /> : null;
};

export default async function OnBoarding({ params }: TypeParams) {
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
                <div key={section.id} className='p-2 flex items-center gap-4'>
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
          href='mailto:contact@camino.fi'
          className='flex items-center gap-2 text-default text-sm font-normal leading-5 mt-5'>
          <MdOutlineEmail className='size-5' />
          <p>contact@camino.fi</p>
        </Link>
      </div>
      <div className='w-full md:w-3/5 py-6 px-9 overflow-auto'>{ActiveStepFormComponent(activeStep)}</div>
    </div>
  );
}
