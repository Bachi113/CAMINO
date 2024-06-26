import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/utils/utils';
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
      label: 'Product ID',
      value: data?.product_id,
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
      <SheetContent className='w-[500px]'>
        <SheetHeader className='space-y-12 text-sm font-medium text-[#363A4E]'>
          <div>
            <SheetTitle className='text-lg font-semibold text-[#363A4E]'>Order Details</SheetTitle>
            <p className='font-normal text-base'>
              Order ID: <span className='font-bold mt-1.5'>{data.order_id}</span>
            </p>
          </div>
          <div className='text-center'>
            <p className='text-base font-medium'>Outstanding Balance</p>
            <p className='text-4xl font-semibold mt-1'>{data.total_amount}</p>
          </div>
          <div>
            <p className='text-sm text-orange-700 mb-5 bg-orange-100 px-2 py-[2px] w-fit rounded-md'>
              status: <span className='font-bold'>{data.status}</span>
            </p>
            <div className='grid grid-cols-2 gap-2'>
              <div className='mb-5'>
                <p>Next Instalment Date</p>
                <p className='text-[#6B7280] mt-1 font-semibold'>{data.next_instalment_date}</p>
              </div>
              <div className='mb-5'>
                <p>Subscription End Date</p>
                <p className='text-[#6B7280] mt-1 font-semibold'>{data.end_instalment_date}</p>
              </div>
              {dataToDisplay.map((item: OrderDetailsData, index) => (
                <div key={index} className='w-full mb-5'>
                  <p>{item.label}</p>
                  <p
                    className={cn(
                      'bg-[#F4F4F4] text-[#6B7280] px-4 py-2.5 mt-1 rounded-lg border',
                      item.label.includes('ID') && 'font-semibold'
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
