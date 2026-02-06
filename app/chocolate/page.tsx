"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { Playfair_Display, Lato, Share_Tech_Mono, Titan_One } from "next/font/google";
import { X, Lock, Unlock } from "lucide-react"; 

// --- Fonts ---
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700"] });
const lato = Lato({ subsets: ["latin"], weight: ["300", "400", "700"] });
const techMono = Share_Tech_Mono({ subsets: ["latin"], weight: ["400"] });
const titan = Titan_One({ subsets: ["latin"], weight: ["400"] }); 

const SECRET_CODE = "11/12/2025/21/56";

export default function ChocolatePage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const meterRef = useRef<HTMLInputElement>(null);
  
  // --- STATES ---
  const [gameStage, setGameStage] = useState<"meter" | "incoming" | "scratch" | "claimed">("meter"); 
  const [meterValue, setMeterValue] = useState(0); 
  const [isRevealed, setIsRevealed] = useState(false);
  const [isWrapperReady, setIsWrapperReady] = useState(false);

  // Message & Auth States
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [isError, setIsError] = useState(false);
  
  const [showToast, setShowToast] = useState(false);

  // --- Helper: Create Crumbs ---
  const createCrumb = useCallback((forceExplosion = false) => {
    const crumb = document.createElement("div");
    crumb.className = "oreo-crumb";
    const type = Math.random();
    
    if (forceExplosion) {
        crumb.innerHTML = ["🍫", "🍬", "🍪", "🍩"][Math.floor(Math.random() * 4)];
        crumb.style.fontSize = `${Math.random() * 40 + 30}px`;
    } else {
        if (type > 0.7) {
            crumb.innerHTML = "🍪"; 
            crumb.style.fontSize = `${Math.random() * 30 + 20}px`;
        } else if (type > 0.4) {
            crumb.style.width = `${Math.random() * 10 + 5}px`;
            crumb.style.height = `${Math.random() * 10 + 5}px`;
            crumb.style.backgroundColor = "#2e2e2e"; 
            crumb.style.borderRadius = "50%";
        } else {
            crumb.style.width = `${Math.random() * 8 + 4}px`;
            crumb.style.height = `${Math.random() * 8 + 4}px`;
            crumb.style.backgroundColor = "#ffffff"; 
            crumb.style.borderRadius = "50%";
        }
    }

    crumb.style.position = "absolute";
    crumb.style.left = forceExplosion ? "50%" : `${Math.random() * 100}%`;
    crumb.style.top = forceExplosion ? "50%" : `-10%`; 
    crumb.style.opacity = forceExplosion ? "1" : "0.5";
    crumb.style.pointerEvents = "none";
    crumb.style.zIndex = "0"; 
    containerRef.current?.appendChild(crumb);

    if (forceExplosion) {
        gsap.to(crumb, {
            x: `random(-500, 500)`,
            y: `random(-500, 500)`,
            rotation: `random(0, 720)`,
            duration: 2,
            ease: "power4.out",
            opacity: 0,
            onComplete: () => crumb.remove()
        });
    } else {
        gsap.to(crumb, {
            y: "110vh", 
            rotation: `random(0, 720)`,
            duration: `random(5, 15)`,
            ease: "linear",
            repeat: -1,
            delay: `random(0, 10)`
        });
    }
  }, []);

  // --- 1. Background Floating Oreos ---
  useEffect(() => {
    const ctx = gsap.context(() => {
      for (let i = 0; i < 20; i++) {
        createCrumb();
      }
    }, containerRef);
    return () => ctx.revert();
  }, [createCrumb]);

  // --- 2. Initialize Canvas (Draw wrapper immediately but keep hidden) ---
  useEffect(() => {
    // We only initialize the canvas drawing when we hit the 'scratch' stage to ensure dimensions are correct
    if (gameStage !== "scratch") return;

    const timer = setTimeout(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const parent = canvas.parentElement;
        if (parent) {
            canvas.width = parent.clientWidth;
            canvas.height = parent.clientHeight;
        }

        // Draw the wrapper
        const drawWrapper = () => {
            ctx.globalCompositeOperation = "source-over"; // Ensure we are drawing normally first
            ctx.fillStyle = "#3e005f"; 
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(-Math.PI / 12); 
            ctx.textAlign = "center";
            
            ctx.shadowColor = "rgba(0,0,0,0.3)";
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = 5;
            ctx.shadowOffsetY = 5;

            ctx.font = "bold 30px Arial";
            ctx.fillStyle = "#fbbf24"; 
            ctx.fillText("TANYA'S SPECIAL", 0, -40);
            
            ctx.font = "bold 50px Arial";
            ctx.fillStyle = "#ffffff"; 
            ctx.fillText("DAIRY MILK", 0, 20);

            ctx.font = "bold 24px Arial";
            ctx.fillStyle = "#60a5fa"; 
            ctx.fillText("OREO EDITION", 0, 70);
            
            ctx.restore();

            ctx.font = "14px monospace";
            ctx.fillStyle = "rgba(255,255,255,0.6)";
            ctx.textAlign = "center";
            ctx.fillText("✨ SCRATCH ME ✨", canvas.width / 2, canvas.height - 40);
        };

        drawWrapper();
        
        // Prepare for scratching
        setIsWrapperReady(true);

        // Entrance Animation
        gsap.fromTo(".scratch-card-container", 
            { scale: 0, rotation: -20 },
            { scale: 1, rotation: 0, duration: 0.8, ease: "elastic.out(1, 0.5)" }
        );

    }, 100); // Small delay to ensure DOM layout is settled

    return () => clearTimeout(timer);
  }, [gameStage]);

  // --- 3. TRANSITION LOGIC ---
  const triggerExplosion = () => {
      for(let i=0; i<30; i++) createCrumb(true); 
      gsap.to(containerRef.current, { 
        keyframes: { x: [-10, 10, -10, 10, 0] },
        duration: 0.4 
      });
      setGameStage("scratch");
  };

  useEffect(() => {
      if (gameStage === "incoming") {
          const timer = setTimeout(() => {
              triggerExplosion();
          }, 3000);
          return () => clearTimeout(timer);
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStage]);

  // --- 4. METER LOGIC ---
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseInt(e.target.value);
    setMeterValue(val);

    if (val > 50 && gameStage === 'meter') {
        if(meterRef.current) meterRef.current.disabled = true;
        const obj = { v: val };
        gsap.to(obj, {
            v: 100,
            duration: 0.5,
            ease: "power2.out",
            onUpdate: () => setMeterValue(Math.round(obj.v)),
            onComplete: () => {
                setTimeout(() => {
                    setGameStage("incoming");
                },4000);
            }
        });
    }
  };

  // --- 5. ROBUST SCRATCH LOGIC ---
  const handleScratch = (e: any) => {
    // Guard: Don't scratch if already revealed or wrapper isn't fully drawn yet
    if (isRevealed || !isWrapperReady) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Set composite operation specifically for scratching now
    ctx.globalCompositeOperation = "destination-out";
    
    ctx.beginPath();
    ctx.arc(x, y, 40, 0, Math.PI * 2); 
    ctx.fill();

    // Check Percentage (Throttled for performance could be added, but this is simple enough)
    // Only check every 10th move roughly (simple math random check to reduce lag)
    if (Math.random() > 0.8) {
        checkRevealPercentage(canvas, ctx);
    }
  };

  const checkRevealPercentage = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      let transparentCount = 0;
      
      // Check alpha channel of every 10th pixel for performance
      for (let i = 3; i < pixels.length; i += 40) {
          if (pixels[i] === 0) {
              transparentCount++;
          }
      }

      const totalChecked = pixels.length / 40;
      const percentage = (transparentCount / totalChecked) * 100;

      // Reveal if more than 40% is scratched
      if (percentage > 40) {
          setIsRevealed(true);
          gsap.to(canvas, { opacity: 0, duration: 0.5 });
      }
  };

  // --- 6. Auth Handler ---
  const handleAuthSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (inputCode === SECRET_CODE) {
          setShowAuthModal(false);
          setShowMessageModal(true);
          setInputCode("");
      } else {
          setIsError(true);
          setTimeout(() => {
              setIsError(false);
              setInputCode("");
          }, 500);
      }
  };

  const handleClaim = () => {
    setGameStage("claimed");
    setTimeout(() => {
        router.push("/");
    }, 6000);
  };

  const handleEasterEgg = () => {
    setShowToast(true);
    setTimeout(() => {
        setShowToast(false);
    }, 3000);
  };

  return (
    <main 
      ref={containerRef}
      className={`relative w-full h-screen overflow-hidden bg-[#1a0b2e] text-white flex flex-col items-center justify-center ${lato.className}`}
    >
      
      {showToast && (
        <div className="fixed top-20 z-[100] animate-in fade-in slide-in-from-top-5 duration-300">
            <div className="bg-[#fffbf0] text-[#3e005f] px-6 py-3 rounded-full shadow-[0_0_20px_rgba(251,191,36,0.6)] border-2 border-[#fbbf24] flex items-center gap-2">
                <span className="text-xl">✨</span>
                <span className={`font-bold ${playfair.className}`}>You are the sweetest thing ever happened to me..</span>
                <span className="text-xl">✨</span>
            </div>
        </div>
      )}

      {/* ================= STAGE 1: METER ================= */}
      {gameStage === "meter" && (
          <div className="z-20 flex flex-col items-center text-center p-6 animate-in zoom-in duration-700 w-full max-w-md">
              <h2 className={`text-4xl md:text-5xl text-[#fbbf24] mb-8 ${titan.className} drop-shadow-lg`}>
                  Sweetness Check! 
              </h2>
              <p className="text-white/80 mb-12 text-lg">How sweet is  my Tanya today?</p>
              
              <div className="relative w-full h-16 bg-white/10 rounded-full border-4 border-white/20 p-2 shadow-[0_0_30px_rgba(251,191,36,0.3)]">
                  <div className="absolute top-2 bottom-2 left-2 rounded-full bg-gradient-to-r from-rose-500 via-[#fbbf24] to-white transition-all duration-100" 
                       style={{ width: `${meterValue}%` }} />
                  <input 
                    ref={meterRef}
                    type="range" 
                    min="0" 
                    max="100" 
                    value={meterValue}
                    onChange={handleSliderChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                      <span className={`text-2xl font-bold ${titan.className} drop-shadow-md ${meterValue > 90 ? 'text-[#3e005f] animate-bounce' : 'text-white'}`}>
                          {meterValue}%
                      </span>
                  </div>
              </div>

              <div className="mt-8 h-8">
                  {meterValue > 90 ? (
                      <p className="text-red-400 font-bold tracking-widest animate-pulse text-xl">Come On Cutuuu You are always 110% sweet..!!</p>
                  ) : (
                      <p className="text-white/50 text-sm">Drag right to measure...</p>
                  )}
              </div>
          </div>
      )}

      {/* ================= STAGE 1.5: INCOMING ================= */}
      {gameStage === "incoming" && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black animate-in fade-in duration-1000">
            <h1 className={`text-4xl md:text-6xl text-[#a855f7] mb-4 text-center px-4 leading-tight animate-pulse ${titan.className}`}>
                Chocolate Incoming...
            </h1>
            <div className="text-6xl animate-bounce mt-4">🍫</div>
        </div>
      )}

      {/* ================= STAGE 3: CLAIMED ================= */}
      {gameStage === "claimed" && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 animate-in fade-in duration-1000 p-8 text-center">
            <div className="text-6xl mb-6 animate-bounce">🚚</div>
            <h1 className={`text-3xl md:text-5xl text-[#fbbf24] mb-4 leading-tight ${titan.className}`}>
                Wait for your chocolate...
            </h1>
            <p className={`text-xl text-white/80 ${playfair.className}`}>
                It&apos;s reaching you very soon! ❤️
            </p>
            <div className="mt-8 w-16 h-1 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-[#fbbf24] animate-[width_2s_ease-in-out_infinite]" style={{width: '50%'}} />
            </div>
        </div>
      )}

      {/* ================= MESSAGE ICON ================= */}
      {gameStage === "scratch" && (
        <button 
            onClick={() => setShowAuthModal(true)}
            className="absolute top-6 right-6 z-50 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:scale-110 transition-transform active:scale-95 shadow-lg animate-in fade-in duration-1000"
        >
            <span className="text-2xl">📩</span>
        </button>
      )}

      {/* ================= AUTH MODAL (PASSCODE) ================= */}
      {showAuthModal && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-md p-6 animate-in fade-in duration-300" onClick={() => setShowAuthModal(false)}>
              <div className="w-full max-w-xs bg-[#1a0b2e] border border-[#3e005f] p-8 rounded-2xl text-center shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 text-white/50 hover:text-white"><X size={20}/></button>
                  
                  <div className="mb-6 flex justify-center">
                      <div className="w-12 h-12 rounded-full bg-[#3e005f] flex items-center justify-center">
                          <Lock size={20} className="text-[#fbbf24]" />
                      </div>
                  </div>

                  <h3 className={`text-lg text-white mb-2 ${titan.className}`}>Locked Message</h3>
                  <p className="text-white/60 text-xs mb-6 font-mono">"When You Said ILY For The First Time.."</p>

                  <form onSubmit={handleAuthSubmit} className={`space-y-4 ${isError ? 'animate-shake' : ''}`}>
                      <input 
                          type="text" 
                          placeholder="DD/MM/YYYY/HH/MM"
                          value={inputCode}
                          onChange={(e) => setInputCode(e.target.value)}
                          className="w-full bg-black/30 border border-white/10 rounded-lg py-3 px-4 text-center text-white placeholder-white/20 outline-none focus:border-[#fbbf24] transition-all font-mono tracking-widest text-sm"
                          autoFocus
                      />
                      <button 
                          type="submit"
                          className="w-full py-3 bg-[#3e005f] hover:bg-[#50007b] text-white rounded-lg font-bold text-sm tracking-widest transition-colors flex items-center justify-center gap-2"
                      >
                          <Unlock size={14} />
                          UNLOCK
                      </button>
                  </form>
              </div>
          </div>
      )}

      {/* ================= MESSAGE MODAL (CONTENT) ================= */}
      {showMessageModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6 animate-in fade-in duration-300" onClick={() => setShowMessageModal(false)}>
            <div className="bg-[#fffbf0] text-black w-full max-w-sm p-8 rounded-2xl shadow-2xl relative overflow-y-auto max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => setShowMessageModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors">
                    <X size={24} />
                </button>
                <h3 className={`text-xl font-bold mb-4 text-[#3e005f] ${playfair.className}`}>A sweet note...</h3>
                <div className="text-gray-800 leading-relaxed font-medium text-sm md:text-base space-y-2">
                    <p>Hey My Lotte Choco Pie...</p>
                    <p>Just wanted to say... You are prettier than any Milky Bar.(My Favourite also hehehe)</p>
                    <ul className="list-disc pl-4 space-y-1 marker:text-[#3e005f]">
                        <li>Be 5-Star of My heart... (Hn pata hai aapko nhi pasand but compliment mai chalti hai..hehehe)</li>
                        <li>Be My Dairy Milk (My Comfort... I will be yours..)</li>
                        <li>Lets stay together like the bars of Kit-kat..</li>
                        <li>You spark me as a PERK(thoda lame haiii lol but hai tu PERK hai meri)</li>
                        <li>And My baby you are smooth as Silky Bar...</li>
                        <li>You are like white cream of oreo sweetu and pure ekdum....( I admire your choice Silk Oreo hmmmm..)</li>
                        <li>You are rare and Precious Like Ferrero Rocher....(Fr is special coz its the first chocolate I gifted you..)</li>
                        <li>You are vitamin necessary and so intense for me so you are hmm....Dark Chocolate alsoo..(not for everyone)</li>
                        <li>You have multiple layers like Fuse ( I wanna know each one of them slowly slowly..)</li>
                    </ul>
                    <p className="pt-2">Jyada chocolate hogai brush kr lena okay...hehee 👌🏻</p>
                    <br/>
                    <p>I hope this little virtual treat makes your day a little sweeter...My Cutuuuuuuu (aapka message aa gya ye type kr rha hu.. kya aaya hai ruk dekhta hu .. call kr lena okiii..)</p>
                    <br/>
                    <p>Love,<br/>Your Sweetuuuu Tanmay</p>
                </div>
                <div className="mt-6 text-center text-xs text-gray-400 uppercase tracking-widest">
                    Tap anywhere to close
                </div>
            </div>
        </div>
      )}

      {/* ================= STAGE 2: THE SCRATCH CARD ================= */}
      {gameStage === "scratch" && (
        <div className="scratch-card-container relative z-20 w-[90%] max-w-sm aspect-[3/4] flex items-center justify-center">
            
            {/* LAYER 1: THE GOLDEN TICKET (Underneath) */}
            <div className={`absolute inset-0 bg-gradient-to-b from-[#fcd34d] to-[#fbbf24] rounded-xl p-2 shadow-2xl flex flex-col transition-opacity duration-500 ${isWrapperReady ? 'opacity-100' : 'opacity-0'} ${!isRevealed ? 'pointer-events-none' : ''}`}>
                <div className="border-4 border-dashed border-black/10 h-full rounded-lg p-6 flex flex-col items-center text-center bg-white/10 overflow-hidden">
                    
                    {/* Header Section */}
                    <div className="flex-shrink-0 mb-2 select-none pointer-events-auto"> 
                        <div 
                            onClick={handleEasterEgg}
                            className="text-5xl mb-1 cursor-pointer hover:scale-110 active:scale-95 transition-transform"
                        >
                            🍫
                        </div>
                        <h2 className={`text-3xl text-[#3e005f] ${titan.className}`}>GOLDEN TICKET</h2>
                        <p className={`text-xs text-black/60 font-bold uppercase tracking-widest ${techMono.className}`}>
                            ID: SWEETUUUU CUTTUU
                        </p>
                    </div>

                    {/* Scrollable Content Section */}
                    <div className="bg-white/60 p-3 rounded-lg w-full flex-1 overflow-y-auto min-h-0 my-2 shadow-inner relative custom-scrollbar pointer-events-auto">
                        <p className="text-sm font-bold text-[#3e005f] mb-2 text-left sticky top-0 bg-white/0 backdrop-blur-sm">Includes:</p>
                        <ul className="text-left text-[10px] md:text-xs space-y-2 text-black/80 font-medium leading-relaxed pb-6">
                            <li>✅ Unlimited Silk Oreos (But haa Khaio kam hi Sensitive Teeth hai aapke..or brush kr rhi haina raat ko.....Aaj chocolate Khake kr lena okay!!)</li>
                            <li>✅ Soon a Late Night Drive (Manifest with me tanya will do one day for sure pakkiiiii baat)</li>
                            <li>✅ F1 Kit-Kat (hmmm.. dhoondh rha hu mili to usi din bhej dunga aapko)</li>
                            <li>✅ I will share your Half Kitkat...(We will have our first break )</li>
                            <li>✅ I will always bookmark in ur Book after you sleep Put ur specs down kiss ur forehead and cover u with ur blanket and stare at you whole night...</li>
                            <li>✅ Good Morning Coffee jab saath rhenenge kabhi to daily ekdum hehehehe (hmm ek straw se 😗)</li>
                            <li>✅ And I know you only eat a bit of a chocolate at a time I will always keep ur remaining chocolate safe..give it to you when u will crave again(ha ha pakka khaunga nhi..)</li>
                            <li>✅ Agli baar Ferrero Rocher share krni padegi...( kidding aapko khata dekhne se meetha kuch hai hi nhi is duniya mai)</li>
                            <li>✅ And Obv Me...Mai to hu hi(Mai bhi theek thaak sweet hu yrr)</li>
                        </ul>
                        
                        <div className="sticky bottom-0 w-full text-center bg-gradient-to-t from-white/90 via-white/50 to-transparent pt-6 pb-1 -mx-3 px-3 translate-y-2 pointer-events-none">
                            <p className="text-[9px] text-[#3e005f]/60 font-bold animate-bounce tracking-widest">
                                ▼ SCROLL FOR MORE ▼
                            </p>
                        </div>
                    </div>

                    {/* Button Section */}
                    <div className="flex-shrink-0 w-full mt-2 pointer-events-auto">
                       <button 
                            onClick={handleClaim}
                            className="w-full py-4 bg-[#3e005f] text-white font-bold rounded-full shadow-lg hover:scale-105 transition-transform active:scale-95 relative z-10 touch-manipulation"
                        >
                            CLAIM NOW
                        </button>
                    </div>
                </div>
            </div>

            {/* LAYER 2: THE WRAPPER (Canvas) */}
            <div 
                className="absolute inset-0 rounded-xl overflow-hidden shadow-2xl transition-all duration-500 z-30"
                style={{ pointerEvents: isRevealed ? 'none' : 'auto' }}
            >
                <canvas
                    ref={canvasRef}
                    className="w-full h-full touch-none cursor-pointer"
                    onMouseMove={handleScratch}
                    onTouchMove={handleScratch}
                />
            </div>
        </div>
      )}

    </main>
  );
}