import { Button } from '@/components/ui/button';
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
      <SheetContent className='flex flex-col justify-between p-6'>
        <SheetHeader className='text-sm font-medium text-[#363A4E]'>
          <div>
            <SheetTitle className='text-[#363A4E]'>Order Details</SheetTitle>
            <p className='font-normal text-base mt-1.5 mb-[22px]'>
              Order ID: <span className='font-bold'>{data.order_id}</span>
            </p>
          </div>
          <div className='text-center bg-[#F9F9F9] py-8 rounded-md'>
            <p className='text-base leading-7 font-medium text-black'>Outstanding Balance</p>
            <p className='text-[32px] leading-10 font-semibold mt-1'>{data.total_amount}</p>
          </div>
          <div>
            <p className='text-sm text-[#C1410C] my-[22px] bg-orange-100 px-2 py-[2px] w-fit rounded-md'>
              Status: <span className='font-bold'>{data.status}</span>
            </p>
            <div className='grid grid-cols-2 gap-4'>
              <div className='mb-3'>
                <p>Next Instalment Date</p>
                <p className='text-[#6B7280] mt-1 font-semibold'>
                  {format(new Date(data.next_instalment_date), 'MMM dd, yyyy')}
                </p>
              </div>
              <div className='mb-3'>
                <p>Subscription End Date</p>
                <p className='text-[#6B7280] mt-1 font-semibold'>
                  {format(new Date(data?.end_instalment_date), 'MMM dd, yyyy')}
                </p>
              </div>
              {dataToDisplay.map((item: OrderDetailsData, index) => (
                <div key={index} className='w-full mb-3'>
                  <p>{item.label}</p>
                  <p
                    className={cn(
                      'bg-[#F4F4F4] text-[#6B7280] px-4 py-2.5 mt-1 rounded-md border',
                      (item.label.includes('ID') || item.label.includes('Date')) && 'font-semibold'
                    )}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </SheetHeader>
        <Button className='w-full h-11'>Send Payment Reminder</Button>
      </SheetContent>
    </Sheet>
  );
};

export default OrderSummary;
