"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { Playfair_Display, Lato, Share_Tech_Mono, Great_Vibes } from "next/font/google";

// --- Fonts ---
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700", "900"] });
const lato = Lato({ subsets: ["latin"], weight: ["300", "400", "700"] });
const techMono = Share_Tech_Mono({ subsets: ["latin"], weight: ["400"] });
const greatVibes = Great_Vibes({ subsets: ["latin"], weight: ["400"] });

// --- MEMORIES ---
const MEMORIES = [
  { text: "Late night calls...", threshold: 20, top: "20%", left: "10%" },
  { text: "My Long paraasss", threshold: 35, top: "70%", left: "80%" },
  { text: "Missing your touch...", threshold: 50, top: "30%", left: "70%" },
  { text: "Waiting for ur messages", threshold: 65, top: "80%", left: "15%" },
  { text: "The distance sucks...", threshold: 80, top: "45%", left: "50%" },
];

// --- STORY CONTENT (EXACT TEXT) ---
const FIRST_HUG_STORY = [
  {
    id: 1,
    title: "The Sight",
    desc: "I know we have met before also...but at that time love was only building ...but..but now we are in love aren't we..Now I am gonna Hug you as we meetup.....Our first hug is gonna be special I know that...Lets just imagine in silence ...So i walk up to you on the gate you are standing on the a little far from ur gate as I arrive...as soon as we both see each other(luckily at the same time) our heart beat sync we start moving towards each other ...slowly slowly",
    action: "Spot Me",
    effect: "heartbeat"
  },
  {
    id: 2,
    title: "Closing the Gap",
    desc: "We start to move faster and faster as we get close to each other ..the world blurs out as we get only I see is you my girl, my baby...my soulmate in the full streets.",
    action: "Run to Me",
    effect: "butterflies"
  },
  {
    id: 3,
    title: "The Collision",
    desc: "The moment we get close to each other and stare each other for a pinch of second then I put my hands on ur waist like I own you..then I pull u gently towards me with my hands..my hand holding ur waist as ur very precious to me ...i am all into you..then i move my hands through ur back like they want to attach u to my body forever..meanwhile ur head on my upper chest resting like I am ur home..ur hands sliding through my shirt u gripping me from the back...after the intense u breathe out in my arms and that sound makes me relazing as f and our heart collide as we hug...I can feel ur heartbeat syncing with me..We remember all the late night calls ..late night missing all the imaginations turning into reality..eyes watery",
    action: "Catch Me",
    effect: "impact_shake"
  },
  {
    id: 4,
    title: "The Squeeze",
    desc: "As we get from realization phase to real phase and squeeze each other harder like giving all the pull from 2 months...u squeeze me tightly ur head near my upper chest u could feel my heart beating for you..I also bury my head in ur neck deeply Breathing you in...breathing ur smell my face in ur hairs..I also hold u tightly and finally lift u up and kiss ur cheeks tightly..tightly ekdum...We both are not ready to release heheh then we release and our foreheads are colliding we smile looking at each other blushing and with a shy smile..then I hold ur face with both hand and kiss ur forehead tightly..and we continue to hug tightly again.......Cutuuu I promise the hug will be special..It will be special....and soooonn alsooo",
    action: "Hold Tight",
    effect: "warmth_bloom"
  }
];

// --- HEART CONSTELLATION POINTS (Percentages) ---
const HEART_POINTS = [
  { x: 50, y: 30 }, // Top Center
  { x: 35, y: 25 }, // Top Left hump
  { x: 20, y: 35 }, // Left
  { x: 20, y: 55 }, // Left lower
  { x: 50, y: 80 }, // Bottom Tip
  { x: 80, y: 55 }, // Right lower
  { x: 80, y: 35 }, // Right
  { x: 65, y: 25 }, // Top Right hump
  { x: 50, y: 30 }, // Close loop
];

