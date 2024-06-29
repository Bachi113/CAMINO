import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { cn, handleCopyPaymentLink } from '@/utils/utils';
import { format } from 'date-fns';
import getSymbolFromCurrency from 'currency-symbol-map';
import { Badge } from '@/components/ui/badge';
import { IoCopyOutline } from 'react-icons/io5';
import { TypeOrderDetails } from '@/types/types';

interface OrderSummaryProps {
  data: TypeOrderDetails;
  handleSheetOpen: () => void;
}

interface DataToDisplay {
  label: string;
  value: string | number | undefined;
}

const OrderSummary = ({ data, handleSheetOpen }: OrderSummaryProps) => {
  const paymentLink = `${process.env.NEXT_PUBLIC_APP_URL}/payment/${data.id}`;

  const dataToDisplay: DataToDisplay[] = data
    ? [
        {
          label: 'Total Amount',
          value: `${getSymbolFromCurrency(data.currency)} ${Number(data.price) * data.quantity}`,
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
          value: data.products?.product_name,
        },
        {
          label: 'Customer Name',
          value: data.customers?.customer_name,
        },
        {
          label: 'Instalments',
          value: data.period ?? '-',
        },
      ]
    : [];

  return (
    <Sheet open={!!data} onOpenChange={handleSheetOpen}>
      <SheetContent className='flex flex-col justify-between'>
        <SheetHeader className='text-sm font-medium text-secondary'>
          <div className='space-y-1 mb-6'>
            <SheetTitle className='text-secondary'>Order Details</SheetTitle>
            <p className='font-normal text-base'>
              Order ID: <span className='font-bold'>{data.id}</span>
            </p>
          </div>

          <div className='text-center bg-stone-100 py-8 rounded-md'>
            <p className='text-base leading-7 font-medium text-black'>Order Price</p>
            <p className='text-3xl leading-10 font-semibold mt-1'>
              {getSymbolFromCurrency(data.currency)} {data.price}
            </p>
          </div>

          <Badge
            variant={data.status === 'active' ? 'default' : 'warning'}
            className='capitalize my-6 space-x-2 w-fit'>
            <span>Status:</span>
            <span className='font-bold'>{data.status}</span>
          </Badge>

          <div className='grid grid-cols-2 gap-4 mb-3'>
            {/* <div className='mb-3'>
                <p>Next Instalment Date</p>
                <p className='text-gray-500 mt-1 font-semibold'>
                  {format(new Date(data.next_instalment_date), 'MMM dd, yyyy')}
                </p>
              </div>
              <div className='mb-3'>
                <p>Subscription End Date</p>
                <p className='text-gray-500 mt-1 font-semibold'>
                  {format(new Date(data?.end_instalment_date), 'MMM dd, yyyy')}
                </p>
              </div> */}
            {dataToDisplay.map((item, index) => (
              <div key={index} className='w-full mb-3 space-y-1'>
                <p>{item.label}</p>
                <p
                  className={cn(
                    'bg-zinc-100 text-gray-500 px-4 py-2.5 rounded-md border',
                    (item.label.includes('ID') || item.label.includes('Date')) && 'font-semibold'
                  )}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {data.status === 'pending' && (
            <div className='space-y-1'>
              <p>Payment Link</p>
              <Button
                type='button'
                variant='secondary'
                size='sm'
                onClick={() => handleCopyPaymentLink(paymentLink)}
                className='w-full justify-between border'>
                {paymentLink} <IoCopyOutline />
              </Button>
            </div>
          )}
        </SheetHeader>
        <Button className='w-full h-11'>Send Payment Reminder</Button>
      </SheetContent>
    </Sheet>
  );
};

export default OrderSummary;
