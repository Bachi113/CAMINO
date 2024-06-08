// TODO convert this to server component

import { getUser } from '@/utils/get-user';
import { supabaseBrowserClient } from '@/utils/supabase/client';

const bucketName = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET_NAME!;

export async function uploadDocument(document: File) {
  const supabase = supabaseBrowserClient();

  try {
    if (document == null) {
      throw 'document does not exist.';
    }

    const user = await getUser();
    if (user == null) {
      throw 'Please login to get started.';
    }

    // Create a unique key for the document file.
    const key = `${Date.now()}-${document.name}`;

    // Upload the document file to the Supabase storage bucket.
    const { error } = await supabase.storage.from(bucketName).upload(key, document);

    if (error) {
      throw error.message;
    }

    // Get the public URL of the uploaded document file.
    const { data } = await supabase.storage.from(bucketName).getPublicUrl(key);
    return data?.publicUrl as string;
  } catch (error) {
    console.error('Error uploading file:', error);
    return `${error}`;
  }
}
