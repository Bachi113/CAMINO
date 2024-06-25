import NavTitle from '@/components/merchant-dashboard/NavTitle';
import CustomersTable from '@/components/merchant-dashboard/customers/Table';
import React from 'react';

const Page = () => {
  return (
    <div className='p-8 w-full mr-5'>
      <NavTitle />
      <CustomersTable />
    </div>
  );
};

export default Page;
