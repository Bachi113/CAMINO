// This is the entry component for the landing page of the application.
// It sequentially renders the primary sections of the landing page including Hero, Features, Product, Pricing, Faq, and Footer components.

import ButtonSignout from '@/components/auth/ButtonSignout';
import { Button } from '@/components/ui/button';
import { getUser } from '@/utils/get-user';
import Link from 'next/link';

export default async function Home() {
  const user = await getUser();

  return (
    <div className='max-w-6xl mx-auto p-4'>
      <p>SaveX/Camino</p>
      {user ? (
        <p>Welcome back, {user.email}</p>
      ) : (
        <p>
          Welcome! Please{' '}
          <Link href='/login' className='text-blue-500'>
            sign in to continue.
          </Link>
        </p>
      )}
      {user && (
        <>
          <ButtonSignout />
          <Link href='/onboarding'>
            <Button>Go to onboarding</Button>
          </Link>
        </>
      )}
    </div>
  );
}
