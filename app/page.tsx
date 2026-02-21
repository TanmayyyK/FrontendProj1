"use client";

import React, { useState, useEffect, useRef, memo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import gsap from "gsap";
import { Playfair_Display, Lato, Share_Tech_Mono, Great_Vibes } from "next/font/google";
import { X, Heart, Sun, Smile, Disc, Bell, ArrowRight, AlertCircle, Send, Wind } from "lucide-react"; 

// --- FONTS ---
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700"] });
const lato = Lato({ subsets: ["latin"], weight: ["300", "400", "700"] });
const techMono = Share_Tech_Mono({ subsets: ["latin"], weight: ["400"] });
const signature = Great_Vibes({ subsets: ["latin"], weight: ["400"] });

// --- CONFIGURATION ---
const IS_DEV_MODE = false; 
const START_DATE = new Date("2025-12-10T00:02:00"); 
const PREMIERE_DATE = new Date("2026-02-23T00:00:00");
const YOUR_WHATSAPP_NUMBER = "919416008686"; // <--- REPLACE WITH YOUR NUMBER

// --- PASSCODE CONFIG ---
const PASSCODE = "10/12/2025/00/02"; 

// --- DATA ---
const LONG_MESSAGE = `My Cutuuuu,

Hmm.. Kya bolu yrrr Don't know what to say but one thing I know for Sure 10/12/2025 this day changed my perspective of the life completely. 
Before that bas Life was passing by but now after I got you....My Life suddenly has a purpose and Believe me I constantly try to become a better person for you baby just for you...

You try to make me a better person, you appreciate me, you care for me, you are my everything tanya literally everything..
You are my comfort place and when I use the word comfort here it holds a meaning my girl..you are my comfort like I am also an introvert kind of guy but you brought my inner side yo life Thank you for that my love.... 

And I know distance is hard meri jaaan but koi nhi we are heading to something better...one day there will be no screens between use we would be living together heheh..

Until then, this cutuuu little world in the form of valentines is holding ur hand...it has me in every pixel..whenever u miss me and I am not there just come to this and u will have me . 
Every pixel here is coded with love. Every animation is a heartbeat for my babyyyy.

And Don't cry okay........
Chalo Get ready to explore this world
I coded this with all my heart, all my blood, and all the brain I had I hope u like it.....

All the best meri jaaaan ( and when I say meri jaan I mean it ..okay...ur breathe is my oxygen , your heart beats..mine beats)
Keep giving me 2H( Happy , Healthy) and 1S(Safe..)

Forever yours,
Tanmay ❤️`;

const MEMORIES = [ "10th Nov", "10th Dec", "Cuutuuu", "Baby", "Princess", "Tanya My Love", "❤️", "Dr. Cutuuu", "Safe Place", "Forever", "Tanmay" ];

const DAYS = [ 
    { id: "rose", title: "Rose Day", unlockAt: "2026-02-07T00:02:00", icon: "🌹", path: "/rose" }, 
    { id: "propose", title: "Propose Day", unlockAt: "2026-02-07T00:02:00", icon: "💍", path: "/propose" }, 
    { id: "chocolate", title: "Chocolate Day", unlockAt: "2026-02-07T00:02:00", icon: "🍫",path: "/chocolate" }, 
    { id: "teddy", title: "Teddy Day", unlockAt: "2026-02-10T00:00:00", icon: "🧸" , path: "/teddy"}, 
    { id: "promise", title: "Promise Day", unlockAt: "2026-02-10T18:00:00", icon: "🤝",path: "/promise" }, 
    { id: "hug", title: "Hug Day", unlockAt: "2026-02-13T00:00:00", icon: "🫂" , path: "/hug"}, 
    { id: "kiss", title: "Kiss Day", unlockAt: "2026-02-23T00:00:00", icon: "💋" , path: "/kiss"} 
];

const OPEN_WHEN_MESSAGES = [
    { id: "miss", label: "MISSING ME", icon: <Heart size={14} />, color: "bg-rose-900/40 border-rose-500/30", text: "Close your eyes. I'm hugging you right now (Just Imagine You are in my arms)." },
    { id: "happy", label: "FEELING HAPPY", icon: <Sun size={14} />, color: "bg-yellow-900/40 border-yellow-500/30", text: "Photo Kheechooo Photo Khecchooo! You look beautiful when u smile (Your Smile is very precious to me)." },
    { id: "tired", label: "FEELING TIRED", icon: <Smile size={14} />, color: "bg-purple-900/40 border-purple-500/30", text: "Rest now, Dr. The world can wait. (Or Call me I will Listen to you..)" }
];
 
const DAILY_SONGS = [ { title: "Perfect", artist: "Ed Sheeran" }, { title: "Tum Se Hi", artist: "Mohit Chauhan" }, { title: "Lover", artist: "Taylor Swift" }, { title: "Raataan Lambiyan", artist: "Jubin Nautiyal" }, { title: "Kesariya", artist: "Arijit Singh" } ];

// --- HELPERS ---
const calculateTimeLeft = (targetDate: string) => {
    const difference = +new Date(targetDate) - +new Date();
    if (difference > 0) {
        return {
            d: Math.floor(difference / (1000 * 60 * 60 * 24)),
            h: Math.floor((difference / (1000 * 60 * 60)) % 24),
            m: Math.floor((difference / 1000 / 60) % 60),
            s: Math.floor((difference / 1000) % 60),
        };
    }
    return null;
};

// --- ISOLATED COMPONENTS ---

const MusicPlayer = ({ shouldPlay }: { shouldPlay: boolean }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.volume = 0.4;

        const attemptPlay = () => {
            audio.play().then(() => {
                setIsPlaying(true);
                document.removeEventListener('click', attemptPlay);
                document.removeEventListener('touchstart', attemptPlay);
            }).catch(() => {
                setIsPlaying(false);
            });
        };

        if (shouldPlay) {
            attemptPlay();
            document.addEventListener('click', attemptPlay, { once: true });
            document.addEventListener('touchstart', attemptPlay, { once: true });
        }

        return () => {
            document.removeEventListener('click', attemptPlay);
            document.removeEventListener('touchstart', attemptPlay);
        };
    }, [shouldPlay]);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play();
            setIsPlaying(true);
        }
    };
    
    return (
        <button 
            onClick={togglePlay} 
            className="fixed top-6 left-6 z-[100] group w-12 h-12 bg-black/40 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center hover:bg-black/60 transition-all shadow-xl"
        >
            <div className={`relative ${isPlaying ? 'animate-spin-slow' : ''}`}>
                <Disc size={24} className="text-zinc-400 group-hover:text-white transition-colors" />
                {isPlaying && <div className="absolute w-2 h-2 bg-rose-500 rounded-full top-0 right-0 animate-pulse border border-black" />}
            </div>
            <audio ref={audioRef} loop src="/bg3.mp3" preload="auto" />
        </button>
    );
};

