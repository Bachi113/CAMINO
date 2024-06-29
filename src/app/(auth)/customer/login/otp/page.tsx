import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MdOutlineKeyboardBackspace } from 'react-icons/md';

export default function CustomerLoginOtpPage() {
  return (
    <>
      <Link href='/customer/login'>
        <Button variant='outline' className='font-normal absolute left-20 top-10'>
          <MdOutlineKeyboardBackspace className='mr-2' />
          Go back
        </Button>
      </Link>

      <div className='w-full space-y-8'>
        <p>OTP Login Page</p>
      </div>
    </>
  );
}
