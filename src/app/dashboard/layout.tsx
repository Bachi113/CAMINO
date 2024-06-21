import Sidebar from '@/components/merchant-dashboard/Sidebar';
import React from 'react';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex'>
      <Sidebar />
      {children}
    </div>
  );
};

export default DashboardLayout;
