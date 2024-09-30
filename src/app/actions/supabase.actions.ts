'use server';

import { supabaseAdmin } from '@/utils/supabase/admin';
import { supabaseServerClient } from '@/utils/supabase/server';
import { getUserRoleFromCookie } from '@/utils/user-role';

export const updateOrderForPeriodAndInterval = async (
  id: string,
  { period, interval }: { period: number; interval: string }
) => {
  const { error } = await supabaseAdmin.from('orders').update({ period, interval }).eq('id', id);
  console.error(error);

  return error?.message;
};

export const getUser = async () => {
  const supabase = supabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    // console.error('User not found:', error.message);
    return null;
  }

  return data.user;
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

export async function getOrders() {
  const userType = await getUserRoleFromCookie();

  let query = supabaseAdmin
    .from('orders')
    .select('*, products (product_name), customers (customer_name, email, phone)')
    .order('created_at', { ascending: false });

  if (userType == 'merchant') {
    const merchant = await getMerchant();
    const merchantId = merchant?.user_id;
    query = query.eq('user_id', merchantId!);
  } else if (userType == 'customer') {
    const customer = await getCustomer();
    const customerId = customer?.stripe_id;
    query = query.eq('stripe_cus_id', customerId!);
  }

  const { data, error } = await query;
  if (error) {
    return { error };
  }

  return { data };
}

export async function getTransactions() {
  const userType = await getUserRoleFromCookie();

  let query = supabaseAdmin.from('transactions').select().order('created_at', { ascending: false });

  if (userType == 'merchant') {
    const merchant = await getMerchant();
    const merchantId = merchant?.user_id;
    query = query.eq('merchant_id', merchantId!);
  } else if (userType == 'customer') {
    const customer = await getCustomer();
    const customerId = customer?.id;
    query = query.eq('customer_id', customerId!);
  }

  const { data, error } = await query;
  if (error) {
    return { error };
  }

  return { data };
}

export async function getTransactionsByOrderId(orderId: string) {
  const { data, error } = await supabaseAdmin
    .from('transactions')
    .select()
    .order('created_at', { ascending: false })
    .eq('order_id', orderId);

  if (error) {
    console.error(error);
    return { error };
  }

  return { data };
}

export async function getAllCustomers() {
  const { data, error } = await supabaseAdmin
    .from('merchants_customers')
    .select('*, customers (customer_name, email, phone, address)');

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getAllMerchants() {
  const { data, error } = await supabaseAdmin
    .from('onboarding')
    .select(
      `id, onboarded_at,
    personal_informations (id, first_name, last_name),
    business_addresses (city, street_address, postal_code, country),
    bank_details (account_number, swift_code, iban_code)
  `
    )
    .not('onboarded_at', 'is', null)
    .order('onboarded_at', { ascending: false });

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
