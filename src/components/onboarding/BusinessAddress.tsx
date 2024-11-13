'use client';

import { useEffect, useState } from 'react';
import StoreIcon from '@/assets/icons/StoreIcon';
import InputWrapper from '@/components/InputWrapper';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { errorToast } from '@/utils/utils';
import { IBusinessAddress, businessAddressSchema } from '@/types/validations';
import { useGetBusinessAddress, useGetVerificationDocuments } from '@/hooks/query';
import NavigationButton from '@/components/onboarding/NavigationButton';
import { businessAddressFields } from '@/utils/form-fields';
import { saveData, updateData } from '@/app/actions/onboarding.actions';
import { queryClient } from '@/app/providers';
import Heading from '@/components/onboarding/Heading';
import { SubmitButton } from '@/components/SubmitButton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import ReactCountryFlag from 'react-country-flag';
import { countryOptions } from '@/utils/contsants/country-codes';
import ModalOnboardingSummary from './ModalOnboardingSummary';

const BusinessAddress = () => {
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
  } = useForm<IBusinessAddress>({
    resolver: yupResolver(businessAddressSchema),
  });

  const { data } = useGetBusinessAddress();
  const { data: documentsData } = useGetVerificationDocuments();

  useEffect(() => {
    if (data) {
      setValue('streetAddress', data.street_address);
      setValue('city', data.city);
      setValue('postalCode', data.postal_code);
      setValue('country', data.country);

      // Extract country code and phone number
      const phoneMatch = data.phone_number.match(/^\+(\d+)\s(.*)$/);
      if (phoneMatch) {
        const [, countryCode, phoneNumber] = phoneMatch;
        const country = countryOptions.find((c) => c.phoneCode === `+${countryCode}`);
        const countryCodeName = country?.code;
        setSelectedPhoneCode(countryCodeName!);
        setValue('phoneNumber', parseInt(phoneNumber, 10));
      } else {
        setValue('phoneNumber', parseInt(data.phone_number, 10));
      }
    }
  }, [setValue, data]);

  const handleFormSubmit = async (formData: IBusinessAddress) => {
    try {
      const country = countryOptions.find((c) => c.code === selectedPhoneCode);
      if (!country) {
        throw new Error('Please select the country code');
      }
      const dataToUpdate = {
        street_address: formData.streetAddress,
        city: formData.city,
        postal_code: formData.postalCode,
        country: formData.country,
        phone_number: `${country?.phoneCode} ${formData.phoneNumber}`,
      };

      setLoading(true);

      if (data) {
        const res = await updateData({ ...dataToUpdate, id: data.id }, 'business_addresses');
        if (res?.error) throw res.error;
      } else {
        const res = await saveData(JSON.stringify(dataToUpdate), 'business_addresses');
        if (res?.error) throw res.error;
      }

      queryClient.invalidateQueries({ queryKey: ['getBusinessAddress'] });
      router.push('/onboarding/bank-account-details');
    } catch (error: any) {
      errorToast(error || `${error}` || 'An unknown error occurred.');
      setLoading(false);
    }
  };

  return (
    <>
      <NavigationButton showNext={!!data} />
      <div className='flex flex-col items-center justify-center mt-6 animate-fade-in-left'>
        <div className='max-w-[350px] mr-20 w-full space-y-10'>
          <Heading
            title='Business Address'
            description='Please provide location details about your business'
            icon={<StoreIcon />}
          />
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className='space-y-6'>
              <div className='space-y-4'>
                {businessAddressFields.map((field) => (
                  <InputWrapper key={field.id} label={field.label} required error={errors[field.id]?.message}>
                    {field.id === 'country' && ((data && watch('country')) || !data) ? (
                      <Select onValueChange={(val) => setValue(field.id, val)} value={watch(field.id)}>
                        <SelectTrigger>
                          <SelectValue placeholder={field.placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                          {countryOptions.map((option) => (
                            <SelectItem key={option.code} value={option.name}>
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
                    ) : field.id === 'phoneNumber' ? (
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
                          name='phoneNumber'
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
                        type='text'
                        placeholder={field.placeholder}
                        id={field.id}
                        {...register(field.id)}
                        disabled={loading}
                      />
                    )}
                  </InputWrapper>
                ))}
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

export default BusinessAddress;
