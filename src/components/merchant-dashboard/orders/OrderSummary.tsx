import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/utils/utils';
import { format } from 'date-fns';
interface OrderSummaryProps {
  setIsOpen: (isOpen: boolean) => void;
  data: any;
}

interface OrderDetailsData {
  label: string;
  value: string;
}

const OrderSummary = ({ setIsOpen, data }: OrderSummaryProps) => {
  const dataToDisplay: OrderDetailsData[] = data && [
    {
      label: 'Total Amount',
      value: data.total_amount,
    },
    {
      label: 'Amount Paid till date',
      value: data?.paid_amount,
    },
    {
      label: 'Order Date',
      value: format(new Date(data?.product_date), 'MMM dd, yyyy'),
    },
    {
      label: 'Product Name',
      value: data?.product_name,
    },
    {
      label: 'Customer Name',
      value: data?.customer_name,
    },
    {
      label: 'Instalments',
      value: data?.instalments,
    },
  ];

  return (
    <Sheet open={true} onOpenChange={setIsOpen}>
      <SheetContent className='w-[500px] p-6'>
        <SheetHeader className='text-sm font-medium text-[#363A4E]'>
          <div>
            <SheetTitle className='text-lg font-semibold text-[#363A4E]'>Order Details</SheetTitle>
            <p className='font-normal text-base mb-2'>
              Order ID: <span className='font-bold mt-1.5'>{data.order_id}</span>
            </p>
          </div>
          <div className='text-center bg-[#F9F9F9] py-8 rounded-md'>
            <p className='text-base font-medium'>Outstanding Balance</p>
            <p className='text-4xl font-semibold mt-1'>{data.total_amount}</p>
          </div>
          <div>
            <p className='text-sm text-orange-700 my-4 bg-orange-100 px-2 py-[2px] w-fit rounded-md'>
              status: <span className='font-bold'>{data.status}</span>
            </p>
            <div className='grid grid-cols-2 gap-4'>
              <div className='mb-3'>
                <p>Next Instalment Date</p>
                <p className='text-[#6B7280] mt-1 font-semibold'>{data.next_instalment_date}</p>
              </div>
              <div className='mb-3'>
                <p>Subscription End Date</p>
                <p className='text-[#6B7280] mt-1 font-semibold'>{data.end_instalment_date}</p>
              </div>
              {dataToDisplay.map((item: OrderDetailsData, index) => (
                <div key={index} className='w-full mb-3'>
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
            </div>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default OrderSummary;
