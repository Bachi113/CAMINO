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
import { LuLoader } from 'react-icons/lu';

interface ModalSubmitConfirmationProps {
  onBoardingId?: string;
}
const ModalSubmitConfirmation = ({ onBoardingId }: ModalSubmitConfirmationProps) => {
  const [submitConfirmation, setSubmitConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    const supabase = supabaseBrowserClient();

    setIsLoading(true);
    try {
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='w-full' size='lg'>
          Submit Form
        </Button>
      </DialogTrigger>
      <DialogContent className='gap-6'>
        {submitConfirmation && (
          <FaCheck className='rounded-full size-12 mx-auto text-white p-2 bg-green-500' />
        )}

        <DialogHeader className='space-y-3'>
          <DialogTitle className='text-center'>Confirm Submission</DialogTitle>
          <DialogDescription className='text-center'>
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
              <Link href='/dashboard'>
                <Button className='w-full'>Go to Dashboard</Button>
              </Link>
            </div>
          ) : (
            <Button disabled={isLoading} onClick={handleSubmit} className='w-full'>
              {isLoading ? (
                <LuLoader className='animate-[spin_2s_linear_infinite]' size={16} />
              ) : (
                'Submit and Continue'
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalSubmitConfirmation;
