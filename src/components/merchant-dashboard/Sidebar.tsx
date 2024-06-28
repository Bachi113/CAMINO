'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/utils/utils';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { HiOutlineArchiveBox } from 'react-icons/hi2';
import { HiOutlineCube } from 'react-icons/hi';
import SignOutButton from '@/components/merchant-dashboard/SignOutButton';
import { IoSettingsOutline } from 'react-icons/io5';
import { PiSquaresFourLight, PiUsersThin } from 'react-icons/pi';

export const sidebarLinks = [
  { label: 'Dashboard', path: '', logo: <PiSquaresFourLight size={22} /> },
  { label: 'Orders', path: '/orders', logo: <HiOutlineArchiveBox size={20} /> },
  { label: 'Products', path: '/products', logo: <HiOutlineCube size={20} /> },
  { label: 'Customers', path: '/customers', logo: <PiUsersThin size={24} className='font-light' /> },
  // { label: 'Transactions', path: '/transactions', logo: TransactionsIcon },
  { label: 'Account Settings', path: '/account-settings', logo: <IoSettingsOutline size={20} /> },
];

const getDashboardType = (pathname: string) => {
  if (pathname.startsWith('/dashboard/m')) return 'm';
  if (pathname.startsWith('/dashboard/c')) return 'c';
  return '';
};

const Sidebar = () => {
  const pathname = usePathname();
  const dashboardType = getDashboardType(pathname);

  const getHref = (path: string) => {
    return dashboardType ? `/dashboard/${dashboardType}${path}` : `/dashboard${path}`;
  };

  return (
    <div className='min-h-screen flex flex-col justify-between h-full p-7 min-w-[250px] bg-white border-r'>
      <div>
        <div className='mb-8'>
          <Image src='/logo.png' width={85} height={40} alt='logo' />
        </div>
        <div>
          {sidebarLinks.map((link) => {
            const isSelected = pathname.split('dashboard/m')[1] === link.path;

            return (
              <Link
                href={getHref(link.path)}
                key={link.label}
                className={cn(
                  'flex items-center gap-2.5 px-2 py-3 rounded-md text-slate-600 text-sm font-semibold',
                  isSelected && 'bg-indigo-50 text-purple-800'
                )}>
                {link.logo}
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>

      <SignOutButton className='w-full' />
    </div>
  );
};

export default Sidebar;
