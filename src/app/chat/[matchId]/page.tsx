"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";

// Dummy conversation
const DUMMY_MESSAGES = [
  { id: "msg1", text: "Hey there! 👋", sender: "partner", timestamp: "10:30 AM" },
  { id: "msg2", text: "Hi! How's your day going?", sender: "me", timestamp: "10:35 AM" },
  { id: "msg3", text: "Pretty good! Just finished working. That Kacchi place you mentioned in your profile is actually my favorite too!", sender: "partner", timestamp: "10:41 AM" },
  { id: "msg4", text: "That's exactly what I was thinking! 😂", sender: "me", timestamp: "10:42 AM" },
];

export default function ChatConversationPage({ params }: { params: { matchId: string } }) {
  const [messages, setMessages] = useState(DUMMY_MESSAGES);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages([
      ...messages,
      {
        id: Date.now().toString(),
        text: input,
        sender: "me",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setInput("");
  };

  return (
    <main className="relative w-full h-[100dvh] flex flex-col bg-background">
      {/* Header */}
      <header className="px-4 py-4 flex items-center gap-4 border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-30">
        <Link href="/chat" className="p-2 -ml-2 rounded-full hover:bg-foreground/5 transition-colors">
          <ArrowLeft size={20} className="text-foreground" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center relative">
            <span className="text-white font-bold text-lg">A</span>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground leading-none mb-1">Ayesha</h2>
            <p className="text-xs text-muted-foreground">Active now</p>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
        {messages.map((msg, i) => {
          const isMe = msg.sender === "me";
          return (
            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <div 
                className={`px-4 py-2.5 max-w-[75%] shadow-sm ${
                  isMe 
                    ? 'bg-glassy-primary rounded-2xl rounded-br-sm' 
                    : 'bg-glassy-secondary rounded-2xl rounded-bl-sm'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
              <span className="text-[10px] text-muted-foreground mt-1 px-1">{msg.timestamp}</span>
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border/40 bg-background mt-auto">
        <div className="flex items-center gap-3">
          <input 
            type="text" 
            placeholder="Type a message..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-foreground/5 border border-border/50 rounded-full px-5 py-3.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary flex items-center justify-center text-primary-foreground transition-colors shadow-lg shadow-primary/20 shrink-0"
          >
            <Send size={18} className="ml-1" />
          </button>
        </div>
      </div>
    </main>
  );
}
