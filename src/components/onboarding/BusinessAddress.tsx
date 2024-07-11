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
import { useGetBusinessAddress } from '@/hooks/query';
import NavigationButton from '@/components/onboarding/NavigationButton';
import { businessAddressFields } from '@/utils/form-fields';
import { saveData, updateData } from '@/app/actions/onboarding.actions';
import { queryClient } from '@/app/providers';
import Heading from '@/components/onboarding/Heading';
import { SubmitButton } from '@/components/SubmitButton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import ReactCountryFlag from 'react-country-flag';

const countryOptions = [
  { code: 'AU', name: 'Australia', phoneCode: '+61' },
  { code: 'BR', name: 'Brazil', phoneCode: '+55' },
  { code: 'CN', name: 'China', phoneCode: '+86' },
  { code: 'FR', name: 'France', phoneCode: '+33' },
  { code: 'DE', name: 'Germany', phoneCode: '+49' },
  { code: 'IN', name: 'India', phoneCode: '+91' },
  { code: 'IE', name: 'Ireland', phoneCode: '+353' },
  { code: 'IT', name: 'Italy', phoneCode: '+39' },
  { code: 'JP', name: 'Japan', phoneCode: '+81' },
  { code: 'MX', name: 'Mexico', phoneCode: '+52' },
  { code: 'NL', name: 'Netherlands', phoneCode: '+31' },
  { code: 'NZ', name: 'New Zealand', phoneCode: '+64' },
  { code: 'NO', name: 'Norway', phoneCode: '+47' },
  { code: 'PL', name: 'Poland', phoneCode: '+48' },
  { code: 'RU', name: 'Russia', phoneCode: '+7' },
  { code: 'SG', name: 'Singapore', phoneCode: '+65' },
  { code: 'ZA', name: 'South Africa', phoneCode: '+27' },
  { code: 'KR', name: 'South Korea', phoneCode: '+82' },
  { code: 'ES', name: 'Spain', phoneCode: '+34' },
  { code: 'SE', name: 'Sweden', phoneCode: '+46' },
  { code: 'CH', name: 'Switzerland', phoneCode: '+41' },
  { code: 'AE', name: 'United Arab Emirates', phoneCode: '+971' },
  { code: 'GB', name: 'United Kingdom', phoneCode: '+44' },
  { code: 'US', name: 'United States', phoneCode: '+1' },
];

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
        setSelectedPhoneCode(`+${countryCode}`);
        setValue('phoneNumber', parseInt(phoneNumber, 10));
      } else {
        setValue('phoneNumber', parseInt(data.phone_number, 10));
      }
    }
  }, [setValue, data]);

  const handleFormSubmit = async (formData: IBusinessAddress) => {
    setLoading(true);

    const dataToUpdate = {
      street_address: formData.streetAddress,
      city: formData.city,
      postal_code: formData.postalCode,
      country: formData.country,
      phone_number: `${selectedPhoneCode} ${formData.phoneNumber}`,
    };
    try {
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
      errorToast(error || 'An unknown error occurred.');
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
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : field.id === 'phoneNumber' ? (
                      <div className='flex'>
                        {selectedPhoneCode && (
                          <Select
                            onValueChange={(val) => setSelectedPhoneCode(val)}
                            value={selectedPhoneCode}>
                            <SelectTrigger className='w-28 mr-2'>
                              <SelectValue placeholder='Code' />
                            </SelectTrigger>
                            <SelectContent>
                              {countryOptions.map((option) => (
                                <SelectItem key={option.code} value={option.phoneCode}>
                                  <div className='flex items-center gap-2'>
                                    <ReactCountryFlag
                                      svg
                                      countryCode={option.code}
                                      style={{
                                        width: '1.2em',
                                        height: '1.2em',
                                      }}
                                    />
                                    <span>{option.phoneCode}</span>
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
              <SubmitButton isLoading={loading}>{data ? 'Update' : 'Continue'}</SubmitButton>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default BusinessAddress;
