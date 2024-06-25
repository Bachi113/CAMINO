import NavTitle from '@/components/merchant-dashboard/NavTitle';
import ProductsTable from '@/components/merchant-dashboard/product/Table';
import React from 'react';

const Page = () => {
  return (
    <div className='p-8 w-full mr-5'>
      <NavTitle />
      <ProductsTable />
    </div>
  );
};

export default Page;
