"use server";

import { createClient } from "@/utils/supabase/server";
import { calculateCompatibilityScore } from "@/utils/matching";

export interface DiscoveryProfile {
  id: string;
  name: string;
  age: number;
  profession: string;
  location: string;
  avatar_url: string | null;
  is_blur_default: boolean;
  prompt_question: string | null;
  prompt_answer: string | null;
  distance_km: number | null;
  compatibility_score: number;
  // For SwipeCard compatibility
  image: string;
  isBlurredByDefault: boolean;
  promptQuestion?: string | null;
  promptAnswer?: string | null;
}

/**
 * Fetch discovery feed profiles for the current user.
 * Uses the Supabase RPC `get_potential_matches` if available,
 * otherwise falls back to a direct query.
 */
export async function fetchDiscoveryFeed(): Promise<{
  profiles: DiscoveryProfile[];
  error: string | null;
}> {
  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { profiles: [], error: "Not authenticated" };
  }

  // Try using RPC first (the get_potential_matches function)
  const { data: rpcData, error: rpcError } = await supabase.rpc(
    "get_potential_matches",
    { p_user_id: user.id, p_limit: 20 }
  );

  if (!rpcError && rpcData && rpcData.length > 0) {
    // Get user preferences for scoring
    const { data: prefs } = await supabase
      .from("preferences")
      .select("*")
      .eq("user_id", user.id)
      .single();

    const profiles: DiscoveryProfile[] = rpcData.map(
      (p: Record<string, unknown>) => {
        const score = calculateCompatibilityScore(
          {
            age: p.age as number,
            gender: null,
            profession: p.profession as string | null,
            location: p.location as string | null,
            distance_km: p.distance_km as number | null,
            prompt_answer: p.prompt_answer as string | null,
          },
          {
            min_age: prefs?.min_age ?? 18,
            max_age: prefs?.max_age ?? 100,
            preferred_gender: prefs?.preferred_gender ?? null,
            preferred_location: prefs?.preferred_location ?? null,
            max_distance_km: prefs?.max_distance_km ?? 100,
          }
        );

        return {
          id: p.id as string,
          name: p.name as string,
          age: p.age as number,
          profession: (p.profession as string) ?? "Not specified",
          location: (p.location as string) ?? "Unknown",
          avatar_url: p.avatar_url as string | null,
          is_blur_default: (p.is_blur_default as boolean) ?? true,
          prompt_question: p.prompt_question as string | null,
          prompt_answer: p.prompt_answer as string | null,
          distance_km: p.distance_km as number | null,
          compatibility_score: score,
          // SwipeCard-compatible fields
          image:
            (p.avatar_url as string) ??
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600",
          isBlurredByDefault: (p.is_blur_default as boolean) ?? true,
          promptQuestion: p.prompt_question as string | null,
          promptAnswer: p.prompt_answer as string | null,
        };
      }
    );

    // Sort by compatibility score
    profiles.sort((a, b) => b.compatibility_score - a.compatibility_score);

    return { profiles, error: null };
  }

  // Fallback: direct query when RPC is not yet set up
  const { data: directData, error: directError } = await supabase
    .from("profiles")
    .select("*")
    .neq("id", user.id)
    .limit(20);

  if (directError) {
    // If profiles table doesn't exist yet, return empty
    return { profiles: [], error: null };
  }

  const profiles: DiscoveryProfile[] = (directData ?? []).map(
    (p: Record<string, unknown>) => ({
      id: p.id as string,
      name: (p.name as string) ?? "Unknown",
      age: p.birthdate
        ? Math.floor(
            (Date.now() - new Date(p.birthdate as string).getTime()) /
              (365.25 * 24 * 60 * 60 * 1000)
          )
        : 25,
      profession: (p.profession as string) ?? "Not specified",
      location: (p.location as string) ?? "Unknown",
      avatar_url: p.avatar_url as string | null,
      is_blur_default: (p.is_blur_default as boolean) ?? true,
      prompt_question: p.prompt_question as string | null,
      prompt_answer: p.prompt_answer as string | null,
      distance_km: null,
      compatibility_score: 50,
      image:
        (p.avatar_url as string) ??
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600",
      isBlurredByDefault: (p.is_blur_default as boolean) ?? true,
      promptQuestion: p.prompt_question as string | null,
      promptAnswer: p.prompt_answer as string | null,
    })
  );

  return { profiles, error: null };
}

/**
 * Submit a swipe action. If it's a mutual like, create a match.
 * Returns { matched: true, matchId } if a new match was created.
 */
export async function submitSwipe(
  swipedId: string,
  direction: "like" | "pass"
): Promise<{
  success: boolean;
  matched: boolean;
  matchId: string | null;
  error: string | null;
}> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, matched: false, matchId: null, error: "Not authenticated" };
  }

  // Record the swipe
  const { error: swipeError } = await supabase.from("swipes").insert({
    swiper_id: user.id,
    swiped_id: swipedId,
    direction,
  });

  if (swipeError) {
    // Could be a duplicate swipe — that's ok
    if (swipeError.code === "23505") {
      return { success: true, matched: false, matchId: null, error: null };
    }
    return { success: false, matched: false, matchId: null, error: swipeError.message };
  }

  // If it's a "like", check for mutual match
  if (direction === "like") {
    const { data: mutualSwipe } = await supabase
      .from("swipes")
      .select("id")
      .eq("swiper_id", swipedId)
      .eq("swiped_id", user.id)
      .eq("direction", "like")
      .single();

    if (mutualSwipe) {
      // It's a match! Create the match record.
      // Ensure consistent ordering (smaller UUID first)
      const userA = user.id < swipedId ? user.id : swipedId;
      const userB = user.id < swipedId ? swipedId : user.id;

      const { data: matchData, error: matchError } = await supabase
        .from("matches")
        .insert({ user_a_id: userA, user_b_id: userB })
        .select("id")
        .single();

      if (matchError) {
        // Match might already exist (duplicate)
        if (matchError.code === "23505") {
          return { success: true, matched: false, matchId: null, error: null };
        }
        return { success: true, matched: false, matchId: null, error: matchError.message };
      }

      return {
        success: true,
        matched: true,
        matchId: matchData?.id ?? null,
        error: null,
      };
    }
  }

  return { success: true, matched: false, matchId: null, error: null };
}

/**
 * Get the name/avatar of a matched user by their ID (for MatchModal)
 */
export async function getMatchedUserInfo(userId: string): Promise<{
  name: string;
  avatar_url: string | null;
} | null> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("profiles")
    .select("name, avatar_url")
    .eq("id", userId)
    .single();

  if (!data) return null;
  return { name: data.name, avatar_url: data.avatar_url };
}
