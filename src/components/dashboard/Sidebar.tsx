'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/utils/utils';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { HiOutlineArchiveBox } from 'react-icons/hi2';
import { BsBox } from 'react-icons/bs';
import { IoSettingsOutline } from 'react-icons/io5';
import { PiUsers } from 'react-icons/pi';
import { RxDashboard } from 'react-icons/rx';
import ButtonSignout from '@/components/ButtonSignout';

export const sidebarLinks = [
  { label: 'Dashboard', path: '/dashboard', logo: <RxDashboard size={18} strokeWidth={0.1} /> },
  { label: 'Orders', path: '/orders', logo: <HiOutlineArchiveBox size={20} /> },
  { label: 'Products', path: '/products', logo: <BsBox size={15} strokeWidth={0.4} /> },
  { label: 'Customers', path: '/customers', logo: <PiUsers size={20} /> },
  // { label: 'Transactions', path: '/transactions', logo: TransactionsIcon },
  { label: 'Account Settings', path: '/account-settings', logo: <IoSettingsOutline size={20} /> },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className='min-h-screen flex flex-col justify-between h-full p-7 min-w-[250px] bg-white border-r'>
      <div>
        <div className='mb-8'>
          <Image src='/logo.png' width={85} height={40} alt='logo' />
        </div>
        <div>
          {sidebarLinks.map((link) => (
            <Link
              href={link.path}
              key={link.label}
              className={cn(
                'flex items-center gap-2.5 px-2 py-3 rounded-md text-slate-600 text-sm font-semibold hover:text-purple-800',
                pathname === link.path && 'bg-indigo-50 text-purple-800'
              )}>
              <div className='w-5 flex justify-center'>{link.logo}</div>
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <ButtonSignout />
    </div>
  );
};

export default Sidebar;