export default function HugPage() {
  const router = useRouter();
  
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const explosionRef = useRef<HTMLDivElement>(null); 
  const leftOrbRef = useRef<HTMLDivElement>(null);
  const rightOrbRef = useRef<HTMLDivElement>(null);
  const tetherRef = useRef<HTMLDivElement>(null);
  const heartBtnRef = useRef<HTMLButtonElement>(null);

  // App State
  const [appStage, setAppStage] = useState<"intro_slides" | "romantic_prelude" | "hug_mechanic" | "success">("intro_slides");
  const [introStep, setIntroStep] = useState(0);

  // Story & Interaction State
  const [currentPhase, setCurrentPhase] = useState(0);
  const [contentVisible, setContentVisible] = useState(false); 
  const [isAnimating, setIsAnimating] = useState(false); 
  
  // Constellation State
  const [connectedStars, setConnectedStars] = useState(0);

  // Hug Mechanic State
  const [isHolding, setIsHolding] = useState(false);
  const [hugProgress, setHugProgress] = useState(0); 

  // ============================================
  // 0. INTRO SLIDES LOGIC
  // ============================================
  const handleIntroNext = () => {
    const ctx = gsap.context(() => {
        gsap.to(".intro-content", {
            opacity: 0, y: -20, duration: 0.5, ease: "power2.in",
            onComplete: () => {
                if (introStep === 0) {
                    setIntroStep(1);
                    gsap.fromTo(".intro-content", 
                        { opacity: 0, y: 20 }, 
                        { opacity: 1, y: 0, duration: 0.8, delay: 0.1 }
                    );
                } else {
                    setAppStage("romantic_prelude");
                }
            }
        });
    }, containerRef);
  };

  useEffect(() => {
    if (appStage === "intro_slides" && introStep === 0) {
        gsap.fromTo(".intro-content", 
            { opacity: 0, scale: 0.8 }, 
            { opacity: 1, scale: 1, duration: 1, ease: "elastic.out(1, 0.5)" }
        );
    }
  }, [appStage, introStep]);

  // ============================================
  // 1. CONSTELLATION & STORY LOGIC
  // ============================================
  
  // Handle Background Clicks for Constellation
  const handleConstellationClick = () => {
    if (connectedStars < HEART_POINTS.length) {
        setConnectedStars(prev => prev + 1);
        // Little haptic bump if supported (optional/safe)
        if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(10);
    }
  };

  const handleStoryInteraction = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent background click trigger
    if (isAnimating) return; 
    setIsAnimating(true);

    const ctx = gsap.context(() => {
        if (!contentVisible) {
            const phase = FIRST_HUG_STORY[currentPhase];
            
            if (phase.effect === "heartbeat") {
                gsap.to(heartBtnRef.current, { scale: 1.3, duration: 0.3, yoyo: true, repeat: 3 });
                gsap.to(".romantic-bg", { opacity: 0.5, duration: 0.5, yoyo: true, repeat: 3 });
            } else if (phase.effect === "warmth_bloom") {
                gsap.to(containerRef.current, { backgroundColor: "#4c0519", duration: 2 });
            }

            gsap.fromTo(".story-content", 
                { opacity: 0, y: 10, scale: 0.98 },
                { 
                    opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power2.out",
                    onComplete: () => {
                        setContentVisible(true);
                        setIsAnimating(false);
                    }
                }
            );
        } else {
            gsap.to(".story-content", { 
                opacity: 0, y: -10, scale: 0.98, duration: 0.3, ease: "power2.in",
                onComplete: () => {
                    if (currentPhase < FIRST_HUG_STORY.length - 1) {
                        setCurrentPhase(prev => prev + 1);
                        setContentVisible(false);
                        setIsAnimating(false);
                    } else {
                        gsap.to(containerRef.current, { opacity: 0, duration: 0.5, onComplete: () => {
                            setAppStage("hug_mechanic");
                            gsap.to(containerRef.current, { opacity: 1, duration: 0.5 });
                        }});
                    }
                }
            });
        }
    }, containerRef);
  };

  // ============================================
  // 2. HUG PHYSICS LOGIC
  // ============================================
  useEffect(() => {
    let animationFrame: number;
    const updatePhysics = () => {
      if (appStage !== "hug_mechanic") return; 

      if (isHolding) {
        setHugProgress((prev) => {
          let speed = 0.5;
          if (prev > 50) speed = 0.3;
          if (prev > 80) speed = 0.15; 
          const newProg = prev + speed; 
          if (newProg >= 100) return 100;
          return newProg;
        });
      } else {
        setHugProgress((prev) => {
          const newProg = prev - 1.5; 
          return newProg < 0 ? 0 : newProg;
        });
      }
      animationFrame = requestAnimationFrame(updatePhysics);
    };

    if (appStage === "hug_mechanic") animationFrame = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animationFrame);
  }, [isHolding, appStage]);

  useEffect(() => {
    if (hugProgress >= 100 && appStage === "hug_mechanic") {
        setAppStage("success");
    }
  }, [hugProgress, appStage]);

  useEffect(() => {
    if (appStage !== "hug_mechanic") return;

    const leftPos = 15 + (35 * (hugProgress / 100)); 
    const rightPos = 85 - (35 * (hugProgress / 100));

    if (leftOrbRef.current && rightOrbRef.current && tetherRef.current) {
        gsap.to(leftOrbRef.current, { left: `${leftPos}%`, duration: 0.1, overwrite: true });
        gsap.to(rightOrbRef.current, { left: `${rightPos}%`, duration: 0.1, overwrite: true });
        const distance = rightPos - leftPos;
        gsap.to(tetherRef.current, {
            left: `${leftPos}%`, width: `${distance}%`,
            opacity: (hugProgress / 100) * 0.8,
            duration: 0.1
        });
    }
  }, [hugProgress, appStage]);

  // ============================================
  // 3. SUCCESS ANIMATION
  // ============================================
  useEffect(() => {
    if (appStage === "success") {
        const ctx = gsap.context(() => {
            gsap.fromTo(".flashbang", { opacity: 1 }, { opacity: 0, duration: 1.5, ease: "power2.out" });
            gsap.fromTo(".giant-heart", { scale: 0, opacity: 0, rotation: -15 }, { scale: 1, opacity: 1, rotation: 0, duration: 1.2, ease: "elastic.out(1, 0.4)" });
            
            if (containerRef.current) gsap.to(containerRef.current, { backgroundColor: "#4c0519", duration: 2 });

            if (explosionRef.current) {
                const colors = ["#f43f5e", "#e11d48", "#be123c", "#ffffff"];
                for (let i = 0; i < 80; i++) {
                    const particle = document.createElement("div");
                    const isHeart = Math.random() > 0.5;
                    particle.innerHTML = isHeart ? "❤️" : "";
                    if (!isHeart) {
                        particle.style.width = `${Math.random() * 10 + 5}px`;
                        particle.style.height = particle.style.width;
                        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                        particle.style.borderRadius = "50%";
                    }
                    particle.style.position = "absolute";
                    particle.style.left = "50%";
                    particle.style.top = "50%";
                    particle.style.fontSize = `${Math.random() * 30 + 10}px`;
                    particle.style.pointerEvents = "none";
                    particle.style.transform = "translate(-50%, -50%)"; 
                    particle.style.zIndex = "40";
                    explosionRef.current.appendChild(particle);

                    const angle = Math.random() * Math.PI * 2;
                    const velocity = Math.random() * 600 + 200;
                    gsap.to(particle, {
                        x: Math.cos(angle) * velocity, y: Math.sin(angle) * velocity,
                        rotation: `random(-720, 720)`, opacity: 0, duration: `random(1.5, 3.5)`,
                        ease: "power3.out", onComplete: () => particle.remove() 
                    });
                }
            }
        }, containerRef);
        return () => ctx.revert();
    }
  }, [appStage]);

  return (
    <main ref={containerRef} className={`relative w-full h-screen overflow-hidden bg-black text-white flex flex-col items-center justify-center select-none touch-none ${lato.className}`}>
      
      <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none z-0" />
      {appStage === "success" && <div className="flashbang fixed inset-0 bg-white z-[100] pointer-events-none animate-out fade-out duration-[2000ms]" />}
      <div ref={explosionRef} className="absolute inset-0 pointer-events-none z-30 overflow-hidden" />

      {/* ==========================================
          STAGE 0: INTRO SLIDES
      ========================================== */}
      {appStage === "intro_slides" && (
        <div 
            className="z-50 absolute inset-0 flex flex-col items-center justify-center bg-black cursor-pointer px-6"
            onClick={handleIntroNext}
        >
            <div className="intro-content flex flex-col items-center justify-center text-center">
                {introStep === 0 ? (
                    <>
                        <h1 className={`${greatVibes.className} text-6xl md:text-8xl text-rose-500 drop-shadow-[0_0_25px_rgba(244,63,94,0.6)] animate-pulse`}>Happy Hug Day</h1>
                        <h2 className={`${greatVibes.className} text-4xl md:text-6xl text-white mt-4`}>Cutuu ❤️</h2>
                        <p className="mt-8 text-white/40 text-xs tracking-[0.3em] uppercase animate-bounce">Tap to continue</p>
                    </>
                ) : (
                    <>
                        <div className="max-w-xl border-l-2 border-rose-500 pl-6 text-left">
                            <p className={`${playfair.className} text-xl md:text-3xl text-white/90 leading-relaxed italic`}>
                                "Hugs are there to let people know you love them without saying anything... <br/><br/>
                                But since I can't hold you yet, I built this to bridge the distance between us...Hope u like it!."
                            </p>
                        </div>
                        <p className="mt-12 text-white/40 text-xs tracking-[0.3em] uppercase">Tap to Begin</p>
                    </>
                )}
            </div>
        </div>
      )}

      {/* ==========================================
          STAGE 1: ROMANTIC STORY (With Constellation)
      ========================================== */}
      {appStage === "romantic_prelude" && (
        <div 
            className="z-10 flex flex-col items-center p-6 w-full h-full relative cursor-crosshair"
            onClick={handleConstellationClick}
        >
          {/* CONSTELLATION LAYER */}
          <div className="absolute inset-0 pointer-events-none z-0">
             <div className="romantic-bg absolute inset-0 opacity-20 z-0 bg-gradient-to-tr from-rose-900 via-black to-rose-950 blur-3xl transition-all duration-1000" />
             
             {/* Render Stars & Connections */}
             <svg className="absolute inset-0 w-full h-full opacity-60">
                {/* Lines */}
                {HEART_POINTS.map((point, i) => {
                    if (i === 0 || i >= connectedStars) return null;
                    const prev = HEART_POINTS[i - 1];
                    return (
                        <line key={`line-${i}`} x1={`${prev.x}%`} y1={`${prev.y}%`} x2={`${point.x}%`} y2={`${point.y}%`} stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                    );
                })}
             </svg>
             {/* Points */}
             {HEART_POINTS.map((point, i) => (
                 <div key={`star-${i}`} 
                      className={`absolute w-1 h-1 rounded-full transition-all duration-500 ${i < connectedStars ? "bg-white shadow-[0_0_10px_white] scale-150" : "bg-white/20"}`}
                      style={{ left: `${point.x}%`, top: `${point.y}%` }} 
                 />
             ))}
          </div>

          <p className={`${techMono.className} text-rose-500/60 text-[10px] tracking-[0.4em] mt-8 mb-4 uppercase z-20 pointer-events-none`}>
            Part {currentPhase + 1} / 04
          </p>
          
          <div className="flex-grow flex flex-col items-center justify-center w-full max-w-xl z-20 pointer-events-none">
            <div className="story-content opacity-0 flex flex-col items-center w-full">
                <h1 className={`${greatVibes.className} text-4xl md:text-6xl mb-6 text-rose-100 drop-shadow-lg text-center`}>
                  {FIRST_HUG_STORY[currentPhase].title}
                </h1>
                <div className="w-full max-h-[50vh] overflow-y-auto scrollbar-hide px-4 text-center pointer-events-auto">
                    <p className={`${playfair.className} text-sm md:text-lg leading-relaxed text-white/90 italic font-light tracking-wide`}>
                      "{FIRST_HUG_STORY[currentPhase].desc}"
                    </p>
                </div>
            </div>
          </div>

          <div className="mb-12 flex flex-col items-center z-20 pointer-events-auto">
              {/* Hint only shows at start */}
              {connectedStars < 2 && currentPhase === 0 && !contentVisible && (
                  <p className="text-rose-400/50 text-[10px] uppercase tracking-widest animate-pulse mb-4">Psst.. tap the background...</p>
              )}
              
              <button ref={heartBtnRef} onClick={handleStoryInteraction}
                className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl transition-all duration-300 border ${contentVisible ? "bg-transparent border-white/40 text-white hover:bg-white/10 scale-100" : "bg-rose-600/20 border-rose-500 text-rose-400 animate-pulse scale-105"}`}
              >
                {contentVisible ? "→" : "❤️"}
              </button>
              <p className={`${techMono.className} mt-4 text-[10px] tracking-[0.3em] text-white/30 uppercase`}>
                {contentVisible ? "Next Part" : `Tap to ${FIRST_HUG_STORY[currentPhase].action}`}
              </p>
          </div>
        </div>
      )}

      {/* ==========================================
          STAGE 2: HUG MECHANIC
      ========================================== */}
      {appStage === "hug_mechanic" && (
        <div className="w-full h-full relative flex flex-col items-center justify-center animate-in fade-in duration-1000">
            {MEMORIES.map((mem, i) => (
                <div key={i} className={`absolute italic text-rose-300/30 ${playfair.className} transition-opacity duration-500`}
                    style={{ top: mem.top, left: mem.left, opacity: hugProgress > mem.threshold ? 0.6 : 0, fontSize: "clamp(1rem, 2vw, 1.5rem)" }}>
                    {mem.text}
                </div>
            ))}
            <div className="absolute top-20 text-center px-4 w-full z-10">
                <h1 className={`text-3xl md:text-5xl ${playfair.className} drop-shadow-lg transition-all duration-300`}>
                    {hugProgress < 85 ? "Closing the distance..." : <span className="text-rose-400 animate-pulse font-black">DON'T LET GO TANYA!!!</span>}
                </h1>
            </div>
            <div ref={tetherRef} className="absolute top-1/2 h-[2px] bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.8)] z-0" />
            <div ref={leftOrbRef} className="absolute top-1/2 -translate-y-1/2 w-24 h-24 bg-blue-900/40 border border-blue-400 rounded-full flex items-center justify-center backdrop-blur-sm shadow-[0_0_30px_rgba(59,130,246,0.3)] z-10" style={{ left: '15%' }}><span className={`${techMono.className} font-bold text-sm tracking-widest`}>TANMAY</span></div>
            <div ref={rightOrbRef} className="absolute top-1/2 -translate-y-1/2 w-24 h-24 bg-rose-900/40 border border-rose-400 rounded-full flex items-center justify-center backdrop-blur-sm shadow-[0_0_30px_rgba(225,29,72,0.3)] z-10" style={{ left: '85%' }}><span className={`${techMono.className} font-bold text-sm tracking-widest`}>TANYA</span></div>
            <button onMouseDown={() => setIsHolding(true)} onMouseUp={() => setIsHolding(false)} onMouseLeave={() => setIsHolding(false)} onTouchStart={(e) => { e.preventDefault(); setIsHolding(true); }} onTouchEnd={(e) => { e.preventDefault(); setIsHolding(false); }} className={`absolute bottom-20 px-12 py-5 rounded-full font-bold tracking-[0.2em] text-sm transition-all duration-300 overflow-hidden select-none border ${isHolding ? "bg-rose-600 border-rose-400 scale-95 shadow-[0_0_40px_rgba(225,29,72,0.6)] text-white" : "bg-white/5 border-white/20 hover:bg-white/10 text-rose-200 scale-100 backdrop-blur-sm"}`}>
                <span className="relative z-10 drop-shadow-md">{isHolding ? "SQUEEZING..." : "HOLD TO HUG"}</span>
                <div className="absolute bottom-0 left-0 h-full bg-white/20 transition-all duration-75 ease-linear" style={{ width: `${hugProgress}%` }} />
            </button>
        </div>
      )}

      {/* ==========================================
          STAGE 3: SUCCESS MESSAGE
      ========================================== */}
      {appStage === "success" && (
        <div className="z-20 flex flex-col items-center justify-center text-center px-6 animate-in zoom-in duration-1000">
            <div className="giant-heart text-[120px] md:text-[180px] drop-shadow-[0_0_60px_rgba(225,29,72,0.8)] animate-pulse">❤️</div>
            <h2 className={`text-4xl md:text-7xl mt-4 text-white font-bold drop-shadow-lg ${playfair.className}`}>Virtual Hug <br/> Delivered!</h2>
            <div className={`mt-8 text-rose-200 text-lg md:text-2xl max-w-lg mx-auto leading-relaxed font-light backdrop-blur-sm bg-black/40 p-8 rounded-3xl border border-rose-500/20 ${lato.className}`}>
                <p className="mb-6">Distance Suckss yrrr But...... <br/>Our Souls are holding each other tighter than ever cutuuuuu.....</p>
                <p className="text-white/50 text-sm">yyrrrr us din Hug kyu nhi kia maine... Hu to Bhondhuu hii 🤦‍♂️</p>
            </div>
            <button onClick={() => router.push("/")} className={`mt-10 px-10 py-4 bg-rose-600 hover:bg-rose-500 rounded-full text-xs font-bold uppercase tracking-[0.3em] shadow-lg transition-all ${techMono.className}`}>Return to Hub 🏠</button>
        </div>
      )}
    </main>
  );
}