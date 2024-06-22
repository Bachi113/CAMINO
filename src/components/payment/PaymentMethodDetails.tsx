'use client';

import { TypePaymentLink } from '@/types/types';
import { Button } from '../ui/button';
import { CardContent, CardFooter } from '../ui/card';
import { BarLoader } from 'react-spinners';
import { FC, useState } from 'react';
import Stripe from 'stripe';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { createSubscription } from '@/app/actions/stripe.actions';
import { errorToast } from '@/utils/utils';
import { toast } from '../ui/use-toast';
import { parse, format } from 'date-fns';

interface PaymentMethodDetailsProps {
  data: TypePaymentLink;
  paymentMethods: Stripe.PaymentMethod[];
}

const PaymentMethodDetails: FC<PaymentMethodDetailsProps> = ({ data, paymentMethods }) => {
  const [isPending, setIsPending] = useState(false);
  const [paymentMethodId, setPaymentMethodId] = useState(paymentMethods[0].id);

  const handleSubscription = async () => {
    setIsPending(true);

    const subscription = await createSubscription({
      customer_id: data.stripe_cus_id,
      payment_method_id: paymentMethodId,
      product_id: (data as any).products.stripe_id,
      currency: data.currency,
      price: data.price,
      quantity: data.quantity,
      installments: data.period!,
    });
    if (subscription.error) {
      errorToast(subscription.error);
      return;
    }

    // TODO: Handle subscription created successfully
    console.log(subscription.id);
    return toast({ description: 'Subscription Created Successfully.' });
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
          <RadioGroup value={paymentMethodId} onValueChange={setPaymentMethodId} className='my-2'>
            {paymentMethods.map((pm) => (
              <div key={pm.id} className='h-14 flex items-center space-x-2 border-b'>
                <RadioGroupItem value={pm.id} id={pm.id} />
                <div className='w-full flex items-center justify-between'>
                  <label htmlFor={pm.id} className='cursor-pointer capitalize space-x-1'>
                    <span>{pm.card?.brand} </span>
                    <span>••••</span>
                    <span className='font-medium'>{pm.card?.last4}</span>
                  </label>
                  <p className='text-sm space-x-2 opacity-60'>
                    <span>Expires</span>
                    <span>
                      {format(
                        parse(`${pm.card?.exp_month}/${pm.card?.exp_year}`, 'M/yyyy', new Date()),
                        'MMM yyyy'
                      )}
                    </span>
                  </p>
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