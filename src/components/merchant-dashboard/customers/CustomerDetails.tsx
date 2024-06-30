import InputWrapper from '@/components/InputWrapper';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { TypeCustomerDetails } from '@/types/types';
import { format } from 'date-fns';

interface CustomerDetailsProps {
  handleSheetOpen: () => void;
  data: TypeCustomerDetails;
}

const CustomerDetails = ({ handleSheetOpen, data }: CustomerDetailsProps) => {
  const dataToDisplay = data && [
    {
      label: 'Date Added',
      value: format(new Date(data.created_at), 'MMM dd, yyyy'),
    },
    {
      label: 'Customer Name',
      value: data.customers?.customer_name ?? '-',
    },
    {
      label: 'Email',
      value: data.customers?.email ?? '-',
    },
    {
      label: 'Number',
      value: data.customers?.phone ?? '-',
    },
  ];

  return (
    <Sheet open={true} onOpenChange={handleSheetOpen}>
      <SheetContent>
        <SheetHeader className='text-sm font-medium mb-10'>
          <div className='space-y-1'>
            <SheetTitle className='text-secondary'>Customer Details</SheetTitle>
            <p className='font-normal text-base'>
              Customer ID: <span className='font-bold'>{data.customer_id}</span>
            </p>
          </div>
        </SheetHeader>

        <div className='space-y-4'>
          {dataToDisplay.map((item, index) => (
            <InputWrapper key={index} label={item.label}>
              <Input disabled={true} value={item.value} className='h-11' />
            </InputWrapper>
          ))}

          <InputWrapper label='Address'>
            <Textarea disabled={true} value={data?.customers?.address ?? '-'} rows={6} />
          </InputWrapper>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CustomerDetails;
