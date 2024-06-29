import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { TypeProductDetails } from '@/types/types';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';

interface ProductDescriptionProps {
  handleSheetOpen: () => void;
  data: TypeProductDetails;
}

const ProductDescription = ({ handleSheetOpen, data }: ProductDescriptionProps) => {
  return (
    <Sheet open={true} onOpenChange={handleSheetOpen}>
      <SheetContent>
        <SheetHeader className='text-sm font-medium text-secondary'>
          <div className='space-y-1 mb-6'>
            <SheetTitle className='text-secondary'>Product Details</SheetTitle>
            <p className='font-normal text-base'>
              Product ID: <span className='font-bold'>{data.id}</span>
            </p>
          </div>

          <div className='space-y-4'>
            <div className='flex items-center gap-4'>
              <div className='w-full'>
                <p>Product name</p>
                <p className='bg-zinc-100 text-gray-500 px-4 py-2.5 mt-1 rounded-lg border'>
                  {data.product_name}
                </p>
              </div>
              <div className='w-full'>
                <p>Product Added on</p>
                <p className='bg-zinc-100 text-gray-500 px-4 py-2.5 mt-1 rounded-lg border'>
                  {format(new Date(data.created_at), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>

            <div>
              <p>Category</p>
              <div className='flex mt-1 justify-between items-center  text-secondary px-4 py-2.5 rounded-lg border'>
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
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default ProductDescription;
