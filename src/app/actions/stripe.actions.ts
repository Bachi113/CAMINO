'use server';

import { TypeCreateCustomer } from '@/types/types';
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

// export async function createSubscription() {
//   const subscriptionSchedule = await stripe.subscriptionSchedules.create({
//     customer: 'cus_Q6xx9eFd7O1evm',
//     metadata: {
//       key: 'value',
//     },
//     phases: [
//       {
//         items: [
//           {
//             // price_data: {
//             //   product: '', // product id
//             //   currency: '',
//             //   recurring: {
//             //     interval: 'month',
//             //   },
//             //   unit_amount_decimal: '1000.00',
//             // },
//             price: '', // price id
//             quantity: 1,
//           },
//         ],
//         iterations: 3,
//       },
//     ],
//     start_date: 'now',
//     end_behavior: 'cancel',
//   });

//   console.log(subscriptionSchedule);
// }
