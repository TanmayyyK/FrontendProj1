"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { Playfair_Display, Lato, Share_Tech_Mono } from "next/font/google";

// --- Fonts ---
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700", "900"] });
const lato = Lato({ subsets: ["latin"], weight: ["300", "400", "700"] });
const techMono = Share_Tech_Mono({ subsets: ["latin"], weight: ["400"] });

// --- MEMORIES TO FLASH DURING HUG ---
const MEMORIES = [
  { text: "Late night calls...", threshold: 20, top: "20%", left: "10%" },
  { text: "My Long paraasss", threshold: 35, top: "70%", left: "80%" },
  { text: "Missing your touch...", threshold: 50, top: "30%", left: "70%" },
  { text: "Waiting for ur messages", threshold: 65, top: "80%", left: "15%" },
  { text: "The distance sucks...", threshold: 80, top: "45%", left: "50%" },
];

// --- APP STAGES ---
type AppStage = "fog_prompt" | "fog_active" | "hug_mechanic" | "success";

export default function HugPage() {
  const router = useRouter();
  
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const explosionRef = useRef<HTMLDivElement>(null); 
  const leftOrbRef = useRef<HTMLDivElement>(null);
  const rightOrbRef = useRef<HTMLDivElement>(null);
  const tetherRef = useRef<HTMLDivElement>(null);
  
  // Audio/Fog Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const requestRef = useRef<number>(0); 
  const fogOpacityRef = useRef(100);

  // Core State
  const [appStage, setAppStage] = useState<AppStage>("fog_prompt");
  const [errorMsg, setErrorMsg] = useState("");
  const [fogOpacity, setFogOpacity] = useState(100); 

  // Hug State
  const [isHolding, setIsHolding] = useState(false);
  const [hugProgress, setHugProgress] = useState(0); 
  
  // Message Modal State
  const [showInput, setShowInput] = useState(false);
  const [userMessage, setUserMessage] = useState("");

  // ==========================================
  // 1. THE FOG & MICROPHONE LOGIC (Bulletproofed)
  // ==========================================
  const startMicrophone = async () => {
    setErrorMsg("");

    // Security Check: Mic won't work on non-HTTPS mobile connections
    if (typeof window !== "undefined" && !window.isSecureContext) {
        setErrorMsg("Mic requires a secure connection (HTTPS). Just wipe the screen with your finger instead!");
        setAppStage("fog_active");
        return;
    }

    try {
      // FIX FOR SAFARI: Create AudioContext synchronously BEFORE the await
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      audioContextRef.current = audioCtx;

      // Request Stream: Disable noise cancellation so it detects blowing
      const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
              echoCancellation: false,
              autoGainControl: false,
              noiseSuppression: false
          } 
      });
      streamRef.current = stream;

      // Resume context if browser suspended it
      if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
      }
      
      const analyser = audioCtx.createAnalyser();
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 256;
      
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      setAppStage("fog_active");

      const checkAudio = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const averageVolume = sum / bufferLength;

        // Sensitivity threshold. 10 is usually easy to hit by blowing.
        if (averageVolume > 10) {
          fogOpacityRef.current = Math.max(0, fogOpacityRef.current - 1.5); 
          setFogOpacity(fogOpacityRef.current);
        }

        if (fogOpacityRef.current <= 0) {
          // Fog melted! Clean up and move DIRECTLY to Hug Mechanic
          cleanupAudio();
          setTimeout(() => setAppStage("hug_mechanic"), 500);
        } else {
          requestRef.current = requestAnimationFrame(checkAudio);
        }
      };

      checkAudio();

    } catch (err: any) {
      console.error("Mic error:", err);
      setErrorMsg("Couldn't access mic. Just wipe the frost away with your finger!");
      setAppStage("fog_active");
    }
  };

  const cleanupAudio = () => {
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
  };

  // Fallback: Wipe the fog with finger/mouse
  const handleWipeFog = () => {
    if (appStage !== "fog_active") return;
    
    // Manual wipe melts the ice faster
    fogOpacityRef.current = Math.max(0, fogOpacityRef.current - 2.5);
    setFogOpacity(fogOpacityRef.current);

    if (fogOpacityRef.current <= 0) {
      cleanupAudio();
      setTimeout(() => setAppStage("hug_mechanic"), 500);
    }
  };

  useEffect(() => {
    return () => cleanupAudio();
  }, []);

  // ==========================================
  // 2. MAGNETIC HUG PHYSICS LOGIC
  // ==========================================
  useEffect(() => {
    let animationFrame: number;
    const updatePhysics = () => {
      if (appStage !== "hug_mechanic") return; 

      if (isHolding) {
        setHugProgress((prev) => {
          let speed = 0.5;
          if (prev > 50) speed = 0.3;
          if (prev > 80) speed = 0.15; // Resistance mechanic
          const newProg = prev + speed; 
          if (newProg >= 100) return 100;
          return newProg;
        });
      } else {
        setHugProgress((prev) => {
          const newProg = prev - 1.5; // Snap back
          return newProg < 0 ? 0 : newProg;
        });
      }
      animationFrame = requestAnimationFrame(updatePhysics);
    };

    if (appStage === "hug_mechanic") animationFrame = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animationFrame);
  }, [isHolding, appStage]);

  // Check for Hug Success
  useEffect(() => {
    if (hugProgress >= 100 && appStage === "hug_mechanic") {
        triggerHugClimax();
    }
  }, [hugProgress, appStage]);

  // Animate Orbs & Tether
  useEffect(() => {
    if (appStage !== "hug_mechanic") return;

    const leftPos = 15 + (35 * (hugProgress / 100)); 
    const rightPos = 85 - (35 * (hugProgress / 100));
    const glowIntensity = hugProgress / 100; 
    const tension = hugProgress > 85 ? (hugProgress - 85) / 15 : 0; 

    if (leftOrbRef.current && rightOrbRef.current && tetherRef.current) {
        const shakeX = tension > 0 ? (Math.random() - 0.5) * tension * 10 : 0;
        const shakeY = tension > 0 ? (Math.random() - 0.5) * tension * 10 : 0;

        gsap.to(leftOrbRef.current, { left: `${leftPos}%`, x: shakeX, y: shakeY, duration: 0.1, overwrite: true });
        gsap.to(rightOrbRef.current, { left: `${rightPos}%`, x: -shakeX, y: -shakeY, duration: 0.1, overwrite: true });

        const distance = rightPos - leftPos;
        gsap.to(tetherRef.current, {
            left: `${leftPos}%`, width: `${distance}%`,
            opacity: glowIntensity * 0.8,
            height: `${1 + (glowIntensity * 4)}px`,
            backgroundColor: hugProgress > 90 ? "#fff" : "#f43f5e",
            boxShadow: `0 0 ${10 + (glowIntensity * 20)}px ${hugProgress > 90 ? "#fff" : "#e11d48"}`,
            duration: 0.1
        });

        gsap.to(".orb-glow", { opacity: 0.5 + (glowIntensity * 0.5), scale: 1 + (glowIntensity * 0.5), duration: 0.1 });
        
        if (tension > 0.5 && containerRef.current) {
             gsap.to(containerRef.current, { x: (Math.random() - 0.5) * 4, y: (Math.random() - 0.5) * 4, duration: 0.05 });
        }
    }
  }, [hugProgress, appStage]);

  // ==========================================
  // 3. EXPLOSION CLIMAX
  // ==========================================
  const triggerHugClimax = () => {
    setAppStage("success");
    if (containerRef.current) gsap.to(containerRef.current, { x: 0, y: 0, duration: 0.1 });

    setTimeout(() => {
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
    }, 50); 
  };

  // ==========================================
  // 4. FINAL ACTIONS (MESSAGING)
  // ==========================================
  const handleSkip = () => {
      router.push("/");
  };

  const handleSend = () => {
      // ⚠️ UPDATE THIS NUMBER with your country code! Example: "919876543210"
      const phoneNumber = "919416008686"; 
      const text = encodeURIComponent(`Hun....❤️\n${userMessage}`);
      window.open(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${text}`, '_blank');
      setTimeout(() => { router.push("/"); }, 1000);
  };

  return (
    <main 
      ref={containerRef}
      className={`relative w-full h-screen overflow-hidden bg-[#0a0a0a] text-white flex flex-col items-center justify-center select-none touch-none ${lato.className}`}
    >
      <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none z-0" />

      {appStage === "success" && <div className="flashbang fixed inset-0 bg-white z-[100] pointer-events-none" />}
      <div ref={explosionRef} className="absolute inset-0 pointer-events-none z-30 overflow-hidden" />

      {/* ==========================================
          STAGE 0: FOG PROMPT (BLOW TO MELT)
      ========================================== */}
      {appStage === "fog_prompt" && (
          <div className="z-10 flex flex-col items-center text-center px-6 max-w-md animate-in zoom-in duration-1000">
              <div className="text-6xl mb-6 opacity-80">❄️</div>
              <h1 className={`text-3xl md:text-5xl text-blue-100 mb-4 ${playfair.className}`}>It feels so cold without you.</h1>
              <p className="text-white/60 mb-10 leading-relaxed font-light">
                  To begin, allow microphone access and gently blow on your screen to melt the distance.
              </p>
              {errorMsg && <p className="text-red-400 mb-4 text-xs font-bold bg-black/50 p-2 rounded">{errorMsg}</p>}
              <button 
                  onClick={startMicrophone}
                  className={`px-8 py-4 bg-white/10 border border-white/20 hover:bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-105 transition-all ${techMono.className}`}
              >
                  Warm it up
              </button>
          </div>
      )}

      {/* FOG OVERLAY (Visible during fog_active) */}
      {(appStage === "fog_active" || appStage === "fog_prompt") && (
          <div 
            className="absolute inset-0 z-50 pointer-events-auto transition-opacity duration-300"
            style={{ 
                opacity: fogOpacity / 100, 
                backdropFilter: `blur(${fogOpacity / 5}px)`,
                backgroundColor: `rgba(255, 255, 255, ${fogOpacity / 400})`
            }}
            onTouchMove={handleWipeFog}
            onMouseMove={handleWipeFog}
            onMouseDown={handleWipeFog} 
          >
              {appStage === "fog_active" && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                     <p className={`text-2xl md:text-4xl text-blue-900/40 font-bold tracking-widest uppercase animate-pulse ${playfair.className}`}>
                         Blow to clear...
                     </p>
                     <p className="mt-4 text-blue-900/30 text-xs tracking-widest">(Or wipe it with your finger)</p>
                     {errorMsg && <p className="text-red-600/50 mt-4 text-xs font-bold">{errorMsg}</p>}
                 </div>
              )}
          </div>
      )}


      {/* ==========================================
          STAGE 1: THE MAGNETIC HUG
      ========================================== */}
      {appStage === "hug_mechanic" && (
        <>
            {MEMORIES.map((mem, i) => (
                <div 
                    key={i}
                    className={`absolute z-0 transition-opacity duration-1000 ${playfair.className} italic`}
                    style={{ 
                        top: mem.top, left: mem.left, transform: "translate(-50%, -50%)",
                        opacity: hugProgress > mem.threshold ? (1 - ((hugProgress - mem.threshold) / 50)) * 0.3 : 0,
                        fontSize: "clamp(1rem, 2vw, 1.5rem)", color: "#fda4af"
                    }}
                >
                    {mem.text}
                </div>
            ))}

            <div className="absolute top-20 text-center z-10 px-4 w-full animate-in slide-in-from-top duration-1000">
                <p className={`text-rose-500 text-xs tracking-[0.3em] uppercase ${techMono.className} ${isHolding ? 'animate-pulse' : ''}`}>
                    {hugProgress > 80 ? "CRITICAL DISTANCE" : "FOG CLEARED"}
                </p>
                <h1 className={`text-3xl md:text-5xl mt-2 leading-tight ${playfair.className} transition-all duration-300`}>
                    {hugProgress === 0 ? "Hold to pull me closer" :
                     hugProgress < 30 ? "It's far, but I'm coming..." : 
                     hugProgress < 60 ? "Closing the distance..." : 
                     hugProgress < 85 ? "ALMOST THERE!" : 
                     <span className="text-rose-400 font-bold drop-shadow-[0_0_10px_rgba(225,29,72,0.8)] animate-pulse">DON'T LET GO TANYA!!!</span>}
                </h1>
                
                <div className="w-48 md:w-64 h-1 bg-white/10 mx-auto mt-6 rounded-full overflow-hidden relative">
                    <div className="absolute top-0 left-0 h-full bg-rose-500 transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(225,29,72,1)]" style={{ width: `${hugProgress}%` }}/>
                </div>
            </div>

            <div ref={tetherRef} className="absolute top-1/2 -translate-y-1/2 z-0 origin-left" />

            {/* LEFT ORB (TANMAY) */}
            <div ref={leftOrbRef} className="absolute top-1/2 -translate-y-1/2 w-20 h-20 md:w-28 md:h-28 flex flex-col items-center justify-center z-10 will-change-transform animate-in fade-in zoom-in duration-1000" style={{ left: '15%' }}>
                <div className="absolute inset-0 w-full h-full bg-blue-600 rounded-full blur-sm"></div>
                <div className="orb-glow absolute inset-0 w-full h-full bg-blue-400 rounded-full opacity-50 blur-md transition-transform duration-100"></div>
                <div className="relative z-20 flex flex-col items-center justify-center w-full h-full border border-blue-300/30 rounded-full bg-blue-900/40 backdrop-blur-sm shadow-[inset_0_0_20px_rgba(59,130,246,0.5)]">
                    <span className={`text-2xl md:text-3xl font-bold text-white drop-shadow-md ${techMono.className}`}>T</span>
                    <div className="absolute -bottom-8 whitespace-nowrap">
                        <p className={`text-blue-300 text-xs md:text-sm font-bold tracking-widest uppercase ${techMono.className}`}>Tanmay</p>
                    </div>
                </div>
            </div>

            {/* RIGHT ORB (TANYA) */}
            <div ref={rightOrbRef} className="absolute top-1/2 -translate-y-1/2 w-20 h-20 md:w-28 md:h-28 flex flex-col items-center justify-center z-10 will-change-transform animate-in fade-in zoom-in duration-1000" style={{ left: '85%' }}>
                <div className="absolute inset-0 w-full h-full bg-rose-600 rounded-full blur-sm"></div>
                <div className="orb-glow absolute inset-0 w-full h-full bg-rose-400 rounded-full opacity-50 blur-md transition-transform duration-100"></div>
                 <div className="relative z-20 flex flex-col items-center justify-center w-full h-full border border-rose-300/30 rounded-full bg-rose-900/40 backdrop-blur-sm shadow-[inset_0_0_20px_rgba(225,29,72,0.5)]">
                    <span className={`text-2xl md:text-3xl font-bold text-white drop-shadow-md ${techMono.className}`}>T</span>
                    <div className="absolute -bottom-8 whitespace-nowrap">
                        <p className={`text-rose-300 text-xs md:text-sm font-bold tracking-widest uppercase ${techMono.className}`}>Tanya</p>
                    </div>
                </div>
            </div>

            {/* CONTROL BUTTON */}
            <div className="absolute bottom-16 w-full flex justify-center px-4 z-20 animate-in slide-in-from-bottom duration-1000 delay-500">
                <button
                    onMouseDown={() => setIsHolding(true)}
                    onMouseUp={() => setIsHolding(false)}
                    onMouseLeave={() => setIsHolding(false)}
                    onTouchStart={(e) => { e.preventDefault(); setIsHolding(true); }}
                    onTouchEnd={(e) => { e.preventDefault(); setIsHolding(false); }}
                    className={`relative px-12 py-5 rounded-full font-bold tracking-[0.2em] text-sm md:text-base transition-all duration-300 overflow-hidden select-none border
                        ${isHolding ? "bg-rose-600 border-rose-400 scale-95 shadow-[0_0_40px_rgba(225,29,72,0.6)] text-white" : "bg-white/5 border-white/20 hover:bg-white/10 text-rose-200 scale-100 backdrop-blur-sm"}
                    `}
                    style={{ transform: isHolding ? `scale(${0.95 + Math.sin(Date.now() / (200 - hugProgress)) * 0.02})` : "scale(1)" }}
                >
                    <span className="relative z-10 drop-shadow-md">
                        {isHolding ? (hugProgress > 85 ? "PULLING..." : "HOLDING...") : "HOLD TO HUG"}
                    </span>
                    <div className="absolute bottom-0 left-0 h-full bg-white/20 transition-all duration-75 ease-linear" style={{ width: `${hugProgress}%` }} />
                </button>
            </div>
            
            <p className="absolute bottom-8 text-white/30 text-[10px] md:text-xs z-10 tracking-widest uppercase animate-in fade-in delay-1000">
                (Fight the distance)
            </p>
        </>
      )}

      {/* ==========================================
          STAGE 2: SUCCESS
      ========================================== */}
      {appStage === "success" && (
        <div className="z-20 flex flex-col items-center justify-center text-center px-6">
            <div className="giant-heart text-[120px] md:text-[200px] leading-none drop-shadow-[0_0_80px_rgba(225,29,72,1)] relative">
                ❤️
                <div className="absolute inset-0 text-white opacity-20 scale-110 blur-sm mix-blend-overlay animate-ping">❤️</div>
                <div className="absolute inset-0 text-rose-400 opacity-10 scale-150 blur-md animate-pulse">❤️</div>
            </div>
            
            <h2 className={`text-4xl md:text-6xl mt-8 text-white font-bold drop-shadow-lg ${playfair.className}`}>
                Virtual Hug <br/> Delivered!
            </h2>
            
            <p className={`mt-6 text-rose-200 text-base md:text-xl max-w-lg mx-auto leading-relaxed font-light backdrop-blur-sm bg-black/20 p-6 rounded-2xl border border-rose-500/20 shadow-2xl ${lato.className}`}>
                Distance Suckss yrrr But...... <br/><br/>
                Our Souls are holding each other tighter than ever cutuuuuu..... <br />
                <span className="text-white font-normal block mt-4 text-sm md:text-base">yyrrrr us din Hug kyu nhi kia maine... Hu to Bhondhuu hii 🤦‍♂️</span>
            </p>

            <button 
                onClick={() => setShowInput(true)} 
                className={`mt-12 px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-colors text-xs font-bold uppercase tracking-[0.2em] backdrop-blur-md ${techMono.className}`}
            >
                Continue
            </button>
        </div>
      )}
      
      {/* MESSAGE INPUT MODAL */}
      {showInput && (
          <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
              <div className="max-w-lg w-full bg-[#1a1a1a] border border-rose-500/30 p-8 rounded-2xl shadow-2xl relative">
                  
                  <h2 className={`text-2xl text-rose-200 mb-2 ${playfair.className}`}>One Last Thing...</h2>
                  <p className="text-white/60 text-sm mb-6 font-light">
                      Do you have any promises for me? Or maybe just something you want to say? 
                  </p>
                  
                  <textarea 
                      value={userMessage}
                      onChange={(e) => setUserMessage(e.target.value)}
                      placeholder="Type here..."
                      className="w-full h-60 bg-black/50 border border-white/10 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-rose-500/50 resize-none mb-6 font-light leading-relaxed"
                  />
                  
                  <div className="flex gap-4">
                      <button 
                          onClick={handleSkip}
                          className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-lg text-xs uppercase tracking-widest transition-all"
                      >
                          Skip
                      </button>
                      <button 
                          onClick={handleSend}
                          className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs uppercase tracking-widest font-bold shadow-lg shadow-rose-900/20 transition-all flex items-center justify-center gap-2"
                      >
                          Send to Me 💌
                      </button>
                  </div>
              </div>
          </div>
      )}

    </main>
  );
}