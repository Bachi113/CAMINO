'use server';

import { TypeCreateCustomer, TypeCreateSubscription } from '@/types/types';
import { getUser } from '@/utils/get-user';
import stripe from '@/utils/stripe';
import { supabaseServerClient } from '@/utils/supabase/server';

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

export async function getDefaultPaymentMethod(customerId: string) {
  try {
    const paymentMethods = await stripe.customers.listPaymentMethods(customerId, {
      limit: 5,
    });

    if (paymentMethods.data.length === 0) {
      return { id: null };
    }
    return { data: paymentMethods.data };
  } catch (error: any) {
    console.error(error);
    return { error: error.message ?? `${error}` };
  }
}

export async function createSubscription(data: TypeCreateSubscription) {
  try {
    const subscriptionSchedule = await stripe.subscriptionSchedules.create({
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
                  interval: 'month',
                },
                unit_amount_decimal: data.price,
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

    console.log(subscriptionSchedule);

    return { id: subscriptionSchedule.id };
  } catch (error) {
    console.error(error);
    return { error: `${error}` };
  }
}
