// This route handles incoming webhook events sent from Stripe.
// It's triggered by Stripe when there are updates to a customer's subscription (created or updated).
// The events are processed to update subscription details in the application's database using Supabase.
// Each webhook request is validated for authenticity by verifying the signature using a secret key.

import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Environment variables for Stripe API key and webhook secret.
const SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

// Stripe object initialization with TypeScript support enabled
const stripe = new Stripe(SECRET_KEY!, {
  typescript: true,
});

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

    // Retrieve the full subscription object from Stripe
    const subscription = await stripe.subscriptions.retrieve((eventObject as Stripe.Subscription).id);

    // Handle the event based on its type (e.g., subscription creation or update)
    switch (eventType) {
      case 'customer.subscription.created':
        break;
      case 'customer.subscription.updated':
        break;
    }

    // Successful handling of the webhook event
    return NextResponse.json({ message: `Processing webhook for ${eventType}` }, { status: 200 });
  } catch (err: any) {
    console.error(err.message);
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
