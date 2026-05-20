"use client";

import SoftAurora from "@/components/SoftAurora";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { ArrowRight, Mail } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="relative w-full h-[100dvh] flex flex-col items-center justify-center bg-background overflow-hidden">
      {/* Background Effect */}
      <SoftAurora 
        color1="#ffed4a" 
        color2="#c90076" 
        speed={0.4}
        brightness={0.6}
      />
      
      <div className="z-10 w-full max-w-sm px-6 flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-6 shadow-xl shadow-primary/30">
          <span className="text-primary-foreground font-bold text-3xl leading-none tracking-tighter">M</span>
        </div>
        
        <h1 className="text-3xl font-bold tracking-tighter mb-2 text-foreground text-center drop-shadow-sm">Welcome Back</h1>
        <p className="text-foreground/70 text-center mb-8 text-sm">Sign in to continue finding meaningful connections.</p>
        
        <div className="w-full bg-background/40 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl p-6 shadow-2xl">
          <form className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wider pl-1">Email</label>
              <input 
                type="email" 
                placeholder="you@example.com" 
                className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center pl-1">
                <label className="text-xs font-semibold text-foreground/80 uppercase tracking-wider">Password</label>
                <Link href="#" className="text-xs text-primary font-medium hover:underline">Forgot?</Link>
              </div>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
              />
            </div>
            
            <button type="button" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl py-3 transition-colors flex items-center justify-center gap-2 mt-2 shadow-lg shadow-primary/20">
              Sign In
              <ArrowRight size={18} />
            </button>
          </form>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Or</span>
            <div className="flex-1 h-px bg-border"></div>
          </div>
          
          <button 
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full bg-white dark:bg-neutral-900 border border-border hover:bg-neutral-50 dark:hover:bg-neutral-800 text-foreground font-medium rounded-xl py-3 transition-colors flex items-center justify-center gap-3"
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
          Don't have an account? <Link href="/signup" className="text-primary font-semibold hover:underline">Sign up</Link>
        </p>
      </div>
    </main>
  );
}
