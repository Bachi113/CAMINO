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
import { createProduct } from '@/app/actions/stripe.actions';

interface ModalSubmitConfirmationProps {
  onBoardingId?: string;
}
const ModalSubmitConfirmation = ({ onBoardingId }: ModalSubmitConfirmationProps) => {
  const [submitConfirmation, setSubmitConfirmation] = useState(false);

  const handleSubmit = async () => {
    try {
      const supabase = supabaseBrowserClient();

      if (!onBoardingId) {
        throw 'You need to be logged in.';
      }

      // Create merchant product in stripe
      const product = await createProduct();
      if (product.error) {
        throw `${product.error}`;
      }
      const { error } = await supabase
        .from('onboarding')
        .update({
          onboarded_at: new Date().toISOString(),
          stripe_product_id: product.id,
        })
        .eq('id', onBoardingId);
      if (error) {
        throw error.message;
      }

      setSubmitConfirmation(true);
    } catch (error: any) {
      errorToast(error.message);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='w-full' size='lg'>
          Submit Form
        </Button>
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

        <DialogFooter className='sm:space-x-4'>
          <DialogClose asChild>
            <Button variant='outline' className='w-full'>
              Back
            </Button>
          </DialogClose>
          {submitConfirmation ? (
            <div className='w-full'>
              <Link href='/dashboard/m'>
                <Button className='w-full'>Go to Dashboard</Button>
              </Link>
            </div>
          ) : (
            <Button onClick={handleSubmit} className='w-full'>
              {/* TODO: add loader */}
              Submit and Continue
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalSubmitConfirmation;
