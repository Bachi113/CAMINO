import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FiMail } from 'react-icons/fi';
import { MdLocalPhone } from 'react-icons/md';

export default function CustomerLoginPage() {
  return (
    <div className='w-full space-y-8'>
      <p className='text-sm text-subtle text-center'>Please choose your login method</p>

      <div className='flex flex-col gap-2'>
        <Link href='/customer/login/otp'>
          <Button variant='outline' size='xl' className='w-full gap-2'>
            <MdLocalPhone size={19} />
            Login with OTP
          </Button>
        </Link>
        <Link href='/customer/login/magic-link'>
          <Button size='xl' className='w-full gap-2'>
            <FiMail size={18} />
            Login with Magic link
          </Button>
        </Link>
      </div>
    </div>
  );
}
