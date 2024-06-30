'use client';

import { cn, errorToast } from '@/utils/utils';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { Separator } from '@/components/ui/separator';
import { useGetOnboardingData } from '@/app/query-hooks';
import { summaryFileds } from '@/utils/form-fields';
import { onboardingData } from '@/app/onboarding/[onboarding]/routes';
import { useState, useRef, useEffect } from 'react';
import ModalDeleteAccount from './ModalDeleteAccount';
import { redirect } from 'next/navigation';
import { updateData } from '@/app/actions/onboarding.actions';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import InputWrapper from '@/components/InputWrapper';
import { Input } from '@/components/ui/input';

type Input = {
  label: string;
  id: string;
  value: string;
};

type EditableValues = {
  field1: string;
  field2: string;
};

const { sections: sidebarItems } = onboardingData;

const AccountSettings = () => {
  const [selectedItem, setSelectedItem] = useState(sidebarItems[0].label);
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const [loading, setLoading] = useState(false);
  const { data, isLoading } = useGetOnboardingData();

  const [editableValues, setEditableValues] = useState<EditableValues>({
    field1: '',
    field2: '',
  });

  useEffect(() => {
    if (!data && !isLoading) {
      redirect('/onboarding');
    }
  }, [data, isLoading]);

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

  useEffect(() => {
    if (data) {
      setEditableValues({
        field1: data.personal_informations?.first_name || '',
        field2: data.personal_informations?.last_name || '',
      });
    }
  }, [data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditableValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);

    const piId = data?.personal_informations?.id;
    const res = await await updateData(
      {
        id: piId!,
        first_name: editableValues.field1,
        last_name: editableValues.field2,
      },
      'personal_informations'
    );

    if (res?.error) {
      errorToast(res.error);
    } else {
      toast({ description: 'Data saved successfully', variant: 'default' });
    }
    setLoading(false);
  };

  return (
    <div className='flex justify-start gap-8 mt-6'>
      <div className='w-1/4 space-y-24'>
        <div className='space-y-1'>
          {sidebarItems.map((item) => (
            <div
              key={item.id}
              className={cn('text-secondary text-sm px-4 py-2.5 font-medium rounded-lg', {
                'bg-secondary text-white font-semibold': selectedItem === item.id,
              })}>
              <p>{item.label}</p>
            </div>
          ))}
        </div>
        <ModalDeleteAccount userId={data?.personal_informations?.user_id} />
      </div>

      <div className='p-4 max-h-[calc(100vh-172px)] border overflow-y-auto rounded-md bg-secondary/5 w-full'>
        {isLoading ? (
          <div className='flex flex-col items-center justify-center gap-3 h-60'>
            <AiOutlineLoading3Quarters className='size-6 animate-spin' />
          </div>
        ) : (
          <div className='space-y-6'>
            {sections?.map(({ id, inputs }, index) => (
              <div
                id={id}
                ref={(el) => {
                  sectionRefs.current[id] = el;
                }}
                className='space-y-4'
                key={id}>
                {inputs.map(({ label, id, value }, idx) => {
                  const isDisabled = !(index === 0 && idx < 2);

                  return (
                    <InputWrapper key={id} label={label} required>
                      <Input
                        type='text'
                        name={`field${idx + 1}`}
                        value={isDisabled ? value : editableValues[`field${idx + 1}` as keyof EditableValues]}
                        disabled={isDisabled}
                        onChange={isDisabled ? undefined : handleInputChange}
                        className='h-11 disabled:bg-white/50'
                      />
                    </InputWrapper>
                  );
                })}

                {index === 0 && (
                  <Button onClick={handleSave} disabled={loading} className='bg-slate-800'>
                    Update
                  </Button>
                )}
                <Separator />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountSettings;
