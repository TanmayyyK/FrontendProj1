"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Playfair_Display, Lato, Great_Vibes, Share_Tech_Mono } from "next/font/google";
import { useRouter } from "next/navigation";

// --- Fonts ---
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700"] });
const lato = Lato({ subsets: ["latin"], weight: ["300", "400", "700"] });
const greatVibes = Great_Vibes({ subsets: ["latin"], weight: ["400"] });
const techMono = Share_Tech_Mono({ subsets: ["latin"], weight: ["400"] });

// --- PROMISE DATA ---
const PROMISES = [
  { text: "To hear you always.. (Thoda Bolta Jyada hu But Thoda- Thoda to Sun bhi leta hu) (", type: "normal" },
  { text: "To be there in your good and bad times....Jab bhi man kare you can talk to me to vent out things that burden you....( I know kabhi kabhi utne ache se baat nhi krta wo kharab mood hota hai and trust me I am improving okay..)", type: "normal" },
  { text: "To stress you out at the end of the day (Emotional Tanmay okay hhehee).", type: "normal" },
  { text: "To make you sleep every night. (Chahe Kitni hi Thand ho Balcony me LOL!! and I secretly love it..)", type: "normal" },
  
  // --- SMILE TRIGGER ---
  { text: "I will always love your smile..(I mean kitna hi mood kharab ho aapki smile dekh leta hu it like releases my stress)", type: "smile_trigger" }, 
  
  { text: "To remember all your small things (Thoda bhoolne laga hu kya...????? but haa I will not forget anything imp to you and you know that...).", type: "normal" },
  { text: "To give you Emotional Solutions (Practical bhi kabhi kabhi hehhe)...", type: "normal" },
  { text: "To never break your trust. (Ye to tu mujh par Trust kr skti hai... Kr skti haina..?", type: "normal" },
  
  // --- DARK MODE TRIGGER ---
  { text: "I will always guide you in your dark times..(You are capable enough to let ur way out but I will always be there backing you up..)", type: "dark_trigger" }, 
  
  { text: "To hold your hand or hug you when you are scared (or just when you want warmth).", type: "hidden" },
  { text: "To be your safe space, your comfort and your home...(I apologise that I sometimes make you feel that I am not your home but I will improve and you know that..)", type: "hidden" },
  
  { text: "To be clapping the loudest when you achieve what you want... Dr Tanya....", type: "normal" },
  { text: "Just be with you always... (Chep hu thoda sa itni jldi se chordta nhi!!)", type: "normal" },
  { text: "To be a better version of me, just for you. (Sudhar rha hu na Dheere Dheere??..nhi..?nhi.?)", type: "normal" },
  { text: "To Never Shout at you... (agar majak mai bhi karu to daant dia kar naaa... Chup mat Hoajaya kar okay!!!)", type: "normal" },
  
  // --- LUDO TRIGGER ---
  { text: "Or haaa Ludo mai Bhi Jeetegi abse... (Haa tu hi jeeti thi waise Tukka tha mera waise rematch kab..?? hmmm bol bol.. Dar gai??)", type: "ludo_trigger" },
  
  { text: "To always Admire and Complement you Till I breathe (isme to expert hu haina??)", type: "normal" },
  { text: "And hamesha Bolta Rhunga heheheh(That means I will never go silent on us...)", type: "normal" },

  // --- THE FINAL PROMISE ---
  { text: "WE PROMISE EACH OTHER THAT WE WILL NEVER LEAVE EACH OTHER'S HAND NO MATTER HOW TOUGH THE TIME GETS..", type: "final" }
];

