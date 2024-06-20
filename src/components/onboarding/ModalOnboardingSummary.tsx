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
import { summaryFileds } from '@/utils/form-fields';
import { BiEdit } from 'react-icons/bi';
import { useRouter } from 'next/navigation';
import { onboardingData } from '@/app/onboarding/[onboarding]/routes';

type ModalOnboardingSummaryProps = {
  isOpen: boolean;
  handleModalOpen: () => void;
};

const { sections: sidebarItems } = onboardingData;

const ModalOnboardingSummary: FC<ModalOnboardingSummaryProps> = ({ isOpen, handleModalOpen }) => {
  const [selectedItem, setSelectedItem] = useState(sidebarItems[0].label);
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const router = useRouter();

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
    if (!isOpen) return;

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
  }, [sections, isOpen]);

  const handleRouteChange = (id: string) => {
    if (id === 'document-verification') {
      return handleModalOpen();
    }
    router.push(`/onboarding/${id}`);
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className='max-w-3xl'>
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
                  'flex justify-between items-center text-sm gap-4 px-4 py-2 text-default font-medium leading-6 cursor-pointer rounded-lg',
                  { 'bg-primary/10 text-primary font-semibold': selectedItem === item.id }
                )}
                onClick={() => {
                  document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                  setSelectedItem(item.id);
                }}>
                <p>{item.label}</p>
                <span onClick={() => handleRouteChange(item.id)}>
                  <BiEdit />
                </span>
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
              <Button variant='outline' size={'lg'} className='w-full' onClick={handleModalOpen}>
                Cancel
              </Button>
            </DialogClose>
            <ModalSubmitConfirmation onBoardingId={data?.id} />
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalOnboardingSummary;
