'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/utils/utils';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import DashboardIcon from '@/assets/icons/DashboardIcon';
import OrdersIcon from '@/assets/icons/OrdersIcon';
import ProductsIcon from '@/assets/icons/ProductsIcon';
import UsersIcon from '@/assets/icons/UsersIcon';
import TransactionsIcon from '@/assets/icons/TransactionsIcon';
import SettingsIcon from '@/assets/icons/SettingsIcon';

export const sidebarLinks = [
  { label: 'Dashboard', path: 'dashboard', logo: DashboardIcon },
  { label: 'Orders', path: 'orders', logo: OrdersIcon },
  { label: 'Products', path: 'products', logo: ProductsIcon },
  { label: 'Customers', path: 'customers', logo: UsersIcon },
  { label: 'Transactions', path: 'transactions', logo: TransactionsIcon },
  { label: 'Account Settings', path: 'account-settings', logo: SettingsIcon },
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
    <div className='min-h-screen h-full p-7 min-w-[250px] bg-white border-r'>
      <div className='mb-8'>
        <Image src='/logo.png' width={85} height={40} alt='logo' />
      </div>
      <div>
        {sidebarLinks.map((link) => {
          const isSelected = pathname.endsWith(link.path);
          const IconComponent = link.logo;

          return (
            <Link
              href={getHref(link.path)}
              key={link.label}
              className={cn(
                'flex items-center gap-2.5 px-2 py-3 rounded-md text-slate-600 text-sm font-semibold',
                isSelected && 'bg-indigo-50 text-purple-800'
              )}>
              <IconComponent isSelected={isSelected} />
              {link.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
