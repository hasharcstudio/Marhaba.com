"use client";

import Link from "next/link";
import Navigation from "@/components/Navigation";
import { Search, Heart, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchChatList, ChatMatch } from "@/app/actions/chat";

export default function ChatListPage() {
  const [search, setSearch] = useState("");
  const [matches, setMatches] = useState<ChatMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMatches() {
      try {
        const { matches: data } = await fetchChatList();
        setMatches(data || []);
      } catch {
        // fail silently
      } finally {
        setLoading(false);
      }
    }
    loadMatches();
  }, []);

  const formatTime = (isoString: string | null) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const today = new Date();
    
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
    
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const filteredMatches = matches.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <main className="relative w-full min-h-[100dvh] flex flex-col bg-background pb-20 md:pb-0">
      <header className="px-6 py-6 sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border/40">
        <h1 className="text-3xl font-bold tracking-tighter text-foreground mb-4 drop-shadow-sm">Messages</h1>
        
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input 
            type="text" 
            placeholder="Search matches..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-foreground/5 border border-border rounded-full pl-10 pr-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : filteredMatches.length > 0 ? (
          filteredMatches.map(match => (
            <Link key={match.matchId} href={`/chat/${match.matchId}`} className="block">
              <div className="bg-card hover:bg-accent/10 transition-colors rounded-2xl p-4 flex items-center gap-4 border border-border/50">
                <div className="relative">
                  {match.avatar_url ? (
                    <img src={match.avatar_url} alt={match.name} className="w-14 h-14 rounded-full object-cover border border-white/10" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <span className="text-primary-foreground font-bold text-xl">{match.name.charAt(0)}</span>
                    </div>
                  )}
                  {match.unreadCount > 0 && <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-rose-500 rounded-full border-2 border-background" />}
                </div>
                
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className={`font-semibold ${match.unreadCount > 0 ? 'text-foreground' : 'text-foreground/80'}`}>{match.name}</h3>
                    <span className="text-xs text-muted-foreground">{formatTime(match.lastMessageTime)}</span>
                  </div>
                  <p className={`text-sm truncate ${match.unreadCount > 0 ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                    {match.lastMessage || "Start a conversation!"}
                  </p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Heart className="text-primary" size={24} />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {search ? "No matches found" : "No messages yet"}
            </h2>
            <p className="text-sm text-muted-foreground max-w-[250px] mb-6">
              {search ? "Try a different search term." : "Keep swiping to find someone who catches your eye!"}
            </p>
            {!search && (
              <Link href="/" className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-medium text-sm transition-transform active:scale-95">
                Go to Discover
              </Link>
            )}
          </div>
        )}
      </div>

      <Navigation />
    </main>
  );
}
