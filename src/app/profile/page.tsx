"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import SoftAurora from "@/components/SoftAurora";
import { Settings, Edit3, MapPin, Briefcase, Calendar, Loader2 } from "lucide-react";
import { getCurrentProfile, FullProfile } from "@/app/actions/profile";

function calculateAge(birthdateStr: string) {
  const birthdate = new Date(birthdateStr);
  const today = new Date();
  let age = today.getFullYear() - birthdate.getFullYear();
  const m = today.getMonth() - birthdate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
    age--;
  }
  return age;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<FullProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const { profile: p } = await getCurrentProfile();
      setProfile(p);
      setLoading(false);
    }
    loadProfile();
  }, []);

  if (loading) {
    return (
      <main className="w-full h-[100dvh] flex flex-col items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" size={32} />
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="w-full h-[100dvh] flex flex-col items-center justify-center bg-background">
        <p className="text-muted-foreground">Error loading profile.</p>
        <Link href="/" className="mt-4 text-primary hover:underline">Go Home</Link>
      </main>
    );
  }

  const age = profile.birthdate ? calculateAge(profile.birthdate) : "?";

  return (
    <main className="relative w-full min-h-[100dvh] flex flex-col bg-background pb-20 md:pb-0">
      <SoftAurora color1="#ffed4a" color2="#c90076" speed={0.1} brightness={0.3} />
      
      {/* Header */}
      <header className="px-6 py-6 sticky top-0 z-30 bg-background/80 backdrop-blur-md flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tighter text-foreground drop-shadow-sm">Profile</h1>
        <Link href="/settings" className="p-2 bg-foreground/5 rounded-full hover:bg-foreground/10 transition-colors">
          <Settings size={20} className="text-foreground" />
        </Link>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-2 z-10 flex flex-col items-center">
        
        {/* Avatar Section */}
        <div className="relative mb-6 mt-4">
          <div className="w-32 h-32 rounded-full border-4 border-background shadow-xl overflow-hidden bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-white text-5xl font-bold">{profile.name.charAt(0)}</span>
            )}
          </div>
        </div>

        <h2 className="text-2xl font-bold text-foreground tracking-tight">{profile.name}, {age}</h2>
        <p className="text-muted-foreground mt-1 flex items-center gap-1.5 text-sm">
          <MapPin size={14} /> {profile.location || "Location not set"}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8 w-full max-w-sm">
          <Link href="/profile/edit" className="flex-1 py-3.5 rounded-2xl bg-foreground/5 hover:bg-foreground/10 border border-border/50 flex items-center justify-center gap-2 transition-colors font-medium text-sm text-foreground">
            <Edit3 size={16} /> Edit Profile
          </Link>
        </div>

        {/* Info Cards */}
        <div className="w-full max-w-sm mt-8 space-y-4">
          <div className="bg-card border border-border/50 rounded-3xl p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">About</h3>
            {profile.bio ? (
              <p className="text-sm text-foreground/90 leading-relaxed">{profile.bio}</p>
            ) : (
              <p className="text-sm text-muted-foreground italic">No bio provided.</p>
            )}

            <div className="mt-5 space-y-2.5">
              <div className="flex items-center gap-3 text-sm text-foreground/80">
                <Briefcase size={16} className="text-muted-foreground" />
                <span>{profile.profession || "Profession not set"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-foreground/80">
                <Calendar size={16} className="text-muted-foreground" />
                <span>{profile.gender || "Gender not set"}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-3xl p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">Prompt</h3>
            <p className="text-sm font-medium text-foreground mb-1">{profile.prompt_question}</p>
            {profile.prompt_answer ? (
              <p className="text-base text-foreground/90 italic">&quot;{profile.prompt_answer}&quot;</p>
            ) : (
              <p className="text-sm text-muted-foreground italic">No answer provided.</p>
            )}
          </div>
        </div>

      </div>

      <Navigation />
    </main>
  );
}
