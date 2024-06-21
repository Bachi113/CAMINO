import React from 'react';
import Link from 'next/link';
import { headers } from 'next/headers';
import { cn } from '@/utils/utils';
import Logo from '@/components/Logo';
import { DashboardIcon, CubeIcon, GearIcon } from '@radix-ui/react-icons';
import { LuUsers2 } from 'react-icons/lu';
import { HiOutlineBanknotes } from 'react-icons/hi2';
import { TbBrandBitbucket } from 'react-icons/tb';
import Image from 'next/image';

const sidebarLinks = [
  { label: 'Dashboard', href: '/dashboard/m', logo: <DashboardIcon /> },
  { label: 'Orders', href: '/dashboard/m/orders', logo: <TbBrandBitbucket /> },
  { label: 'Products', href: '/dashboard/m/products', logo: <CubeIcon /> },
  { label: 'Customers', href: '/dashboard/m/customers', logo: <LuUsers2 /> },
  { label: 'Transactions', href: '/dashboard/m/transactions', logo: <HiOutlineBanknotes /> },
  { label: 'Account Settings', href: '/dashboard/m/account-settings', logo: <GearIcon /> },
];

const Sidebar = () => {
  const headersList = headers();
  const fullUrl = headersList.get('referer') || '';

  return (
    <div className='min-h-screen h-full p-6 min-w-[380px]'>
      <div className='mb-8'>
        <Image src='/logo.png' width={120} height={72} alt='logo' />
      </div>
      <div className='space-y-2'>
        {sidebarLinks.map((link) => (
          <Link
            href={link.href}
            key={link.label}
            className={cn(
              'flex items-center gap-2.5 px-2 py-3 rounded-md text-slate-600 text-sm font-semibold',
              fullUrl.endsWith(link.href) && 'bg-indigo-50 text-purple-700'
            )}>
            {link.logo}
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
