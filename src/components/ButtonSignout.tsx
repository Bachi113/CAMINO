// This snippet demonstrates the use of a ButtonSignout component to sign out a user from the application.
// You can use the ButtonSignout component to create sign-out buttons anywhere in your application.

'use client';

import { FC } from 'react';
import { supabaseBrowserClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { TbLogout2 } from 'react-icons/tb';
import { Button } from '@/components/ui/button';
import { removeUserRoleCookie } from '@/utils/user-role';

interface ButtonSignoutProps {
  className?: string;
}
const ButtonSignout: FC<ButtonSignoutProps> = () => {
  const supabase = supabaseBrowserClient();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    await removeUserRoleCookie();
    router.refresh();
  };

  return (
    <Button variant='outline' onClick={handleSignOut} className='gap-4'>
      <TbLogout2 size={16} /> Sign out
    </Button>
  );
};
export default ButtonSignout;
