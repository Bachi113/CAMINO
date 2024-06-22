'use client';

import { TypePaymentLink } from '@/types/types';
import { Button } from '../ui/button';
import { CardContent, CardFooter } from '../ui/card';
import { BarLoader } from 'react-spinners';
import { FC, useState } from 'react';
import Stripe from 'stripe';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

interface PaymentMethodDetailsProps {
  data: TypePaymentLink;
  paymentMethods: Stripe.PaymentMethod[];
}

const PaymentMethodDetails: FC<PaymentMethodDetailsProps> = ({ data, paymentMethods }) => {
  const [isPending, setIsPending] = useState(false);
  const [paymentMethodId, setPaymentMethodId] = useState(paymentMethods[0].id);

  const handleSubscription = () => {
    setIsPending(true);
    // TODO: Call the API to start the subscription
    setIsPending(false);
  };

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
          <p className='text-lg font-medium'>Payment Method</p>
          <RadioGroup
            value={paymentMethodId}
            onValueChange={setPaymentMethodId}
            className='flex flex-col space-y-2'>
            {paymentMethods.map((option) => (
              <div key={option.id} className='h-16 flex items-center space-x-2 border-b'>
                <RadioGroupItem value={option.id} id={option.id} />
                <div className='w-full flex items-center justify-between'>
                  <label htmlFor={option.id} className='cursor-pointer'>
                    Ending in ...<span className='font-medium'>{option.card?.last4}</span>
                  </label>
                  <p className='border rounded px-3 py-0.5'>{option.card?.brand}</p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>

      <CardFooter>
        <Button size='xl' disabled={isPending} className='w-full rounded-lg' onClick={handleSubscription}>
          {isPending ? <BarLoader height={1} /> : 'Start Subscription'}
        </Button>
      </CardFooter>
    </>
  );
};

export default PaymentMethodDetails;
