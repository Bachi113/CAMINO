'use client';

import { useEffect, useState } from 'react';
import UserIcon from '@/assets/icons/UserIcon';
import InputWrapper from '@/components/InputWrapper';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Link from 'next/link';
import { Checkbox } from '@/components/ui/checkbox';
import { errorToast } from '@/utils/utils';
import { IPersonalInformation, personalInformationSchema } from '@/types/validations';
import { useGetPersonalInfo, useGetVerificationDocuments } from '@/hooks/query';
import NavigationButton from '@/components/onboarding/NavigationButton';
import { personalInfoFields } from '@/utils/form-fields';
import { saveData, updateData } from '@/app/actions/onboarding.actions';
import { queryClient } from '@/app/providers';
import Heading from '@/components/onboarding/Heading';
import { SubmitButton } from '@/components/SubmitButton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ReactCountryFlag from 'react-country-flag';
import { countryOptions } from '@/utils/contsants/country-codes';
import ModalOnboardingSummary from './ModalOnboardingSummary';

const PersonalInformation = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedPhoneCode, setSelectedPhoneCode] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<IPersonalInformation>({
    resolver: yupResolver(personalInformationSchema),
    defaultValues: { terms: false },
  });

  const { data } = useGetPersonalInfo();
  const { data: documentsData } = useGetVerificationDocuments();

  useEffect(() => {
    if (data) {
      setValue('firstName', data.first_name);
      setValue('lastName', data.last_name);
      setValue('email', data.email);
      setValue('terms', true);

      // Extract country code and phone number
      const phoneMatch = data.phone.match(/^\+(\d+)\s(.*)$/);
      if (phoneMatch) {
        const [, countryCode, phoneNumber] = phoneMatch;
        const country = countryOptions.find((c) => c.phoneCode === `+${countryCode}`);
        const countryCodeName = country?.code;
        setSelectedPhoneCode(countryCodeName!);
        setValue('phone', parseInt(phoneNumber, 10));
      } else {
        setValue('phone', parseInt(data.phone, 10));
      }
    }
  }, [data, setValue]);

  const handleFormSubmit = async (formData: IPersonalInformation) => {
    try {
      const country = countryOptions.find((c) => c.code === selectedPhoneCode);
      if (!country) {
        throw new Error('Please select the country code');
      }
      const dataToUpdate = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: `${country?.phoneCode} ${formData.phone}`,
      };

      setLoading(true);

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
      errorToast(error.message || `${error}`);
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
                    {field.id === 'phone' ? (
                      <div className='flex'>
                        {((data && selectedPhoneCode) || !data) && (
                          <Select
                            onValueChange={(val) => setSelectedPhoneCode(val)}
                            value={selectedPhoneCode}>
                            <SelectTrigger className='w-28 mr-2'>
                              <SelectValue placeholder='Code' />
                            </SelectTrigger>
                            <SelectContent>
                              {countryOptions.map((option) => (
                                <SelectItem key={option.code} value={option.code}>
                                  <div className='flex items-center gap-2'>
                                    <ReactCountryFlag
                                      svg
                                      countryCode={option.code}
                                      style={{
                                        width: '1.2em',
                                        height: '1.2em',
                                      }}
                                    />
                                    <span>{option.name}</span>
                                    <span>({option.phoneCode})</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}

                        <Controller
                          name='phone'
                          control={control}
                          render={({ field: fieldData }) => (
                            <Input
                              type='tel'
                              placeholder={field.placeholder}
                              {...fieldData}
                              disabled={loading}
                              className='flex-1'
                            />
                          )}
                        />
                      </div>
                    ) : (
                      <Input
                        type={field.type}
                        placeholder={field.placeholder}
                        id={field.id}
                        {...register(field.id)}
                        disabled={loading}
                      />
                    )}
                  </InputWrapper>
                ))}

                <InputWrapper error={errors.terms?.message}>
                  <div className='flex items-center space-x-2'>
                    <Checkbox
                      id='terms'
                      onCheckedChange={(checked) => setValue('terms', checked as boolean)}
                      {...register('terms')}
                      disabled={loading}
                      checked={watch('terms')}
                    />
                    <label htmlFor='terms' className='text-sm font-medium space-x-1'>
                      <span>I agree to</span>
                      <Link href='/terms-of-service' target='_blank' className='text-primary'>
                        Camino Terms
                      </Link>
                      <span>&</span>
                      <Link href='/privacy-policy' target='_blank' className='text-primary'>
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                </InputWrapper>
              </div>

              <div className='flex gap-2'>
                <SubmitButton isLoading={loading}>{data ? 'Update' : 'Continue'}</SubmitButton>
                {documentsData && <ModalOnboardingSummary />}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PersonalInformation;
