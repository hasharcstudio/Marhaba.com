"use client";

import { createClient } from "@/utils/supabase/client";

/**
 * Upload an image to the 'avatars' storage bucket and return its public URL
 */
export async function uploadAvatar(file: File): Promise<{ url: string | null; error: string | null }> {
  const supabase = createClient();
  
  // Get current user to use as path
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { url: null, error: "Not authenticated" };
  }

  // Create unique filename based on time
  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}/${Date.now()}.${fileExt}`;

  // Upload file
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) {
    return { url: null, error: uploadError.message };
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);

  return { url: publicUrl, error: null };
}
