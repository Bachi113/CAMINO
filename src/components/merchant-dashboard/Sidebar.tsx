'use client';
import { DashboardIcon, CubeIcon, GearIcon } from '@radix-ui/react-icons';
import { LuUsers2 } from 'react-icons/lu';
import { HiOutlineBanknotes } from 'react-icons/hi2';
import { TbBrandBitbucket } from 'react-icons/tb';
import React from 'react';
import Link from 'next/link';
import { cn } from '@/utils/utils';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export const sidebarLinks = [
  { label: 'Dashboard', path: 'dashboard', logo: <DashboardIcon /> },
  { label: 'Orders', path: 'orders', logo: <TbBrandBitbucket /> },
  { label: 'Products', path: 'products', logo: <CubeIcon /> },
  { label: 'Customers', path: 'customers', logo: <LuUsers2 /> },
  { label: 'Transactions', path: 'transactions', logo: <HiOutlineBanknotes /> },
  { label: 'Account Settings', path: 'account-settings', logo: <GearIcon /> },
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
    return dashboardType ? `/dashboard/${dashboardType}/${path}` : `/dashboard/${path}`;
  };

  return (
    <div className='min-h-screen h-full p-7 min-w-[250px]'>
      <div className='mb-8'>
        <Image src='/logo.png' width={120} height={72} alt='logo' />
      </div>
      <div className='space-y-1'>
        {sidebarLinks.map((link) => (
          <Link
            href={getHref(link.path)}
            key={link.label}
            className={cn(
              'flex items-center gap-2.5 px-2 py-3 rounded-md text-slate-500 text-sm font-semibold',
              pathname.endsWith(link.path) && 'bg-indigo-50 text-purple-700'
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
