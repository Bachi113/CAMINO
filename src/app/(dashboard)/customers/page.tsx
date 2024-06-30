import NavTitle from '@/components/dashboard/NavTitle';
import CustomersTable from '@/components/dashboard/customers/Table';
import React from 'react';

const Page = () => {
  return (
    <div className='p-8 w-full'>
      <NavTitle />
      <CustomersTable />
    </div>
  );
};

export default Page;
