'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

const NavTitle = () => {
  const pathname = usePathname();

  const title = pathname.replace('/', '').replaceAll('-', ' ');

  return <h1 className='text-2xl text-secondary font-semibold capitalize'>{title}</h1>;
};

export default NavTitle;
