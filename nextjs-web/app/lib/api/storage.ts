"use client";

import { supabase } from "../supabase/client";

export async function uploadToBucket(
  bucket: string,
  file: File
): Promise<string> {
  const fileName = `${Date.now()}_${file.name}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file);

  if (error) throw error;

  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
}
