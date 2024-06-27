import ModalCreatePaymentLink from '@/components/merchant-dashboard/ModalCreatePaymentLink';
import NavTitle from '@/components/merchant-dashboard/NavTitle';

export default async function MerchantDashboard() {
  return (
    <div className='p-8 w-full'>
      <NavTitle />

      <div className='mt-10'>
        <ModalCreatePaymentLink />
      </div>
    </div>
  );
}
