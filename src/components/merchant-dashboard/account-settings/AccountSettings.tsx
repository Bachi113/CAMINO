'use client';

import { cn } from '@/utils/utils';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { Separator } from '@/components/ui/separator';
import { useGetOnboardingData } from '@/app/query-hooks';
import { summaryFileds } from '@/utils/form-fields';
import { onboardingData } from '@/app/onboarding/[onboarding]/routes';
import { useState, useRef, useEffect } from 'react';

const { sections: sidebarItems } = onboardingData;
const AccountSettings = () => {
  const [selectedItem, setSelectedItem] = useState(sidebarItems[0].label);
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  const { data, isLoading } = useGetOnboardingData();

  const sections = summaryFileds(data);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '10px',
      threshold: 0.7,
    };

    setTimeout(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            setSelectedItem(sectionId);
          }
        });
      }, observerOptions);

      Object.values(sectionRefs.current).forEach((sectionRef) => {
        if (sectionRef) {
          observer.observe(sectionRef);
        }
      });

      return () => {
        observer.disconnect();
      };
    }, 100);
  }, [sections]);

  return (
    <div className='flex gap-12 mt-6'>
      <div className='w-3/12 sticky top-0 h-[calc(100vh-200px)]'>
        {sidebarItems.map((item) => (
          <div
            key={item.id}
            className={cn(
              'flex justify-between items-center text-slate-700 text-sm px-4 py-2.5 font-medium rounded-lg',
              {
                'bg-slate-700 text-white font-semibold': selectedItem === item.id,
              }
            )}>
            <p>{item.label}</p>
          </div>
        ))}
      </div>
      <div className='p-4 w-5/12 mx-auto max-h-[65vh] overflow-y-auto rounded-md bg-gray-100'>
        {isLoading ? (
          <div className='flex flex-col items-center justify-center gap-3 h-60'>
            <AiOutlineLoading3Quarters className='size-6 animate-spin' />
          </div>
        ) : (
          <div className='space-y-6'>
            {sections &&
              sections.map(({ id, inputs }) => (
                <div
                  id={id}
                  ref={(el) => {
                    sectionRefs.current[id] = el;
                  }}
                  className='space-y-4'
                  key={id}>
                  {renderFields(inputs)}
                  <Separator />
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};
const renderFields = (inputs: { label: string; id: string; value: string }[]) => {
  return inputs.map(({ label, id, value }) => (
    <div key={id} className='text-sm space-y-1'>
      <p className='font-medium text-slate-800'>{label}</p>
      <p className='border px-4 py-3 rounded-md opacity-70'>{value != '' ? value : '-'}</p>
    </div>
  ));
};
export default AccountSettings;
