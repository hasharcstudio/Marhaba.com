"use client";

import { useState } from "react";
import SoftAurora from "@/components/SoftAurora";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // Check if email confirmation is required
    setSuccess(true);
    setLoading(false);
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
  };

  if (success) {
    return (
      <main className="relative w-full h-[100dvh] flex flex-col items-center justify-center bg-background overflow-hidden">
        <SoftAurora color1="#ffed4a" color2="#c90076" speed={0.4} brightness={0.6} />
        <div className="z-10 w-full max-w-sm px-6 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6">
            <span className="text-4xl">✉️</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tighter mb-3 text-foreground">Check your email</h1>
          <p className="text-foreground/70 text-sm mb-8">
            We&apos;ve sent a confirmation link to <span className="font-semibold text-primary">{email}</span>. Click the link to activate your account.
          </p>
          <Link href="/login" className="text-primary font-semibold hover:underline text-sm">
            Back to Sign In
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative w-full h-[100dvh] flex flex-col items-center justify-center bg-background overflow-hidden">
      <SoftAurora color1="#ffed4a" color2="#c90076" speed={0.4} brightness={0.6} />
      
      <div className="z-10 w-full max-w-sm px-6 flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-6 shadow-xl shadow-primary/30">
          <span className="text-primary-foreground font-bold text-3xl leading-none tracking-tighter">M</span>
        </div>
        
        <h1 className="text-3xl font-bold tracking-tighter mb-2 text-foreground text-center drop-shadow-sm">Create Account</h1>
        <p className="text-foreground/70 text-center mb-8 text-sm">Join Marhaba and start your journey.</p>
        
        <div className="w-full bg-background/40 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl p-6 shadow-2xl">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wider pl-1">Email</label>
              <input 
                type="email" 
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wider pl-1">Password</label>
              <input 
                type="password" 
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wider pl-1">Confirm Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
              />
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl py-3 transition-colors flex items-center justify-center gap-2 mt-2 shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <>Create Account <ArrowRight size={18} /></>}
            </button>
          </form>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Or</span>
            <div className="flex-1 h-px bg-border"></div>
          </div>
          
          <button 
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full bg-white dark:bg-neutral-900 border border-border hover:bg-neutral-50 dark:hover:bg-neutral-800 text-foreground font-medium rounded-xl py-3 transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </div>
        
        <p className="mt-8 text-sm text-foreground/70">
          Already have an account? <Link href="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
