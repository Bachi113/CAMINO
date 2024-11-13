'use server';

import { supabaseAdmin } from '@/utils/supabase/admin';
import { supabaseServerClient } from '@/utils/supabase/server';
import { setUserRoleCookie } from '@/utils/user-role';
import { headers } from 'next/headers';

export async function signInWithMagicLink(email: string, user: 'customer' | 'merchant' | 'admin') {
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
      throw error.message;
    }
  } catch (error) {
    return `${error}`;
  }
}

export async function verifyPhoneOtp(phone: string, otp: string) {
  const supabase = supabaseServerClient();

  try {
    const { data, error: authError } = await supabase.auth.verifyOtp({ phone, token: otp, type: 'sms' });
    if (authError) {
      throw authError.message;
    }

    const userPhone = data.user?.phone;
    const { data: customer } = await supabaseAdmin
      .from('customers')
      .select('id, user_id, phone')
      .eq('phone', userPhone!)
      .single();

    let error;
    const userId = data.user?.id;
    if (customer === null) {
      const { error: insertError } = await supabaseAdmin.from('customers').insert({
        phone: userPhone!,
        user_id: userId,
      });
      error = insertError;
    } else if (customer.user_id === null) {
      const { error: updateError } = await supabaseAdmin
        .from('customers')
        .update({ user_id: userId })
        .eq('phone', userPhone!);
      error = updateError;
    } else if (customer.phone === null) {
      const { error: updateError } = await supabaseAdmin
        .from('customers')
        .update({ phone: userPhone! })
        .eq('user_id', userId!);
      error = updateError;
    }

    if (error) {
      throw error.message;
    }

    await setUserRoleCookie('customer');
  } catch (error) {
    return `${error}`;
  }
}
