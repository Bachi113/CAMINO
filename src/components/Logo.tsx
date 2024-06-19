// Logo Component that redirects users to the homepage.
// It is used across various parts of the application to provide a consistent way to return to the main page.

import Image from 'next/image';
import Link from 'next/link';

export default function Logo() {
  return (
    <Link href='/'>
      <div className='w-fit'>
        <Image src='/logo.png' width={164} height={72} alt='logo' />
      </div>
    </Link>
  );
}
