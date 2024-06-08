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

type TBankDetails = {
  bankName: string;
  bankAccountNumber: string;
  sortCode: string;
  ibanNumber?: string;
  swiftCode?: string;
  purchasingCurrency: string;
};

const bankImages = [bank1, bank2, bank3];

const schema = yup.object().shape({
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TBankDetails>({
    resolver: yupResolver(schema),
  });

  const onHandleFormSubmit = async (data: TBankDetails) => {
    const user = await getUser();

    const userId = user?.id;

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
      console.error('Error inserting personal information:', error);
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
      console.error('Error inserting onboarding:', insert_onboarding_error);
      return;
    }

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
                  />
                </InputWrapper>
                <InputWrapper label='Sort Code' required error={errors.sortCode?.message}>
                  <Input type='text' placeholder='Sort Code' id='sortCode' {...register('sortCode')} />
                </InputWrapper>
                <InputWrapper label='IBAN Code' error={errors.ibanNumber?.message}>
                  <Input type='text' placeholder='IBAN Code' id='ibanNumber' {...register('ibanNumber')} />
                </InputWrapper>
                <InputWrapper label='Swift Code' error={errors.swiftCode?.message}>
                  <Input type='text' placeholder='Swift Code' id='swiftCode' {...register('swiftCode')} />
                </InputWrapper>
                <InputWrapper label='Purchasing Currency' required error={errors.purchasingCurrency?.message}>
                  <Input
                    type='text'
                    placeholder='GBP'
                    id='purchasingCurrency'
                    {...register('purchasingCurrency')}
                  />
                </InputWrapper>
              </div>
              <div>
                <Button className='w-full' size='lg' type='submit'>
                  Continue
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
