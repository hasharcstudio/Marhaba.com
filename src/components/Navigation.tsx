"use client";

import { motion } from "framer-motion";
import { Compass, Heart, User, MessageCircle } from "lucide-react";
import { useState } from "react";

export default function Navigation() {
  const [activeTab, setActiveTab] = useState("discover");

  const tabs = [
    { id: "discover", icon: Compass, label: "Discover" },
    { id: "matches", icon: Heart, label: "Matches" },
    { id: "chat", icon: MessageCircle, label: "Chat" },
    { id: "profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="fixed bottom-0 w-full max-w-md mx-auto z-50 px-6 pb-8 pt-4 pointer-events-none">
      <div className="pointer-events-auto glass w-full rounded-2xl flex justify-between items-center px-6 py-4 shadow-[0_10px_40px_rgb(0,0,0,0.1)]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex flex-col items-center justify-center w-12 h-12"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary/10 rounded-xl"
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                />
              )}
              <Icon 
                size={24} 
                className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-primary' : 'text-neutral-400'}`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={`text-[10px] mt-1 transition-colors duration-300 font-medium ${isActive ? 'text-primary' : 'text-neutral-400'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
