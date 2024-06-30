import NavTitle from '@/components/dashboard/NavTitle';
import ProductsTable from '@/components/dashboard/product/Table';
import React from 'react';

const Page = () => {
  return (
    <div className='p-8 w-full'>
      <NavTitle />
      <ProductsTable />
    </div>
  );
};

export default Page;
