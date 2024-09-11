// This component is a custom button that handles form submission states.
// It displays a loading indicator when the form is being processed.

'use client';

import { useFormStatus } from 'react-dom';
import { ReactNode, type ComponentProps } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { LuLoader } from 'react-icons/lu';

type Props = ComponentProps<'button'> &
  ButtonProps & {
    isCircleLoader?: ReactNode;
    isLoading?: boolean;
  };

export function SubmitButton({ children, isLoading, ...props }: Props) {
  const { pending, action } = useFormStatus();

  // Checks if the form is pending and the action matches the form action
  const isPending = isLoading || (pending && action === props.formAction);

  return (
    <Button
      {...props}
      type='submit'
      size={props.size || 'xl'}
      aria-disabled={pending}
      disabled={isPending || props.disabled}>
      {isPending ? <LuLoader className='animate-[spin_2s_linear_infinite]' size={16} /> : children}
    </Button>
  );
}
