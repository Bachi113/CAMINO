'use client';

import { TypeUserType } from '@/types/types';
import { usePathname } from 'next/navigation';
import React, { FC } from 'react';

interface NavTitleProps {
  userType?: TypeUserType;
}

const NavTitle: FC<NavTitleProps> = ({ userType }) => {
  const pathname = usePathname();

  let title = pathname.replace('/', '').replaceAll('-', ' ');

  if (userType && title === 'dashboard') {
    title = `${userType} ${title}`;
  }

  return <h1 className='text-2xl text-secondary font-semibold capitalize'>{title}</h1>;
};

export default NavTitle;
