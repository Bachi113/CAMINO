import React from 'react';
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
import { Button } from '@/components/ui/button';

const ModalDeleteAccountRequest = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='destructive'>Delete Account</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className='mb-3'>
          <DialogTitle className='mb-3'>Delete Account?</DialogTitle>
          <DialogDescription>
            To delete your account, please drop us an email @{' '}
            <a href='mailto:support@camino.fi' className='text-primary'>
              support@camino.fi
            </a>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className='sm:space-x-4'>
          <DialogClose asChild>
            <Button variant='outline' className='w-full'>
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDeleteAccountRequest;
