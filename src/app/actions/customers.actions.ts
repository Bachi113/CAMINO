'use server';

import { TypeCreateCustomer } from '@/types/types';
import { getUser } from '@/utils/get-user';
import { createCustomer } from './stripe.actions';
import { supabaseAdmin } from '@/utils/supabase/admin';

export async function addNewCustomer(formData: TypeCreateCustomer) {
  try {
    const user = await getUser();
    if (!user) {
      throw 'You need to be logged in.';
    }

    const { data } = await supabaseAdmin.from('customers').select('id').eq('email', formData.email).single();
    if (data != null) {
      return { merchant: user.id, id: data.id };
    }

    const customer = await createCustomer(formData);
    if (customer.error) {
      throw customer.error;
    }

    const { data: newCustomer, error } = await supabaseAdmin
      .from('customers')
      .insert({
        customer_name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        stripe_id: customer.id,
      })
      .select('id')
      .single();
    if (error) {
      throw `[Customer] ${error.message}`;
    }

    return { merchant: user.id, id: newCustomer.id };
  } catch (error) {
    console.error(error);
    return { error };
  }
}
