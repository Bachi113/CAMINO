'use server';

import { getUser } from '@/utils/get-user';
import { supabaseServerClient } from '@/utils/supabase/server';

const bucketName = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET_NAME!;

export async function uploadDocument(files: FormData) {
  try {
    const supabase = await supabaseServerClient();

    // Iterate through all files in FormData
    const fileEntries = files.entries();
    const fileEntry = fileEntries.next();
    const file = fileEntry.value[1] as File;

    if (!file) {
      throw new Error('Document does not exist.');
    }

    const user = await getUser();
    if (!user) {
      throw new Error('Please login to get started.');
    }

    const key = `${user.id}-${file.name}`;

    // Upload the document file to the Supabase storage bucket.
    const { data, error } = await supabase.storage.from(bucketName).upload(key, file, {
      upsert: true,
    });

    if (error) {
      throw new Error(error.message);
    }

    return { path: data.path };
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return `Error: ${error.message}`;
  }
}

export async function getDocumentUrl(key: string) {
  try {
    const supabase = await supabaseServerClient();

    // Get the public URL of the uploaded document file.
    const { data } = await supabase.storage.from(bucketName).getPublicUrl(key);

    return data.publicUrl;
  } catch (error: any) {
    console.error('Error getting document URL:', error);
    return `Error: ${error.message}`;
  }
}

type TableName =
  | 'personal_informations'
  | 'business_details'
  | 'business_addresses'
  | 'business_informations'
  | 'bank_details'
  | 'business_addresses'
  | 'documents';

export async function saveData(data: string, tableName: TableName) {
  try {
    const supabase = await supabaseServerClient();
    const dataToSave = JSON.parse(data);
    const user = await getUser();

    if (!user) {
      throw new Error('You need to be logged in.');
    }

    const { data: insert_data, error } = await supabase
      .from(tableName)
      .insert({
        ...dataToSave,
        user_id: user.id,
      })
      .select('id')
      .single();

    if (error) throw error;

    const onboardingData = {
      user_id: user.id,
      [tableName]: insert_data.id,
    };

    let onboardingError;

    if (tableName === 'personal_informations') {
      ({ error: onboardingError } = await supabase.from('onboarding').insert(onboardingData));
    } else {
      ({ error: onboardingError } = await supabase
        .from('onboarding')
        .update(onboardingData)
        .eq('user_id', user.id)); // Add the WHERE clause
    }

    if (onboardingError) throw onboardingError;
    return null; // Indicate success
  } catch (error: any) {
    console.error('Error saving data:', error);
    return { error: error.message || 'An error occurred while saving data.' };
  }
}

export async function updateData(data: string, tableName: TableName) {
  try {
    const supabase = await supabaseServerClient();
    const dataToUpdate = JSON.parse(data);
    const user = await getUser();

    if (!user) {
      throw new Error('You need to be logged in.');
    }

    const { error } = await supabase
      .from(tableName)
      .update({
        ...dataToUpdate,
      })
      .eq('user_id', user.id);

    if (error) throw new Error(error.message);

    return null; // Indicate success
  } catch (error: any) {
    console.error('Error saving data:', error);
    return { error: error.message || 'An error occurred while saving data.' };
  }
}
