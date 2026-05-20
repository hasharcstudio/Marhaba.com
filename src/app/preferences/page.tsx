"use client";

import ScrollStack, { ScrollStackItem } from '@/components/ScrollStack';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function PreferencesPage() {
  return (
    <main className="w-full h-[100dvh] bg-background text-foreground flex flex-col relative overflow-hidden">
      <header className="absolute top-0 w-full z-40 px-6 py-4 flex items-center gap-4 text-foreground pt-8 bg-gradient-to-b from-background/80 to-transparent">
        <Link href="/" className="bg-foreground/10 hover:bg-foreground/20 transition-colors w-10 h-10 rounded-full flex items-center justify-center pointer-events-auto backdrop-blur-md">
          <ChevronLeft size={20} className="text-foreground" />
        </Link>
        <h1 className="font-bold text-2xl tracking-tighter drop-shadow-sm text-foreground">Preferences</h1>
      </header>

      <ScrollStack
        className="flex-1 bg-background"
        itemDistance={100}
        itemScale={0.05}
        itemStackDistance={40}
        stackPosition="15%"
        scaleEndPosition="5%"
        baseScale={0.8}
        blurAmount={8}
      >
        <ScrollStackItem itemClassName="bg-card text-card-foreground border border-border">
          <h2 className="text-2xl font-bold mb-4">Religion & Sect</h2>
          <p className="text-muted-foreground mb-6">Filter by religious beliefs and practices, which is crucial for matrimonial compatibility.</p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">Sunni</span>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">Shia</span>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">Ahmadiyya</span>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">Other</span>
          </div>
        </ScrollStackItem>

        <ScrollStackItem itemClassName="bg-card text-card-foreground border border-border">
          <h2 className="text-2xl font-bold mb-4">Education Level</h2>
          <p className="text-muted-foreground mb-6">Find partners with similar academic backgrounds and career aspirations.</p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">Bachelor&apos;s</span>
            <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">Master&apos;s</span>
            <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">PhD</span>
            <span className="px-3 py-1 border border-border rounded-full text-sm text-muted-foreground">Any</span>
          </div>
        </ScrollStackItem>

        <ScrollStackItem itemClassName="bg-card text-card-foreground border border-border">
          <h2 className="text-2xl font-bold mb-4">City & Location</h2>
          <p className="text-muted-foreground mb-6">Connect with people in your preferred cities across Bangladesh.</p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">Dhaka</span>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">Chattogram</span>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">Sylhet</span>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">Rajshahi</span>
          </div>
        </ScrollStackItem>

        <ScrollStackItem itemClassName="bg-card text-card-foreground border border-border">
          <h2 className="text-2xl font-bold mb-4">Area-Based (Local)</h2>
          <p className="text-muted-foreground mb-6">Narrow down your search to specific neighborhoods for convenient meetups.</p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">Gulshan</span>
            <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">Banani</span>
            <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">Dhanmondi</span>
            <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">Uttara</span>
          </div>
        </ScrollStackItem>

        <ScrollStackItem itemClassName="bg-card text-card-foreground border border-border">
          <h2 className="text-2xl font-bold mb-4">Ethnicity & Background</h2>
          <p className="text-muted-foreground mb-6">Filter by cultural background, district of origin, or ethnicity.</p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">Bengali</span>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">Sylheti</span>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">Chittagonian</span>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">Expat / NRB</span>
          </div>
        </ScrollStackItem>
      </ScrollStack>
    </main>
  );
}