const LockScreenBackground = memo(() => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const ctx = gsap.context(() => {
            document.querySelectorAll(".memory-float").forEach((mem) => {
                gsap.set(mem, { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight });
                gsap.to(mem, { x: `random(-50, 50)`, y: `random(-50, 50)`, rotation: `random(-5, 5)`, duration: `random(15, 30)`, repeat: -1, yoyo: true, ease: "sine.inOut" });
                gsap.to(mem, { opacity: `random(0.1, 0.3)`, duration: `random(5, 10)`, repeat: -1, yoyo: true, ease: "sine.inOut" });
            });
            document.querySelectorAll(".firefly").forEach((fly) => {
                gsap.to(fly, { x: `random(-100, 100)`, y: `random(-100, 100)`, opacity: `random(0.3, 0.8)`, scale: `random(0.8, 1.2)`, duration: `random(10, 20)`, repeat: -1, yoyo: true, ease: "sine.inOut" });
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(20)].map((_, i) => ( 
                <div key={`fly-${i}`} className="firefly absolute w-1 h-1 bg-rose-400 rounded-full blur-[1px] opacity-70" style={{ left: `${Math.random()*100}%`, top: `${Math.random()*100}%` }}></div> 
            ))}
            {MEMORIES.map((text, i) => ( 
                <div key={i} className={`memory-float absolute text-white/5 font-bold whitespace-nowrap select-none ${i % 2 === 0 ? playfair.className : signature.className}`} style={{ fontSize: `${Math.random() * 30 + 15}px` }}>{text}</div> 
            ))}
        </div>
    );
});
LockScreenBackground.displayName = "LockScreenBackground";

