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
import { supabaseBrowserClient } from '@/utils/supabase/client';
import { TypeOrder } from '@/types/types';
import { LuCalendarDays } from 'react-icons/lu';

interface ModalSubscriptionOverviewProps {
  data: TypeOrder;
  installments: string;
}

const ModalSubscriptionOverview: FC<ModalSubscriptionOverviewProps> = ({ data, installments }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const { id, stripe_cus_id: customer_id, price, currency } = data;
  const period = Number(installments);

  const router = useRouter();

  const today = new Date();
  const firstPaymentDate = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const nextPaymentDate = new Date(today.setMonth(today.getMonth() + 1)).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const installmentAmount = (parseFloat(price) / period).toFixed(2);

  const handleVerifyPaymentMethod = async () => {
    setIsPending(true);

    const supabase = supabaseBrowserClient();
    await supabase.from('orders').update({ period: period }).eq('id', id);

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
      <DialogTrigger className={cn(buttonVariants({ size: 'lg' }), 'w-full rounded-lg')}>
        Preview
      </DialogTrigger>

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
                <span className='font-semibold'>
                  {currency} {price}
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='font-medium'>Monthly Payment:</span>
                <span className='font-semibold'>
                  {currency} {installmentAmount}
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='font-medium'>Installment Plan:</span>
                <span>{period} monthly payments</span>
              </div>
            </div>

            <div className='space-y-4 bg-gray-50 p-4 rounded-lg'>
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
                  <p className='text-sm text-gray-600'>{nextPaymentDate}</p>
                </div>
              </div>
            </div>

            <div className='space-y-2'>
              <p className='text-sm text-gray-600'>
                By confirming, you agree to the terms of the subscription and authorize for {period} monthly
                payments of {currency} {installmentAmount}.
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
