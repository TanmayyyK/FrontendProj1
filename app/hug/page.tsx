"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { Playfair_Display, Lato, Share_Tech_Mono } from "next/font/google";

// --- Fonts ---
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700"] });
const lato = Lato({ subsets: ["latin"], weight: ["300", "400", "700"] });
const techMono = Share_Tech_Mono({ subsets: ["latin"], weight: ["400"] });

export default function HugPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const explosionRef = useRef<HTMLDivElement>(null); 
  const leftOrbRef = useRef<HTMLDivElement>(null);
  const rightOrbRef = useRef<HTMLDivElement>(null);
  
  // State
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0); 
  const [hugged, setHugged] = useState(false);

  // --- 1. The Physics Loop (Magnet Logic) ---
  useEffect(() => {
    let animationFrame: number;

    const updatePhysics = () => {
      if (hugged) return; 

      if (isHolding) {
        setProgress((prev) => {
          const newProg = prev + 0.5; 
          if (newProg >= 100) return 100;
          return newProg;
        });
      } else {
        setProgress((prev) => {
          const newProg = prev - 2; 
          return newProg < 0 ? 0 : newProg;
        });
      }

      animationFrame = requestAnimationFrame(updatePhysics);
    };

    animationFrame = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animationFrame);
  }, [isHolding, hugged]);

  // --- 2. Trigger Hug Effect ---
  useEffect(() => {
    if (progress >= 100 && !hugged) {
        triggerHug();
    }
  }, [progress, hugged]);

  // --- 3. Animate Orbs ---
  useEffect(() => {
    if (hugged) return;

    // Calculate positions
    const leftPos = 15 + (35 * (progress / 100)); 
    const rightPos = 85 - (35 * (progress / 100));
    // We now animate opacity/scale of inner elements instead of box-shadow on container for better performance with blurs
    const glowIntensity = progress / 100; 

    if (leftOrbRef.current && rightOrbRef.current) {
        gsap.to(leftOrbRef.current, { 
            left: `${leftPos}%`, 
            duration: 0.1,
            overwrite: true 
        });
        gsap.to(rightOrbRef.current, { 
            left: `${rightPos}%`, 
            duration: 0.1,
            overwrite: true
        });

        // Animate inner glow intensity
        gsap.to(".orb-glow", {
            opacity: 0.5 + (glowIntensity * 0.5),
            scale: 1 + (glowIntensity * 0.3),
            duration: 0.1
        });
    }
  }, [progress, hugged]);

  // --- 4. The Climax (Explosion) ---
  const triggerHug = () => {
    setHugged(true);
    
    setTimeout(() => {
        const ctx = gsap.context(() => {
          // Giant Heart Entrance
          gsap.fromTo(".giant-heart", 
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.8, ease: "elastic.out(1, 0.3)" }
          );

          // Background flash
          gsap.to("main", { backgroundColor: "#be123c", duration: 0.1, yoyo: true, repeat: 1 });
          gsap.to("main", { backgroundColor: "#000000", duration: 1, delay: 0.2 });

          // Heart Explosion
          if (explosionRef.current) {
              for (let i = 0; i < 50; i++) {
                const heart = document.createElement("div");
                heart.innerHTML = "🫂"; 
                heart.style.position = "absolute";
                heart.style.left = "50%";
                heart.style.top = "50%";
                heart.style.fontSize = `${Math.random() * 40 + 10}px`;
                heart.style.pointerEvents = "none";
                heart.style.transform = "translate(-50%, -50%)"; 
                
                explosionRef.current.appendChild(heart);

                gsap.to(heart, {
                  x: `random(-400, 400)`,
                  y: `random(-400, 400)`,
                  rotation: `random(0, 360)`,
                  opacity: 0,
                  duration: `random(1.5, 3)`,
                  ease: "power3.out",
                  onComplete: () => heart.remove() 
                });
              }
          }
        }, containerRef); 
    }, 10);
  };

  return (
    <main 
      ref={containerRef}
      className={`relative w-full h-screen overflow-hidden bg-black text-white flex flex-col items-center justify-center select-none ${lato.className}`}
    >
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />

      {/* --- EXPLOSION LAYER --- */}
      <div ref={explosionRef} className="absolute inset-0 pointer-events-none z-30 overflow-hidden" />

      {/* --- THE STAGE --- */}
      {!hugged ? (
        <>
            {/* Status Text */}
            <div className="absolute top-20 text-center animate-pulse z-10 px-4">
                <p className={`text-rose-500 text-xs tracking-[0.3em] uppercase ${techMono.className}`}>
                    Alert
                </p>
                <h1 className={`text-3xl md:text-5xl mt-2 leading-tight ${playfair.className}`}>
                    {progress < 20 ? "Too Far" : 
                     progress < 50 ? "Slowlyyy Slowlyyy Come Near Me Baby!!" : 
                     progress < 80 ? "ALMOST THERE!" : "DON'T LET GO ME Tanya!!!"}
                </h1>
                <p className={`mt-4 text-white/50 text-sm font-mono ${techMono.className}`}>
                    Distance: {Math.max(0, 100 - Math.floor(progress))}%
                </p>
            </div>

            {/* --- LEFT ORB Container (TANMAY) - Moves but has NO BLUR itself --- */}
            <div 
                ref={leftOrbRef}
                className="absolute top-1/2 -translate-y-1/2 w-16 h-16 md:w-24 md:h-24 flex flex-col items-center justify-center z-10 will-change-transform"
                style={{ left: '15%' }} 
            >
                {/* LAYER 1: The Blurry Backgrounds (Absolute positioning) */}
                <div className="absolute inset-0 w-full h-full bg-blue-500 rounded-full blur-sm"></div>
                <div className="orb-glow absolute inset-0 w-full h-full bg-blue-300 rounded-full opacity-50 blur-md animate-pulse"></div>
                
                {/* LAYER 2: The Sharp Text Content (Relative z-20 sits on top) */}
                <div className="relative z-20 flex flex-col items-center justify-center w-full h-full">
                    {/* Initials Inside */}
                    <span className={`text-xl md:text-2xl font-bold text-white ${techMono.className}`}>TK</span>
                    {/* Name Label Below */}
                    <div className="absolute -bottom-10 whitespace-nowrap">
                        <p className={`text-blue-300 text-sm font-bold tracking-widest uppercase ${techMono.className}`}>Tanmay</p>
                    </div>
                </div>
            </div>

            {/* --- RIGHT ORB Container (TANYA) --- */}
            <div 
                ref={rightOrbRef}
                className="absolute top-1/2 -translate-y-1/2 w-16 h-16 md:w-24 md:h-24 flex flex-col items-center justify-center z-10 will-change-transform"
                style={{ left: '85%' }}
            >
                {/* LAYER 1: The Blurry Backgrounds */}
                <div className="absolute inset-0 w-full h-full bg-rose-500 rounded-full blur-sm"></div>
                <div className="orb-glow absolute inset-0 w-full h-full bg-rose-300 rounded-full opacity-50 blur-md animate-pulse"></div>
                
                {/* LAYER 2: The Sharp Text Content */}
                 <div className="relative z-20 flex flex-col items-center justify-center w-full h-full">
                    {/* Initials Inside */}
                    <span className={`text-xl md:text-2xl font-bold text-white ${techMono.className}`}>T</span>
                    {/* Name Label Below */}
                    <div className="absolute -bottom-10 whitespace-nowrap">
                        <p className={`text-rose-300 text-sm font-bold tracking-widest uppercase ${techMono.className}`}>Tanya</p>
                    </div>
                </div>
            </div>

            {/* Connection Line */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2" />

            {/* CONTROL BUTTON */}
            <div className="absolute bottom-16 w-full flex justify-center px-4 z-20">
                <button
                    onMouseDown={() => setIsHolding(true)}
                    onMouseUp={() => setIsHolding(false)}
                    onMouseLeave={() => setIsHolding(false)}
                    onTouchStart={() => setIsHolding(true)}
                    onTouchEnd={() => setIsHolding(false)}
                    className={`
                        relative px-10 py-6 rounded-full font-bold tracking-widest text-lg transition-all duration-100 shadow-[0_0_30px_rgba(255,255,255,0.1)] overflow-hidden select-none
                        ${isHolding 
                            ? "bg-rose-600 scale-95 shadow-[0_0_50px_rgba(225,29,72,0.6)] text-white" 
                            : "bg-white/10 hover:bg-white/20 text-rose-300 scale-100"}
                    `}
                >
                    <span className="relative z-10">
                        {isHolding ? "HOLDING..." : "HOLD TO HUG"}
                    </span>
                    
                    <div 
                        className="absolute bottom-0 left-0 h-full bg-black/20 transition-all duration-75 ease-linear"
                        style={{ width: `${progress}%` }}
                    />
                </button>
            </div>
            
            <p className="absolute bottom-8 text-white/30 text-xs z-10">
                (Don't let go until they touch!)
            </p>
        </>
      ) : (
        /* --- SUCCESS STATE --- */
        <div className="z-20 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
            <div className="giant-heart text-[100px] md:text-[200px] leading-none drop-shadow-[0_0_50px_rgba(225,29,72,0.8)]">
                ❤️
            </div>
            
            <h2 className={`text-5xl md:text-7xl mt-8 text-white ${playfair.className}`}>
                Virtual Hug <br/> Delivered!
            </h2>
            
            <p className="mt-4 text-rose-300 text-lg max-w-md mx-auto leading-relaxed px-6">
                Distance Suckss yrrr But...... <br/>
                Our Souls are holding each other tighter than ever cutuuuuu..... <br />
                yyrrrr us din Hug kyu nhi kia maine...Hu to Bhondhuu hii
            </p>

            <button 
                onClick={() => router.push("/")}
                className="mt-12 px-8 py-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors text-sm uppercase tracking-widest"
            >
                Back to Hub
            </button>
        </div>
      )}

    </main>
  );
}