const RelationshipTimer = () => {
    const calculateTime = () => {
        const now = new Date();
        const diff = now.getTime() - START_DATE.getTime();
        return {
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((diff / 1000 / 60) % 60),
            seconds: Math.floor((diff / 1000) % 60)
        };
    };

    const [time, setTime] = useState(calculateTime());
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const timer = setInterval(() => {
            setTime(calculateTime());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    if (!mounted) return <div className="h-16"></div>; 

    return (
        <div className="flex gap-4 md:gap-6 mb-12 opacity-80 scale-90 md:scale-100 font-light animate-in fade-in zoom-in duration-500">
            {['Days', 'Hrs', 'Mins'].map((unit, i) => (
                <div key={unit} className="flex flex-col items-center">
                    <span className={`text-3xl font-bold ${techMono.className}`}>
                        {Object.values(time)[i]}
                    </span>
                    <span className="text-[9px] uppercase text-white/40 tracking-widest">{unit}</span>
                </div>
            ))}
            <div className="flex flex-col items-center">
                <span className={`text-3xl font-bold text-rose-500 animate-heartbeat ${techMono.className}`}>
                    {time.seconds}
                </span>
                <span className="text-[9px] uppercase text-rose-500/60 tracking-widest">Secs</span>
            </div>
        </div>
    );
};

const CardTimer = ({ targetDate }: { targetDate: string }) => {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft(targetDate));
        }, 1000 * 60); 
        return () => clearInterval(timer);
    }, [targetDate]);

    if (!timeLeft) return <span className="text-[10px] text-green-400">OPEN</span>;

    return (
        <div className={`flex gap-2 text-[10px] text-rose-400/80 font-mono tracking-wide ${techMono.className}`}>
            <span>{timeLeft.d}d</span>
            <span>{timeLeft.h}h</span>
            <span>{timeLeft.m}m</span>
        </div>
    );
};

