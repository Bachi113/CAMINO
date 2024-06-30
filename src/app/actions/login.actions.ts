'use server';

import { supabaseServerClient } from '@/utils/supabase/server';
import { headers } from 'next/headers';

export async function signInWithMagicLink(email: string, user: 'customer' | 'merchant') {
  const supabase = supabaseServerClient();

  try {
    const origin = headers().get('origin');
    const redirectUrl = `${origin}/api/auth/callback/${user}`;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    return `${error}`;
  }
}
