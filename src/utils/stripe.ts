import Stripe from 'stripe';

const SECRET_KEY = process.env.STRIPE_SECRET_KEY;

const stripe = new Stripe(SECRET_KEY!, {
  typescript: true,
});

export default stripe;
