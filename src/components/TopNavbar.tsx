"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Heart, MessageCircle, User, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function TopNavbar() {
  const pathname = usePathname();
  
  // Hide on login/signup pages
  if (pathname === "/login" || pathname === "/signup") return null;

  return (
    <nav className="hidden md:flex w-full sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/40 px-6 py-4 items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-lg leading-none tracking-tighter">M</span>
        </div>
        <span className="font-bold text-xl tracking-tighter text-primary">Marhaba</span>
      </Link>
      
      <div className="flex items-center gap-8">
        <Link 
          href="/" 
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${pathname === "/" ? "text-primary" : "text-foreground/70 hover:text-foreground"}`}
        >
          <Compass size={18} />
          Discover
        </Link>
        <Link 
          href="/matches" 
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${pathname === "/matches" ? "text-primary" : "text-foreground/70 hover:text-foreground"}`}
        >
          <Heart size={18} />
          Matches
        </Link>
        <Link 
          href="/chat" 
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${pathname === "/chat" ? "text-primary" : "text-foreground/70 hover:text-foreground"}`}
        >
          <MessageCircle size={18} />
          Chat
        </Link>
        <Link 
          href="/preferences" 
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${pathname === "/preferences" ? "text-primary" : "text-foreground/70 hover:text-foreground"}`}
        >
          <User size={18} />
          Profile
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="text-sm font-medium text-foreground/70 hover:text-foreground flex items-center gap-2 transition-colors"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </nav>
  );
}
