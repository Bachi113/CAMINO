import { useState, useRef, FC, useEffect } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/utils';
import ModalSubmitConfirmation from './ModalSubmitConfirmation';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { Separator } from '@/components/ui/separator';
import { useGetOnboardingData } from '@/app/query-hooks';
import { onboardingData } from '@/app/onboarding/[onboarding]/page';
import { summaryFileds } from '@/utils/form-fields';

type ModalOnboardingSummaryProps = {
  isSubmitSuccessful: boolean;
  setShowModal: (value: boolean) => void;
};

const { sections: sidebarItems } = onboardingData;

const ModalOnboardingSummary: FC<ModalOnboardingSummaryProps> = ({ isSubmitSuccessful, setShowModal }) => {
  const [selectedItem, setSelectedItem] = useState(sidebarItems[0].label);
  const [isOpen, setIsOpen] = useState<boolean>(isSubmitSuccessful);
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  const { data, isLoading } = useGetOnboardingData();

  const renderFields = (inputs: { label: string; id: string; value: string }[]) => {
    return inputs.map(({ label, id, value }) => (
      <div key={id} className='text-sm font-medium'>
        <p className='text-default'>{label}</p>
        <p className='border px-4 py-3 rounded-md mt-1 text-slate-800'>{value}</p>
      </div>
    ));
  };

  const sections = summaryFileds(data);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

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
  }, [sections]);

  return (
    <Dialog open={isOpen}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle className='text-slate-800'>Review Your Information</DialogTitle>
          <DialogDescription>Please check the details below before submitting the form</DialogDescription>
        </DialogHeader>
        <div className='flex gap-12 mt-6'>
          <div className='w-5/12 sticky top-0 h-[calc(100vh-200px)]'>
            {sidebarItems.map((item) => (
              <div
                key={item.id}
                className={cn(
                  'flex items-center text-sm gap-4 px-4 py-2 text-default font-medium leading-6 cursor-pointer rounded-lg',
                  { 'bg-primary/10 text-primary font-semibold': selectedItem === item.id }
                )}
                onClick={() => {
                  document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                  setSelectedItem(item.id);
                }}>
                <p>{item.label}</p>
              </div>
            ))}
          </div>
          <div className='p-4 w-7/12 max-h-[calc(100vh-200px)] overflow-y-auto rounded-md bg-gray-100'>
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
        <DialogFooter>
          <div className='flex gap-4 w-full'>
            <DialogClose asChild>
              <Button
                variant='outline'
                className='w-full'
                onClick={() => {
                  setIsOpen(false);
                  setShowModal(false);
                }}>
                Cancel
              </Button>
            </DialogClose>
            <ModalSubmitConfirmation />
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalOnboardingSummary;
