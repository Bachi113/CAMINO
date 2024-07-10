// This is the entry component for the landing page of the application.
// It sequentially renders the primary sections of the landing page including Hero, Features, Product, Pricing, Faq, and Footer components.

import Link from 'next/link';
import { getUser } from './actions/supabase.actions';
import { redirect } from 'next/navigation';

export default async function Home() {
  const user = await getUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className='max-w-6xl mx-auto p-4'>
      <p className='mb-4'>Welcome to Camino!</p>

      <div className='text-sm space-x-6'>
        <Link href='/merchant/login' className='text-blue-500'>
          Merchant Login
        </Link>
        <Link href='/customer/login' className='text-blue-500'>
          Customer Login
        </Link>
      </div>
    </div>
  );
}
