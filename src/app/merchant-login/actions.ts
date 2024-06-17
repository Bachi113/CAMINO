'use server';

import { supabaseServerClient } from '@/utils/supabase/server';

export async function signInWithEmail(email: string) {
  const supabase = supabaseServerClient();

  try {
    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: 'http://localhost:3000/auth/confirm',
      },
    });

    if (error) {
      throw error;
    }
    return true;
  } catch (error) {
    return `${error}`;
  }
}
