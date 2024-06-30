'use client';

import { useEffect, useState } from 'react';
import UserIcon from '@/assets/icons/UserIcon';
import InputWrapper from '@/components/InputWrapper';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Link from 'next/link';
import { Checkbox } from '@/components/ui/checkbox';
import { errorToast } from '@/utils/utils';
import { IPersonalInformation, personalInformationSchema } from '@/types/validations';
import { useGetPersonalInfo } from '@/app/query-hooks';
import NavigationButton from '@/components/onboarding/NavigationButton';
import { personalInfoFields } from '@/utils/form-fields';
import { saveData, updateData } from '@/app/actions/onboarding.actions';
import { queryClient } from '@/app/providers';
import Heading from '@/components/onboarding/Heading';
import { SubmitButton } from '@/components/SubmitButton';

const PersonalInformation = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IPersonalInformation>({
    resolver: yupResolver(personalInformationSchema),
    defaultValues: {
      terms: false,
    },
  });

  const { data } = useGetPersonalInfo();

  useEffect(() => {
    if (data) {
      setValue('firstName', data.first_name);
      setValue('lastName', data.last_name);
      setValue('email', data.email);
      setValue('phone', data.phone);
      setValue('terms', true);
    }
  }, [data, setValue]);

  const handleFormSubmit = async (formData: IPersonalInformation) => {
    setLoading(true);

    const dataToUpdate = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone,
    };

    try {
      if (data) {
        const res = await updateData({ ...dataToUpdate, id: data.id }, 'personal_informations');
        if (res?.error) throw res.error;
      } else {
        const res = await saveData(JSON.stringify(dataToUpdate), 'personal_informations');
        if (res?.error) throw res.error;
      }

      queryClient.invalidateQueries({ queryKey: ['getPersonalInfo'] });
      router.push('/onboarding/business-details');
    } catch (error: any) {
      errorToast(error.message);
      setLoading(false);
    }
  };

  return (
    <>
      <NavigationButton showNext={!!data} />
      <div className='flex flex-col items-center justify-center mt-6 animate-fade-in-left'>
        <div className='max-w-[370px] mr-20 w-full space-y-10'>
          <Heading
            title='Key Contact Person Information'
            icon={<UserIcon />}
            description='Please provide basic details'
          />
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className='space-y-6'>
              <div className='space-y-5'>
                {personalInfoFields.map((field) => (
                  <InputWrapper key={field.id} label={field.label} required error={errors[field.id]?.message}>
                    <Input
                      type={field.type}
                      placeholder={field.placeholder}
                      id={field.id}
                      {...register(field.id)}
                      disabled={loading}
                    />
                  </InputWrapper>
                ))}

                <InputWrapper error={errors.terms?.message}>
                  <div className='flex items-center space-x-2'>
                    <Checkbox
                      id='terms'
                      onCheckedChange={(checked) => setValue('terms', checked as boolean)}
                      {...register('terms')}
                      disabled={loading}
                      checked={!!data}
                    />
                    <label htmlFor='terms' className='text-sm font-medium space-x-1'>
                      <span>I agree to</span>
                      <Link href='' className='text-primary'>
                        Camino Terms
                      </Link>
                      <span>&</span>
                      <Link href='' className='text-primary'>
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                </InputWrapper>
              </div>

              <SubmitButton isLoading={loading}>{data ? 'Update' : 'Continue'}</SubmitButton>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PersonalInformation;
