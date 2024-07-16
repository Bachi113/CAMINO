import { supabaseAdmin } from '@/utils/supabase/admin';
import { supabaseServerClient } from '@/utils/supabase/server';
import { setUserRoleCookie } from '@/utils/user-role';
import { EmailOtpType } from '@supabase/supabase-js';

export async function handleMerchantLogin(token_hash: string | null, code: string | null) {
  const supabase = supabaseServerClient();

  let error = null;
  if (token_hash) {
    // Handle Magic Link verification
    const { error: magicLinkError } = await supabase.auth.verifyOtp({
      token_hash,
      type: 'email' as EmailOtpType,
    });
    error = magicLinkError;
  } else if (code) {
    // Handle OAuth code exchange for session
    const { error: codeError } = await supabase.auth.exchangeCodeForSession(code);
    error = codeError;
  }

  if (error) {
    throw error.message;
  }

  await setUserRoleCookie('merchant');
}

export async function handleCustomerLogin(token_hash: string | null) {
  const supabase = supabaseServerClient();

  if (token_hash === null) {
    throw new Error('Invalid magic link');
  }

  const { data, error: authError } = await supabase.auth.verifyOtp({ token_hash, type: 'email' });
  if (authError) {
    throw authError.message;
  }

  const userEmail = data.user?.email;
  const { data: customer } = await supabaseAdmin
    .from('customers')
    .select('id, user_id, email')
    .eq('email', userEmail!)
    .single();

  let error;
  const userId = data.user?.id;
  if (customer === null) {
    const { error: insertError } = await supabaseAdmin.from('customers').insert({
      email: userEmail!,
      user_id: userId,
    });
    error = insertError;
  } else if (customer.user_id === null) {
    const { error: updateError } = await supabaseAdmin
      .from('customers')
      .update({ user_id: userId })
      .eq('email', userEmail!);
    error = updateError;
  } else if (customer.email === null) {
    const { error: updateError } = await supabaseAdmin
      .from('customers')
      .update({ email: userEmail! })
      .eq('user_id', userId!);
    error = updateError;
  }

  if (error) {
    throw error.message;
  }

  await setUserRoleCookie('customer');
}

export async function handleAdminLogin(token_hash: string | null) {
  const supabase = supabaseServerClient();

  if (token_hash === null) {
    throw new Error('Invalid magic link');
  }

  // Handle Magic Link verification
  const { data, error: authError } = await supabase.auth.verifyOtp({
    token_hash,
    type: 'email' as EmailOtpType,
  });
  if (authError) {
    throw authError.message;
  }

  const userEmail = data.user?.email;
  const { data: admin } = await supabaseAdmin.from('admins').select('id').eq('email', userEmail!).single();

  if (admin == null) {
    const userId = data.user?.id;
    const { error: insertError } = await supabaseAdmin
      .from('admins')
      .insert({ user_id: userId!, email: userEmail! });
    if (insertError) {
      throw insertError.message;
    }
  }

  await setUserRoleCookie('admin');
}
