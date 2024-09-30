import NavTitle from '@/components/dashboard/NavTitle';
import ProductsTable from '@/components/dashboard/product/Table';
import React from 'react';

const Page = () => {
  return (
    <div className='w-full p-6'>
      <NavTitle />
      <ProductsTable />
    </div>
  );
};

export default Page;
