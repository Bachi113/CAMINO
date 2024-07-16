import NavTitle from '@/components/dashboard/NavTitle';
import { CustomerAccountSettings, MerchantAccountSettings } from '@/components/dashboard/account-settings';
import AdminAccountSettings from '@/components/dashboard/account-settings/AdminAccountSettings';
import { TypeUserType } from '@/types/types';
import { getUserRoleFromCookie } from '@/utils/user-role';

export default async function AccountSettings() {
  const userType = (await getUserRoleFromCookie()) as TypeUserType;

  return (
    <div className='p-8 w-full space-y-12'>
      <div>
        <NavTitle />
        <p className='text-slate-500 font-medium mt-2 text-sm'>Access and Manage Details of your account</p>
      </div>

      {userType === 'admin' ? (
        <AdminAccountSettings />
      ) : userType === 'merchant' ? (
        <MerchantAccountSettings />
      ) : (
        <CustomerAccountSettings />
      )}
    </div>
  );
}
