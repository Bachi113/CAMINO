'use server';

import { supabaseServerClient } from '@/utils/supabase/server';

export async function signInWithPhone(phone: string) {
  const supabase = supabaseServerClient();

  try {
    console.log(phone);

    const { error, data } = await supabase.auth.signInWithOtp({
      phone: phone,
    });

    console.log('OTP no', error, data);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    return `${error}`;
  }
}

export async function signInWithEmail(email: string) {
  const supabase = supabaseServerClient();

  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
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
