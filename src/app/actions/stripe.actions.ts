'use server';

import { TypeCreateCustomer, TypeCreatePaymentMethodCS, TypeCreateSubscription } from '@/types/types';
import stripe from '@/utils/stripe';
import { supabaseServerClient } from '@/utils/supabase/server';
import { getUser } from './supabase.actions';
import { supabaseAdmin } from '@/utils/supabase/admin';

export async function createProduct() {
  const supabase = supabaseServerClient();
  try {
    const { data: merchant, error } = await supabase
      .from('personal_informations')
      .select('user_id, first_name')
      .single();

    if (error) {
      throw 'User not found';
    }

    const product = await stripe.products.create({
      name: merchant.first_name,
      // description: 'This is a default product for the merchant',
      metadata: {
        merchant_id: merchant.user_id,
      },
    });

    return { id: product.id };
  } catch (error) {
    console.error(error);
    return { error };
  }
}

export async function createCustomer(data: TypeCreateCustomer) {
  try {
    const user = await getUser();
    if (!user) {
      throw 'You need to be logged in.';
    }

    const customer = await stripe.customers.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: {
        line1: data.address,
      },
      metadata: {
        created_by: user.id,
      },
    });

    return { id: customer.id };
  } catch (error) {
    console.error(error);
    return { error };
  }
}

export async function getCustomerPaymentMethods(customerId: string) {
  try {
    const paymentMethods = await stripe.customers.listPaymentMethods(customerId);
    return { data: paymentMethods.data };
  } catch (error: any) {
    console.error(error);
    return { error: error.message ?? `${error}` };
  }
}

export async function createSubscription(data: TypeCreateSubscription) {
  try {
    const amount = (Number(data.price) / data.installments) * 100;

    const subscription = await stripe.subscriptionSchedules.create({
      customer: data.customer_id,
      default_settings: {
        default_payment_method: data.payment_method_id,
      },
      phases: [
        {
          items: [
            {
              price_data: {
                product: data.product_id,
                currency: data.currency,
                recurring: {
                  interval: data.interval,
                },
                unit_amount_decimal: amount.toFixed(0),
              },
              quantity: data.quantity,
            },
          ],
          iterations: data.installments,
        },
      ],
      start_date: 'now',
      end_behavior: 'cancel',
    });

    await supabaseAdmin
      .from('orders')
      .update({
        stripe_id: subscription.subscription as string,
        status: 'processing',
      })
      .eq('id', data.id);

    return { id: subscription.id };
  } catch (error) {
    console.error(error);
    return { error: `${error}` };
  }
}

export async function createSetupCheckoutSession(data: TypeCreatePaymentMethodCS) {
  const appUrl = process.env.APP_URL;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'setup',
      currency: data.currency,
      customer: data.customer_id,
      success_url: `${appUrl}/payment/${data.paymentId}/confirm?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/payment/cancel`,
    });
    if (session.url == null) {
      throw 'Session URL not found';
    }

    return { url: session.url };
  } catch (error: any) {
    console.error(error);
    return { error: error.message ?? `${error}` };
  }
}

export async function getInvoice(invoiceId: string) {
  try {
    const invoice = await stripe.invoices.retrieve(invoiceId);
    return {
      url: invoice.hosted_invoice_url,
      pdf: invoice.invoice_pdf,
    };
  } catch (error) {
    console.error(error);
    return { error: `${error}` };
  }
}
