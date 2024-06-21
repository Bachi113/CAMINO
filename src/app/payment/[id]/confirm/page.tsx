import { Card, CardHeader } from '@/components/ui/card';
import stripe from '@/utils/stripe';
import Image from 'next/image';
import { LuLoader } from 'react-icons/lu';

type TypeProps = {
  searchParams: {
    pm_id: string;
    session_id: string;
  };
};

export default async function ConfirmPaymentPage({ searchParams }: TypeProps) {
  // TODO: handle payment method confirmation and the create subscription
  if (searchParams.pm_id) {
    try {
      const paymentMethod = await stripe.paymentMethods.retrieve(searchParams.pm_id);

      return (
        <div className='w-11/12 md:w-[30%]'>
          <Card className='w-full shadow-xl'>
            <CardHeader className='bg-[#F9F9F9] p-4 border-b rounded-t-lg'>
              <Image src='/logo.png' width={164} height={72} alt='logo' className='w-24 mx-auto' />
            </CardHeader>

            {/* <PaymentDetails data={data} /> */}
          </Card>
        </div>
      );
    } catch (error: any) {
      return <div>{error.message}</div>;
    }
  }

  if (searchParams.session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(searchParams.session_id);

      if (session.status != 'complete') {
        return <div>Payment method not attached yet.</div>;
      }

      // TODO: create subscription now
      return (
        <div className='flex flex-col items-center gap-4'>
          <LuLoader className='animate-[spin_2s_linear_infinite]' size={26} />
          <p className='text-lg font-light'>Creating your subscription.</p>
        </div>
      );
    } catch (error: any) {
      return <div>{error.message}</div>;
    }
  }

  return <></>;
}
