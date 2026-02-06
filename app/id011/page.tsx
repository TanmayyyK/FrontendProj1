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

// --- YOUR PROMISES ---
const PROMISES = [
  "To hear you always.",
  "To be there in your good and bad times(Thoda Bolta Jyada hu But Thoda- Thoda to Sun bhi leta hu).",
  "To stress you out at the end of the day (Emotional Solutions okay hhehee).",
  "To make you sleep every night.(Chahe Kitni hi Thand ho Balcony me LOL!!)",
  "To remember all your small things (Thoda bhoolne laga hu kya...????? but haa I will not forget anything imp to you).",
  "To give you Emotional Solutions (Practical bhi kabhi kabhi hehhe)...",
  "To never break your trust.(Ye to tu mujh par Trust kr skti hai... Kr skti haina..?",
  "To never let a pinch of sadness come to that pretty smiling face.(Hasti hai to achi lgti hai!!)",
  "To be clapping the loudest when you achieve what you want...Dr Tanya....",
  "Just be with you always...(Chep hu thoda sa itni jldi se chordta nhi!!)",
  "To be a better version of me, just for you.( Sudhar rha hu na Dheere Dheere??)",
  "To Never Shout at you...(agar majak mai bhi karu to daant dia kar naaa... Chup mat Hoajaya kar okay!!!",
  "To always Admire and Complement you Till I breathe ( isme to expert hu haina??)",
  "And hamesha Bolta Rhunga heheheh",
  "Or haaa Ludo mai Bhi Jeetegi abse... ( Haa tu hi jeeti thi waise Tukka tha mera  waise rematch kab..?? hmmm bol bol.. Dar gai??",
  
];

export default function PromisePage() {
  const router = useRouter();
  
  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef(null);
  
  // State
  const [isSigned, setIsSigned] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  // --- 1. GSAP Scroll Animation ---
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Animate the Intro Text first
      gsap.fromTo(".intro-text", 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.5, ease: "power3.out", delay: 0.5 }
      );

      // Animate promises as they scroll into view
      const cards = gsap.utils.toArray(".promise-card");
      cards.forEach((card: any) => {
        gsap.fromTo(
          card,
          { opacity: 0, x: 50 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 80%", // Trigger when item is 80% down the screen
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // --- 2. Signature Canvas Logic ---
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
        ctx.strokeStyle = "#fb7185"; // Rose-400
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
      }
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  // Drawing Handlers
  const startDrawing = (e: any) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: any) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
    
    if (!isSigned) setIsSigned(true);
  };

  const endDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsSigned(false);
  };

  const handleAccept = () => {
    if (!isSigned) return;
    gsap.to(containerRef.current, {
        opacity: 0,
        y: -50,
        duration: 0.5,
        onComplete: () => router.push("/")
    });
  };

  return (
    <main 
      ref={containerRef} 
      // FIX: Changed overflow-hidden to overflow-x-hidden so Sticky works!
      className={`relative w-full min-h-screen bg-[#050202] text-white overflow-x-hidden flex flex-col md:flex-row ${lato.className}`}
    >
      {/* Background Texture */}
      <div className="fixed inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none z-0" />
      
      {/* --- LEFT SIDE (FIXED/STICKY) --- */}
      {/* FIX: added h-screen and sticky top-0 */}
      <div className="w-full md:w-1/2 h-auto md:h-screen md:sticky md:top-0 z-20 bg-gradient-to-b md:bg-gradient-to-r from-black via-black/90 to-transparent flex flex-col justify-center px-8 md:px-16 border-b md:border-b-0 md:border-r border-white/10 shrink-0">
         <p className={`text-rose-500 text-xs font-bold tracking-[0.3em] uppercase ${techMono.className} mb-4 mt-12 md:mt-0`}>
            Love:- 2025...Forever
         </p>
         <h1 className={`text-6xl md:text-8xl text-white font-bold tracking-tight leading-none ${playfair.className}`}>
            I <br/> Promise
         </h1>
         <div className="hidden md:block w-20 h-1 bg-rose-500 mt-8" />
      </div>

      {/* --- RIGHT SIDE (SCROLLABLE CONTENT) --- */}
      {/* FIX: Removed fixed height and overflow-y-auto so it scrolls with the window */}
      <div className="w-full md:w-1/2 relative z-10 flex flex-col items-start pt-12 md:pt-32 pb-32 px-6 md:px-16">
         
         {/* INTRO MESSAGE */}
         <div className="intro-text mb-20 max-w-lg">
            <h2 className={`text-2xl md:text-3xl text-rose-200 mb-6 leading-relaxed ${playfair.className}`}>
               I know you trusted me...
            </h2>
            <div className="space-y-4 text-white/80 font-light text-lg leading-relaxed">
               <p>I know you had some fear from the past.</p>
               <p>You couldn't trust long distance easily.</p>
               <p>But you still trusted me to come on this journey with me.</p>
               <p className="text-white font-medium border-l-2 border-rose-500 pl-4">
                  I am so, so glad that you trusted me, Tanya.
               </p>
            </div>
         </div>

         {/* PROMISES LIST */}
         <div className="flex flex-col gap-16 w-full max-w-lg">
            {PROMISES.map((promise, index) => (
               <div 
                  key={index} 
                  className="promise-card flex gap-6 items-start group"
               >
                  <span className={`text-4xl text-rose-900/40 font-serif group-hover:text-rose-500 transition-colors duration-500 ${playfair.className}`}>
                     {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="text-xl md:text-2xl text-white/90 font-light leading-relaxed group-hover:text-white transition-colors duration-300">
                     {promise}
                  </p>
               </div>
            ))}
         </div>

         {/* SIGNATURE SECTION */}
         <div className="promise-card w-full max-w-md mt-24 bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md">
            <h3 className={`text-2xl text-rose-200 mb-2 ${playfair.className}`}>
               Seal the Deal
            </h3>
            <p className="text-white/40 text-xs mb-6 uppercase tracking-widest">
               Sign below to accept my heart
            </p>

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
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <span className={`text-white/10 text-4xl ${greatVibes.className}`}>Sign Here</span>
                    </div>
                )}
            </div>

            <div className="flex justify-between items-center mt-4">
                <button 
                    onClick={clearSignature}
                    className="text-xs text-white/40 hover:text-white transition-colors uppercase tracking-wider"
                >
                    Clear
                </button>
                <button
                    onClick={handleAccept}
                    disabled={!isSigned}
                    className={`
                        px-6 py-2 rounded-full font-medium transition-all duration-300
                        ${isSigned 
                            ? "bg-rose-600 text-white shadow-[0_0_20px_rgba(225,29,72,0.4)] hover:scale-105" 
                            : "bg-white/10 text-white/20 cursor-not-allowed"}
                    `}
                >
                    {isSigned ? "Accept Promises" : "Sign to Accept"}
                </button>
            </div>
         </div>
      </div>
    </main>
  );
}