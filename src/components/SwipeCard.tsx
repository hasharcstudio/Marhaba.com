"use client";

import { useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Check, X, ShieldAlert, User } from "lucide-react";
import Link from "next/link";

export interface Profile {
  id: string;
  name: string;
  age: number;
  profession: string;
  location: string;
  image: string;
  isBlurredByDefault: boolean;
  promptQuestion?: string;
  promptAnswer?: string;
}

interface SwipeCardProps {
  profile: Profile;
  onSwipe: (dir: "left" | "right", id: string) => void;
  active: boolean;
}

export default function SwipeCard({ profile, onSwipe, active }: SwipeCardProps) {
  const [isBlurred, setIsBlurred] = useState(profile.isBlurredByDefault);
  const x = useMotionValue(0);
  
  // Transform x position to rotation and opacity for UI feedback
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);
  
  // Indicators for like/pass
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-20, -100], [0, 1]);

  const handleDragEnd = (event: any, info: any) => {
    const threshold = 120;
    if (info.offset.x > threshold) {
      animate(x, 400, { duration: 0.3 }).then(() => onSwipe("right", profile.id));
    } else if (info.offset.x < -threshold) {
      animate(x, -400, { duration: 0.3 }).then(() => onSwipe("left", profile.id));
    } else {
      animate(x, 0, { type: "spring", stiffness: 300, damping: 20 });
    }
  };

  return (
    <motion.div
      className={`absolute inset-0 flex items-center justify-center p-4 pt-16 pb-24 pointer-events-${active ? 'auto' : 'none'}`}
      style={{
        x,
        rotate,
        opacity,
        zIndex: active ? 10 : 0
      }}
      drag={active ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileTap={active ? { scale: 0.98 } : {}}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div className="relative w-full h-full max-h-[600px] bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/40">
        
        {/* Profile Image with Blur option */}
        <div className="absolute inset-0 w-full h-full bg-neutral-200">
          <img 
            src={profile.image} 
            alt={profile.name}
            className={`w-full h-full object-cover transition-all duration-500 ${isBlurred ? 'blur-xl scale-110' : ''}`}
            draggable={false}
          />
          {/* Gradient Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>

        {/* Unblur button for MVP testing */}
        {isBlurred && (
          <button 
            onClick={(e) => { e.stopPropagation(); setIsBlurred(false); }}
            className="absolute top-4 right-4 glass z-20 px-4 py-2 rounded-full flex items-center gap-2 text-sm text-neutral-800 font-medium"
          >
            <ShieldAlert size={16} className="text-primary" />
            Reveal
          </button>
        )}

        {/* Swipe Indicators */}
        <motion.div 
          style={{ opacity: likeOpacity }}
          className="absolute top-12 left-8 border-4 border-emerald-400 text-emerald-400 font-black text-4xl px-4 py-2 rounded-xl uppercase tracking-widest z-20 rotate-[-15deg]"
        >
          LIKE
        </motion.div>
        
        <motion.div 
          style={{ opacity: nopeOpacity }}
          className="absolute top-12 right-8 border-4 border-rose-500 text-rose-500 font-black text-4xl px-4 py-2 rounded-xl uppercase tracking-widest z-20 rotate-[15deg]"
        >
          PASS
        </motion.div>

        {/* Profile Info */}
        <div className="absolute bottom-0 left-0 w-full p-6 text-white z-10 flex flex-col justify-end">
          <div className="flex items-end gap-3 mb-1">
            <h2 className="text-3xl font-bold font-sans drop-shadow-md">{profile.name}</h2>
            <span className="text-2xl font-light mb-0.5">{profile.age}</span>
          </div>
          
          <p className="text-sm text-neutral-200 mb-3 drop-shadow-md">
            {profile.profession} • {profile.location}
          </p>
          
          <Link 
            href={`/profile/${profile.id}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 self-start bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium mb-2 pointer-events-auto border border-white/10"
          >
            <User size={16} />
            View Full Profile
          </Link>
          
          {profile.promptQuestion && (
            <div className="mt-3 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl">
              <p className="text-xs text-primary-foreground/70 mb-1">{profile.promptQuestion}</p>
              <p className="text-sm font-medium">{profile.promptAnswer}</p>
            </div>
          )}
        </div>
        
        {/* Action Buttons (can also click instead of swipe) */}
        <div className="absolute -bottom-6 left-0 w-full flex justify-center gap-6 z-20 pb-8 pointer-events-none">
          <button 
            className="pointer-events-auto w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg text-rose-500 hover:scale-110 transition-transform"
            onClick={(e) => {
              e.stopPropagation();
              animate(x, -400, { duration: 0.3 }).then(() => onSwipe("left", profile.id));
            }}
          >
            <X size={28} strokeWidth={3} />
          </button>
          <button 
            className="pointer-events-auto w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg text-emerald-400 hover:scale-110 transition-transform"
            onClick={(e) => {
              e.stopPropagation();
              animate(x, 400, { duration: 0.3 }).then(() => onSwipe("right", profile.id));
            }}
          >
            <Check size={28} strokeWidth={3} />
          </button>
        </div>

      </div>
    </motion.div>
  );
}
