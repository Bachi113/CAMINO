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
import { errorToast } from '@/utils/utils';
import { deleteUser } from '@/app/actions/supabase.actions';

interface ModalDeleteAccountProps {
  userId?: string;
}
const ModalDeleteAccount = ({ userId }: ModalDeleteAccountProps) => {
  const handleSubmit = async () => {
    const response = await deleteUser(userId);
    if (response?.error) {
      errorToast(response.error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='destructive'>Delete Account</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Account?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the Account? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className='sm:space-x-4'>
          <DialogClose asChild>
            <Button variant='outline' className='w-full'>
              Back
            </Button>
          </DialogClose>

          <Button onClick={handleSubmit} className='w-full bg-red-500 text-white'>
            Yes, Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDeleteAccount;
