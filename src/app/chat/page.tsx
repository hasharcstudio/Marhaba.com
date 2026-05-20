"use client";

import Link from "next/link";
import Navigation from "@/components/Navigation";
import { Search, Heart } from "lucide-react";
import { useState } from "react";

// Dummy matches for now
const DUMMY_MATCHES = [
  { id: "m1", name: "Ayesha", lastMessage: "That's exactly what I was thinking! 😂", timestamp: "10:42 AM", unread: true, photo: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=200&auto=format&fit=crop" },
  { id: "m2", name: "Farhan", lastMessage: "Let's grab coffee this weekend?", timestamp: "Yesterday", unread: false, photo: "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?q=80&w=200&auto=format&fit=crop" },
  { id: "m3", name: "Nusrat", lastMessage: "Say hi!", timestamp: "Mon", unread: true, photo: null },
];

export default function ChatListPage() {
  const [search, setSearch] = useState("");

  const filteredMatches = DUMMY_MATCHES.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

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
        {filteredMatches.length > 0 ? (
          filteredMatches.map(match => (
            <Link key={match.id} href={`/chat/${match.id}`} className="block">
              <div className="bg-card hover:bg-accent/10 transition-colors rounded-2xl p-4 flex items-center gap-4 border border-border/50">
                <div className="relative">
                  {match.photo ? (
                    <img src={match.photo} alt={match.name} className="w-14 h-14 rounded-full object-cover border border-white/10" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <span className="text-primary-foreground font-bold text-xl">{match.name.charAt(0)}</span>
                    </div>
                  )}
                  {match.unread && <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-rose-500 rounded-full border-2 border-background" />}
                </div>
                
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className={`font-semibold ${match.unread ? 'text-foreground' : 'text-foreground/80'}`}>{match.name}</h3>
                    <span className="text-xs text-muted-foreground">{match.timestamp}</span>
                  </div>
                  <p className={`text-sm truncate ${match.unread ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                    {match.lastMessage}
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
            <h2 className="text-xl font-semibold text-foreground mb-2">No matches found</h2>
            <p className="text-sm text-muted-foreground max-w-[250px] mb-6">Keep swiping to find someone who catches your eye!</p>
            <Link href="/" className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-medium text-sm transition-transform active:scale-95">
              Go to Discover
            </Link>
          </div>
        )}
      </div>

      <Navigation />
    </main>
  );
}
