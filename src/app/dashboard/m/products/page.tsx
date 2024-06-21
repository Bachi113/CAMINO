import OrderTable from '@/components/merchant-dashboard/product/Table';
import React from 'react';

const Page = () => {
  return (
    <div className='py-5 w-full mr-5'>
      <p className='text-2xl text-slate-800 font-semibold'>Orders</p>
      <OrderTable />
    </div>
  );
};

export default Page;
