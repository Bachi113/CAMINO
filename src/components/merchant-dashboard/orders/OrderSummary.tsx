import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { cn } from '@/utils/utils';
import { format } from 'date-fns';
import getSymbolFromCurrency from 'currency-symbol-map';
import { Badge } from '@/components/ui/badge';

interface OrderSummaryProps {
  data: any;
  handleSheetOpen: () => void;
}

interface OrderDetailsData {
  label: string;
  value: string;
}

const OrderSummary = ({ data, handleSheetOpen }: OrderSummaryProps) => {
  const dataToDisplay: OrderDetailsData[] = data && [
    {
      label: 'Total Amount',
      value: (
        <div>
          {getSymbolFromCurrency(data.currency)} {Number(data.price) * data.quantity}
        </div>
      ),
    },
    {
      label: 'Amount Paid till date',
      value: data.paid_amount ?? '-',
    },
    {
      label: 'Order Date',
      value: format(new Date(data.created_at), 'MMM dd, yyyy'),
    },
    {
      label: 'Product Name',
      value: data.products.product_name,
    },
    {
      label: 'Customer Name',
      value: data.customers.customer_name,
    },
    {
      label: 'Instalments',
      value: <div>{data.period ?? '-'}</div>,
    },
  ];

  return (
    <Sheet open={data} onOpenChange={handleSheetOpen}>
      <SheetContent className='flex flex-col justify-between p-6'>
        <SheetHeader className='text-sm font-medium text-[#363A4E]'>
          <div className='space-y-2 mb-6'>
            <SheetTitle className='text-[#363A4E]'>Order Details</SheetTitle>
            <p className='font-normal text-base'>
              Order ID: <span className='font-bold'>{data.id}</span>
            </p>
          </div>

          <div className='text-center bg-[#F9F9F9] py-8 rounded-md'>
            <p className='text-base leading-7 font-medium text-black'>Order Price</p>
            <p className='text-3xl leading-10 font-semibold mt-1'>
              {getSymbolFromCurrency(data.currency)} {data.price}
            </p>
          </div>
          <div>
            <Badge
              variant={data.status === 'active' ? 'default' : 'warning'}
              className='capitalize my-6 space-x-2'>
              <span>Status:</span>
              <span className='font-bold'>{data.status}</span>
            </Badge>

            <div className='grid grid-cols-2 gap-4'>
              {/* <div className='mb-3'>
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
              </div> */}

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
