"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { fetchMessages, sendMessage, markMessagesAsRead, ChatMessage } from "@/app/actions/chat";
import { createClient } from "@/utils/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { getMatchedUserInfo } from "@/app/actions/discovery";
import { getCurrentProfile } from "@/app/actions/profile";

export default function ChatConversationPage({ params }: { params: { matchId: string } }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [partner, setPartner] = useState<{ name: string; avatar_url: string | null } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize and load
  useEffect(() => {
    let subscription: RealtimeChannel | null = null;
    const supabase = createClient();

    async function initialize() {
      // Get current user
      const { profile } = await getCurrentProfile();
      if (!profile) return;
      setCurrentUserId(profile.id);

      // Load initial messages
      const { messages: initialMsgs } = await fetchMessages(params.matchId);
      setMessages(initialMsgs);
      setLoading(false);
      markMessagesAsRead(params.matchId);

      let partnerFound = false;

      // Find partner ID to get their profile
      if (initialMsgs.length > 0) {
        const pId = initialMsgs[0].sender_id === profile.id 
          ? null // we'd need another query if the first msg is ours and we want their info, but typically matches table holds this
          : initialMsgs[0].sender_id;
        
        if (pId) {
          const info = await getMatchedUserInfo(pId);
          setPartner(info);
          partnerFound = !!info;
        }
      }

      // If we couldn't get partner from messages, we can query the match directly 
      // (a robust implementation would query the matches table first)
      if (!partnerFound) {
        const { data: matchData } = await supabase
          .from('matches')
          .select('user_a_id, user_b_id')
          .eq('id', params.matchId)
          .single();
          
        if (matchData) {
          const partnerId = matchData.user_a_id === profile.id ? matchData.user_b_id : matchData.user_a_id;
          const info = await getMatchedUserInfo(partnerId);
          setPartner(info);
        }
      }

      // Setup real-time subscription
      subscription = supabase
        .channel(`match_${params.matchId}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'messages', filter: `match_id=eq.${params.matchId}` },
          (payload) => {
            const newMsg = payload.new as ChatMessage;
            setMessages((prev) => [...prev, newMsg]);
            
            // If message is from partner, mark it read
            if (newMsg.sender_id !== profile.id) {
              markMessagesAsRead(params.matchId);
            }
          }
        )
        .subscribe();
    }

    initialize();

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [params.matchId]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !currentUserId) return;
    
    const text = input;
    setInput("");

    // Optimistic UI update
    const tempId = `temp-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        content: text,
        sender_id: currentUserId,
        created_at: new Date().toISOString(),
        read_at: null
      }
    ]);

    await sendMessage(params.matchId, text);
    // The real-time subscription will push the real message down. 
    // We can filter out temp messages or just rely on the subscription alone.
    // For simplicity, letting real-time just append is ok if we manage deduping,
    // but usually we don't optimistic append if real-time is fast enough. 
    // I'll remove the optimistic message once real one arrives or just don't do it.
    // Actually, let's remove optimistic append to avoid duplicates for now.
    setMessages((prev) => prev.filter(m => m.id !== tempId));
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <main className="relative w-full h-[100dvh] flex flex-col bg-background">
      {/* Header */}
      <header className="px-4 py-4 flex items-center gap-4 border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-30">
        <Link href="/chat" className="p-2 -ml-2 rounded-full hover:bg-foreground/5 transition-colors">
          <ArrowLeft size={20} className="text-foreground" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center relative overflow-hidden p-0.5">
            {partner?.avatar_url ? (
               <img src={partner.avatar_url} className="w-full h-full rounded-full object-cover" alt={partner.name} />
            ) : (
              <span className="text-white font-bold text-lg">{partner?.name?.charAt(0) || "?"}</span>
            )}
          </div>
          <div>
            <h2 className="font-semibold text-foreground leading-none mb-1">{partner?.name || "Loading..."}</h2>
            <p className="text-xs text-muted-foreground">Match</p>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            Send a message to start chatting!
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === currentUserId;
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div 
                  className={`px-4 py-2.5 max-w-[75%] shadow-sm ${
                    isMe 
                      ? 'bg-glassy-primary rounded-2xl rounded-br-sm' 
                      : 'bg-glassy-secondary rounded-2xl rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
                <span className="text-[10px] text-muted-foreground mt-1 px-1">
                  {formatTime(msg.created_at)} {isMe && (msg.read_at ? "• Read" : "• Sent")}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border/40 bg-background mt-auto">
        <div className="flex items-center gap-3">
          <input 
            type="text" 
            placeholder="Type a message..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-foreground/5 border border-border/50 rounded-full px-5 py-3.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary flex items-center justify-center text-primary-foreground transition-colors shadow-lg shadow-primary/20 shrink-0"
          >
            <Send size={18} className="ml-1" />
          </button>
        </div>
      </div>
    </main>
  );
}
