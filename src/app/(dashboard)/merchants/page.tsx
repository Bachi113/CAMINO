import MerchantsTable from '@/components/dashboard/merchants/Table';
import NavTitle from '@/components/dashboard/NavTitle';

const Page = () => {
  return (
    <div className='p-8 w-full'>
      <NavTitle />
      <MerchantsTable />
    </div>
  );
};

export default Page;
