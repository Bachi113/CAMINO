'use client';
import { usePathname } from 'next/navigation';
import React from 'react';
import { sidebarLinks } from './Sidebar';

const NavTitle = () => {
  const pathname = usePathname();

  const currentLink = sidebarLinks.find((link) => pathname.endsWith(link.path));

  const title = currentLink ? currentLink.label : 'Dashboard';

  return <h1 className='text-2xl text-[#363A4E] font-semibold'>{title}</h1>;
};

export default NavTitle;
