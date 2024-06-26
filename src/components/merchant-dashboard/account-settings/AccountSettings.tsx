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
    const dataToUpdate = {
      first_name: editableValues.field1,
      last_name: editableValues.field2,
    };
    const res = await await updateData(JSON.stringify(dataToUpdate), 'personal_informations');
    if (res?.error) return errorToast(res.error);
    setLoading(false);
    toast({ description: 'Data saved successfully', variant: 'default' });
  };

  return (
    <div className='flex gap-64 mt-6'>
      <div className='w-3/12 sticky top-0 h-[calc(100vh-200px)]'>
        {sidebarItems.map((item) => (
          <div
            key={item.id}
            className={cn(
              'flex justify-between items-center text-slate-700 text-sm px-4 py-2.5 font-medium rounded-lg',
              {
                'bg-slate-800/90 text-white font-semibold': selectedItem === item.id,
              }
            )}>
            <p>{item.label}</p>
          </div>
        ))}
        <ModalDeleteAccount userId={data?.personal_informations?.user_id} />
      </div>
      <div className='p-4 w-[350px] max-h-[65vh]  overflow-y-auto rounded-md'>
        {isLoading ? (
          <div className='flex flex-col items-center justify-center gap-3 h-60'>
            <AiOutlineLoading3Quarters className='size-6 animate-spin' />
          </div>
        ) : (
          <div className='space-y-6'>
            {sections &&
              sections.map(({ id, inputs }, index) => (
                <div
                  id={id}
                  ref={(el) => {
                    sectionRefs.current[id] = el;
                  }}
                  className='space-y-4'
                  key={id}>
                  {renderFields(inputs, editableValues, handleInputChange, index === 0)}
                  {index === 0 && (
                    <Button
                      onClick={handleSave}
                      disabled={loading}
                      className='bg-slate-800 text-white px-4 py-2 rounded-md'>
                      Save
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

const renderFields = (
  inputs: Input[],
  editableValues: EditableValues,
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  isFirstSection: boolean
) => {
  return inputs.map(({ label, id, value }, index) => {
    if (isFirstSection && index < 2) {
      return (
        <div key={id} className='text-sm space-y-1 w-full'>
          <InputWrapper label={label} required>
            <Input
              type='text'
              name={`field${index + 1}`}
              value={editableValues[`field${index + 1}` as keyof EditableValues]}
              onChange={handleInputChange}
              className='border px-4 h-11 rounded-md font-medium  w-full'
            />
          </InputWrapper>
        </div>
      );
    }
    return (
      <div key={id} className='text-sm space-y-1 w-full'>
        <p className='font-medium text-slate-800'>
          {label} <span className='text-red-500'>*</span>
        </p>
        <p className='border px-4 py-2.5 rounded-md opacity-50 w-full'>{value !== '' ? value : '-'}</p>
      </div>
    );
  });
};

export default AccountSettings;
