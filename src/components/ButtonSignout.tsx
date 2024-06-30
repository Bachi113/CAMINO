// This snippet demonstrates the use of a ButtonSignout component to sign out a user from the application.
// You can use the ButtonSignout component to create sign-out buttons anywhere in your application.

'use client';
import { FC } from 'react';
import { supabaseBrowserClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { TbLogout2 } from 'react-icons/tb';
import { Button } from '@/components/ui/button';

interface ButtonSignoutProps {
  className?: string;
}
const ButtonSignout: FC<ButtonSignoutProps> = () => {
  const supabase = supabaseBrowserClient();
  const router = useRouter();

  return (
    <Button
      variant='outline'
      onClick={async () => {
        await supabase.auth.signOut();
        router.refresh();
      }}
      className='gap-4'>
      <TbLogout2 size={16} /> Sign out
    </Button>
  );
};
export default ButtonSignout;
