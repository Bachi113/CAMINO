import { EnumOrderStatus, EnumTransactionStatus } from '@/types/types';
import stripe from '@/utils/stripe';
import { supabaseAdmin } from '@/utils/supabase/admin';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Stripe webhook secret key
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

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
        // Create new transaction in the database
        await handleRecordTransaction(invoice);

        // Finalize and pay the invoice if it's still open
        const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);
        if (finalizedInvoice.status === 'open') {
          await stripe.invoices.pay(finalizedInvoice.id);
        }
        break;
      }
      case 'invoice.payment_succeeded': {
        const invoice = await stripe.invoices.retrieve((eventObject as Stripe.Invoice).id);
        await handleSubscriptionEvent(invoice.subscription as string, 'active', invoice.id, 'completed');
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = await stripe.invoices.retrieve((eventObject as Stripe.Invoice).id);
        await handleSubscriptionEvent(invoice.subscription as string, 'failed', invoice.id, 'failed');
        break;
      }
    }

    return NextResponse.json({ message: `Processing webhook for ${eventType}` }, { status: 200 });
  } catch (err: any) {
    console.error(err.message);
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}

async function handleRecordTransaction(invoice: Stripe.Response<Stripe.Invoice>) {
  const tx = await supabaseAdmin.from('transactions').select('id').eq('stripe_id', invoice.id).single();
  if (tx != null) {
    return NextResponse.json({ message: 'Transaction already exists' }, { status: 200 });
  }

  const { data: orderDetails } = await supabaseAdmin
    .from('orders')
    .select()
    .eq('stripe_id', invoice.subscription!)
    .single();

  if (orderDetails == null) {
    throw new Error(`Subscription not found for invoice ${invoice.id}, subscription ${invoice.subscription}`);
  }

  const [{ data: customer }, { data: product }] = await Promise.all([
    supabaseAdmin.from('customers').select().eq('stripe_id', orderDetails.stripe_cus_id).single(),
    supabaseAdmin.from('products').select().eq('id', orderDetails.product_id).single(),
  ]);

  if (!customer || !product) {
    throw new Error('Customer or product not found');
  }

  await supabaseAdmin.from('transactions').insert({
    stripe_id: invoice.id,
    product_name: product.product_name!,
    product_id: product.id,
    order_id: orderDetails.id,
    merchant_id: orderDetails.user_id,
    customer_id: customer.id,
    customer_name: customer.customer_name!,
  });
}

// Helper function to handle subscription events
async function handleSubscriptionEvent(
  subscriptionId: string,
  status: EnumOrderStatus,
  invoiceId: string,
  txStatus: EnumTransactionStatus
) {
  await Promise.all([
    supabaseAdmin.from('orders').update({ status }).eq('stripe_id', subscriptionId),
    supabaseAdmin.from('transactions').update({ status: txStatus }).eq('stripe_id', invoiceId),
  ]);
}
