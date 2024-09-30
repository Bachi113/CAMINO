import NavTitle from '@/components/dashboard/NavTitle';
import TransactionsTable from '@/components/dashboard/transactions/Table';
import React from 'react';

const Page = () => {
  return (
    <div className='w-full p-6'>
      <NavTitle />
      <TransactionsTable />
    </div>
  );
};

export default Page;
