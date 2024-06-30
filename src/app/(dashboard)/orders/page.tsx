import NavTitle from '@/components/dashboard/NavTitle';
import OrdersTable from '@/components/dashboard/orders/Table';
import React from 'react';

const Page = () => {
  return (
    <div className='p-8 w-full'>
      <NavTitle />
      <OrdersTable />
    </div>
  );
};

export default Page;