// --- MAIN HUB CONTENT ---
function HubContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isTestMode = searchParams.get("test") === "1"; 
  const TEST_MODE_ALLOWED_DAYS = ["rose", "propose", "chocolate"];

  const lockScreenRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null); 
  const feelingsRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null); 
  
  const [screen, setScreen] = useState<"loading" | "lock" | "home">("loading");
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  // Modals & Interactivity
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [activeOpenWhen, setActiveOpenWhen] = useState<typeof OPEN_WHEN_MESSAGES[0] | null>(null);
  
  // Passcode States
  const [showPasscode, setShowPasscode] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [isError, setIsError] = useState(false);

  // Exclamation Logic
  const [showCheckModal, setShowCheckModal] = useState(false);
  const [showFeelingsModal, setShowFeelingsModal] = useState(false);
  const [showListeningMessage, setShowListeningMessage] = useState(false); // NEW STATE
  const [feelingText, setFeelingText] = useState("");

  useEffect(() => { 
      const interval = setInterval(() => { 
          setLoadingProgress((prev) => { 
              if (prev >= 100) { 
                  clearInterval(interval); 
                  setScreen("lock"); 
                  return 100; 
              } 
              return prev + 2; 
          }); 
      }, 30); 
      return () => clearInterval(interval); 
  }, []);

  const handleUnlock = () => {
    if (lockScreenRef.current) {
        const ctx = gsap.context(() => { 
            gsap.to(".memory-float", { scale: 1.5, opacity: 0, duration: 1.5, stagger: { amount: 0.5, from: "center" }, ease: "power2.out" }); 
            gsap.to(lockScreenRef.current, { opacity: 0, filter: "blur(20px)", duration: 1.2, delay: 0.3, onComplete: () => setScreen("home") }); 
        }, lockScreenRef);
        return () => ctx.revert();
    }
  };

  const handleDayClick = (day: typeof DAYS[0]) => { 
      const today = new Date(); 
      const isUnlocked = IS_DEV_MODE || (isTestMode && TEST_MODE_ALLOWED_DAYS.includes(day.id)) || today >= new Date(day.unlockAt); 
      if (isUnlocked && day.path) {
          router.push(day.path); 
      } else { 
          gsap.fromTo(`#card-${day.id}`, { x: -3, rotate: -1 }, { x: 3, rotate: 1, duration: 0.08, repeat: 5, yoyo: true }); 
      }
  };
  
  const handlePremiereClick = () => { 
      const today = new Date();
      if (IS_DEV_MODE || today >= PREMIERE_DATE) {
          router.push("/gallery"); 
      } else {
          gsap.fromTo("#premiere-ticket", { x: -3, scale: 0.98 }, { x: 3, scale: 1, duration: 0.08, repeat: 5, yoyo: true });
      }
  };

  const handlePasscodeSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (inputCode === PASSCODE) {
          setShowPasscode(false);
          setIsLetterOpen(true);
          setInputCode("");
      } else {
          setIsError(true);
          setTimeout(() => {
              setIsError(false);
              setInputCode("");
          }, 500);
      }
  };

  const handleCheckResponse = (response: 'yes' | 'no') => {
      if (response === 'no') {
          gsap.fromTo(".check-modal", { x: -5 }, { x: 5, duration: 0.1, repeat: 5, yoyo: true });
          alert("Go watch them first my Cutuuu! 🌹💍🍫");
          setShowCheckModal(false);
      } else {
          setShowCheckModal(false);
          setTimeout(() => setShowFeelingsModal(true), 300);
      }
  };

  const handleFadeAway = () => {
      if (textAreaRef.current) {
          // 1. Animate ONLY the Text content fading and floating up
          gsap.to(textAreaRef.current, {
              color: "transparent",
              textShadow: "0px -20px 20px rgba(255,255,255,0.5)",
              duration: 2,
              ease: "power2.inOut",
              onComplete: () => {
                  // 2. Hide Modal & Show Listening Screen
                  setShowFeelingsModal(false);
                  setShowListeningMessage(true);
                  setFeelingText("");
                  
                  // 3. Reset Textarea style for next time
                  gsap.set(textAreaRef.current, { clearProps: "all" });

                  // 4. After 3 seconds, hide Listening Screen and return to Lock Screen state
                  setTimeout(() => {
                      setShowListeningMessage(false);
                  }, 3500);
              }
          });
      }
  };

  // --- FIXED: Handle Send Whatsapp ---
  // Simply opens the link and closes the modal, returning to the lock screen immediately.
  const handleSendWhatsapp = () => {
      const text = encodeURIComponent(`Hun🤍.... \n\n ${feelingText}`);
      window.open(`https://wa.me/${YOUR_WHATSAPP_NUMBER}?text=${text}`, '_blank');
      
      // Close Modal & Reset immediately
      setShowFeelingsModal(false);
      setFeelingText("");
      setScreen("lock"); 
  };
  
  const isMovieLocked = !IS_DEV_MODE && new Date() < PREMIERE_DATE;

  return (
    <>
      <MusicPlayer shouldPlay={screen !== "loading"} />

      {screen === "loading" && <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black"><div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden mb-4"><div className="h-full bg-rose-600 transition-all duration-75 ease-out" style={{ width: `${loadingProgress}%` }} /></div><p className={`text-rose-500 text-xs font-bold tracking-[0.3em] uppercase ${techMono.className} animate-pulse`}>Loading Tanya's World... {loadingProgress}%</p></div>}

      {/* --- LISTENING MESSAGE SCREEN --- */}
      {showListeningMessage && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black animate-in fade-in duration-1000">
              <div className="text-center px-6">
                  <div className="mb-6 flex justify-center">
                      <Wind size={48} className="text-rose-500/50 animate-pulse" />
                  </div>
                  <h2 className={`text-2xl md:text-4xl text-white/90 font-light tracking-wide leading-relaxed ${playfair.className}`}>
                      No Worries!!
                  </h2>
                  <p className="text-white/30 text-xs mt-4 uppercase tracking-[0.3em] font-mono">
                      Website Has Listned To It........
                  </p>
              </div>
          </div>
      )}

      {screen === "lock" && (
        <div ref={lockScreenRef} className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-[radial-gradient(circle_at_center,_#2a0a12_0%,_#000000_100%)] overflow-hidden">
          
          <LockScreenBackground />
          
          {/* Main Lock Screen Content */}
          <div className={`relative z-10 w-full max-w-md flex flex-col items-center text-center px-4 transition-all duration-500 ${activeOpenWhen || isLetterOpen || showPasscode || showCheckModal || showFeelingsModal || showListeningMessage ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'}`}>
             
             <div className="mb-8 space-y-1">
                 <p className={`text-rose-400 text-xs md:text-sm tracking-[0.4em] uppercase ${techMono.className}`}>10-12-2025 -- Forever</p>
                 <h1 className={`text-6xl md:text-8xl font-bold text-white leading-none ${playfair.className}`}>Tanya's<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-red-800">World</span></h1>
             </div>

             <div className="mb-6 w-full max-w-xs bg-rose-950/30 border border-rose-500/20 rounded-xl p-3 flex items-start gap-3 backdrop-blur-sm animate-fade-in-up">
                <Bell size={16} className="text-rose-500 mt-1 flex-shrink-0 animate-pulse" />
                <div className="text-left">
                    <p className={`text-[10px] text-rose-400 font-bold uppercase tracking-widest ${techMono.className}`}>Anything Happens Always Remember!!</p>
                    <p className="text-xs text-rose-100/90 leading-relaxed font-light">Distance is temporary. We are forever.</p>
                </div>
             </div>

             <div className="flex justify-center gap-2 mb-10 w-full flex-wrap">
                {OPEN_WHEN_MESSAGES.map((msg) => (
                    <button key={msg.id} onClick={(e) => { e.stopPropagation(); setActiveOpenWhen(msg); }} className={`flex items-center gap-2 px-3 py-2 rounded-full border ${msg.color} backdrop-blur-md hover:scale-105 transition-transform`}>
                        <span className="text-white/80">{msg.icon}</span>
                        <span className="text-[9px] text-white font-medium uppercase tracking-wider">{msg.label}</span>
                    </button>
                ))}
             </div>

             <RelationshipTimer />

             <button onClick={handleUnlock} className="group relative flex items-center justify-center w-24 h-24 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-500 cursor-pointer">
                <div className="absolute inset-0 rounded-full border border-rose-500/30 animate-ping opacity-75 duration-3000" />
                <span className="text-3xl filter drop-shadow-[0_0_10px_rgba(225,29,72,0.8)] animate-pulse">❤️</span>
                <span className="absolute -bottom-10 text-[10px] text-white/40 uppercase tracking-widest group-hover:text-rose-400 transition-colors">Tap to Enter</span>
             </button>
          </div>
          
          {/* Top Right: Message Icon */}
          <button 
            onClick={(e) => { e.stopPropagation(); setShowPasscode(true); }} 
            className={`absolute top-6 right-6 z-20 w-14 h-14 bg-white/5 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center hover:bg-rose-900/40 hover:scale-110 transition-all duration-300 group ${isLetterOpen || showPasscode || showCheckModal || showFeelingsModal || showListeningMessage ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full animate-ping" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border border-black" />
            <span className="text-2xl group-hover:animate-bounce">📩</span>
          </button>

          {/* Bottom Left: THE SECRET EXCLAMATION */}
          <button
            onClick={(e) => { e.stopPropagation(); setShowCheckModal(true); }}
            className={`absolute bottom-6 left-6 z-20 w-14 h-14 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-rose-500/50 hover:bg-white/10 hover:text-rose-400 hover:border-rose-500/30 transition-all duration-500 hover:scale-110 ${isLetterOpen || showPasscode || showCheckModal || showFeelingsModal || showListeningMessage ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
              <div className="absolute inset-0 rounded-full animate-ping opacity-10 bg-rose-500/20"></div>
              <AlertCircle size={28} />
          </button>
          
          {/* --- MODAL 1: CHECK MODAL --- */}
          <div className={`absolute inset-0 z-40 flex items-center justify-center bg-black/90 backdrop-blur-md transition-all duration-500 ${showCheckModal ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`} onClick={() => setShowCheckModal(false)}>
              <div onClick={(e) => e.stopPropagation()} className="check-modal w-full max-w-sm bg-[#1a0505] border border-rose-900/50 p-8 rounded-2xl text-center shadow-2xl">
                  <h3 className={`text-xl text-white mb-4 ${playfair.className}`}>Hmmm...</h3>
                  <p className="text-white/70 text-sm mb-8 font-light">Have you visited the Rose, Propose, and Chocolate worlds yet?</p>
                  <div className="flex gap-4 justify-center">
                      <button onClick={() => handleCheckResponse('no')} className="px-6 py-3 rounded-full border border-white/10 text-white/50 hover:text-white text-xs uppercase tracking-widest transition-colors">
                          Not Yet
                      </button>
                      <button onClick={() => handleCheckResponse('yes')} className="px-6 py-3 rounded-full bg-rose-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-rose-500 shadow-lg transition-transform active:scale-95">
                          Yes, All 3!
                      </button>
                  </div>
              </div>
          </div>

          {/* --- MODAL 2: FEELINGS MODAL --- */}
          <div className={`absolute inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl transition-all duration-700 ${showFeelingsModal ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
              <div ref={feelingsRef} className="feelings-content w-full max-w-md p-8 text-center relative">
                  <button onClick={() => setShowFeelingsModal(false)} className="absolute -top-12 right-0 text-white/30 hover:text-white"><X /></button>
                  
                  <h2 className={`text-3xl text-rose-500 mb-6 ${playfair.className}`}>How are you feeling?</h2>
                  <p className="text-white/60 text-sm mb-8">Babe...Write Anything You Want!!!.</p>
                  
                  <textarea 
                    ref={textAreaRef} 
                    value={feelingText}
                    onChange={(e) => setFeelingText(e.target.value)}
                    placeholder="Kitna Acha laga itna ya itnaaaaaaa..??"
                    className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:border-rose-500 outline-none mb-8 resize-none font-light"
                  />

                  <div className="flex flex-col gap-4">
                      <button 
                        onClick={handleSendWhatsapp}
                        className="w-full py-4 bg-[#25D366] hover:bg-[#1ebe57] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-green-900/20 active:scale-95"
                      >
                          <Send size={18} />
                          Send to me
                      </button>
                      
                      <button 
                        onClick={handleFadeAway}
                        className="w-full py-4 bg-transparent border border-white/10 text-white/60 hover:text-white hover:border-white/30 rounded-xl flex items-center justify-center gap-2 transition-all group"
                      >
                          <Wind size={18} className="group-hover:translate-x-1 transition-transform" />
                         Let it fade...
                      </button>
                  </div>
              </div>
          </div>

          {/* PASSCODE MODAL */}
          <div className={`absolute inset-0 z-40 flex items-center justify-center bg-black/90 backdrop-blur-xl transition-all duration-500 ${showPasscode ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`} onClick={() => setShowPasscode(false)}>
              <div onClick={(e) => e.stopPropagation()} className="flex flex-col items-center w-full max-w-xs">
                  <div className="mb-6 text-center">
                      <p className={`text-rose-500 text-xs uppercase tracking-[0.2em] font-bold ${techMono.className}`}>
                          {isError ? "Incorrect Code" : "When we came together"}
                      </p>
                      <p className="text-[10px] text-white/40 mt-2 uppercase tracking-widest">DD/MM/YYYY/HH/MM</p>
                  </div>
                  <form onSubmit={handlePasscodeSubmit} className={`flex flex-col items-center w-full gap-4 ${isError ? 'animate-shake' : ''}`}>
                      <div className="relative w-full">
                          <input 
                              type="password" 
                              value={inputCode}
                              onChange={(e) => setInputCode(e.target.value)}
                              placeholder="Enter Date..."
                              className="w-full bg-white/5 border border-white/20 rounded-full py-3 px-6 text-center text-white placeholder-white/30 outline-none focus:border-rose-500 transition-all font-mono tracking-widest"
                              autoFocus
                          />
                          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-rose-600 rounded-full flex items-center justify-center hover:bg-rose-500 transition-colors">
                              <ArrowRight size={14} className="text-white" />
                          </button>
                      </div>
                  </form>
                  <button onClick={() => setShowPasscode(false)} className="mt-8 text-white/30 hover:text-white transition-colors"><X size={24} /></button>
              </div>
          </div>

          {/* LETTER MODAL */}
          <div className={`absolute inset-0 z-30 flex items-center justify-center bg-black/80 backdrop-blur-md p-6 transition-all duration-700 ${isLetterOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`} onClick={(e) => { e.stopPropagation(); setIsLetterOpen(false); }}>
            <div ref={letterRef} onClick={(e) => e.stopPropagation()} className="w-full max-w-lg bg-[#fffbf0] text-gray-900 p-8 md:p-12 rounded-lg shadow-2xl relative">
                <button onClick={() => setIsLetterOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-xl">✕</button>
                <div className="overflow-y-auto max-h-[50vh] pr-4 custom-scrollbar">
                    <h2 className={`text-3xl font-bold text-rose-800 mb-6 text-center ${playfair.className}`}>For My Tanya</h2>
                    <p className={`text-base md:text-lg leading-relaxed whitespace-pre-line ${lato.className} text-gray-800`}>{LONG_MESSAGE}</p>
                </div>
                <div className="mt-8 text-center pt-6 border-t border-gray-200"><p className="text-xs text-gray-400 uppercase tracking-widest">Read with love • 100% Truth</p></div>
            </div>
          </div>

          {/* OPEN WHEN MODAL */}
          <div className={`absolute inset-0 z-30 flex items-center justify-center bg-black/80 backdrop-blur-md p-6 transition-all duration-500 ${activeOpenWhen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`} onClick={() => setActiveOpenWhen(null)}>
             {activeOpenWhen && (
                 <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm bg-zinc-900 border border-white/10 p-6 rounded-2xl text-center relative shadow-2xl">
                     <button onClick={() => setActiveOpenWhen(null)} className="absolute top-4 right-4 text-white/50 hover:text-white"><X size={20} /></button>
                     <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">{activeOpenWhen.icon}</div>
                     <h3 className={`text-xl text-white mb-2 ${techMono.className}`}>{activeOpenWhen.label}</h3>
                     <p className="text-white/60 text-sm leading-relaxed">{activeOpenWhen.text}</p>
                 </div>
             )}
          </div>
        </div>
      )}

      {/* --- HOME HUB --- */}
      {screen === "home" && (
        <div className="relative z-30 w-full h-full flex flex-col items-center bg-[#050202] animate-in fade-in duration-1000">
          <div className="w-full h-full overflow-y-auto custom-scrollbar px-4 pt-24 pb-24">
              <div className="w-full max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-rose-900/30 pb-6 gap-4">
                    <div><p className={`text-rose-500 text-xs font-bold tracking-[0.2em] ${techMono.className} mb-2`}>EST. 2025</p><h2 className={`text-4xl text-white ${playfair.className}`}>A Little Love, Daily</h2></div>
                    <div className="text-left md:text-right"><p className="text-rose-500/60 text-xs uppercase tracking-widest mb-1">Right Now</p><p className="text-green-400 text-sm font-mono tracking-widest flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>Thinking About You</p></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                    {DAYS.map((day) => {
                    const today = new Date();
                    const isUnlocked = IS_DEV_MODE || (isTestMode && TEST_MODE_ALLOWED_DAYS.includes(day.id)) || today >= new Date(day.unlockAt); 
                    return (
                        <div key={day.id} id={`card-${day.id}`} onClick={() => handleDayClick(day)} className={`relative aspect-[3/4] rounded-2xl flex flex-col items-center justify-center gap-3 border transition-all duration-300 cursor-pointer group overflow-hidden ${isUnlocked ? "bg-gray-900/40 border-rose-500/20 hover:border-rose-500 hover:bg-rose-900/10 p-4" : "bg-[#1a0505] border-rose-900/30 hover:scale-[1.02] shadow-[0_0_15px_rgba(225,29,72,0.05)]" }`}>
                        {isUnlocked ? (
                            <><div className="absolute inset-0 bg-gradient-to-t from-rose-900/20 to-transparent rounded-2xl pointer-events-none" /><span className="text-4xl md:text-5xl filter drop-shadow-[0_0_10px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">{day.icon}</span><div className="text-center z-10 mt-2"><h3 className="font-medium text-sm md:text-base text-rose-100">{day.title}</h3><p className={`text-[10px] uppercase tracking-widest font-mono mt-1 ${techMono.className} text-rose-400`}>{new Date(day.unlockAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</p></div></>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center relative">
                                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] mix-blend-overlay" />
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-rose-950/50 to-rose-900/20" />
                                <div className="relative z-10 group-hover:animate-pulse transition-all duration-1000 mb-2">
                                    <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(225,29,72,0.5)]">💌</span>
                                    <div className="absolute -bottom-1 -right-2 bg-black/60 rounded-full p-1 border border-rose-500/30"><span className="text-[10px] block">🔒</span></div>
                                </div>
                                <div className="z-10 text-center">
                                    <p className={`text-[9px] text-rose-400/70 uppercase tracking-[0.2em] mb-1 ${techMono.className}`}>Opens In</p>
                                    <CardTimer targetDate={day.unlockAt} />
                                </div>
                            </div>
                        )}
                        </div>
                    );
                    })}
                </div>
                <div className="w-full pb-12"><div className="flex items-center gap-4 mb-6"><div className="h-[1px] bg-rose-900/50 flex-1" /><span className={`text-rose-500/50 text-xs uppercase tracking-widest ${techMono.className}`}>Valentine's Day</span><div className="h-[1px] bg-rose-900/50 flex-1" /></div><button id="premiere-ticket" onClick={handlePremiereClick} className={`w-full group relative overflow-hidden rounded-2xl border p-6 md:p-10 transition-all duration-500 ${isMovieLocked ? "bg-gray-900/20 border-white/5 cursor-not-allowed hover:border-red-500/30" : "bg-gray-900/40 border-rose-500/30 hover:border-rose-500 hover:shadow-[0_0_30px_rgba(225,29,72,0.15)]"}`}><div className={`flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 transition-all duration-500 ${isMovieLocked ? "blur-sm opacity-30 grayscale" : ""}`}><div className="flex items-center gap-6"><div className="w-20 h-20 rounded-full bg-rose-950 flex items-center justify-center border border-rose-500/20 text-4xl shadow-inner">🎬</div><div className="text-left"><h3 className={`text-2xl md:text-4xl text-white font-bold ${playfair.className}`}>The Tanya Movie</h3><p className="text-rose-400 text-xs uppercase tracking-widest mt-2">A Visual Journey • 20 Photos</p></div></div><div className="text-right hidden md:block"><p className={`text-xs text-gray-500 uppercase tracking-widest mb-1 ${techMono.className}`}>Premiere Date</p><p className="text-xl md:text-3xl font-bold text-white">FEB 14, 2026</p></div></div>{isMovieLocked && (<div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px]"><div className="bg-black/80 px-6 py-3 rounded-full border border-rose-500/50 flex items-center gap-3"><span className="animate-pulse">🔒</span><div className="flex flex-col items-start"><p className={`text-rose-500 text-xs uppercase tracking-[0.2em] font-bold ${techMono.className}`}>LOCKED</p><p className="text-white/60 text-[10px] uppercase tracking-widest">14th Feb</p></div></div></div>)}</button></div>
              </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes heartbeat { 0% { transform: scale(1); } 15% { transform: scale(1.2); } 30% { transform: scale(1); } 45% { transform: scale(1.15); } 60% { transform: scale(1); } } 
        .animate-heartbeat { animation: heartbeat 1.5s infinite; } 
        .animate-spin-slow { animation: spin-slow 8s linear infinite; } 
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } 
        .custom-scrollbar-hide::-webkit-scrollbar { display: none; } 
        .custom-scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-5px); } 40%, 80% { transform: translateX(5px); } }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </>
  );
}

// --- DEFAULT EXPORT WITH SUSPENSE ---
export default function Hub() {
  return (
    <main className={`relative w-screen h-[100dvh] overflow-hidden bg-black text-white ${lato.className}`}>
      <Suspense fallback={<div className="flex items-center justify-center h-full bg-black"><span className="text-rose-500 animate-pulse">Loading...</span></div>}>
        <HubContent />
      </Suspense>
    </main>
  );
}