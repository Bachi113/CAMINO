import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { MdOutlineKeyboardBackspace } from 'react-icons/md';
import StoreIcon from '@/assets/icons/StoreIcon';
import InputWrapper from '../InputWrapper';
import { Input } from '../ui/input';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Image from 'next/image';
import bank1 from '../../assets/iamges/bank-image-1.png';
import bank2 from '../../assets/iamges/bank-image-2.png';
import bank3 from '../../assets/iamges/bank-image-3.png';
import { getUser } from '@/utils/get-user';
import { supabaseBrowserClient } from '@/utils/supabase/client';
import { errorToast } from '@/utils/utils';

export type TBankDetails = {
  bankName: string;
  bankAccountNumber: string;
  sortCode: string;
  ibanNumber?: string;
  swiftCode?: string;
  purchasingCurrency: string;
};

export const bankImages = [bank1, bank2, bank3];

export const BankDetailsSchema = yup.object().shape({
  bankName: yup.string().required('Bank Name is required'),
  bankAccountNumber: yup.string().required('Account Number is required'),
  sortCode: yup.string().required('Sort Code is required'),
  ibanNumber: yup.string().optional(),
  swiftCode: yup.string().optional(),
  purchasingCurrency: yup.string().required('Purchasing Currency is required'),
});

const BankDetails = () => {
  const router = useRouter();
  const supabase = supabaseBrowserClient();

  const [bankDetails, setBankDetails] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TBankDetails>({
    resolver: yupResolver(BankDetailsSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const user = await getUser();
      const userId = user?.id;

      const { data, error } = await supabase.from('bank_details').select('*').eq('user_id', userId!).single();

      if (data) {
        setValue('bankName', data.bank_name);
        setValue('bankAccountNumber', data.account_number);
        setValue('sortCode', data.sort_code);
        setValue('ibanNumber', data.iban_code ?? undefined);
        setValue('swiftCode', data.swift_code ?? undefined);
        setValue('purchasingCurrency', data.purchasing_currency);
        setBankDetails(true);
      }

      if (error) {
        console.error('Error fetching bank details:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, [setValue, supabase]);

  const onHandleFormSubmit = async (data: TBankDetails) => {
    setLoading(true);
    const user = await getUser();
    const userId = user?.id;

    if (bankDetails) {
      const { error } = await supabase
        .from('bank_details')
        .update({
          bank_name: data.bankName,
          account_number: data.bankAccountNumber,
          sort_code: data.sortCode,
          iban_code: data.ibanNumber,
          swift_code: data.swiftCode,
          purchasing_currency: data.purchasingCurrency,
        })
        .eq('user_id', userId!);

      if (error) {
        errorToast(error.message);
        console.error('Error updating bank details:', error);
        setLoading(false);
        return;
      }
    } else {
      const { data: insert_data, error } = await supabase
        .from('bank_details')
        .insert({
          bank_name: data.bankName,
          account_number: data.bankAccountNumber,
          sort_code: data.sortCode,
          iban_code: data.ibanNumber,
          swift_code: data.swiftCode,
          purchasing_currency: data.purchasingCurrency,
          user_id: userId!,
        })
        .select('id')
        .single();

      if (error) {
        errorToast(error.message);
        console.error('Error inserting bank details:', error);
        setLoading(false);
        return;
      }

      const { error: insert_onboarding_error } = await supabase
        .from('onboarding')
        .update({
          user_id: userId!,
          bank_details: insert_data.id,
        })
        .eq('user_id', userId!);

      if (insert_onboarding_error) {
        errorToast(insert_onboarding_error.message);
        console.error('Error updating onboarding:', insert_onboarding_error);
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    router.push('/onboarding/document_verification');
  };

  return (
    <>
      <Button
        size='default'
        className='gap-2 text-default'
        variant='outline'
        onClick={() => router.push('/onboarding/business_information')}>
        <MdOutlineKeyboardBackspace className='size-5' /> Back
      </Button>
      <div className='flex flex-col items-center justify-center mt-6'>
        <div className='max-w-[350px] w-full space-y-10'>
          <div className='space-y-6 flex flex-col items-center'>
            <div className='border rounded-lg p-3'>
              <StoreIcon />
            </div>
            <div className='space-y-2 text-center'>
              <p className='text-default text-2xl font-semibold leading-7'>Bank Details</p>
              <p className='text-subtle text-sm text-normal leading-5'>
                Please provide your banking details to verify
              </p>
            </div>
          </div>
          <form onSubmit={handleSubmit(onHandleFormSubmit)}>
            <div className='space-y-6'>
              <div className='space-y-4'>
                <InputWrapper label='Bank Name' required error={errors.bankName?.message}>
                  <Input
                    type='text'
                    placeholder='Find and select the bank'
                    id='bankName'
                    {...register('bankName')}
                    disabled={loading}
                  />
                  <div className='bg-secondary rounded-lg p-1.5 flex justify-between mt-1'>
                    {bankImages.map((image, index) => (
                      <Image src={image} alt='Bank' width={100} height={100} key={index} />
                    ))}
                  </div>
                </InputWrapper>
                <InputWrapper label='Bank Account Number' required error={errors.bankAccountNumber?.message}>
                  <Input
                    type='text'
                    placeholder='Account number'
                    id='bankAccountNumber'
                    {...register('bankAccountNumber')}
                    disabled={loading}
                  />
                </InputWrapper>
                <InputWrapper label='Sort Code' required error={errors.sortCode?.message}>
                  <Input
                    type='text'
                    placeholder='Sort Code'
                    id='sortCode'
                    {...register('sortCode')}
                    disabled={loading}
                  />
                </InputWrapper>
                <InputWrapper label='IBAN Code' error={errors.ibanNumber?.message}>
                  <Input
                    type='text'
                    placeholder='IBAN Code'
                    id='ibanNumber'
                    {...register('ibanNumber')}
                    disabled={loading}
                  />
                </InputWrapper>
                <InputWrapper label='Swift Code' error={errors.swiftCode?.message}>
                  <Input
                    type='text'
                    placeholder='Swift Code'
                    id='swiftCode'
                    {...register('swiftCode')}
                    disabled={loading}
                  />
                </InputWrapper>
                <InputWrapper label='Purchasing Currency' required error={errors.purchasingCurrency?.message}>
                  <Input
                    type='text'
                    placeholder='GBP'
                    id='purchasingCurrency'
                    {...register('purchasingCurrency')}
                    disabled={loading}
                  />
                </InputWrapper>
              </div>
              <div>
                <Button className='w-full' size='lg' type='submit' disabled={loading}>
                  {loading ? 'Loading...' : bankDetails ? 'Update' : 'Continue'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default BankDetails;
