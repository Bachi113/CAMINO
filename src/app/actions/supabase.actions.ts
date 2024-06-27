'use server';

import { supabaseAdmin } from '@/utils/supabase/admin';
import { supabaseServerClient } from '@/utils/supabase/server';

export const getUser = async () => {
  const supabase = supabaseServerClient();
  const { data: user } = await supabase.auth.getUser();

  return user;
};

export const getMerchant = async () => {
  const supabase = supabaseServerClient();
  const { data: merchant } = await supabase.from('personal_informations').select('*').single();

  return merchant;
};

export async function getOrdersByMerchant(page: number, pageSize: number) {
  const merchant = await getMerchant();

  if (merchant == null) {
    throw 'Merchant not found';
  }

  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*, products (product_name), customers (customer_name)')
    .eq('user_id', merchant.user_id)
    .order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (error) {
    console.log(error);
  }

  return data;
}
