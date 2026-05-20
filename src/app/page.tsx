"use client";

import { useState } from "react";
import SoftAurora from "@/components/SoftAurora";
import SwipeCard, { Profile } from "@/components/SwipeCard";
import Navigation from "@/components/Navigation";
import LogoLoop from "@/components/LogoLoop";
import { AnimatePresence, motion } from "framer-motion";
import { Settings2, Bell, Search } from "lucide-react";

// Dummy data highlighting the Bangladeshi context
const DUMMY_PROFILES: Profile[] = [
  {
    id: "p1",
    name: "Ayesha",
    age: 26,
    profession: "UX Designer",
    location: "Gulshan, Dhaka",
    image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=600&auto=format&fit=crop",
    isBlurredByDefault: true, // Privacy first
    promptQuestion: "Best Kacchi Biryani in Dhaka is...",
    promptAnswer: "Obviously Kacchi Bhai, fight me!"
  },
  {
    id: "p2",
    name: "Farhan",
    age: 29,
    profession: "Software Engineer",
    location: "Banani, Dhaka",
    image: "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?q=80&w=600&auto=format&fit=crop",
    isBlurredByDefault: false,
    promptQuestion: "My stance on living in a joint family is...",
    promptAnswer: "I prefer independent living but weekend family dinners are a must."
  },
  {
    id: "p3",
    name: "Nusrat",
    age: 25,
    profession: "Doctor",
    location: "Dhanmondi, Dhaka",
    image: "https://images.unsplash.com/photo-1621592484082-2d05b1290d73?q=80&w=600&auto=format&fit=crop",
    isBlurredByDefault: true,
    promptQuestion: "I'm looking for...",
    promptAnswer: "Someone who respects my career goals as much as I respect theirs."
  }
];

export default function Home() {
  const [profiles, setProfiles] = useState<Profile[]>(DUMMY_PROFILES);

  const handleSwipe = (direction: "left" | "right", id: string) => {
    // In a real app, send swipe to API here
    setProfiles(current => current.filter(p => p.id !== id));
  };

  return (
    <main className="relative w-full h-[100dvh] flex flex-col">
      {/* Background Effect */}
      <SoftAurora 
        color1="#ffed4a" // gold
        color2="#c90076" // crimson
        speed={0.4}
        brightness={0.8}
      />
      
      {/* Top Header - Mobile Only */}
      <header className="absolute top-0 w-full z-40 px-6 py-4 flex justify-between items-center text-foreground pt-8 pointer-events-none md:hidden">
        <button className="pointer-events-auto bg-foreground/10 hover:bg-foreground/20 transition-colors w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md">
          <Settings2 size={20} />
        </button>
        
        <h1 className="font-bold text-2xl tracking-tighter drop-shadow-sm text-primary">Marhaba</h1>
        
        <div className="flex gap-3 pointer-events-auto">
          <button className="bg-foreground/10 hover:bg-foreground/20 transition-colors w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md">
            <Search size={20} />
          </button>
          <button className="bg-foreground/10 hover:bg-foreground/20 transition-colors w-10 h-10 rounded-full flex items-center justify-center relative backdrop-blur-md">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full" />
          </button>
        </div>
      </header>

      {/* Swipe Cards Container - Constrained and centered on desktop */}
      <div className="flex-1 relative w-full h-full md:max-w-md md:mx-auto md:my-8 md:border md:border-border/50 md:rounded-[40px] md:shadow-2xl md:overflow-hidden md:bg-background">
        {profiles.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-primary-foreground p-8 text-center z-10 drop-shadow-md">
            <div className="w-24 h-24 mb-6 rounded-full glass flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center"
              >
                <div className="w-8 h-8 rounded-full bg-primary" />
              </motion.div>
            </div>
            <h2 className="text-2xl font-bold mb-2">You&apos;re all caught up!</h2>
            <p className="text-primary-foreground/80 mb-12">We are finding more potential matches around your area.</p>
            
            <div className="w-full max-w-md mt-auto mb-10 overflow-hidden">
              <p className="text-xs text-primary-foreground/60 mb-4 uppercase tracking-widest font-semibold">Powered By</p>
              <LogoLoop
                logos={[
                  { node: <span className="font-bold text-xl text-primary-foreground/90 whitespace-nowrap">HASHARC Studio</span>, title: "HASHARC Studio" },
                  { node: <img src="/HASHARC Logo.jpg" alt="HASHARC Logo" className="h-10 w-10 rounded-full object-cover border-2 border-white/20" /> },
                  { node: <span className="font-bold text-xl text-primary-foreground/90 whitespace-nowrap">HASHARC Studio</span>, title: "HASHARC Studio" },
                  { node: <img src="/HASHARC Logo.jpg" alt="HASHARC Logo" className="h-10 w-10 rounded-full object-cover border-2 border-white/20" /> },
                  { node: <span className="font-bold text-xl text-primary-foreground/90 whitespace-nowrap">HASHARC Studio</span>, title: "HASHARC Studio" },
                  { node: <img src="/HASHARC Logo.jpg" alt="HASHARC Logo" className="h-10 w-10 rounded-full object-cover border-2 border-white/20" /> },
                ]}
                speed={40}
                direction="left"
                logoHeight={40}
                gap={30}
                fadeOut={false}
              />
            </div>
          </div>
        ) : (
          <AnimatePresence>
            {profiles.map((profile, index) => (
              <SwipeCard 
                key={profile.id}
                profile={profile}
                onSwipe={handleSwipe}
                active={index === profiles.length - 1}
              />
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Bottom Navigation */}
      <Navigation />
    </main>
  );
}
