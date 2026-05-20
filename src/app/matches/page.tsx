"use client";

import Navigation from "@/components/Navigation";
import { Heart } from "lucide-react";
import Link from "next/link";

const DUMMY_MATCHES = [
  { id: "m1", name: "Ayesha", age: 26, location: "Gulshan", photo: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=300&auto=format&fit=crop" },
  { id: "m2", name: "Farhan", age: 29, location: "Banani", photo: "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?q=80&w=300&auto=format&fit=crop" },
  { id: "m3", name: "Nusrat", age: 25, location: "Dhanmondi", photo: null },
  { id: "m4", name: "Zara", age: 27, location: "Uttara", photo: "https://images.unsplash.com/photo-1621592484082-2d05b1290d73?q=80&w=300&auto=format&fit=crop" },
];

export default function MatchesPage() {
  return (
    <main className="relative w-full min-h-[100dvh] flex flex-col bg-background pb-20 md:pb-0">
      <header className="px-6 py-6 sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border/40">
        <h1 className="text-3xl font-bold tracking-tighter text-foreground drop-shadow-sm">Matches</h1>
        <p className="text-sm text-muted-foreground mt-1">People who liked you back</p>
      </header>

      <div className="flex-1 p-6">
        {DUMMY_MATCHES.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {DUMMY_MATCHES.map(match => (
              <Link href={`/chat/${match.id}`} key={match.id}>
                <div className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-card border border-border/50 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
                  {match.photo ? (
                    <img src={match.photo} alt={match.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-secondary/80 flex items-center justify-center">
                      <span className="text-white font-bold text-4xl opacity-50">{match.name.charAt(0)}</span>
                    </div>
                  )}
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 w-full p-4">
                    <h3 className="text-white font-bold text-lg leading-tight flex items-center gap-1">
                      {match.name}, {match.age}
                    </h3>
                    <p className="text-white/80 text-xs font-medium">{match.location}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
           <div className="flex flex-col items-center justify-center h-[50vh] text-center">
             <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
               <Heart className="text-primary" size={24} />
             </div>
             <h2 className="text-xl font-semibold text-foreground mb-2">No matches yet</h2>
             <p className="text-sm text-muted-foreground max-w-[250px]">Your future connections will appear here.</p>
           </div>
        )}
      </div>

      <Navigation />
    </main>
  );
}
