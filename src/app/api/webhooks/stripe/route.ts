import { EnumOrderStatus } from '@/types/types';
import stripe from '@/utils/stripe';
import { supabaseAdmin } from '@/utils/supabase/admin';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Stripe webhook secret key
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

// Helper function to handle subscription events
const handleSubscriptionEvent = async (subscriptionId: string, status: EnumOrderStatus) => {
  await supabaseAdmin.from('orders').update({ status }).eq('stripe_id', subscriptionId);
};

// Main function to handle POST requests from Stripe webhooks
export async function POST(req: NextRequest): Promise<NextResponse> {
  // Retrieving the signature from the headers to validate the request
  const signature = headers().get('stripe-signature') as string;
  const requestData = await req.text();

  try {
    // Validate and construct the event using Stripe's library
    const event = stripe.webhooks.constructEvent(requestData, signature, WEBHOOK_SECRET!);
    const {
      type: eventType,
      data: { object: eventObject },
    } = event;

    console.log(`Event received: ${eventType}`);

    // Handle webhook events based on type
    switch (eventType) {
      case 'invoice.created': {
        // Retrieve the full invoice object from Stripe
        const invoice = await stripe.invoices.retrieve((eventObject as Stripe.Invoice).id);
        const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);
        if (finalizedInvoice.status === 'open') {
          await stripe.invoices.pay(finalizedInvoice.id);
        }
        break;
      }
      case 'invoice.payment_succeeded': {
        const invoice = await stripe.invoices.retrieve((eventObject as Stripe.Invoice).id);
        await handleSubscriptionEvent(invoice.subscription as string, 'active');
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = await stripe.invoices.retrieve((eventObject as Stripe.Invoice).id);
        await handleSubscriptionEvent(invoice.subscription as string, 'failed');
        break;
      }
    }

    return NextResponse.json({ message: `Processing webhook for ${eventType}` }, { status: 200 });
  } catch (err: any) {
    console.error(err.message);
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
