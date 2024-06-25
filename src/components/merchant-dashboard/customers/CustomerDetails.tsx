import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { format } from 'date-fns';

interface CustomerDetailsProps {
  setIsOpen: (isOpen: boolean) => void;
  data: any;
}

interface CustomerDetailsData {
  label: string;
  value: string;
}

const CustomerDetails = ({ setIsOpen, data }: CustomerDetailsProps) => {
  const dataToDisplay: CustomerDetailsData[] = data && [
    {
      label: 'Date Added',
      value: format(new Date(data?.created_at), 'MMM dd, yyyy'),
    },
    {
      label: 'Customer Name',
      value: data?.customer?.name,
    },
    {
      label: 'Email',
      value: data?.customer?.email,
    },
    {
      label: 'Number',
      value: data?.customers?.number,
    },
    {
      label: 'Address',
      value: data?.customers?.address,
    },
  ];

  return (
    <Sheet open={true} onOpenChange={setIsOpen}>
      <SheetContent className='w-[500px]'>
        <SheetHeader className='space-y-5 text-sm font-medium text-slate-800'>
          <SheetTitle className='text-lg font-semibold -mb-5'>Customer Details</SheetTitle>
          <p className='font-normal'>
            Customer ID: <span className='font-bold mt-1'>CUId23324</span>
          </p>
          <div className='my-5'>
            {dataToDisplay.map((item: CustomerDetailsData, index) => (
              <div key={index} className='w-full mb-5'>
                <p>{item.label}</p>
                <p className='bg-gray-100 text-slate-500 px-2.5 py-3 mt-1 rounded-lg border'>{item.value}</p>
              </div>
            ))}
            <div className='w-full'>
              <p>Address</p>
              <p className='bg-gray-100 h-36 text-slate-500 px-2.5 py-3 mt-1 rounded-lg border'>
                {data?.customers?.address}
              </p>
            </div>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default CustomerDetails;
