import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { TypeTransaction } from '@/types/types';
import InputWrapper from '@/components/InputWrapper';
import { Input } from '@/components/ui/input';
import { getInvoice } from '@/app/actions/stripe.actions';
import { errorToast } from '@/utils/utils';

interface TransactionDetailsProps {
  data: TypeTransaction;
  handleSheetOpen: () => void;
}

const TransactionDetails = ({ data, handleSheetOpen }: TransactionDetailsProps) => {
  const dataToDisplay = data && [
    {
      label: 'Txn Date',
      value: format(new Date(data.created_at), 'MMM dd, yyyy'),
    },
    {
      label: 'Order ID',
      value: data.order_id,
    },
    {
      label: 'Customer ID',
      value: data.customer_id,
    },
    {
      label: 'Customer Name',
      value: data.customer_name,
    },
    {
      label: 'Product ID',
      value: data.product_id,
    },
    {
      label: 'Product Name',
      value: data.product_name,
    },
  ];

  const handleInvoiceAndRecieptDownload = async () => {
    const invoice = await getInvoice(data.stripe_id);
    if (invoice.error) {
      errorToast(invoice.error);
      return;
    }
    window.open(invoice.url!, '_blank');
  };

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
            <Badge
              variant={
                data.status === 'completed'
                  ? 'default'
                  : data.status === 'initiated'
                    ? 'warning'
                    : 'destructive'
              }
              className='capitalize space-x-2 w-fit'>
              <span>Status:</span>
              <span className='font-bold'>{data.status}</span>
            </Badge>

            <div className='space-y-4'>
              {dataToDisplay.map((item, index) => (
                <InputWrapper key={index} label={item.label}>
                  <Input disabled={true} value={item.value} className='h-11' />
                </InputWrapper>
              ))}
            </div>
          </div>
        </div>

        <SheetFooter>
          <Button className='w-full h-11' onClick={handleInvoiceAndRecieptDownload}>
            Get Invoice & Receipt
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default TransactionDetails;
