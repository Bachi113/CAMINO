'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { supabaseBrowserClient } from '@/utils/supabase/client';
import { cn, errorToast } from '@/utils/utils';
import LogoutIcon from '@/assets/icons/LogoutIcon';

interface SignOutButtonProps {
  className?: string;
}
const SignOutButton = ({ className }: SignOutButtonProps) => {
  const handleSignOut = async () => {
    const supabase = supabaseBrowserClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      return errorToast(error.message);
    }
  };
  return (
    <Button
      variant={'ghost'}
      size={'lg'}
      className={cn(
        'gap-2 px-2.5 mr-10 font-medium shadow-none border text-secondary',
        className && className
      )}
      onClick={handleSignOut}>
      <LogoutIcon /> Sign out
    </Button>
  );
};

export default SignOutButton;
