import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';

interface ProductDescriptionProps {
  setIsOpen: (isOpen: boolean) => void;
  data: any;
}

const ProductDescription = ({ setIsOpen, data }: ProductDescriptionProps) => {
  return (
    <Sheet open={true} onOpenChange={setIsOpen}>
      <SheetContent>
        <SheetHeader className='space-y-5 text-sm font-medium text-[#363A4E]'>
          <SheetTitle className='text-lg font-semibold -mb-5 text-[#363A4E]'>Product Details</SheetTitle>
          <p className='font-normal'>
            Product ID: <span className='font-bold mt-1'>{data.id}</span>{' '}
          </p>
          <div className='flex items-center gap-4 my-5'>
            <div className='w-full'>
              <p>Product name</p>
              <p className='bg-[#F4F4F4] text-[#6B7280] px-4 py-2.5 mt-1 rounded-lg border'>
                {data.product_name}
              </p>
            </div>
            <div className='w-full'>
              <p>Product Added on</p>
              <p className='bg-[#F4F4F4] text-[#6B7280] px-4 py-2.5 mt-1 rounded-lg border'>
                {format(new Date(data.created_at), 'MMM dd, yyyy')}
              </p>
            </div>
          </div>

          <div>
            <p>Category</p>
            <div className='flex mt-1 justify-between items-center  text-[#363A4E] px-4 py-2.5 rounded-lg border'>
              <p className=''>{data.category}</p>
              <ChevronDownIcon />
            </div>
          </div>
          <div>
            <p>Product Remarks</p>
            <div className='h-36 mt-1 border rounded-lg p-2.5'>
              <p className='text-[#A3A3A3]'>{data.remarks}</p>
            </div>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default ProductDescription;
