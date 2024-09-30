'use client';

import { FC, useState } from 'react';
import { CardContent, CardFooter } from '@/components/ui/card';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import InputWrapper from '@/components/InputWrapper';
import { TypeOrder } from '@/types/types';
import getSymbolFromCurrency from 'currency-symbol-map';
import ModalSubscriptionOverview from './ModalSubscriptionOverview';
import { intervalOptions, TypeInstallmentOption } from '@/utils/installment-options';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

interface PaymentDetailsProps {
  data: TypeOrder;
}

const PaymentDetails: FC<PaymentDetailsProps> = ({ data }) => {
  const installmentOptions = data.installments_options as TypeInstallmentOption[];
  const [selectedInstallment, setSelectedInstallment] = useState(installmentOptions[0]);
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const [isCustomerDetailsOpen, setIsCustomerDetailsOpen] = useState(true);

  const totalAmount = Number(data.price) * data.quantity;

  const handleInstallmentSelection = (id: string) => {
    const installment = installmentOptions.find((item) => item.id === Number(id))!;
    setSelectedInstallment(installment);
  };

  return (
    <>
      <CardContent className='space-y-6'>
        <div className='text-center pt-4 space-y-2'>
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
                  <span>{totalAmount}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <InputWrapper id='installments' label='Select installment option'>
          <div className='max-h-40 overflow-auto'>
            <RadioGroup
              defaultValue={installmentOptions[0]?.id.toString()}
              onValueChange={handleInstallmentSelection}>
              {installmentOptions.map((option) => (
                <label
                  key={option.id}
                  htmlFor={`installment${option.id}`}
                  className='h-10 flex items-center text-sm space-x-2 border rounded-md cursor-pointer px-3'>
                  <RadioGroupItem value={option.id.toString()} id={`installment${option.id}`} />
                  <div className='w-full flex items-center justify-between space-x-6'>
                    <div>
                      {option.count} <span className='capitalize'>{intervalOptions[option.interval]}</span>{' '}
                      installments
                    </div>
                    <div>
                      <span className='font-semibold'>
                        {getSymbolFromCurrency(data.currency)} {(totalAmount / option.count).toFixed(2)} /
                      </span>{' '}
                      <span className='font-normal'>{option.interval}</span>
                    </div>
                  </div>
                </label>
              ))}
            </RadioGroup>
          </div>
        </InputWrapper>
      </CardContent>

      <CardFooter>
        <ModalSubscriptionOverview data={data} installment={selectedInstallment} />
      </CardFooter>
    </>
  );
};

export default PaymentDetails;