export default function PromisePage() {
  const router = useRouter();
  
  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const threadRef = useRef<SVGPathElement>(null);
  
  // State
  const [isSigned, setIsSigned] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  
  // --- INTERACTION STATES ---
  const [reflectionActive, setReflectionActive] = useState(false);
  const [prankStep, setPrankStep] = useState(0); 
  const [flash, setFlash] = useState(false); 
  
  const [darkActive, setDarkActive] = useState(false);
  const [flashlightPos, setFlashlightPos] = useState({ x: 0, y: 0 });

  const [ludoActive, setLudoActive] = useState(false);
  const [ludoStage, setLudoStage] = useState(0); 

  // --- NEW STATE FOR MESSAGE MODAL ---
  const [showInput, setShowInput] = useState(false);
  const [userMessage, setUserMessage] = useState("");

  // --- 1. GSAP & SCROLL LOGIC ---
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Intro Animation
      gsap.fromTo(".intro-text", 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.5, ease: "power3.out", delay: 0.5 }
      );

      // Promise Cards Animation
      const cards = gsap.utils.toArray(".promise-card");
      cards.forEach((card: any) => {
        gsap.fromTo(card,
          { opacity: 0, x: 50 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%", 
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // Red Thread
      if (threadRef.current) {
        const pathLength = threadRef.current.getTotalLength();
        gsap.set(threadRef.current, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
        gsap.to(threadRef.current, {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
            }
        });
      }

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // --- 2. REFLECTION SEQUENCE ---
  const triggerReflection = () => {
    setReflectionActive(true);
    setPrankStep(1); 

    setTimeout(() => setPrankStep(2), 2000);
    setTimeout(() => setPrankStep(3), 4000);
    setTimeout(() => setPrankStep(4), 6000);
    setTimeout(() => {
        setFlash(true); 
        setPrankStep(5);
        setTimeout(() => setFlash(false), 200); 
    }, 9000);
    setTimeout(() => setPrankStep(6), 11000);
    setTimeout(() => {
        setReflectionActive(false);
        setPrankStep(0);
    }, 13000);
  };

  // --- 3. DARK MODE / FLASHLIGHT LOGIC ---
  const triggerDark = () => {
    setDarkActive(true);
    document.body.style.overflow = "hidden";
    setTimeout(() => {
        setDarkActive(false);
        document.body.style.overflow = "auto";
    }, 10000);
  };

  const handleMove = (e: any) => {
    if (!darkActive) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setFlashlightPos({ x: clientX, y: clientY });
  };

  // --- 4. LUDO GAME LOGIC ---
  const triggerLudo = () => {
      setLudoActive(true);
      setLudoStage(0);

      // Sequence
      setTimeout(() => setLudoStage(1), 1000); // Start
      setTimeout(() => setLudoStage(2), 4000); // Glitch
      setTimeout(() => setLudoStage(3), 8000); // Win
      setTimeout(() => {
          setLudoActive(false);
          setLudoStage(0);
      }, 12000); // Exit
  };
  
  // --- 5. SIGNATURE LOGIC ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        ctx.strokeStyle = "#fb7185"; 
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
      }
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  const startDrawing = (e: any) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: any) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
    if (!isSigned) setIsSigned(true);
  };

  const endDrawing = () => setIsDrawing(false);
  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsSigned(false);
  };

  // --- 6. ACCEPT HANDLER (Show Modal) ---
  const handleAccept = () => {
    if (!isSigned) return;
    setShowInput(true); // Open the modal instead of navigating immediately
  };

  // --- 7. FINAL ACTIONS ---
  const handleSkip = () => {
      router.push("/");
  };

  const handleSend = () => {
      // ⚠️ UPDATE THIS NUMBER with your country code!
      // Example: "919999999999" for India
      const phoneNumber = "919416008686"; 

      const text = encodeURIComponent(`Hun....❤️\n${userMessage}`);
      
      // Use 'phone' parameter to target a specific number
      window.open(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${text}`, '_blank');
      
      // Redirect after a short delay
      setTimeout(() => {
          router.push("/");
      }, 1000);
  };

  return (
    <main 
      ref={containerRef} 
      onMouseMove={handleMove}
      onTouchMove={handleMove}
      className={`relative w-full min-h-screen text-white overflow-x-hidden flex flex-col lg:flex-row ${lato.className} ${darkActive ? 'cursor-none touch-none' : ''}`}
    >
      {/* --- BACKGROUND --- */}
      <div className="fixed inset-0 z-0 bg-[#050202]" />
      <div className="fixed inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none z-0" />
      
      {/* --- RED THREAD --- */}
      <svg className="fixed top-0 left-0 w-full h-full pointer-events-none z-10 hidden lg:block">
         <path 
            ref={threadRef}
            d="M 50 0 Q 50 100 200 150 T 500 300 T 800 500 T 1200 800 T 1200 1200" 
            fill="none"
            stroke="#e11d48"
            strokeWidth="2"
            strokeLinecap="round"
            className="drop-shadow-[0_0_10px_rgba(225,29,72,0.8)]"
         />
      </svg>
      {/* Mobile/Tablet Thread */}
      <div className="fixed left-6 lg:left-12 top-0 bottom-0 w-[1px] bg-rose-900/30 lg:hidden z-0">
         <div className="w-full h-full bg-rose-500 origin-top transform scale-y-0 animate-scroll-thread" />
      </div>

      {/* ================= OVERLAYS ================= */}
      
      {/* 1. MESSAGE INPUT MODAL (Resized) */}
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

      {/* 2. REFLECTION SEQUENCE OVERLAY */}
      {reflectionActive && (
          <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center animate-in fade-in duration-300 px-6 text-center">
              {flash && <div className="fixed inset-0 bg-white z-[110] animate-out fade-out duration-300" />}
              {prankStep === 1 && <p className={`text-white text-xl md:text-3xl animate-in zoom-in duration-700 ${playfair.className}`}>I mean look at this...</p>}
              {prankStep === 2 && <p className={`text-rose-200 text-xl md:text-3xl animate-in slide-in-from-bottom duration-700 ${playfair.className}`}>Have you seen your smile?</p>}
              {prankStep === 3 && <p className={`text-white text-2xl md:text-4xl animate-in zoom-in duration-1000 ${playfair.className}`}>Lo dekho ek baar... ❤️</p>}
              {prankStep === 4 && <div className="w-full h-full bg-black cursor-none" />}
              {prankStep === 5 && (
                 <div className="animate-in zoom-in duration-100 bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/20">
                     <div className="text-5xl mb-4">📸</div>
                     <p className={`text-white text-2xl ${techMono.className}`}>Pic clicked...</p>
                 </div>
              )}
              {prankStep === 6 && <p className={`text-rose-400 text-xl md:text-2xl mt-4 animate-bounce ${playfair.className}`}>Majak kr rha hu nhi li 😂</p>}
          </div>
      )}

      {/* 3. FLASHLIGHT OVERLAY */}
      {darkActive && (
          <div 
            className="fixed inset-0 z-50 pointer-events-none transition-opacity duration-500"
            style={{
                background: `radial-gradient(circle 200px at ${flashlightPos.x}px ${flashlightPos.y}px, transparent 0%, rgba(0,0,0,0.98) 100%)`
            }}
          >
              <div 
                className="absolute text-white/30 text-xs uppercase tracking-widest pointer-events-none"
                style={{ top: flashlightPos.y + 220, left: flashlightPos.x - 50 }}
              >
                  Slide to Read
              </div>
          </div>
      )}

      {/* 4. LUDO GAME OVERLAY */}
      {ludoActive && (
          <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
              <div className="bg-[#1a1a1a] p-4 rounded-xl border border-gray-700 shadow-2xl relative w-full max-w-sm lg:max-w-md aspect-square flex items-center justify-center">
                  
                  {/* --- GAME BOARD --- */}
                  <div className="w-full h-full bg-[#f0f0f0] rounded grid grid-cols-2 grid-rows-2 relative overflow-hidden">
                      <div className="bg-red-500 m-1 rounded flex items-center justify-center text-white/50 font-bold text-xs lowercase tracking-wider">tanmay</div>
                      <div className="bg-green-500 m-1 rounded flex items-center justify-center text-white/50 font-bold text-xs tracking-wider">CPU</div>
                      <div className="bg-blue-500 m-1 rounded flex items-center justify-center text-white/50 font-bold text-xs tracking-wider">CPU</div>
                      <div className="bg-yellow-500 m-1 rounded flex items-center justify-center text-white/50 font-bold text-xs tracking-wider">Tanya</div>

                      {/* CENTER PATH */}
                      <div className="absolute inset-[20%] bg-white flex items-center justify-center border-2 border-gray-300">
                          {ludoStage === 3 && <div className="text-4xl">👑</div>}
                      </div>

                      {/* PIECES */}
                      {/* My Piece (Red) */}
                      <div 
                        className={`absolute w-6 h-6 lg:w-8 lg:h-8 bg-red-600 border-2 border-white rounded-full shadow-lg transition-all duration-1000 z-10
                            ${ludoStage >= 1 && ludoStage < 2 ? 'top-[45%] left-[45%] scale-125' : 'top-4 left-4'}
                        `}
                      />
                      
                      {/* Your Piece (Yellow) */}
                      <div 
                        className={`absolute w-6 h-6 lg:w-8 lg:h-8 bg-yellow-500 border-2 border-white rounded-full shadow-lg transition-all duration-[2000ms] z-20
                            ${ludoStage >= 3 ? 'top-[45%] left-[45%] scale-150 animate-bounce' : 'bottom-4 right-4'}
                        `}
                      />
                  </div>

                  {/* --- OVERLAYS ON BOARD --- */}
                  
                  {/* STAGE 1: My Turn */}
                  {ludoStage === 1 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                          <p className="text-red-400 font-bold text-xl lg:text-2xl animate-pulse">Haha! I win! 🎲</p>
                      </div>
                  )}

                  {/* STAGE 2: GLITCH (Longer Duration) */}
                  {ludoStage === 2 && (
                      <div className="absolute inset-0 bg-black flex flex-col items-center justify-center font-mono overflow-hidden p-4 text-center">
                          <p className="text-red-500 glitch-text text-3xl font-bold">SYSTEM ERROR</p>
                          <p className="text-green-500 text-sm mt-4 tracking-widest">{`> DETECTED: MYBABY_CANNOT_LOSE`}</p>
                          <p className="text-green-500 text-sm mt-2">{`> OVERRIDING LOGIC...`}</p>
                          <p className="text-green-500/50 text-xs mt-6 animate-pulse">Re-calculating winner...</p>
                      </div>
                  )}

                  {/* STAGE 3: WIN */}
                  {ludoStage === 3 && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-yellow-500/90 animate-in zoom-in p-4 text-center">
                          <h1 className="text-5xl font-bold text-white drop-shadow-md">WINNER!</h1>
                          <p className="text-white/80 text-lg mt-4 font-medium">Prank tha! You always win Tanya. ❤️</p>
                      </div>
                  )}
              </div>
          </div>
      )}

      {/* ================= CONTENT ================= */}

      {/* LEFT HEADER (Sticky for Desktop/Tablet) */}
      <div className="w-full lg:w-1/2 h-auto lg:h-screen lg:sticky lg:top-0 z-20 flex flex-col justify-center px-8 md:px-16 lg:px-24 border-b lg:border-b-0 lg:border-r border-white/10 shrink-0 backdrop-blur-sm lg:backdrop-blur-none py-16 lg:py-0">
         <p className={`text-rose-400 text-xs font-bold tracking-[0.3em] uppercase ${techMono.className} mb-4 animate-pulse`}>
            Fate Connected
         </p>
         <h1 className={`text-5xl md:text-7xl lg:text-8xl text-white font-bold tracking-tight leading-none ${playfair.className}`}>
            Our <br/> <span className="text-rose-500">Thread</span>
         </h1>
         <div className="hidden lg:block w-20 h-1 bg-rose-500 mt-8 rounded-full" />
      </div>

      {/* RIGHT PROMISES (Scrollable) */}
      <div className="w-full lg:w-1/2 relative z-10 flex flex-col items-start pt-12 lg:pt-32 pb-32 px-6 md:px-16 lg:px-24 ml-auto">
         
         <div className="intro-text mb-20 max-w-lg pl-8 border-l border-rose-500/30">
            <h2 className={`text-2xl md:text-3xl text-rose-200 mb-6 leading-relaxed ${playfair.className}`}>
               The Red String Theory...
            </h2>
            <div className="space-y-4 text-white/80 font-light text-lg leading-relaxed">
               <p>They say naaa ki an invisible red thread connects those who are destined to meet.</p>
               <p> And we are perfect Example of destiny aren't we..?🧿 </p>
               <p className="text-white font-medium pl-2">
                  These are the knots I tie on our thread today:
               </p>
            </div>
         </div>

         {/* LIST */}
         <div className="flex flex-col gap-24 lg:gap-32 w-full max-w-xl relative">
            <div className="absolute left-[-20px] top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-rose-500/50 to-transparent" />

            {PROMISES.map((promise, index) => (
               <div 
                  key={index} 
                  className={`promise-card flex flex-col gap-4 items-start group relative transition-all duration-500 
                    ${promise.type === 'hidden' && !darkActive ? 'opacity-0 blur-md' : 'opacity-100 blur-0'}
                  `}
               >
                  <div className="flex gap-6 items-center">
                    <div className={`absolute left-[-24px] w-2 h-2 rounded-full shadow-[0_0_10px_rgba(225,29,72,0.8)] opacity-50 group-hover:opacity-100 transition-opacity ${promise.type === 'final' ? 'bg-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.8)]' : 'bg-rose-500'}`} />

                    {promise.type !== 'final' ? (
                        /* MODIFIED LINE: Added permanent BRIGHT colors + Glow effect */
                        <span className={`text-4xl lg:text-5xl font-serif transition-all duration-500 ${playfair.className}
                            text-rose-500 drop-shadow-[0_0_5px_rgba(225,29,72,0.5)]
                        `}>
                            {String(index + 1).padStart(2, '0')}
                        </span>
                    ) : (
                        <span className={`text-4xl text-yellow-500/50 font-serif animate-pulse ${playfair.className}`}>∞</span>
                    )}
                    
                    {/* TEXT LOGIC FOR NORMAL VS FINAL */}
                    {promise.type === 'final' ? (
                        <div className="p-6 lg:p-8 border border-yellow-500/30 bg-yellow-900/10 rounded-xl shadow-[0_0_30px_rgba(234,179,8,0.1)] backdrop-blur-sm w-full">
                            <p className={`text-xs md:text-sm text-yellow-500 uppercase tracking-[0.2em] mb-3 ${techMono.className}`}>The Final Promise</p>
                            <p className={`text-xl md:text-2xl lg:text-3xl font-bold leading-tight text-yellow-100 ${playfair.className}`}>
                                {promise.text}
                            </p>
                        </div>
                    ) : (
                        /* MODIFIED LINE: Changed opacity to 80% and weight to light for subtle look */
                        <p className={`text-lg md:text-xl lg:text-2xl font-normal leading-relaxed group-hover:text-white transition-colors duration-300 drop-shadow-md
                            ${promise.type === 'hidden' ? 'text-blue-200/80' : 'text-white/80 hover:text-white'}
                        `}>
                            {promise.text}
                        </p>
                    )}
                  </div>

                  {/* BUTTON: SMILE / REFLECTION */}
                  {promise.type === 'smile_trigger' && (
                    <button 
                        onClick={triggerReflection}
                        className="ml-16 lg:ml-20 px-6 py-2 bg-rose-600/20 border border-rose-500/50 text-rose-300 rounded-full text-xs md:text-sm uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all shadow-[0_0_15px_rgba(225,29,72,0.2)] animate-pulse"
                    >
                        See Why?
                    </button>
                  )}

                  {/* BUTTON: DARK MODE / FLASHLIGHT */}
                  {promise.type === 'dark_trigger' && (
                    <button 
                        onClick={triggerDark}
                        className="ml-16 lg:ml-20 px-6 py-2 bg-blue-600/20 border border-blue-500/50 text-blue-300 rounded-full text-xs md:text-sm uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-[0_0_15px_rgba(59,130,246,0.2)] animate-bounce"
                    >
                        How? 🔦
                    </button>
                  )}

                  {/* BUTTON: LUDO / GAME */}
                  {promise.type === 'ludo_trigger' && (
                    <button 
                        onClick={triggerLudo}
                        className="ml-16 lg:ml-20 px-6 py-2 bg-green-600/20 border border-green-500/50 text-green-300 rounded-full text-xs md:text-sm uppercase tracking-widest hover:bg-green-600 hover:text-white transition-all shadow-[0_0_15px_rgba(34,197,94,0.2)]"
                    >
                        Rematch? 🎲
                    </button>
                  )}
               </div>
            ))}
         </div>

         {/* SIGNATURE */}
         <div className="promise-card w-full max-w-md mt-32 bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
            <h3 className={`text-2xl text-rose-200 mb-2 ${playfair.className}`}>Seal the Deal</h3>
            <p className="text-white/40 text-xs mb-6 uppercase tracking-widest">Sign below to knot the thread forever</p>
            <div className="relative w-full h-40 bg-black/40 rounded-xl border border-white/20 overflow-hidden cursor-crosshair touch-none">
                <canvas
                    ref={canvasRef}
                    className="w-full h-full"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={endDrawing}
                    onMouseLeave={endDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={endDrawing}
                />
                {!isSigned && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center animate-pulse">
                        <span className={`text-white/10 text-4xl ${greatVibes.className}`}>Sign Here</span>
                    </div>
                )}
            </div>
            <div className="flex justify-between items-center mt-4 relative z-10">
                <button onClick={clearSignature} className="text-xs text-white/40 hover:text-white transition-colors uppercase tracking-wider">Clear</button>
                <button
                    onClick={handleAccept}
                    disabled={!isSigned}
                    className={`px-8 py-3 rounded-full font-bold tracking-widest transition-all duration-300 ${isSigned ? "bg-rose-600 text-white shadow-[0_0_30px_rgba(225,29,72,0.6)] hover:scale-105 hover:bg-rose-500" : "bg-white/10 text-white/20 cursor-not-allowed"}`}
                >
                    {isSigned ? "ACCEPT FOREVER" : "Waiting for Sign..."}
                </button>
            </div>
         </div>
      </div>
    </main>
  );
}