import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/utils/utils';
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
      value: data?.customers?.customer_name || '-',
    },
    {
      label: 'Email',
      value: data?.customers?.email || '-',
    },
    {
      label: 'Number',
      value: data?.customers?.phone || '-',
    },
  ];

  return (
    <Sheet open={true} onOpenChange={setIsOpen}>
      <SheetContent>
        <SheetHeader className='space-y-5 text-sm font-medium text-[#363A4E]'>
          <SheetTitle className='text-lg font-semibold -mb-5 text-[#363A4E]'>Customer Details</SheetTitle>
          <p className='font-normal text-base'>
            Customer ID: <span className='font-bold mt-1'>{data.customer_id}</span>
          </p>
          <div className='my-5'>
            {dataToDisplay.map((item: CustomerDetailsData, index) => (
              <div key={index} className='w-full mb-5'>
                <p>{item.label}</p>
                <p
                  className={cn(
                    'bg-[#F4F4F4] text-[#6B7280] px-4 py-2.5 mt-1 rounded-lg border',
                    (item.label.includes('ID') || item.label.includes('Date')) && 'font-semibold'
                  )}>
                  {item.value}
                </p>
              </div>
            ))}
            <div className='w-full'>
              <p>Address</p>
              <p className='bg-[#F4F4F4] h-36 text-[#6B7280] px-4 py-2.5 mt-1 rounded-lg border'>
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
