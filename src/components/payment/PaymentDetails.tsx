'use client';

import { FC, useState } from 'react';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import InputWrapper from '@/components/InputWrapper';
import { TypeOrder } from '@/types/types';
import getSymbolFromCurrency from 'currency-symbol-map';
import ModalSubscriptionOverview from './ModalSubscriptionOverview';

interface PaymentDetailsProps {
  data: TypeOrder;
}

const PaymentDetails: FC<PaymentDetailsProps> = ({ data }) => {
  const defaultInstallment = data.period?.toString() || data.installments_options[0].toString();
  const [installments, setInstallments] = useState(defaultInstallment);
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const [isCustomerDetailsOpen, setIsCustomerDetailsOpen] = useState(true);

  return (
    <>
      <CardContent className='space-y-6'>
        <div className='text-center p-6 space-y-3'>
          <p className='font-medium'>Amount to be paid</p>
          <h2 className='text-4xl font-semibold space-x-1'>
            <span>{getSymbolFromCurrency(data.currency)}</span>
            <span>{data.price}</span>
          </h2>
        </div>

        <div>
          <button
            onClick={() => setIsCustomerDetailsOpen(!isCustomerDetailsOpen)}
            className='flex justify-between items-center w-full py-2 text-left'>
            <span className='text-sm font-medium'>Customer Details</span>
            {isCustomerDetailsOpen ? (
              <IoIosArrowUp className='size-5 opacity-50' />
            ) : (
              <IoIosArrowDown className='size-5 opacity-50' />
            )}
          </button>
          {isCustomerDetailsOpen && (
            <div className='space-y-2 text-sm bg-[#F9F9F9] rounded-md px-4 py-3'>
              <div className='flex justify-between font-medium'>
                <span className='opacity-50'>Name</span>
                <span className='max-w-72 truncate capitalize'>{(data as any).customers?.customer_name}</span>
              </div>
              <div className='flex justify-between font-medium'>
                <span className='opacity-50'>Email</span>
                <span className='max-w-72 truncate'>{(data as any).customers?.email}</span>
              </div>
            </div>
          )}
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
                <div className='space-x-1'>
                  <span>{getSymbolFromCurrency(data.currency)}</span>
                  <span>{Number(data.price) * data.quantity}</span>
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
              {data.installments_options.map((installment) => (
                <SelectItem key={installment} value={installment.toString()}>
                  {installment}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </InputWrapper>
      </CardContent>

      <CardFooter>
        <ModalSubscriptionOverview data={data} installments={installments} />
      </CardFooter>
    </>
  );
};

export default PaymentDetails;
