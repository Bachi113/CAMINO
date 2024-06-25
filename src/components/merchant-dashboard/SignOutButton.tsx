'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { supabaseBrowserClient } from '@/utils/supabase/client';
import { errorToast } from '@/utils/utils';
import LogoutIcon from '@/assets/icons/LogoutIcon';

const SignOutButton = () => {
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
      className='gap-2 px-2.5 py-3 font-medium shadow-none border text-slate-700'
      onClick={handleSignOut}>
      <LogoutIcon /> Sign out
    </Button>
  );
};

export default SignOutButton;
