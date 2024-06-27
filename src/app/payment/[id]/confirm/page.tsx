import { createSubscription, getCustomerPaymentMethods } from '@/app/actions/stripe.actions';
import PaymentMethodDetails from '@/components/payment/PaymentMethodDetails';
import { Card, CardHeader } from '@/components/ui/card';
import stripe from '@/utils/stripe';
import { supabaseServerClient } from '@/utils/supabase/server';
import Image from 'next/image';
import { LuLoader } from 'react-icons/lu';

type TypeProps = {
  params: {
    id: string;
  };
  searchParams: {
    session_id: string;
  };
};

export default async function ConfirmPaymentPage({ params, searchParams }: TypeProps) {
  const supabase = supabaseServerClient();

  const { data } = await supabase
    .from('orders')
    .select('*, products (stripe_id)')
    .eq('id', params.id)
    .single();

  if (data == null) {
    return (
      <div className='text-center space-y-2'>
        <p className='text-xl font-medium'>Invalid Payment Link!</p>
        <p className='text-sm'>Please contact support</p>
      </div>
    );
  }

  if (searchParams.session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(searchParams.session_id);
      const setupIntent = await stripe.setupIntents.retrieve(session.setup_intent as string);

      const subscription = await createSubscription({
        id: data.id,
        customer_id: data.stripe_cus_id,
        product_id: data.products?.stripe_id as string,
        currency: data.currency,
        price: data.price,
        quantity: data.quantity,
        installments: data.period!,
        payment_method_id: setupIntent.payment_method as string,
      });
      if (subscription.error) {
        return <div>{subscription.error}</div>;
      }
      if (subscription?.id) {
        return <p>Subscription Created Successfully.</p>;
      }

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

  const paymentMethods = await getCustomerPaymentMethods(data.stripe_cus_id);

  if (paymentMethods.data?.length === 0 || paymentMethods.error) {
    return <div>Payment method not found for the user.</div>;
  }

  return (
    <div className='w-11/12 md:w-[30%]'>
      <Card className='w-full shadow-xl'>
        <CardHeader className='bg-[#F9F9F9] p-4 border-b rounded-t-lg'>
          <Image src='/logo.png' width={164} height={72} alt='logo' className='w-24 mx-auto' />
        </CardHeader>

        <PaymentMethodDetails data={data} paymentMethods={paymentMethods.data!} />
      </Card>
    </div>
  );
}
