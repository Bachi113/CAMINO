import ModalAddNewProduct from '@/components/dashboard/ModalAddNewProduct';
import ModalCreatePaymentLink from '@/components/dashboard/ModalCreatePaymentLink';
import NavTitle from '@/components/dashboard/NavTitle';
import { section1, section2, section3 } from './data';

export default async function MerchantDashboard() {
  return (
    <div className='p-8 w-full'>
      <NavTitle />

      <div className='flex justify-end gap-2 mt-10'>
        <ModalAddNewProduct triggerButton={true} buttonVariant='outline' />
        <ModalCreatePaymentLink />
      </div>

      <div className='grid grid-cols-3 gap-6 mt-8'>
        {section1.map((item) => (
          <div key={item.label} className='bg-white p-5 rounded-lg shadow-sm border space-y-3'>
            <div className='text-sm font-light text-gray-600'>{item.label}</div>
            <div className='text-2xl font-medium'>{item.value}</div>
          </div>
        ))}
      </div>

      <hr className='my-8' />

      <div className='grid grid-cols-3 gap-6'>
        {section2.map((item) => (
          <div key={item.label} className='bg-white p-5 rounded-lg shadow-sm border space-y-3'>
            <div className='text-sm font-light text-gray-600'>{item.label}</div>
            <div className='text-2xl font-medium'>{item.value}</div>
          </div>
        ))}
      </div>

      <hr className='my-8' />

      <div className='grid grid-cols-3 gap-6'>
        {section3.map((item) => (
          <div key={item.label} className='bg-white p-5 rounded-lg shadow-sm border space-y-3'>
            <div className='text-sm font-light text-gray-600'>{item.label}</div>
            <div className='text-2xl font-medium'>{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
