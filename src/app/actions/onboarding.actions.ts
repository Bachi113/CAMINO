'use server';

import { supabaseServerClient } from '@/utils/supabase/server';
import { getUser } from './supabase.actions';
import config from '@/config';

const bucketName = config.supabaseStorageBucket;

export async function getDocumentUrl(key: string) {
  try {
    const supabase = await supabaseServerClient();

    // Get the public URL of the uploaded document file.
    const { data } = await supabase.storage.from(bucketName).getPublicUrl(key);

    if (!data) {
      throw 'Url not found';
    }

    return data.publicUrl;
  } catch (error: any) {
    console.error('Error getting document URL:', error);
    return error;
  }
}

type TableName =
  | 'personal_informations'
  | 'business_details'
  | 'business_addresses'
  | 'bank_details'
  | 'business_addresses'
  | 'documents';

export async function saveData(data: string, tableName: TableName) {
  try {
    const supabase = await supabaseServerClient();
    const dataToSave = JSON.parse(data);

    const user = await getUser();
    if (!user) {
      throw 'You need to be logged in.';
    }

    const { data: insert_data, error } = await supabase
      .from(tableName)
      .insert({
        ...dataToSave,
        user_id: user.id,
      })
      .select('id')
      .single();

    if (error) {
      throw error.message;
    }

    const { error: onboardingError } = await supabase
      .from('onboarding')
      .update({ [tableName]: insert_data.id })
      .eq('user_id', user.id);

    if (onboardingError) {
      throw onboardingError.message;
    }
  } catch (error: any) {
    console.error('Error saving data:', error);
    return { error };
  }
}

export async function updateData(data: any, tableName: TableName) {
  try {
    const supabase = await supabaseServerClient();

    const { id, ...restData } = data;
    const { error } = await supabase.from(tableName).update(restData).eq('id', id);

    if (error) {
      throw error.message;
    }
  } catch (error: any) {
    console.error('Error saving data:', error);
    return { error };
  }
}
