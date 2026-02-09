"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import {
  Playfair_Display,
  Lato,
  Patrick_Hand,
  Share_Tech_Mono,
  Great_Vibes,
} from "next/font/google";

// --- Fonts ---
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700"] });
const lato = Lato({ subsets: ["latin"], weight: ["300", "400", "700"] });
const handwritten = Patrick_Hand({ subsets: ["latin"], weight: ["400"] });
const techMono = Share_Tech_Mono({ subsets: ["latin"], weight: ["400"] });
const greatVibes = Great_Vibes({ subsets: ["latin"], weight: ["400"] });

// --- Types ---
type FactoryOption = {
  id: string;
  icon: string;
  name: string;
  desc: string;
};

type MessageOption = {
  id: string;
  text: string;
  icon: string;
};

type View = "anniversary" | "intro" | "factory" | "certificate" | "exit";
type Step = 1 | 2 | 3 | 4;
type FadeState = "in" | "out";

type IntroSlide = {
  text: string;
  subtext: string;
  duration: number;
  bg: string;
  type?: "mechanical";
};

type Selections = {
  base: FactoryOption;
  heart: FactoryOption | null;
  accessory: FactoryOption | null;
  message: MessageOption | null;
};

// --- 🧸 DATA CONSTANTS (Your Customized Text) ---
const BASES: FactoryOption[] = [
  { id: "brown", icon: "🧸", name: "Cuddler", desc: "I am Big in Size (Meri tarah hai ye)..Cuddle will Feel like a Home!! dekhloo and all types of Hug available hai jaise soft...to...bone crushing" },
  { id: "panda", icon: "🐼", name: "Pandaa", desc: "Sleeps 20 hours/day to aapke sapne dekhega or mast mast not nightmares....Waise bhi mai so hi rha hota hu maximum time.(Par mai to boring sapne dekhta hu naa..🥹)" },
  { id: "polar", icon: "🐻‍❄️", name: "Snowy Softyyyy", desc: "Dikhne mai Cool andar se ekdum Warm(Meri tarah😎)...or haa he will help you to fulfil ur bucket list task 1 i.e. Snowfallll❄️)" },
  { id: "koala", icon: "🐨", name: "Koala", desc: "Ekdum Chep..Will never let u go jaise phone nhi katega poore din message spam...mtlb basically Attention seeker ( mai aisa nhi hoon haan 😌)" },
  { id: "pink", icon: "🐷", name: "Bear", desc: "Shy....Aapki tarah ekdum To kam bolega ( to ye chup hi rhega ekdum to phir apni call par silence rhega maximum time to wo bhi dekh lena 😗)" },
  { id: "lion", icon: "🦁", name: "Lion", desc: "Darta nhi kisi se bas haaa apni madam ji se thoda darta hai (aapko protect karega hamesha ekdum)...." },
];

const HEARTS: FactoryOption[] = [
  { id: "red", icon: "❤️", name: "True Love", desc: "Beats only for you, You can trust him always, Always yours." },
  { id: "sparkle", icon: "💖", name: "Drama", desc: "Full OF Drama and Nautanki...mtlb baat baat par naraaj ho jaega phir manate rhnaa (tantrums full..bhai ko princess treatment chahiye..)" },
  { id: "fire", icon: "❤️‍🔥", name: " Passionate", desc: "Intense ekdum Intense haa dekh lena sab kuch passionate ..kiss..hug..love..sab kuch.." },
  { id: "blue", icon: "💙", name: "Loyal & Chill", desc: "Needs BareMinimum Kinda guy aapka hai hamesha or haa cool rhega aap ki daant sun lega saamne se ulte jawab bhi nhi dega ..(wo to mai hu thoda sa nhi..?)" },
  { id: "gold", icon: "💛", name: "Pure", desc: "Ekdum innocent and true ekdum unfiltered( mtlb aap jitna pure innocent to nhi aap to mtlb next level ekdum)" },
  { id: "bandaid", icon: "❤️‍🩹", name: "Healing Heart", desc: "Bandage for your Low days sun lega aapke bad days ko or practical solutions de dega ...at the end you will be healed (emotional solutions hmmm...)" },
];

