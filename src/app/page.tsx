// This is the entry component for the landing page of the application.
// It sequentially renders the primary sections of the landing page including Hero, Features, Product, Pricing, Faq, and Footer components.

import { FC } from 'react';
import Link from 'next/link';
import { getUser } from './actions/supabase.actions';
import { redirect } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BsHandbag } from 'react-icons/bs';
import { LuUser2 } from 'react-icons/lu';
import Image from 'next/image';

const Home: FC = async () => {
  const user = await getUser();

  if (user) {
    redirect('/onboarding');
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-b from-white from-25% to-[#DDC3FF]'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <Image src='/logo.png' width={164} height={72} alt='logo' className='w-24 mx-auto' />
          <CardTitle className='text-3xl text-center text-primary'>Welcome to Camino!</CardTitle>
          <CardDescription className='text-center text-gray-600'>Your journey starts here</CardDescription>
        </CardHeader>

        <CardContent className='space-y-4 my-4'>
          <p className='text-center text-sm text-gray-600'>
            Camino is your all-in-one platform for seamless merchant and customer interactions. Choose your
            path below to get started.
          </p>
        </CardContent>

        <CardFooter className='flex gap-2'>
          <Link href='/merchant/login' className='w-full'>
            <Button variant='default' size='lg' className='gap-2 font-normal'>
              <BsHandbag className='size-4' />
              <span>Merchant Login</span>
            </Button>
          </Link>
          <Link href='/customer/login' className='w-full'>
            <Button variant='outline' size='lg' className='gap-2 font-normal'>
              <LuUser2 className='size-4' />
              <span>Customer Login</span>
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Home;
