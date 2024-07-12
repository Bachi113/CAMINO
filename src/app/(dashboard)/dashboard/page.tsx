import ModalAddNewProduct from '@/components/dashboard/ModalAddNewProduct';
import ModalCreatePaymentLink from '@/components/dashboard/ModalCreatePaymentLink';
import NavTitle from '@/components/dashboard/NavTitle';
import { customerData1, customerData2, merchantData1, merchantData2, merchantData3 } from './data';
import { getUserType } from '@/app/actions/supabase.actions';

export default async function MerchantDashboard() {
  const userType = await getUserType();

  const isMerchant = userType === 'merchant';
  const data1 = isMerchant ? merchantData1 : customerData1;
  const data2 = isMerchant ? merchantData2 : customerData2;
  const data3 = isMerchant ? merchantData3 : [];

  return (
    <div className='p-8 w-full'>
      <NavTitle />

      <div className='flex justify-end gap-2 mt-10 mb-8'>
        {isMerchant && (
          <>
            <ModalAddNewProduct triggerButton={true} buttonVariant='outline' />
            <ModalCreatePaymentLink />
          </>
        )}
      </div>

      <DataSection data={data1} />

      <hr className='my-8' />

      <DataSection data={data2} />

      {data3.length > 0 && (
        <>
          <hr className='my-8' />
          <DataSection data={data3} />
        </>
      )}
    </div>
  );
}

const DataSection = ({ data }: { data: { label: string; value: string }[] }) => (
  <div className='grid grid-cols-3 gap-6'>
    {data.map((item) => (
      <div key={item.label} className='bg-white p-5 rounded-lg shadow-sm border space-y-3'>
        <div className='text-sm font-light text-gray-600'>{item.label}</div>
        {/* <div className='text-2xl font-medium'>{item.value}</div> */}
        <div className='text-2xl font-medium'>NA</div>
      </div>
    ))}
  </div>
);
