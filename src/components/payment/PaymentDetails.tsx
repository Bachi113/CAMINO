'use client';

import { FC, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import InputWrapper from '@/components/InputWrapper';
import { TypePaymentLink } from '@/types/types';
import { getDefaultPaymentMethod } from '@/app/actions/stripe.actions';
import { errorToast } from '@/utils/utils';
import { useRouter } from 'next/navigation';
import { BarLoader } from 'react-spinners';

interface PaymentDetailsProps {
  data: TypePaymentLink;
}

const PaymentDetails: FC<PaymentDetailsProps> = ({ data }) => {
  const [isPending, setIsPending] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const [installments, setInstallments] = useState(data.installments_options[0].toString());

  const router = useRouter();

  const handleVerifyPaymentMethod = async () => {
    setIsPending(true);

    const pm = await getDefaultPaymentMethod(data.stripe_cus_id);
    if (pm.error) {
      errorToast(pm.error);
      return;
    }

    if (pm.id === null) {
      // TODO: PM setup page
    } else {
      router.push(`/payment/${data.id}/confirm?pm_id=${pm.id}`);
    }
  };

  const totalAmount = Number(data.price) * data.quantity;

  return (
    <>
      <CardContent className='space-y-6 pb-8'>
        <div className='text-center p-6 space-y-3'>
          <p className='font-medium'>Amount to be paid</p>
          <h2 className='text-4xl font-semibold space-x-2'>
            <span>{data.currency}</span>
            <span>{data.price}</span>
          </h2>
        </div>

        <div>
          <button
            onClick={() => setIsDetailsOpen(!isDetailsOpen)}
            className='flex justify-between items-center w-full py-2 text-left'>
            <span className='text-sm font-medium'>Payment Details</span>
            {isDetailsOpen ? (
              <IoIosArrowUp className='size-5 opacity-50' />
            ) : (
              <IoIosArrowDown className='size-5 opacity-50' />
            )}
          </button>
          {isDetailsOpen && (
            <div className='space-y-2 text-sm bg-[#F9F9F9] rounded-md px-4 py-3'>
              <div className='flex justify-between font-medium'>
                <span className='opacity-50'>Product Name</span>
                <span>{(data as any).products.product_name}</span>
              </div>
              <div className='flex justify-between font-medium'>
                <span className='opacity-50'>Product Quantity</span>
                <span>{data.quantity}</span>
              </div>
              <div className='flex justify-between font-medium'>
                <span className='opacity-50'>Total Amount</span>
                <div className='space-x-2'>
                  <span>{data.currency}</span>
                  <span>{totalAmount}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <InputWrapper id='installments' label='Select number of instalments'>
          <Select value={installments} onValueChange={setInstallments}>
            <SelectTrigger id='installments' className='h-10'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {data.installments_options.map((number) => (
                <SelectItem key={number} value={number.toString()}>
                  {number}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </InputWrapper>
      </CardContent>

      <CardFooter>
        <Button
          size='xl'
          disabled={isPending}
          className='w-full rounded-lg'
          onClick={handleVerifyPaymentMethod}>
          {isPending ? <BarLoader height={1} /> : 'Confirm Payment'}
        </Button>
      </CardFooter>
    </>
  );
};

export default PaymentDetails;
