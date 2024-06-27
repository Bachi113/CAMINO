'use server';

import { supabaseAdmin } from '@/utils/supabase/admin';

export const deleteUser = async (userId?: string) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) {
      throw new Error(error.message);
    }
  } catch (error: any) {
    return `${error.message} | Something went wrong. Please try again.`;
  }
};
