import NavTitle from '@/components/dashboard/NavTitle';
import TransactionsTable from '@/components/dashboard/transactions/Table';
import React from 'react';

const Page = () => {
  return (
    <div className='p-8 w-full'>
      <NavTitle />
      <TransactionsTable />
    </div>
  );
};

export default Page;
