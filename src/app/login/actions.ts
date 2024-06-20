'use server';

import { supabaseServerClient } from '@/utils/supabase/server';
import { headers } from 'next/headers';

export async function signInWithEmail(email: string) {
  const supabase = supabaseServerClient();

  try {
    const origin = headers().get('origin');

    // Magic Link
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${origin}/api/auth/callback`,
      },
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    return `${error}`;
  }
}