const ACCESSORIES: FactoryOption[] = [
  { id: "steth", icon: "🩺", name: "Dr.Tanya Special", desc: "Ready for CPR ..test subject basically( kabhi kabhi Mouth to Mouth bhi💋)." },
  { id: "glasses", icon: "👓", name: "Smarty", desc: "Sab khud soch lega aapko dimaag lagane ki jaroorat nhi Practical and Smart Solutions(emotional thode kam..😗)" },
  { id: "tie", icon: "👔", name: "Gentleman", desc: "Gentleman ekdum mtlb Green flag but Fashion wgrh krega ye...Kaaam kam dikhawa jyada aaapki story wgrh bhi laga dega ye hmmmm.." },
  { id: "flower", icon: "🌹", name: "Romantic", desc: "Romantic Baatein karehga hameshaaa...(risk hai ki serious hona chahoge tab bhi ye romance hi ghusa na de khi wo dekh lena)" },
  { id: "coffee", icon: "☕", name: "Night Owl", desc: "Soega nhi jab tak aap so na jao( ye to pretty much mai hu nhi..hn bas 2 baar hi soya hu 🫵🏻?)" },
  { id: "crown", icon: "👑", name: "King", desc: "Leader(will lead whereever needed) but Tanya ji ke aage Bow down ekdum" },
];

const MESSAGES: MessageOption[] = [
  { id: "love", text: "I love you more than sleep!", icon: "😴" },
  { id: "proud", text: "So proud of you, Doctor!(always proud of ur achievements)", icon: "👩‍⚕️" },
  { id: "miss", text: "I miss you meri jaaan cutuuuuu... ( miss krta rhega aapko 24*7)", icon: "🥺" },
  { id: "health", text: "Brush Kari..?, Paani peeya....?, Kaisi hai..?, Ab to dard nhi hai..?", icon: "🍲" },
  { id: "hug", text: "Sending virtual Hugss come baby...come to me Hug mee plsss!", icon: "🤗" },
];

// --- YOUR CUSTOM INTRO SLIDES ---
const INTRO_SLIDES: IntroSlide[] = [
  { text: "Happy Teddy Day my Billi... 🐈", subtext: "", duration: 3000, bg: "bg-[#1a1515]" },
  { text: "I know distance is a Bitch...", subtext: "I can't be there ..Hamesha", duration: 3500, bg: "bg-[#100c0c]" },
  { text: "So I want you to build something...", subtext: "Who can be there ALWAYS with you.", duration: 4000, bg: "bg-[#0a0505]" },
  { text: "WELCOME TO...", subtext: "INITIALIZING..", duration: 3000, type: "mechanical", bg: "bg-black" },
];

const CONFETTI_ICONS = ["🧸", "❤️", "✨", "🌸"] as const;

const STEP_TITLES: Record<Step, string> = {
  1: "First, pick his fur color.",
  2: "Now, give him a soul.",
  3: "Add some personality.",
  4: "Finally, what does he say?",
};

