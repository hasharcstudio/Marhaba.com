"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Camera, Loader2, Save } from "lucide-react";
import { getCurrentProfile, updateProfile, updatePreferences, FullProfile } from "@/app/actions/profile";
import { uploadAvatar } from "@/app/actions/storage";

export default function EditProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profession, setProfession] = useState("");
  const [location, setLocation] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(35);
  const [maxDistance, setMaxDistance] = useState(25);

  useEffect(() => {
    async function loadData() {
      const { profile, preferences } = await getCurrentProfile();
      if (profile) {
        setName(profile.name || "");
        setBio(profile.bio || "");
        setProfession(profile.profession || "");
        setLocation(profile.location || "");
        setAvatarUrl(profile.avatar_url || null);
      }
      if (preferences) {
        setMinAge(preferences.min_age || 18);
        setMaxAge(preferences.max_age || 35);
        setMaxDistance(preferences.max_distance_km || 25);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const { url, error } = await uploadAvatar(file);
    if (error || !url) {
      setError(error || "Failed to upload image");
      setUploading(false);
      return;
    }

    setAvatarUrl(url);
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      await updateProfile({
        name,
        bio: bio || null,
        profession: profession || null,
        location: location || null,
        avatar_url: avatarUrl
      });

      await updatePreferences({
        min_age: minAge,
        max_age: maxAge,
        max_distance_km: maxDistance
      });

      router.push("/profile");
      router.refresh();
    } catch (err) {
      setError("Failed to save profile");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="w-full h-[100dvh] flex flex-col items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" size={32} />
      </main>
    );
  }

  return (
    <main className="relative w-full min-h-[100dvh] flex flex-col bg-background">
      <header className="px-4 py-4 sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border/40 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link href="/profile" className="p-2 -ml-2 rounded-full hover:bg-foreground/5 transition-colors">
            <ArrowLeft size={20} className="text-foreground" />
          </Link>
          <h1 className="font-bold text-foreground">Edit Profile</h1>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving || uploading}
          className="bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1.5 disabled:opacity-50"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          Save
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm text-center">
            {error}
          </div>
        )}

        {/* Photo Upload */}
        <section className="flex flex-col items-center">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-32 h-32 rounded-full bg-foreground/5 border-2 border-dashed border-border flex items-center justify-center relative overflow-hidden cursor-pointer hover:border-primary/50 transition-colors"
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <Camera className="text-muted-foreground" size={32} />
            )}
            {uploading && (
              <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={24} />
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-3 uppercase tracking-wider font-semibold">Tap to change photo</p>
        </section>

        {/* Basic Info */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">Basic Info</h2>
          
          <div className="space-y-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground/80 pl-1">Name</label>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-foreground/5 border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground/80 pl-1">Bio</label>
              <textarea 
                value={bio}
                onChange={e => setBio(e.target.value)}
                rows={3}
                className="w-full bg-foreground/5 border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground/80 pl-1">Profession</label>
                <input 
                  type="text" 
                  value={profession}
                  onChange={e => setProfession(e.target.value)}
                  className="w-full bg-foreground/5 border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground/80 pl-1">Location</label>
                <input 
                  type="text" 
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full bg-foreground/5 border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2 mt-4">Matching Preferences</h2>
          
          <div className="bg-card border border-border/50 rounded-2xl p-4 space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Age Range</label>
                <span className="text-sm text-primary font-semibold">{minAge} - {maxAge}</span>
              </div>
              <div className="flex gap-4 items-center">
                <input 
                  type="range" min="18" max="65" 
                  value={minAge} onChange={(e) => setMinAge(Math.min(parseInt(e.target.value), maxAge))}
                  className="w-full accent-primary" 
                />
                <input 
                  type="range" min="18" max="65" 
                  value={maxAge} onChange={(e) => setMaxAge(Math.max(parseInt(e.target.value), minAge))}
                  className="w-full accent-primary" 
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Maximum Distance</label>
                <span className="text-sm text-primary font-semibold">{maxDistance} km</span>
              </div>
              <input 
                type="range" min="1" max="100" 
                value={maxDistance} onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                className="w-full accent-primary" 
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
