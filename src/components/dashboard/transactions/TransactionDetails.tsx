import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { handleCopyPaymentLink } from '@/utils/utils';
import { format } from 'date-fns';
import getSymbolFromCurrency from 'currency-symbol-map';
import { Badge } from '@/components/ui/badge';
import { IoCopyOutline } from 'react-icons/io5';
import { TypeTransactionDetails } from '@/types/types';
import InputWrapper from '@/components/InputWrapper';
import { Input } from '@/components/ui/input';

interface TransactionDetailsProps {
  data: TypeTransactionDetails;
  handleSheetOpen: () => void;
}

const TransactionDetails = ({ data, handleSheetOpen }: TransactionDetailsProps) => {
  const paymentLink = `${process.env.NEXT_PUBLIC_APP_URL}/payment/${data.id}`;

  const dataToDisplay = data && [
    {
      label: 'Total Amount',
      value: `${getSymbolFromCurrency(data.currency)} ${Number(data.price) * data.quantity}`,
    },
    {
      label: 'Amount Paid till date',
      value: data.paid_amount ?? '-',
    },
    {
      label: 'Transaction Date',
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
  ];

  return (
    <Sheet open={!!data} onOpenChange={handleSheetOpen}>
      <SheetContent className='flex flex-col justify-between'>
        <div>
          <SheetHeader className='text-sm font-medium mb-6'>
            <div className='space-y-1'>
              <SheetTitle className='text-secondary'>Transaction Details</SheetTitle>
              <p className='font-normal text-base'>
                Transaction ID: <span className='font-bold'>{data.id}</span>
              </p>
            </div>
          </SheetHeader>

          <div className='space-y-4'>
            <div className='text-center bg-zinc-100 border py-8 rounded-md mb-4'>
              <p className='text-base leading-7 font-medium text-black'>Order Price</p>
              <p className='text-3xl leading-10 font-semibold mt-1'>
                {getSymbolFromCurrency(data.currency)} {data.price}
              </p>
            </div>

            <Badge
              variant={data.status === 'active' ? 'default' : 'warning'}
              className='capitalize space-x-2 w-fit'>
              <span>Status:</span>
              <span className='font-bold'>{data.status}</span>
            </Badge>

            <div className='grid grid-cols-2 gap-4'>
              {dataToDisplay.map((item, index) => (
                <InputWrapper key={index} label={item.label}>
                  <Input disabled={true} value={item.value} className='h-11' />
                </InputWrapper>
              ))}
            </div>

            {data.status === 'pending' && (
              <div className='space-y-1'>
                <p>Payment Link</p>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => handleCopyPaymentLink(paymentLink)}
                  className='w-full h-11 justify-between opacity-80'>
                  {paymentLink} <IoCopyOutline />
                </Button>
              </div>
            )}
          </div>
        </div>

        <SheetFooter>
          <Button className='w-full h-11'>Send Payment Reminder</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default TransactionDetails;
