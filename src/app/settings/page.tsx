"use client";

import { useState, useEffect } from "react";
import SoftAurora from "@/components/SoftAurora";
import Navigation from "@/components/Navigation";
import Link from "next/link";
import { ArrowLeft, LogOut, Shield, Bell, Lock, ChevronRight } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { getCurrentProfile, updateProfile } from "@/app/actions/profile";

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [blurDefault, setBlurDefault] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      const { profile } = await getCurrentProfile();
      if (profile) {
        setBlurDefault(profile.is_blur_default);
      }
      setLoading(false);
    }
    loadSettings();
  }, []);

  const handleBlurToggle = async () => {
    const newValue = !blurDefault;
    setBlurDefault(newValue);
    await updateProfile({ is_blur_default: newValue });
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <main className="relative w-full min-h-[100dvh] flex flex-col bg-background pb-20 md:pb-0">
      <SoftAurora color1="#ffed4a" color2="#c90076" speed={0.2} brightness={0.3} />
      
      <header className="px-6 py-6 sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border/40 flex items-center gap-4">
        <Link href="/profile" className="p-2 -ml-2 rounded-full hover:bg-foreground/5 transition-colors">
          <ArrowLeft size={20} className="text-foreground" />
        </Link>
        <h1 className="text-xl font-bold tracking-tighter text-foreground drop-shadow-sm">Settings</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 z-10">
        
        {/* Privacy Section */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 px-2">Privacy & Security</h2>
          <div className="bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm">
            
            <div className="p-4 flex items-center justify-between border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Shield size={18} />
                </div>
                <div>
                  <p className="font-semibold text-sm">Blur Photos by Default</p>
                  <p className="text-xs text-muted-foreground">Require matches to request reveal</p>
                </div>
              </div>
              <button
                onClick={handleBlurToggle}
                disabled={loading}
                className={`w-12 h-7 rounded-full transition-colors relative ${blurDefault ? "bg-primary" : "bg-foreground/20"}`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md absolute top-1 transition-all duration-300 ${blurDefault ? 'left-6' : 'left-1'}`}
                />
              </button>
            </div>

            <Link href="#" className="p-4 flex items-center justify-between hover:bg-foreground/5 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center text-foreground/70">
                  <Lock size={18} />
                </div>
                <div>
                  <p className="font-semibold text-sm">Privacy Policy</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-muted-foreground" />
            </Link>
            
          </div>
        </section>

        {/* Notifications Section */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 px-2">Notifications</h2>
          <div className="bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-4 flex items-center justify-between hover:bg-foreground/5 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <Bell size={18} />
                </div>
                <div>
                  <p className="font-semibold text-sm">Push Notifications</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-muted-foreground" />
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="pt-4">
          <button 
            onClick={handleLogout}
            className="w-full bg-card border border-border/50 rounded-2xl p-4 flex items-center justify-center gap-2 text-rose-500 font-semibold hover:bg-rose-500/10 transition-colors shadow-sm"
          >
            <LogOut size={18} />
            Log Out
          </button>
        </section>
        
        <p className="text-center text-xs text-muted-foreground mt-8">
          Marhaba App v1.0.0
        </p>
      </div>

      <Navigation />
    </main>
  );
}
