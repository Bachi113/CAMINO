'use server';

import stripe from '@/utils/stripe';

async function getOrCreateCustomer() {}

async function createSubscription() {
  const subscriptionSchedule = await stripe.subscriptionSchedules.create({
    customer: 'cus_Q6xx9eFd7O1evm',
    metadata: {
      key: 'value',
    },
    phases: [
      {
        items: [
          {
            price: 'price_1OCidWSJAHz9RUEIuDx9wHDQ',
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

export { createSubscription, getOrCreateCustomer };
