import React, { useState } from 'react';
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
import { FaCheck } from 'react-icons/fa6';
import Link from 'next/link';
import { errorToast } from '@/utils/utils';
import { supabaseBrowserClient } from '@/utils/supabase/client';

interface ModalSubmitConfirmationProps {
  onBoardingId?: string;
}
const ModalSubmitConfirmation = ({ onBoardingId }: ModalSubmitConfirmationProps) => {
  const [submitConfirmation, setSubmitConfirmation] = useState(false);

  const handleSubmit = async () => {
    try {
      const supabase = supabaseBrowserClient();

      if (!onBoardingId) {
        throw new Error('You need to be logged in.');
      }

      const { error } = await supabase
        .from('onboarding')
        .update({ onboarded_at: new Date().toISOString() })
        .eq('id', onBoardingId);

      if (error) {
        throw new Error(error.message);
      }

      setSubmitConfirmation(true);
    } catch (error: any) {
      errorToast(error.message);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='w-full'>Submit Form</Button>
      </DialogTrigger>
      <DialogContent>
        {submitConfirmation && (
          <div>
            <FaCheck className='rounded-full size-12 text-white p-2 bg-green-500' />
          </div>
        )}
        <DialogHeader>
          <DialogTitle>Confirm Submission</DialogTitle>
          <DialogDescription>
            Please confirm that all details are correct before submitting.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className='flex gap-4 w-full'>
            <DialogClose asChild>
              <Button variant='outline' className='w-full'>
                Back
              </Button>
            </DialogClose>
            {submitConfirmation ? (
              <div className='w-full'>
                <Link href='/'>
                  <Button className='w-full'>Take me to home</Button>
                </Link>
              </div>
            ) : (
              <Button onClick={handleSubmit} className='w-full'>
                Submit and Continue
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalSubmitConfirmation;
