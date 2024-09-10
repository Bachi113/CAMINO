import ModalAddNewProduct from '@/components/dashboard/ModalAddNewProduct';
import ModalCreatePaymentLink from '@/components/dashboard/ModalCreatePaymentLink';
import NavTitle from '@/components/dashboard/NavTitle';
import {
  adminData1,
  adminData2,
  adminData3,
  customerData1,
  customerData2,
  merchantData1,
  merchantData2,
  merchantData3,
} from './data';
import { TypeUserType } from '@/types/types';
import { getUserRoleFromCookie } from '@/utils/user-role';

export default async function MerchantDashboard() {
  const userType = (await getUserRoleFromCookie()) as TypeUserType;

  const isAdmin = userType === 'admin';
  const isMerchant = userType === 'merchant';

  const data1 = isAdmin ? adminData1 : isMerchant ? merchantData1 : customerData1;
  const data2 = isAdmin ? adminData2 : isMerchant ? merchantData2 : customerData2;
  const data3 = isAdmin ? adminData3 : isMerchant ? merchantData3 : [];

  return (
    <div className='p-6 w-full'>
      <NavTitle />

      {isMerchant ? (
        <div className='flex justify-end gap-2 mt-6 mb-8'>
          <ModalAddNewProduct triggerButton={true} buttonVariant='outline' />
          <ModalCreatePaymentLink />
        </div>
      ) : (
        <div className='mt-9' />
      )}

      <div className='max-h-[calc(100vh-150px)] overflow-auto'>
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
