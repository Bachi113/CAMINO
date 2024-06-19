'use server';

import stripe from '@/utils/stripe';

export async function getOrCreateCustomer() {}

export async function createSubscription() {
  const subscriptionSchedule = await stripe.subscriptionSchedules.create({
    customer: 'cus_Q6xx9eFd7O1evm',
    metadata: {
      key: 'value',
    },
    phases: [
      {
        items: [
          {
            // price_data: {
            //   product: '', // product id
            //   currency: '',
            //   recurring: {
            //     interval: 'month',
            //   },
            //   unit_amount_decimal: '1000.00',
            // },
            price: '', // price id
            quantity: 1,
          },
        ],
        iterations: 3,
      },
    ],
    start_date: 'now',
    end_behavior: 'cancel',
  });

  console.log(subscriptionSchedule);
}
