"use client";

import { useState } from "react";
import { Compass, Heart, User, MessageCircle } from "lucide-react";
import Dock from "./Dock";
import { useRouter } from "next/navigation";

export default function Navigation() {
  const [activeTab, setActiveTab] = useState("discover");
  const router = useRouter();

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    if (id === "discover") router.push("/");
    if (id === "matches") router.push("/matches");
    if (id === "chat") router.push("/chat");
    if (id === "profile") router.push("/profile");
  };

  const items = [
    { 
      icon: <Compass size={22} className={activeTab === "discover" ? "text-primary" : "text-foreground/80"} />, 
      label: "Discover", 
      onClick: () => handleTabClick("discover") 
    },
    { 
      icon: <Heart size={22} className={activeTab === "matches" ? "text-primary" : "text-foreground/80"} />, 
      label: "Matches", 
      onClick: () => handleTabClick("matches") 
    },
    { 
      icon: <MessageCircle size={22} className={activeTab === "chat" ? "text-primary" : "text-foreground/80"} />, 
      label: "Chat", 
      onClick: () => handleTabClick("chat") 
    },
    { 
      icon: <User size={22} className={activeTab === "profile" ? "text-primary" : "text-foreground/80"} />, 
      label: "Profile", 
      onClick: () => handleTabClick("profile") 
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 pointer-events-none pb-4 sm:pb-8 md:hidden">
      <div className="pointer-events-auto w-full max-w-screen-md mx-auto flex justify-center">
        <Dock 
          items={items}
          panelHeight={64}
          baseItemSize={48}
          magnification={65}
          distance={100}
        />
      </div>
    </div>
  );
}
