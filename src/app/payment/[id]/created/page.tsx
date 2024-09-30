import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { supabaseAdmin } from '@/utils/supabase/admin';
import getSymbolFromCurrency from 'currency-symbol-map';
import Image from 'next/image';
import Link from 'next/link';
import { LuCheckCircle2 } from 'react-icons/lu';
import { BiCircle } from 'react-icons/bi';
import { cn, getInstallmentDates } from '@/utils/utils';
import { TypeInterval } from '@/types/types';
import { buttonVariants } from '@/components/ui/button';
import { LuUser2 } from 'react-icons/lu';

export default async function ConfirmPaymentPage({ params }: { params: { id: string } }) {
  const { data } = await supabaseAdmin.from('orders').select().eq('id', params.id).single();

  if (data == null) {
    return (
      <div className='text-center space-y-2'>
        <p className='text-xl font-medium'>Invalid Payment Link!</p>
        <p className='text-sm'>Please contact support</p>
      </div>
    );
  }

  if (data.stripe_id == null) {
    return (
      <div className='text-center space-y-2'>
        <p className='text-xl font-medium'>Subscription creation is still pending!</p>
        <div className='text-sm'>
          <Link href={`/payment/${data.id}`} className='text-primary underline'>
            Pay Now
          </Link>{' '}
          to create a subscription
        </div>
      </div>
    );
  }

  const totalAmount = Number(data.price) * data.quantity;
  const installmentAmount = (parseFloat(totalAmount.toString()) / data.period!).toFixed(2);
  const installmentDates = getInstallmentDates(new Date(), data.period!, data.interval as TypeInterval);

  return (
    <div className='w-full relative'>
      <Link
        href='/customer/login'
        className={cn(buttonVariants({ variant: 'outline' }), 'flex gap-2 absolute -top-4 right-4')}>
        <LuUser2 size={16} /> Access Customer Dashboard
      </Link>

      <div className='w-11/12 md:w-[30%] mx-auto'>
        <Card className='w-full shadow-xl'>
          <CardHeader className='bg-[#F9F9F9] p-4 border-b rounded-t-lg'>
            <Image src='/logo.png' width={164} height={72} alt='logo' className='w-24 mx-auto' />
          </CardHeader>

          <CardContent className='space-y-6 pb-8'>
            <div className='text-center p-6 space-y-3'>
              <p className='font-medium'>Subscription created successfully 🎉</p>
              <h2 className='text-4xl font-semibold space-x-1'>
                <span>{getSymbolFromCurrency(data.currency)}</span>
                <span>{totalAmount}</span>
              </h2>
            </div>

            <div className='text-sm space-y-4'>
              <p>
                Dear Customer, <br /> Thank you for your reservation!
              </p>

              <div className='max-h-72 overflow-auto'>
                {installmentDates.map((date, index) => (
                  <div key={index} className='flex items-center mb-4 last:mb-0'>
                    <div className='flex flex-col items-center mr-4'>
                      {index === 0 ? (
                        <LuCheckCircle2 className='size-6 text-green-500' />
                      ) : (
                        <BiCircle className='size-6 text-gray-300' />
                      )}
                    </div>
                    <Card className='grow'>
                      <CardContent className='p-4 flex justify-between items-center'>
                        <div>
                          <p className='font-medium text-sm'>{date}</p>
                          <p className='text-xs text-gray-500'>
                            Payment {index === 0 ? 'processed' : 'scheduled'}
                          </p>
                        </div>
                        <p className='font-semibold'>
                          {installmentAmount} {data.currency}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>

              <p>
                Your first installment of{' '}
                <span className='font-semibold'>
                  {getSymbolFromCurrency(data.currency)}
                  {installmentAmount}
                </span>{' '}
                has been processed. The total purchase amount is{' '}
                <span className='font-semibold'>
                  {getSymbolFromCurrency(data.currency)}
                  {data.price}
                </span>
                , payable in <span className='font-semibold'>{data.period} installments</span>. Your next
                payment is due on <span className='font-semibold'>{installmentDates[1]}</span>.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
