import InputWrapper from '@/components/InputWrapper';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { TypeProductDetails } from '@/types/types';
import { format } from 'date-fns';

interface ProductDescriptionProps {
  handleSheetOpen: () => void;
  data: TypeProductDetails;
}

const ProductDescription = ({ handleSheetOpen, data }: ProductDescriptionProps) => {
  const dataToDisplay = data && [
    { label: 'Product name', value: data.product_name },
    { label: 'Added on', value: format(new Date(data.created_at), 'MMM dd, yyyy') },
    { label: 'Category', value: data.category },
  ];

  return (
    <Sheet open={true} onOpenChange={handleSheetOpen}>
      <SheetContent>
        <SheetHeader className='text-sm font-medium mb-10'>
          <div className='space-y-1'>
            <SheetTitle className='text-secondary'>Product Details</SheetTitle>
            <p className='font-normal text-base'>
              Product ID: <span className='font-bold'>{data.id}</span>
            </p>
          </div>
        </SheetHeader>

        <div className='space-y-4'>
          {dataToDisplay.map((item, index) => (
            <InputWrapper key={index} label={item.label}>
              <Input disabled={true} value={item.value} className='h-11' />
            </InputWrapper>
          ))}

          <InputWrapper label='Product Remarks'>
            <Textarea disabled={true} value={data.remarks} rows={6} />
          </InputWrapper>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProductDescription;
