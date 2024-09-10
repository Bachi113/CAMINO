'use client';

import React, { FC } from 'react';
import Link from 'next/link';
import { cn } from '@/utils/utils';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import ButtonSignout from '@/components/ButtonSignout';
import { TypeUserType } from '@/types/types';
import { adminLinks, commonLinks, merchantLinks } from './links';
import { IoSettingsOutline } from 'react-icons/io5';

interface SidebarProps {
  userType: TypeUserType;
  userName: string;
}

const accountSettingsLink = {
  label: 'Account Settings',
  path: '/account-settings',
  logo: <IoSettingsOutline size={18} />,
};

const Sidebar: FC<SidebarProps> = ({ userType, userName }) => {
  const pathname = usePathname();

  const isTypeMerchant = userType === 'merchant';
  const isTypeAdmin = userType === 'admin';

  let sidebarLinks = isTypeAdmin
    ? [...commonLinks, ...adminLinks]
    : isTypeMerchant
      ? [...commonLinks, ...merchantLinks]
      : commonLinks;
  sidebarLinks = [...sidebarLinks, accountSettingsLink];

  return (
    <div className='min-h-screen flex flex-col justify-between h-full p-7 min-w-[250px] bg-white border-r'>
      <div>
        <Image src='/logo.png' width={85} height={40} alt='logo' className='mb-3' />

        <p className='h-10 text-sm text-slate-600 mb-4 capitalize'>
          Welcome, <span className='font-medium'>{userName}</span>!
        </p>

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
