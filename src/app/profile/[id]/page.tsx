"use client";

import { use } from "react";
import ProfileCard from "@/components/ProfileCard";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Profile } from "@/components/SwipeCard";
import BorderGlow from "@/components/BorderGlow";

// Mock fetching profile by ID
const DUMMY_PROFILES: Profile[] = [
  {
    id: "p1",
    name: "Ayesha",
    age: 26,
    profession: "UX Designer",
    location: "Gulshan, Dhaka",
    image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=600&auto=format&fit=crop",
    isBlurredByDefault: true,
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

export default function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const profile = DUMMY_PROFILES.find(p => p.id === resolvedParams.id) || null;

  if (!profile) {
    return (
      <div className="w-full h-[100dvh] flex items-center justify-center bg-background text-foreground">
        <p>Loading profile...</p>
      </div>
    );
  }

  const handleContactClick = () => {
    // Directs them to Instagram/FB as requested
    window.open("https://instagram.com", "_blank", "noopener,noreferrer");
  };

  return (
    <main className="w-full min-h-[100dvh] bg-background text-foreground flex flex-col relative overflow-x-hidden pb-20">
      <header className="absolute top-0 w-full z-40 px-6 py-4 flex items-center gap-4 text-primary-foreground pt-8 bg-gradient-to-b from-background/80 to-transparent">
        <Link href="/" className="glass w-10 h-10 rounded-full flex items-center justify-center pointer-events-auto shadow-md border border-white/20">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="font-bold text-xl tracking-tighter drop-shadow-md">Profile Details</h1>
      </header>

      {/* Profile Card Section */}
      <div className="w-full max-w-md mx-auto pt-24 px-6 mb-8">
        <ProfileCard
          name={profile.name}
          title={`${profile.profession} • ${profile.age}`}
          handle={profile.name.toLowerCase() + "123"}
          status={profile.location}
          contactText="Message on Instagram"
          avatarUrl={profile.image}
          miniAvatarUrl={profile.image}
          showUserInfo={true}
          enableTilt={true}
          enableMobileTilt={true}
          onContactClick={handleContactClick}
          behindGlowEnabled={true}
          innerGradient="linear-gradient(145deg, rgba(255, 237, 74, 0.2) 0%, rgba(201, 0, 118, 0.2) 100%)"
          behindGlowColor="rgba(201, 0, 118, 0.4)"
        />
      </div>

      {/* Profile Description Section */}
      <div className="w-full max-w-md mx-auto px-6 flex flex-col gap-6">
        <BorderGlow
          edgeSensitivity={30}
          glowColor="320 100 50" // Pinkish-crimson glow to match theme
          backgroundColor="rgba(20, 20, 20, 0.4)" // Semi-transparent dark
          borderRadius={24}
          glowRadius={30}
          animated={true}
          colors={['#ffed4a', '#c90076', '#ff4291']}
        >
          <div className="rounded-3xl p-6 backdrop-blur-md">
            <h2 className="text-xl font-bold mb-3 text-primary">About {profile.name}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Hi! I am a {profile.profession.toLowerCase()} based in {profile.location}. I&apos;m very passionate about my career and love exploring different cuisines around the city during weekends. Looking for someone who shares similar values and respects boundaries.
            </p>

            {profile.promptQuestion && (
              <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 mt-4">
                <p className="text-sm font-semibold text-primary/80 mb-2">{profile.promptQuestion}</p>
                <p className="text-md text-foreground">{profile.promptAnswer}</p>
              </div>
            )}
          </div>
        </BorderGlow>
        
        <BorderGlow
          edgeSensitivity={30}
          glowColor="50 100 50" // Gold glow
          backgroundColor="rgba(20, 20, 20, 0.4)"
          borderRadius={24}
          glowRadius={30}
          animated={true}
          colors={['#ffed4a', '#c90076', '#ff4291']}
        >
          <div className="rounded-3xl p-6 backdrop-blur-md">
            <h2 className="text-xl font-bold mb-3 text-primary">Interests</h2>
            <div className="flex flex-wrap gap-2">
              <span className="px-4 py-2 bg-secondary text-secondary-foreground rounded-full text-sm font-medium">Foodie</span>
              <span className="px-4 py-2 bg-secondary text-secondary-foreground rounded-full text-sm font-medium">Traveling</span>
              <span className="px-4 py-2 bg-secondary text-secondary-foreground rounded-full text-sm font-medium">Photography</span>
              <span className="px-4 py-2 bg-secondary text-secondary-foreground rounded-full text-sm font-medium">Movies</span>
            </div>
          </div>
        </BorderGlow>
      </div>
    </main>
  );
}
