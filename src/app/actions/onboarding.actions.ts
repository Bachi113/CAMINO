'use server';

import { getUser } from '@/utils/get-user';
import { supabaseServerClient } from '@/utils/supabase/server';

const bucketName = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET_NAME!;

export async function uploadDocuments(files: FormData[]) {
  try {
    const supabase = await supabaseServerClient();

    const user = await getUser();
    if (!user) {
      throw 'Please login to get started.';
    }

    const uploadPromises = files.map((fileData, index) => {
      if (typeof fileData === 'string') {
        return fileData;
      }

      const file = fileData.get(`document${index + 1}`) as File;
      if (!file) {
        throw new Error(`Document ${index + 1} does not exist.`);
      }
      const key = `${user.id}-${file.name}`;
      return supabase.storage.from(bucketName).upload(key, file, { upsert: true });
    });

    const results = await Promise.all(uploadPromises);
    const errors = results.filter((result) => result.error);

    if (errors.length > 0) {
      throw new Error(errors.map((error) => error.error?.message).join(', '));
    }

    return { urls: results.map((result) => result.data?.path ?? result) };
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return { error };
  }
}

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

export async function updateData(
  data: { id: string; first_name: string; last_name: string },
  tableName: TableName
) {
  try {
    const supabase = await supabaseServerClient();

    const { error } = await supabase
      .from(tableName)
      .update({
        first_name: data.first_name,
        last_name: data.last_name,
      })
      .eq('id', data.id);

    if (error) {
      throw error.message;
    }
  } catch (error: any) {
    console.error('Error saving data:', error);
    return { error };
  }
}
