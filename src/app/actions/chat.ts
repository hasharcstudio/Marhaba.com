"use server";

import { createClient } from "@/utils/supabase/server";

export interface ChatMatch {
  id: string;
  matchId: string;
  name: string;
  avatar_url: string | null;
  lastMessage: string | null;
  lastMessageTime: string | null;
  unreadCount: number;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  read_at: string | null;
}

/**
 * Fetch all matches with last message preview for the chat list
 */
export async function fetchChatList(): Promise<{
  matches: ChatMatch[];
  error: string | null;
}> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { matches: [], error: "Not authenticated" };
  }

  // Get all matches where user is involved
  const { data: matchesData, error: matchesError } = await supabase
    .from("matches")
    .select(`
      id,
      user_a_id,
      user_b_id,
      created_at
    `)
    .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
    .order("created_at", { ascending: false });

  if (matchesError || !matchesData) {
    return { matches: [], error: matchesError?.message ?? null };
  }

  // Enrich with partner profile and last message
  const chatMatches: ChatMatch[] = [];

  for (const match of matchesData) {
    const partnerId =
      match.user_a_id === user.id ? match.user_b_id : match.user_a_id;

    // Get partner profile
    const { data: partner } = await supabase
      .from("profiles")
      .select("name, avatar_url")
      .eq("id", partnerId)
      .single();

    // Get last message
    const { data: lastMsg } = await supabase
      .from("messages")
      .select("content, created_at")
      .eq("match_id", match.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    // Count unread messages
    const { count } = await supabase
      .from("messages")
      .select("id", { count: "exact", head: true })
      .eq("match_id", match.id)
      .neq("sender_id", user.id)
      .is("read_at", null);

    chatMatches.push({
      id: partnerId,
      matchId: match.id,
      name: partner?.name ?? "Unknown",
      avatar_url: partner?.avatar_url ?? null,
      lastMessage: lastMsg?.content ?? null,
      lastMessageTime: lastMsg?.created_at ?? match.created_at,
      unreadCount: count ?? 0,
    });
  }

  return { matches: chatMatches, error: null };
}

/**
 * Fetch messages for a specific match
 */
export async function fetchMessages(matchId: string): Promise<{
  messages: ChatMessage[];
  error: string | null;
}> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { messages: [], error: "Not authenticated" };
  }

  const { data, error } = await supabase
    .from("messages")
    .select("id, content, sender_id, created_at, read_at")
    .eq("match_id", matchId)
    .order("created_at", { ascending: true });

  if (error) {
    return { messages: [], error: error.message };
  }

  return { messages: data ?? [], error: null };
}

/**
 * Send a message in a match conversation
 */
export async function sendMessage(
  matchId: string,
  content: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "Not authenticated" };
  }

  const { error } = await supabase.from("messages").insert({
    match_id: matchId,
    sender_id: user.id,
    content,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

/**
 * Mark messages as read
 */
export async function markMessagesAsRead(
  matchId: string
): Promise<{ success: boolean }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false };

  await supabase
    .from("messages")
    .update({ read_at: new Date().toISOString() })
    .eq("match_id", matchId)
    .neq("sender_id", user.id)
    .is("read_at", null);

  return { success: true };
}