// --- 0. ANNIVERSARY COMPONENT ---
function AnniversaryIntro({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
        const hearts = ["❤️", "💖", "💘", "🌹"];
        
        const createHeart = () => {
            const heart = document.createElement("div");
            heart.innerText = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.position = "absolute";
            heart.style.left = `${Math.random() * 100}vw`;
            heart.style.bottom = "-50px";
            heart.style.fontSize = `${Math.random() * 30 + 15}px`;
            heart.style.opacity = "0.7";
            heart.style.pointerEvents = "none";
            containerRef.current?.appendChild(heart);

            gsap.to(heart, {
                y: -window.innerHeight - 100,
                x: `random(-50, 50)`,
                rotation: `random(0, 360)`,
                duration: `random(4, 8)`,
                ease: "linear",
                onComplete: () => heart.remove()
            });
        };

        const interval = setInterval(createHeart, 400);
        return () => clearInterval(interval);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[60] bg-gradient-to-b from-[#2a0808] to-[#000000] flex flex-col items-center justify-center text-center p-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-900/20 via-transparent to-transparent animate-pulse pointer-events-none"/>

        <div className="relative z-10 animate-in zoom-in duration-1000">
            <p className={`text-rose-400 text-lg md:text-xl tracking-widest uppercase mb-4 ${lato.className}`}>
                10th February 2026
            </p>
            
            <h1 className={`text-5xl md:text-7xl text-white mb-6 leading-tight ${greatVibes.className}`}>
                Happy 2 Month <br/> Anniversary!
            </h1>
            
            <p className={`text-white/70 text-lg md:text-2xl max-w-md mx-auto leading-relaxed mb-12 ${playfair.className}`}>
                "2 Months of us... <br/>
                Pata nhi laga naaa🧿." <br/>
                <span className="text-sm text-rose-300 mt-2 block">(I LOVE YOU 💋)</span>
            </p>

            <button 
                onClick={onComplete}
                className="group relative px-8 py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-full font-bold tracking-widest transition-all shadow-[0_0_30px_rgba(225,29,72,0.4)] hover:shadow-[0_0_50px_rgba(225,29,72,0.6)] hover:scale-105"
            >
                <span className="relative z-10 flex items-center gap-3">
                    ENTER TEDDY DAY 🧸
                </span>
            </button>
        </div>
    </div>
  );
}

// --- 1. INTRO SEQUENCE ---
function IntroSequence({ onComplete }: { onComplete: () => void }) {
  const [slide, setSlide] = useState(0);
  const [fadeState, setFadeState] = useState<FadeState>("in");

  useEffect(() => {
    const currentDuration = INTRO_SLIDES[slide].duration;
    const fadeTimer = setTimeout(() => setFadeState("out"), currentDuration - 1000);
    const nextTimer = setTimeout(() => {
      if (slide < INTRO_SLIDES.length - 1) {
        setSlide((prevSlide) => prevSlide + 1);
        setFadeState("in");
      } else {
        onComplete();
      }
    }, currentDuration);

    return () => { clearTimeout(fadeTimer); clearTimeout(nextTimer); };
  }, [slide, onComplete]);

  const currentSlide = INTRO_SLIDES[slide];

  if (currentSlide.type === "mechanical") {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#333_10px,#333_20px)] animate-[pulse_2s_infinite]" />
        <div className={`text-center transition-opacity duration-1000 ${fadeState === "out" ? "opacity-0" : "opacity-100"}`}>
          <div className="text-6xl mb-6 animate-spin-slow">⚙️</div>
          <h1 className={`text-5xl md:text-7xl font-bold text-gray-200 tracking-[0.2em] mb-4 ${techMono.className} uppercase`}>
            THE BEAR<br />FACTORY
          </h1>
          <p className="text-rose-500 font-mono text-sm tracking-widest animate-pulse">{currentSlide.subtext}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 z-50 ${currentSlide.bg} flex flex-col items-center justify-center text-center p-8 transition-colors duration-1000`}>
      <div className={`max-w-2xl transition-all duration-1000 transform ${fadeState === "out" ? "opacity-0 translate-y-[-20px] scale-105" : "opacity-100 translate-y-0 scale-100"}`}>
        <h1 className={`text-3xl md:text-5xl text-rose-100 leading-tight mb-6 ${playfair.className}`}>{currentSlide.text}</h1>
        {currentSlide.subtext && <p className={`text-lg md:text-xl text-white/60 font-light ${lato.className}`}>{currentSlide.subtext}</p>}
      </div>
    </div>
  );
}

// --- 2. EXIT COMPONENT (HUMAN STYLE) ---
function ExitSequence({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 500);
    const t2 = setTimeout(() => setStep(2), 3500);
    const t3 = setTimeout(() => onComplete(), 7000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center text-center px-4 animate-in fade-in duration-500">
      {step === 1 && (
         <div className="animate-in zoom-in duration-1000">
             <h1 className={`text-3xl md:text-5xl text-white font-bold mb-4 ${playfair.className}`}>
                 You wanna see how I made it?
             </h1>
         </div>
      )}
      {step === 2 && (
         <div className="animate-in slide-in-from-bottom duration-1000">
             <h1 className={`text-2xl md:text-4xl text-rose-300 font-bold mb-4 ${playfair.className}`}>
                 I mean... I tried my best. 😅
             </h1>
             <div className="text-6xl animate-bounce mt-4">👨‍💻</div>
         </div>
      )}
    </div>
  );
}

// --- 3. MAIN PAGE COMPONENT ---
export default function TeddyPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const bearRef = useRef<HTMLDivElement>(null);
  const finalizationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- CHANGED INITIAL STATE TO 'anniversary' ---
  const [view, setView] = useState<View>("anniversary");
  const [step, setStep] = useState<Step>(1);
  const [selections, setSelections] = useState<Selections>({
    base: BASES[0],
    heart: null,
    accessory: null,
    message: null,
  });
  const [isFinalizing, setIsFinalizing] = useState(false);

  // Animation Helpers
  const animateBear = useCallback(() => {
    if (!bearRef.current) return;
    gsap.fromTo(
      bearRef.current,
      { scale: 0.9, rotate: -5 },
      { scale: 1, rotate: 0, duration: 0.4, ease: "back.out(1.7)" },
    );
  }, []);

  const handleFactorySelection = useCallback((item: FactoryOption) => {
      if (step === 1) setSelections(p => ({...p, base: item}));
      if (step === 2) setSelections(p => ({...p, heart: item}));
      if (step === 3) setSelections(p => ({...p, accessory: item}));
      animateBear();
  }, [step, animateBear]);

  const handleMessageSelection = useCallback((item: MessageOption) => {
      setSelections(p => ({...p, message: item}));
      animateBear();
  }, [animateBear]);

  const finalizeBear = useCallback(() => {
    if (finalizationTimeoutRef.current) clearTimeout(finalizationTimeoutRef.current);
    setIsFinalizing(true);
    finalizationTimeoutRef.current = setTimeout(() => {
      setIsFinalizing(false);
      setView("certificate");
      finalizationTimeoutRef.current = null;
    }, 2500);
  }, []);

  const nextStep = useCallback(() => {
    if (step < 4) {
      setStep((prev) => (prev < 4 ? ((prev + 1) as Step) : prev));
    } else {
      finalizeBear();
    }
  }, [finalizeBear, step]);

  const goBack = useCallback(() => {
    setStep((prev) => (prev > 1 ? ((prev - 1) as Step) : prev));
  }, []);

  // --- TRANSITION HANDLERS ---
  const handleAnniversaryComplete = useCallback(() => {
      setView("intro");
  }, []);

  const handleIntroComplete = useCallback(() => {
    setView("factory");
  }, []);

  const handleExitComplete = useCallback(() => {
    router.push("/teddy/code");
  }, [router]);

  const goHome = useCallback(() => {
    router.push("/");
  }, [router]);

  useEffect(() => {
    return () => {
      if (finalizationTimeoutRef.current) clearTimeout(finalizationTimeoutRef.current);
    };
  }, []);

  // Confetti
  useEffect(() => {
    if (view !== "certificate" || !containerRef.current) return;

    const ctx = gsap.context(() => {
      for (let i = 0; i < 60; i += 1) {
        const confetti = document.createElement("div");
        confetti.textContent = CONFETTI_ICONS[Math.floor(Math.random() * CONFETTI_ICONS.length)];
        confetti.style.position = "absolute";
        confetti.style.left = "50%";
        confetti.style.top = "50%";
        confetti.style.fontSize = `${Math.random() * 20 + 10}px`;
        confetti.style.pointerEvents = "none";
        containerRef.current?.appendChild(confetti);

        gsap.to(confetti, {
          x: `random(-400, 400)`,
          y: `random(-600, 600)`,
          rotation: `random(0, 720)`,
          opacity: 0,
          duration: 2.5,
          ease: "power3.out",
          onComplete: () => confetti.remove(),
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [view]);

  // Derived State
  const activeOptions = useMemo(() => {
    if (step === 1) return BASES;
    if (step === 2) return HEARTS;
    if (step === 3) return ACCESSORIES;
    return [];
  }, [step]);

  const selectedFactoryOptionId = step === 1 ? selections.base.id : step === 2 ? selections.heart?.id : step === 3 ? selections.accessory?.id : undefined;
  const isNextDisabled = (step === 2 && !selections.heart) || (step === 3 && !selections.accessory) || (step === 4 && !selections.message);
  
  const certHeart = selections.heart ?? HEARTS[0];
  const certAcc = selections.accessory ?? ACCESSORIES[0];
  const certMsg = selections.message ?? MESSAGES[0];

  return (
    <main
      ref={containerRef}
      className={`relative w-full min-h-screen bg-[#1a1515] text-white flex flex-col items-center py-6 px-4 overflow-x-hidden ${lato.className}`}
    >
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/felt.png')] pointer-events-none" />

      {/* --- VIEW 0: ANNIVERSARY --- */}
      {view === "anniversary" && <AnniversaryIntro onComplete={handleAnniversaryComplete} />}

      {/* --- VIEW 1: INTRO --- */}
      {view === "intro" && <IntroSequence onComplete={handleIntroComplete} />}

      {/* --- VIEW 2: FACTORY --- */}
      {view === "factory" && (
        <>
          <div className="w-full max-w-lg flex justify-between items-end mb-8 border-b border-white/10 pb-4 z-10 animate-in slide-in-from-top duration-700">
            <div>
              <p className={`text-rose-400 text-xs tracking-widest uppercase mb-1 ${lato.className}`}>
                Teddy Day Special <br />
                (Made with Brain & Heart)
              </p>
              <h1 className={`text-3xl font-bold ${playfair.className}`}>The Bear Factory</h1>
            </div>
            <div className="text-right">
              <span className="text-4xl opacity-50 font-bold">{step}</span>
              <span className="text-sm opacity-30">/4</span>
            </div>
          </div>

          <div className="relative z-10 mb-8 animate-in zoom-in duration-500">
            <div className="w-64 h-64 bg-white/5 rounded-full border border-white/10 flex items-center justify-center shadow-[0_0_60px_rgba(255,255,255,0.05)] relative overflow-visible">
              <div className="absolute inset-0 bg-rose-500/10 rounded-full blur-xl" />
              <div ref={bearRef} className="relative text-[140px] leading-none filter drop-shadow-2xl select-none transition-all duration-300">
                <div className="relative z-10">{selections.base.icon}</div>
                {selections.heart && (
                  <div className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40px] z-20 animate-pulse">
                    {selections.heart.icon}
                  </div>
                )}
                {selections.accessory && (
                  <div className="absolute top-[25%] -right-4 text-[60px] z-30 transform rotate-12 drop-shadow-lg">
                    {selections.accessory.icon}
                  </div>
                )}
                {selections.message && (
                  <div
                    className={`absolute -top-10 -left-16 bg-white text-black text-xs p-3 rounded-xl rounded-br-none shadow-xl w-32 animate-bounce ${handwritten.className}`}
                  >
                    &quot;{selections.message.text}&quot;
                  </div>
                )}
              </div>
            </div>
            <p className="text-center text-white/30 text-xs mt-4 uppercase tracking-widest">Live Preview</p>
          </div>

          {!isFinalizing ? (
            <div className="w-full max-w-lg flex-1 flex flex-col z-10 animate-in slide-in-from-bottom duration-500">
              <h2 className={`text-2xl mb-6 text-center ${playfair.className}`}>{STEP_TITLES[step]}</h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                {step < 4 &&
                  activeOptions.map((item) => (
                    <OptionCard
                      key={item.id}
                      item={item}
                      isSelected={selectedFactoryOptionId === item.id}
                      onClick={() => handleFactorySelection(item)}
                    />
                  ))}

                {step === 4 &&
                  MESSAGES.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleMessageSelection(item)}
                      className={`p-4 rounded-xl border transition-all text-left flex items-center gap-3 ${
                        selections.message?.id === item.id
                          ? "bg-rose-600 border-rose-500"
                          : "bg-white/5 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <span className={`text-sm ${handwritten.className} text-lg`}>{item.text}</span>
                    </button>
                  ))}
              </div>

              <div className="mt-auto pt-4 flex justify-between items-center border-t border-white/10">
                {step > 1 && (
                  <button onClick={goBack} className="text-white/50 hover:text-white text-sm uppercase tracking-widest px-4 py-2">
                    ← Back
                  </button>
                )}
                <button
                  onClick={nextStep}
                  disabled={isNextDisabled}
                  className={`ml-auto px-8 py-3 rounded-full font-bold tracking-widest transition-all ${
                    isNextDisabled
                      ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                      : "bg-white text-black hover:scale-105 shadow-lg"
                  }`}
                >
                  {step === 4 ? "Bring to Life ✨" : "Next Step →"}
                </button>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center">
              <div className="text-6xl animate-bounce mb-8">🧵</div>
              <h2 className={`text-2xl text-rose-400 ${playfair.className}`}>Hmm.. In Progress...</h2>
              <p className="text-white/40 text-sm mt-2">Adding some extra Cotton...</p>
            </div>
          )}
        </>
      )}

      {/* --- VIEW 3: CERTIFICATE --- */}
      {view === "certificate" && (
        <div className="relative z-20 flex flex-col items-center justify-center animate-in zoom-in duration-700 p-4 w-full">
          <div className="w-full max-w-sm bg-[#fdfbf7] text-gray-900 p-8 rounded-sm shadow-2xl transform rotate-1 relative overflow-hidden">
            <div className="absolute inset-0 opacity-50 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]" />

            <div className="w-32 h-32 mx-auto bg-gray-100 rounded-full border-4 border-double border-rose-200 flex items-center justify-center mb-6 relative">
              <span className="text-6xl">{selections.base.icon}</span>
              <span className="absolute text-2xl top-16 right-6">{certHeart.icon}</span>
              <span className="absolute text-3xl top-14 left-6">{certAcc.icon}</span>
            </div>

            <div className="text-center mb-8">
              <h2 className={`text-3xl font-bold text-rose-900 mb-1 ${playfair.className}`}>Birth Certificate</h2>
              <p className="text-xs tracking-[0.3em] text-gray-400 uppercase">Baby Version Of Me</p>
            </div>

            <div className="space-y-4 text-left border-t border-b border-gray-200 py-6 mb-6">
              <div className="flex justify-between items-end">
                <span className="text-xs text-gray-400 uppercase tracking-widest">Name</span>
                <span className={`text-xl font-bold ${handwritten.className}`}>Mr. {selections.base.name.split(" ")[0]}</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-xs text-gray-400 uppercase tracking-widest">Personality</span>
                <span className={`text-lg ${handwritten.className}`}>{certHeart.name}</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-xs text-gray-400 uppercase tracking-widest">Job</span>
                <span className={`text-lg ${handwritten.className}`}>{certAcc.name}</span>
              </div>
              <div className="mt-4 bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                <span className="text-xs text-yellow-600 uppercase tracking-widest block mb-1">He is...:</span>
                <p className={`text-lg leading-tight ${handwritten.className}`}>&quot;{certMsg.text}&quot;</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase">Created By</p>
                <p className={`text-lg ${handwritten.className}`}>Dr. Tanya</p>
              </div>
              <div className="w-16 h-16 border-2 border-rose-800 rounded-full flex items-center justify-center opacity-80 rotate-[-15deg]">
                <span className="text-[10px] font-bold text-rose-800 uppercase text-center leading-tight">
                  100%<br />CUTE<br />VERIFIED
                </span>
              </div>
            </div>
          </div>

          {/* DEVELOPER BUTTON */}
          <div className="flex flex-col gap-4 mt-8 w-full max-w-xs items-center animate-in slide-in-from-bottom duration-1000 delay-500">
            <button
              onClick={() => setView("exit")}
              className="group relative px-6 py-3 bg-[#1e1e1e] border border-gray-800 rounded text-green-500 font-mono text-xs hover:border-green-500 hover:shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all w-full flex items-center justify-center gap-3 overflow-hidden shadow-2xl"
            >
              <span className="absolute inset-0 bg-green-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative">{"console.log(\"Show My World\")"}</span>
              <span className="relative animate-pulse">_</span>
            </button>

            <button
              onClick={goHome}
              className="text-white/30 hover:text-white uppercase tracking-widest text-[10px] transition-colors"
            >
              Return to Hub
            </button>
          </div>
        </div>
      )}

      {/* --- VIEW 4: EXIT SEQUENCE --- */}
      {view === "exit" && <ExitSequence onComplete={handleExitComplete} />}
    </main>
  );
}

// --- OPTION CARD COMPONENT ---
type OptionCardProps = {
  item: FactoryOption;
  isSelected: boolean;
  onClick: () => void;
};

const OptionCard = memo(function OptionCard({ item, isSelected, onClick }: OptionCardProps) {
  return (
    <button
      onClick={onClick}
      className={`relative p-4 rounded-xl border text-left transition-all duration-200 group ${
        isSelected
          ? "bg-rose-900/30 border-rose-500 shadow-[0_0_20px_rgba(225,29,72,0.2)]"
          : "bg-white/5 border-white/10 hover:bg-white/10"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-3xl transform group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
        {isSelected && <span className="text-rose-500 text-lg">✓</span>}
      </div>
      <h3 className={`font-bold text-sm mb-1 ${isSelected ? "text-rose-200" : "text-white"}`}>{item.name}</h3>
      <p className="text-[10px] text-white/50 leading-tight">{item.desc}</p>
    </button>
  );
});