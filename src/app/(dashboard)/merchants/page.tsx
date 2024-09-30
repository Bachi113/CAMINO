import MerchantsTable from '@/components/dashboard/merchants/Table';
import NavTitle from '@/components/dashboard/NavTitle';

const Page = () => {
  return (
    <div className='w-full p-6'>
      <NavTitle />
      <MerchantsTable />
    </div>
  );
};

export default Page;
