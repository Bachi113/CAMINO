import NavTitle from '@/components/dashboard/NavTitle';
import OrdersTable from '@/components/dashboard/orders/Table';
import { getUserRoleFromCookie } from '@/utils/user-role';

const Page = async () => {
  const userType = await getUserRoleFromCookie();

  return (
    <div className='w-full p-6'>
      <NavTitle />
      <OrdersTable isMerchant={userType === 'merchant'} />
    </div>
  );
};

export default Page;
