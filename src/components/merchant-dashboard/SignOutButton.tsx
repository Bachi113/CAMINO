'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { TbLogout2 } from 'react-icons/tb';
import { supabaseBrowserClient } from '@/utils/supabase/client';
import { errorToast } from '@/utils/utils';

const SignOutButton = () => {
  const handleSignOut = async () => {
    const supabase = supabaseBrowserClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      return errorToast(error.message);
    }
  };
  return (
    <Button variant={'ghost'} className='gap-2 w-fit font-medium shadow-none border' onClick={handleSignOut}>
      <TbLogout2 /> Sign out
    </Button>
  );
};

export default SignOutButton;
