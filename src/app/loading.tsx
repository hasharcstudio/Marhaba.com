"use client";

import MagicRings from "@/components/MagicRings";

export default function Loading() {
  return (
    <div className="fixed inset-0 w-full h-[100dvh] bg-background z-[100] flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <MagicRings
          color="#ffed4a" // Matches the app's gold aurora color
          colorTwo="#c90076" // Matches the app's crimson aurora color
          ringCount={5}
          speed={1.5}
          attenuation={15}
          lineThickness={3}
          baseRadius={0.2}
          radiusStep={0.15}
          scaleRate={0.1}
          opacity={0.8}
          blur={0}
          noiseAmount={0.05}
          rotation={0}
          ringGap={1.2}
          fadeIn={0.5}
          fadeOut={0.5}
          followMouse={false}
          mouseInfluence={0.1}
          hoverScale={1.1}
          parallax={0.05}
          clickBurst={true}
        />
      </div>
      <div className="relative z-10 flex flex-col items-center drop-shadow-md">
        <h2 className="text-3xl font-bold tracking-tighter text-primary-foreground mb-2">Marhaba</h2>
        <p className="text-primary-foreground/80 animate-pulse uppercase tracking-widest text-sm">Loading...</p>
      </div>
    </div>
  );
}
