'use client';

import { FC, useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import Image from 'next/image';
import { HiOutlineCreditCard } from 'react-icons/hi2';
import Link from 'next/link';
import { cn } from '@/utils/utils';
import { BarLoader } from 'react-spinners';
import { useRouter } from 'next/navigation';
import { createSetupCheckoutSession, getCustomerPaymentMethods } from '@/app/actions/stripe.actions';
import { errorToast } from '@/utils/utils';
import { updateOrderForPeriodAndInterval } from '@/app/actions/supabase.actions';
import { TypeInterval, TypeOrder } from '@/types/types';
import { LuCalendarDays } from 'react-icons/lu';
import { intervalOptions, TypeInstallmentOption } from '@/utils/installment-options';
import ModalAllPaymentDates from './ModalAllPaymentDates';
import getSymbolFromCurrency from 'currency-symbol-map';

interface ModalSubscriptionOverviewProps {
  data: TypeOrder;
  installment: TypeInstallmentOption;
}

const today = new Date();
const firstPaymentDate = today.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const nextPaymentDate = (interval: TypeInterval) => {
  const currentDate = new Date(today);
  const intervalMapping: { [key: string]: () => void } = {
    day: () => currentDate.setDate(today.getDate() + 1),
    week: () => currentDate.setDate(today.getDate() + 7),
    month: () => currentDate.setMonth(today.getMonth() + 1),
    year: () => currentDate.setFullYear(today.getFullYear() + 1),
  };

  (intervalMapping[interval] || intervalMapping['month'])();

  return currentDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const ModalSubscriptionOverview: FC<ModalSubscriptionOverviewProps> = ({ data, installment }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const { id, stripe_cus_id: customer_id, price, quantity, currency } = data;
  const totalAmount = Number(price) * quantity;
  const period = installment.count;
  const interval = installment.interval;
  const intervalText = intervalOptions[installment.interval];

  const router = useRouter();

  const installmentAmount = (parseFloat(totalAmount.toString()) / period).toFixed(2);

  const handleVerifyPaymentMethod = async () => {
    setIsPending(true);

    const response = await updateOrderForPeriodAndInterval(id, { period, interval });
    if (response) {
      errorToast(response);
    }

    const paymentMethods = await getCustomerPaymentMethods(customer_id);
    if (paymentMethods.error) {
      errorToast(paymentMethods.error);
      return;
    }

    if (paymentMethods.data?.length === 0) {
      // Create setup checkout session for user to add payment method
      const session = await createSetupCheckoutSession({ currency: currency, customer_id, paymentId: id });
      if (session.error) {
        errorToast(session.error);
        return;
      }
      router.push(session.url!);
    } else {
      router.push(`/payment/${id}/confirm`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className={cn(buttonVariants({ size: 'lg' }), 'w-full rounded-lg')}>Next</DialogTrigger>

      <DialogContent className='w-11/12 md:w-[30%] p-0'>
        <Card className='w-full shadow-xl'>
          <CardHeader className='bg-[#F9F9F9] p-4 border-b rounded-t-lg'>
            <Image src='/logo.png' width={164} height={72} alt='logo' className='w-24 mx-auto' />
          </CardHeader>

          <CardContent className='space-y-6 pb-8'>
            <div className='text-center p-6 space-y-3'>
              <h2 className='text-2xl font-semibold'>Subscription Overview</h2>
              <p className='text-gray-600'>Please review your subscription details before confirming.</p>
            </div>

            <div className='space-y-1'>
              <div className='flex justify-between items-center'>
                <span className='font-medium'>Total Amount:</span>
                <span className='text-lg font-semibold'>
                  {currency} {totalAmount}
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='font-medium'>Installment Amount:</span>
                <span className='font-semibold'>
                  {currency} {installmentAmount}
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='font-medium'>Installment Plan:</span>
                <div>
                  {period} {intervalText} payments
                </div>
              </div>
            </div>

            <div className='flex items-start justify-between bg-gray-50 p-4 rounded-lg'>
              <div className='space-y-4'>
                <div className='flex items-center space-x-3'>
                  <LuCalendarDays className='text-primary' />
                  <div>
                    <p className='font-medium'>First Payment Date</p>
                    <p className='text-sm text-gray-600'>{firstPaymentDate}</p>
                  </div>
                </div>
                <div className='flex items-center space-x-3'>
                  <LuCalendarDays className='text-primary' />
                  <div>
                    <p className='font-medium'>Next Payment Date</p>
                    <p className='text-sm text-gray-600'>{nextPaymentDate(interval)}</p>
                  </div>
                </div>
              </div>
              <ModalAllPaymentDates
                period={period}
                interval={interval as TypeInterval}
                amount={`${getSymbolFromCurrency(currency)} ${installmentAmount}`}
              />
            </div>

            <div className='space-y-2'>
              <p className='text-sm text-gray-600'>
                By confirming, you agree to the terms of the subscription and authorize for{' '}
                <span className='font-semibold'>
                  {period} {intervalText}
                </span>{' '}
                payments of{' '}
                <span className='font-medium'>
                  {currency} {installmentAmount}
                </span>
                .
              </p>
              <div className='flex items-center space-x-2'>
                <HiOutlineCreditCard className='text-gray-400' />
                <p className='text-sm text-gray-600'>
                  Secure payment processed by{' '}
                  <Link href='https://stripe.com' target='_blank' className='text-primary'>
                    Stripe
                  </Link>
                </p>
              </div>
            </div>

            <div className='space-y-3'>
              <Button size='lg' className='w-full' onClick={handleVerifyPaymentMethod}>
                {isPending ? <BarLoader height={1} /> : 'Confirm Subscription'}
              </Button>

              <Button size='lg' variant='outline' className='w-full' onClick={() => setIsOpen(false)}>
                Change Installment
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default ModalSubscriptionOverview;
