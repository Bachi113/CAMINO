'use server';

import { supabaseAdmin } from '@/utils/supabase/admin';
import { supabaseServerClient } from '@/utils/supabase/server';

export const getUser = async () => {
  const supabase = supabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error('User not found:', error.message);
    return null;
  }

  return data.user;
};

export const getUserType = async () => {
  const merchant = await getMerchant();
  if (merchant) {
    return 'merchant';
  }

  const customer = await getCustomer();
  if (customer) {
    return 'customer';
  }
};

export const getCustomer = async () => {
  const supabase = supabaseServerClient();
  const { data: customer } = await supabase.from('customers').select().single();
  return customer;
};
export const getMerchant = async () => {
  const supabase = supabaseServerClient();
  const { data: merchant } = await supabase.from('personal_informations').select().single();
  return merchant;
};

export async function getOrdersByMerchant(page: number, pageSize: number, searchQuery?: string) {
  const merchant = await getMerchant();
  const customer = await getCustomer();

  if (!merchant && !customer) {
    return { error: 'User not found' };
  }

  let query = supabaseAdmin
    .from('orders')
    .select('*, products (product_name), customers (customer_name)')
    .order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (merchant) {
    query = query.eq('user_id', merchant.user_id);
  }
  if (customer) {
    query = query.eq('stripe_cus_id', customer.stripe_id!);
  }
  if (searchQuery) {
    query = query.ilike('products.product_name', `%${searchQuery}%`);
  }

  const { data, error } = await query;
  if (error) {
    return { error };
  }

  return { data };
}

export const deleteUser = async (userId?: string) => {
  try {
    if (!userId) {
      throw 'User ID is required to delete the account';
    }
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) {
      throw error.message;
    }
  } catch (error: any) {
    return { error };
  }
};
