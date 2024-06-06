// This page represents the login screen of the application.
// It displays a central form allowing users to log in or register either through email or Google authentication.
// The application name is dynamically fetched from the config and displayed at the top.
// The `EmailAuth` and `GoogleAuth` components are used here for handling the respective authentication methods.

import Logo from '@/components/Logo';
import EmailAuth from '@/components/auth/EmailAuth';
import GoogleAuth from '@/components/auth/GoogleAuth';
import { Button } from '@/components/ui/button';
import config from '@/config';
import { MdOutlineStoreMallDirectory } from 'react-icons/md';
import { FiUser } from 'react-icons/fi';

export default function Login() {
  return (
    <div className='h-screen flex flex-col'>
      <div className='w-full flex flex-col items-center mt-36'>
        <div className='m-4 md:m-0 md:max-w-[414px]'>
          <div className='border rounded-lg p-8 space-y-10'>
            <div className='space-y-6 flex flex-col items-center justify-center'>
              <Logo />
              <p className='text-2xl font-semibold leading-7 text-default'>Welcome to SaveX</p>
            </div>
            <div className='space-y-4'>
              <Button
                size='lg'
                variant='secondary'
                className='w-full text-default text-sm font-semibold leading-5 gap-2'>
                <MdOutlineStoreMallDirectory className='size-6' />
                Merchat Login
              </Button>
              <Button
                size='lg'
                variant='secondary'
                className='w-full text-default text-sm font-semibold leading-5 gap-2'>
                <FiUser className='size-6' />
                Personal Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
