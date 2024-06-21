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
      <SheetContent className='w-[500px]'>
        <SheetHeader className='space-y-5 text-sm font-medium text-slate-800'>
          <SheetTitle className='text-lg font-semibold -mb-5'>Product Details</SheetTitle>
          <p className='font-normal'>
            Product ID: <span className='font-bold mt-1'>{data.id}</span>{' '}
          </p>
          <div className='flex items-center gap-4 my-5'>
            <div className='w-full'>
              <p>Product name</p>
              <p className='bg-gray-100 text-slate-500 px-2.5 py-4 mt-1 rounded-lg border'>
                {data.product_name}
              </p>
            </div>
            <div className='w-full'>
              <p>Product Added on</p>
              <p className='bg-gray-100 text-slate-500 px-2.5 py-4 mt-1 rounded-lg border'>
                {format(new Date(data.created_at), 'MMM dd, yyyy')}
              </p>
            </div>
          </div>

          <div>
            <p>Category</p>
            <div className='flex mt-1 justify-between items-center  text-slate-500 px-2.5 py-4 rounded-lg border'>
              <p className=''>{data.category}</p>
              <ChevronDownIcon />
            </div>
          </div>
          <div>
            <p>Product Remarks</p>
            <div className='h-36 mt-1 border rounded-lg p-2.5'>
              <p className='text-slate-500'>{data.remarks}</p>
            </div>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default ProductDescription;
