import ModalAddNewCustomer from '@/components/merchant-dashboard/ModalAddNewCustomer';

export default async function Dashboard() {
  return (
    <div className='max-w-6xl mx-auto p-4 space-y-4'>
      <h1>Dashboard</h1>

      <ModalAddNewCustomer />
    </div>
  );
}
