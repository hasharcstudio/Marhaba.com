"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SoftAurora from "@/components/SoftAurora";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Camera, Sparkles } from "lucide-react";

const STEPS = ["Basic Info", "Location", "About Me", "Photos", "Preferences"];

const PROMPT_OPTIONS = [
  "Best Kacchi Biryani in Dhaka is...",
  "My stance on living in a joint family is...",
  "I'm looking for...",
  "A perfect weekend for me is...",
  "My love language is...",
  "The way to my heart is...",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  // Form state
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [profession, setProfession] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [promptQuestion, setPromptQuestion] = useState(PROMPT_OPTIONS[0]);
  const [promptAnswer, setPromptAnswer] = useState("");
  const [blurDefault, setBlurDefault] = useState(true);
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(35);
  const [prefGender, setPrefGender] = useState("");
  const [religion, setReligion] = useState("");
  const [maxDistance, setMaxDistance] = useState(25);

  const next = () => {
    if (step < STEPS.length - 1) {
      setDirection(1);
      setStep(s => s + 1);
    }
  };

  const back = () => {
    if (step > 0) {
      setDirection(-1);
      setStep(s => s - 1);
    }
  };

  const finish = () => {
    // TODO: Save to Supabase
    router.push("/");
  };

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  };

  const inputClass = "w-full bg-background/50 border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground";
  const labelClass = "text-xs font-semibold text-foreground/80 uppercase tracking-wider pl-1";

  return (
    <main className="relative w-full h-[100dvh] flex flex-col items-center justify-center bg-background overflow-hidden">
      <SoftAurora color1="#ffed4a" color2="#c90076" speed={0.4} brightness={0.6} />

      <div className="z-10 w-full max-w-md px-6 flex flex-col items-center">
        {/* Progress Bar */}
        <div className="w-full mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">Step {step + 1} of {STEPS.length}</span>
            <span className="text-xs font-semibold text-primary">{STEPS[step]}</span>
          </div>
          <div className="w-full h-1.5 bg-foreground/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
              animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>
        </div>

        {/* Step Card */}
        <div className="w-full relative overflow-hidden" style={{ minHeight: 380 }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full bg-background/40 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl p-6 shadow-2xl"
            >
              {/* Step 0: Basic Info */}
              {step === 0 && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-xl font-bold text-foreground mb-1">Tell us about yourself</h2>
                  <div className="flex flex-col gap-1.5">
                    <label className={labelClass}>Full Name</label>
                    <input type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} className={inputClass} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={labelClass}>Gender</label>
                    <select value={gender} onChange={e => setGender(e.target.value)} className={inputClass}>
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={labelClass}>Date of Birth</label>
                    <input type="date" value={birthdate} onChange={e => setBirthdate(e.target.value)} className={inputClass} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={labelClass}>Profession</label>
                    <input type="text" placeholder="e.g. Software Engineer" value={profession} onChange={e => setProfession(e.target.value)} className={inputClass} />
                  </div>
                </div>
              )}

              {/* Step 1: Location */}
              {step === 1 && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-xl font-bold text-foreground mb-1">Where are you based?</h2>
                  <p className="text-sm text-foreground/60 -mt-2">This helps us find people near you.</p>
                  <div className="flex flex-col gap-1.5">
                    <label className={labelClass}>Location</label>
                    <input type="text" placeholder="e.g. Gulshan, Dhaka" value={location} onChange={e => setLocation(e.target.value)} className={inputClass} />
                  </div>
                  <div className="mt-4 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                    <p className="text-xs text-foreground/60">📍 GPS-based location will be available in a future update for more accurate distance matching.</p>
                  </div>
                </div>
              )}

              {/* Step 2: About Me */}
              {step === 2 && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-xl font-bold text-foreground mb-1">Express yourself</h2>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between">
                      <label className={labelClass}>Bio</label>
                      <span className={`text-xs ${bio.length > 280 ? "text-rose-500" : "text-foreground/50"}`}>{bio.length}/300</span>
                    </div>
                    <textarea
                      placeholder="Write something about yourself..."
                      value={bio}
                      onChange={e => setBio(e.target.value.slice(0, 300))}
                      rows={4}
                      className={inputClass + " resize-none"}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={labelClass}>Prompt Question</label>
                    <select value={promptQuestion} onChange={e => setPromptQuestion(e.target.value)} className={inputClass}>
                      {PROMPT_OPTIONS.map(q => <option key={q} value={q}>{q}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={labelClass}>Your Answer</label>
                    <input type="text" placeholder="Your witty answer..." value={promptAnswer} onChange={e => setPromptAnswer(e.target.value)} className={inputClass} />
                  </div>
                </div>
              )}

              {/* Step 3: Photos */}
              {step === 3 && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-xl font-bold text-foreground mb-1">Add your photos</h2>
                  <p className="text-sm text-foreground/60 -mt-2">Add up to 6 photos. Your first photo is your main one.</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[0, 1, 2, 3, 4, 5].map(i => (
                      <button
                        key={i}
                        className="aspect-[3/4] rounded-2xl border-2 border-dashed border-foreground/20 hover:border-primary/50 bg-foreground/5 flex flex-col items-center justify-center gap-1 transition-colors"
                      >
                        <Camera size={20} className="text-foreground/40" />
                        {i === 0 && <span className="text-[10px] font-semibold text-foreground/40 uppercase">Main</span>}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-foreground/5 border border-border/50 mt-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">Blur my photos</p>
                      <p className="text-xs text-foreground/50">Others must request to see your photos</p>
                    </div>
                    <button
                      onClick={() => setBlurDefault(!blurDefault)}
                      className={`w-12 h-7 rounded-full transition-colors relative ${blurDefault ? "bg-primary" : "bg-foreground/20"}`}
                    >
                      <motion.div
                        className="w-5 h-5 rounded-full bg-white shadow-md absolute top-1"
                        animate={{ left: blurDefault ? 26 : 4 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Preferences */}
              {step === 4 && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-xl font-bold text-foreground mb-1">Your preferences</h2>
                  <p className="text-sm text-foreground/60 -mt-2">Help us find the right people for you.</p>
                  <div className="flex flex-col gap-1.5">
                    <label className={labelClass}>Age Range: {minAge} – {maxAge}</label>
                    <div className="flex gap-3 items-center">
                      <input type="range" min={18} max={60} value={minAge} onChange={e => setMinAge(Math.min(Number(e.target.value), maxAge - 1))} className="flex-1 accent-primary" />
                      <input type="range" min={18} max={60} value={maxAge} onChange={e => setMaxAge(Math.max(Number(e.target.value), minAge + 1))} className="flex-1 accent-primary" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={labelClass}>Show Me</label>
                    <select value={prefGender} onChange={e => setPrefGender(e.target.value)} className={inputClass}>
                      <option value="">Everyone</option>
                      <option value="male">Men</option>
                      <option value="female">Women</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={labelClass}>Religion</label>
                    <input type="text" placeholder="e.g. Islam, Hinduism, Any" value={religion} onChange={e => setReligion(e.target.value)} className={inputClass} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={labelClass}>Max Distance: {maxDistance} km</label>
                    <input type="range" min={5} max={100} value={maxDistance} onChange={e => setMaxDistance(Number(e.target.value))} className="w-full accent-primary" />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3 w-full mt-6">
          {step > 0 && (
            <button
              onClick={back}
              className="flex-1 py-3 rounded-xl border border-border text-foreground font-medium text-sm flex items-center justify-center gap-2 hover:bg-foreground/5 transition-colors"
            >
              <ArrowLeft size={16} /> Back
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button
              onClick={next}
              className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-primary/20"
            >
              Next <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={finish}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-primary/20"
            >
              <Sparkles size={16} /> Start Discovering
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
