"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import Link from "next/link";

export interface MatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchedUser: {
    name: string;
    photo?: string;
  };
  currentUser?: {
    name: string;
    photo?: string;
  };
}

export default function MatchModal({ isOpen, onClose, matchedUser, currentUser = { name: "You" } }: MatchModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-md pointer-events-auto"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div 
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-sm mx-4 bg-background/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col items-center text-center shadow-2xl pointer-events-auto"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-foreground/10 hover:bg-foreground/20 rounded-full transition-colors text-foreground"
            >
              <X size={20} />
            </button>

            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
              className="text-4xl font-black italic tracking-tighter mb-8 bg-gradient-to-r from-primary via-rose-500 to-secondary bg-clip-text text-transparent drop-shadow-md"
            >
              It&apos;s a Match!
            </motion.div>

            <div className="flex justify-center items-center mb-8 relative">
              <motion.div 
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 10, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-24 h-24 rounded-full bg-primary/20 p-1 relative z-10"
              >
                {currentUser.photo ? (
                  <img src={currentUser.photo} className="w-full h-full rounded-full object-cover" alt="You" />
                ) : (
                  <div className="w-full h-full rounded-full bg-glassy-primary flex items-center justify-center">
                    <span className="text-3xl font-bold">{currentUser.name.charAt(0)}</span>
                  </div>
                )}
              </motion.div>

              <motion.div 
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: -10, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="w-24 h-24 rounded-full bg-secondary/20 p-1 relative z-20"
              >
                {matchedUser.photo ? (
                  <img src={matchedUser.photo} className="w-full h-full rounded-full object-cover" alt="Match" />
                ) : (
                  <div className="w-full h-full rounded-full bg-glassy-secondary flex items-center justify-center">
                    <span className="text-3xl font-bold">{matchedUser.name.charAt(0)}</span>
                  </div>
                )}
              </motion.div>

              {/* Sparkles */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                className="absolute inset-[-20px] rounded-full border border-dashed border-primary/30 z-0"
              />
            </div>

            <p className="text-foreground/80 mb-8 font-medium">
              You and <span className="text-primary font-bold">{matchedUser.name}</span> liked each other.
            </p>

            <div className="w-full flex flex-col gap-3">
              <Link href={`/chat/new`} onClick={onClose} className="w-full py-3.5 rounded-xl bg-glassy-primary font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                <MessageCircle size={18} />
                Send a Message
              </Link>
              
              <button 
                onClick={onClose}
                className="w-full py-3.5 rounded-xl border border-border text-foreground font-semibold text-sm hover:bg-foreground/5 transition-colors"
              >
                Keep Swiping
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
