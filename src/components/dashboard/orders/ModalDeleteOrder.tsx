import { FC, useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { MdOutlineDelete } from 'react-icons/md';
import { Button } from '@/components/ui/button';
import { queryClient } from '@/app/providers';
import { supabaseBrowserClient } from '@/utils/supabase/client';
import { errorToast } from '@/utils/utils';
import { toast } from '@/components/ui/use-toast';

interface ModalDeleteOrderProps {
  id: string;
  handleSheetOpen: () => void;
}

const ModalDeleteOrder: FC<ModalDeleteOrderProps> = ({ id, handleSheetOpen }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDeleteOrder = async () => {
    const supabase = supabaseBrowserClient();
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (error) {
      errorToast(error.message);
      return;
    }

    queryClient.invalidateQueries({ queryKey: ['getOrders'] });
    setIsOpen(false);
    handleSheetOpen();
    toast({ description: 'Order Deleted Successfully' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(value) => setIsOpen(value)}>
      <DialogTrigger asChild>
        <Button size='sm' variant='outline' className='gap-1 border-destructive text-destructive'>
          <MdOutlineDelete size={16} />
          <span>Delete</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className='mb-3'>
          <DialogTitle className='mb-3'>Delete Order</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this order?
            <br />
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className='sm:space-x-4'>
          <DialogClose asChild>
            <Button variant='outline' className='w-full'>
              Back
            </Button>
          </DialogClose>

          <Button onClick={handleDeleteOrder} className='w-full bg-red-500 text-white'>
            Yes, Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDeleteOrder;
