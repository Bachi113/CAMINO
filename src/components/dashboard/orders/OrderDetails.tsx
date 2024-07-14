import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { errorToast, handleCopyPaymentLink } from '@/utils/utils';
import { format } from 'date-fns';
import getSymbolFromCurrency from 'currency-symbol-map';
import { Badge } from '@/components/ui/badge';
import { IoCopyOutline } from 'react-icons/io5';
import { TypeOrderDetails } from '@/types/types';
import InputWrapper from '@/components/InputWrapper';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { useState } from 'react';
import { LuLoader } from 'react-icons/lu';
import { sendPaymentLinkToCustomer } from '@/utils/send-payment-link';

interface OrderDetailsProps {
  data: TypeOrderDetails;
  handleSheetOpen: () => void;
}

const OrderDetails = ({ data, handleSheetOpen }: OrderDetailsProps) => {
  const [isLoading, setIsLoading] = useState(false);

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
  ];

  // Send payment link to the customer
  const handleSendPaymentLink = async () => {
    const customerName = data.customers?.customer_name || '';
    const customerEmail = data.customers?.email || '';
    const customerPhone = data.customers?.phone || '';
    const productName = data.products?.product_name || '';

    try {
      setIsLoading(true);
      await sendPaymentLinkToCustomer({
        customerName,
        customerEmail,
        customerPhone,
        productName,
        currency: data.currency,
        price: data.price,
        paymentLink,
      });
      toast({ description: 'Payment link sent successfully' });
    } catch (error: any) {
      errorToast(error.response.data.message || `${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={!!data} onOpenChange={handleSheetOpen}>
      <SheetContent className='flex flex-col justify-between'>
        <div>
          <SheetHeader className='text-sm font-medium mb-6'>
            <div className='space-y-1'>
              <SheetTitle className='text-secondary'>Order Details</SheetTitle>
              <p className='font-normal text-base'>
                Order ID: <span className='font-bold'>{data.id}</span>
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
          <Button className='w-full h-11' disabled={isLoading} onClick={handleSendPaymentLink}>
            {isLoading ? (
              <LuLoader className='animate-[spin_2s_linear_infinite]' size={16} />
            ) : (
              'Send Payment Link'
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default OrderDetails;
