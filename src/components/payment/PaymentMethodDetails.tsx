'use client';

import { TypeOrder } from '@/types/types';
import { Button } from '../ui/button';
import { CardContent, CardFooter } from '../ui/card';
import { BarLoader } from 'react-spinners';
import { FC, useState } from 'react';
import Stripe from 'stripe';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { createSetupCheckoutSession, createSubscription } from '@/app/actions/stripe.actions';
import { errorToast } from '@/utils/utils';
import { parse, format } from 'date-fns';
import getSymbolFromCurrency from 'currency-symbol-map';
import { useRouter } from 'next/navigation';
import { FaPlus } from 'react-icons/fa6';

interface PaymentMethodDetailsProps {
  data: TypeOrder;
  paymentMethods: Stripe.PaymentMethod[];
}

const PaymentMethodDetails: FC<PaymentMethodDetailsProps> = ({ data, paymentMethods }) => {
  const [isPending, setIsPending] = useState(false);
  const [paymentMethodId, setPaymentMethodId] = useState(paymentMethods[0].id);

  const router = useRouter();

  const handleSubscription = async () => {
    setIsPending(true);

    const subscription = await createSubscription({
      id: data.id,
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
    } else {
      router.push(`/payment/${data.id}/created`);
    }

    setIsPending(false);
  };

  const subscriptionThroughNewcard = async () => {
    const session = await createSetupCheckoutSession({
      currency: data.currency,
      customer_id: data.stripe_cus_id,
      paymentId: data.id,
    });
    if (session.error) {
      errorToast(session.error);
      return;
    }
    router.push(session.url!);
  };

  const totalAmount = Number(data.price) * data.quantity;

  return (
    <>
      <CardContent className='space-y-4 pb-8'>
        <div className='text-center p-6 space-y-2'>
          <p className='font-medium'>Amount to be paid</p>
          <h2 className='text-4xl font-semibold space-x-2'>
            <span>{getSymbolFromCurrency(data.currency)}</span>
            <span>{totalAmount}</span>
          </h2>
        </div>

        <div>
          <p className='text-lg font-medium mb-3'>Payment Method</p>
          <RadioGroup value={paymentMethodId} onValueChange={setPaymentMethodId}>
            {paymentMethods.map((pm) => (
              <div key={pm.id} className='h-12 flex items-center space-x-2 border rounded-lg px-3'>
                <RadioGroupItem value={pm.id} id={pm.id} />
                <div className='w-full flex items-center justify-between'>
                  <label htmlFor={pm.id} className='cursor-pointer capitalize space-x-1'>
                    <span>{pm.card?.brand} </span>
                    <span>••••</span>
                    <span className='font-medium'>{pm.card?.last4}</span>
                  </label>
                  <p className='text-sm space-x-2 opacity-45'>
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
          <Button variant='link' className='gap-2 p-0 mt-4 text-primary' onClick={subscriptionThroughNewcard}>
            <FaPlus />
            Add New Card
          </Button>
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
