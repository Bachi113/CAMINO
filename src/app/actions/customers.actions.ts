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

    const { data } = await supabaseAdmin
      .from('customers')
      .select('id, stripe_id')
      .eq('email', formData.email)
      .single();
    if (data && data.stripe_id) {
      return { merchant: user.id, id: data.id };
    }

    const customer = await createCustomer(formData);
    if (customer.error) {
      throw customer.error;
    }

    const customerData = {
      customer_name: formData.name,
      phone: formData.phone,
      address: formData.address,
      stripe_id: customer.id,
      email: formData.email,
    };

    let result;
    if (data && !data.stripe_id) {
      const response = await supabaseAdmin
        .from('customers')
        .update(customerData)
        .eq('email', formData.email)
        .select('id')
        .single();
      result = response;
    } else {
      const response = await supabaseAdmin.from('customers').insert(customerData).select('id').single();
      result = response;
    }

    const { data: newCustomer, error } = result;
    if (error) {
      throw error.message;
    }

    return { merchant: user.id, id: newCustomer.id };
  } catch (error) {
    console.error(error);
    return { error };
  }
}
