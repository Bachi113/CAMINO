import NavTitle from '@/components/merchant-dashboard/NavTitle';
import TransactionsTable from '@/components/merchant-dashboard/orders/Table';
import React from 'react';

const Page = () => {
  return (
    <div className='p-8 w-full mr-5'>
      <NavTitle />
      <TransactionsTable />
    </div>
  );
};

export default Page;
