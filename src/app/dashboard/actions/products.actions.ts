'use server';

import stripe from '@/utils/stripe';
import { supabaseServerClient } from '@/utils/supabase/server';

export async function createProduct(data: TypeCreateProduct) {
  try {
    const supabase = supabaseServerClient();
    const { data: merchant, error } = await supabase
      .from('personal_informations')
      .select('user_id, first_name')
      .single();

    if (error) {
      throw 'User not found';
    }

    const product = await stripe.products.create({
      name: data.product_name,
      description: data.remarks,
      metadata: {
        merchant_name: merchant.first_name,
        merchant_id: merchant.user_id,
      },
      default_price_data: {
        currency: data.currency,
        recurring: {
          interval: 'month', // UPDATE: Handle this in the future to make it dynamic
        },
        unit_amount_decimal: data.price,
      },
    });

    const priceId = product.default_price as string;
    const { error: productError } = await supabase.from('products').insert({
      ...data,
      user_id: merchant.user_id,
      stripe_id: product.id,
      stripe_price_id: priceId,
    });

    if (productError) {
      throw productError.message;
    }
  } catch (error) {
    console.error(error);
    return { error };
  }
}

export type TypeCreateProduct = {
  category: string;
  currency: string;
  price: string;
  product_name: string;
  remarks?: string;
};
