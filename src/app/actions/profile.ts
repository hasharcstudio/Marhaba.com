"use server";

import { createClient } from "@/utils/supabase/server";

export interface FullProfile {
  id: string;
  name: string;
  avatar_url: string | null;
  location: string | null;
  profession: string | null;
  prompt_question: string;
  prompt_answer: string | null;
  bio: string | null;
  birthdate: string | null;
  gender: string | null;
  is_blur_default: boolean;
}

/**
 * Get current user profile
 */
export async function getCurrentProfile() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { profile: null, error: "Not authenticated" };
  }

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError) {
    return { profile: null, preferences: null, error: profileError.message };
  }

  const { data: prefData } = await supabase
    .from("preferences")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return { profile: profileData, preferences: prefData, error: null };
}

/**
 * Update current user profile
 */
export async function updateProfile(updates: Record<string, unknown>) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

/**
 * Get or create user preferences
 */
export async function getPreferences() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { preferences: null, error: "Not authenticated" };
  }

  const { data, error } = await supabase
    .from("preferences")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error && error.code === "PGRST116") {
    // No preferences found, create defaults
    const { data: newPrefs, error: insertError } = await supabase
      .from("preferences")
      .insert({ user_id: user.id })
      .select()
      .single();

    if (insertError) {
      return { preferences: null, error: insertError.message };
    }

    return { preferences: newPrefs, error: null };
  }

  if (error) {
    return { preferences: null, error: error.message };
  }

  return { preferences: data, error: null };
}

/**
 * Update user preferences
 */
export async function updatePreferences(updates: Record<string, unknown>) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("preferences")
    .update(updates)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

/**
 * Complete onboarding — set is_onboarded to true
 */
export async function completeOnboarding(profileData: Record<string, unknown>) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      ...profileData,
      is_onboarded: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

/**
 * Report a user
 */
export async function reportUser(
  reportedId: string,
  reason: string,
  details?: string
) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "Not authenticated" };
  }

  const { error } = await supabase.from("reports").insert({
    reporter_id: user.id,
    reported_id: reportedId,
    reason,
    details: details ?? null,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

/**
 * Block a user
 */
export async function blockUser(blockedId: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "Not authenticated" };
  }

  const { error } = await supabase.from("blocked_users").insert({
    blocker_id: user.id,
    blocked_id: blockedId,
  });

  if (error) {
    if (error.code === "23505") {
      return { success: true, error: null }; // Already blocked
    }
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}
