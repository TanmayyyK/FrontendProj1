"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { Playfair_Display, Lato, Share_Tech_Mono } from "next/font/google";
import { Heart, Frown, RefreshCcw, PartyPopper, BadgeCheck } from "lucide-react";

// --- Fonts ---
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700"] });
const lato = Lato({ subsets: ["latin"], weight: ["300", "400", "700"] });
const techMono = Share_Tech_Mono({ subsets: ["latin"], weight: ["400"] });

// --- PERKS DATA ---
const PERKS = [
  { 
    icon: "💻", 
    title: "24/7 Tech Support", 
    desc: "Waise Isilie banaya hai aapne BF mujhe.. But Ha Perk is Real 24*7 Support Ekdum hmmmm....." 
  },
  { 
    icon: "💉", 
    title: "CPR SUBJECT", 
    desc: "Ab Aapko Dekh ke Maine Gir Jaana hai to hmmm...CPR seekh skte hai aap Mujhe par ...or haaa Mouth to Mouth Nhi dunga mai..." 
  },
  { 
    icon: "🎮", 
    title: "Ludo Partner", 
    desc: "Tu waise Khelti to hai Khatarnak To Kabhi bhi kisi ko harana ho to come to me Mai haar hi jaunga!!!" 
  },
  { 
    icon: "🛌", 
    title: "Night Watcher..", 
    desc: "Neend nhi aa rhi no prob.. I am here Chahe kitni der Balcony mai khada hona pade I will make u sleep Bolta rhunga Non stop...mtlb bore bore kr krke aapko sula hi dunga.." 
  },
  { 
    icon: "💆‍♂️", 
    title: "Stress Absorber", 
    desc: "Will Listen to you after ur long College Day and Long Hospital Shifts without complaining." 
  },
  { 
    icon: "🥹", 
    title: "Emotional Support..", 
    desc: "Hn hn pata hai Practically sochta hu mai but koi nhi aage se I will be there for emotional support also jaise ki..(haa bure hai nhi krna chahiye tha ...like this okaaaayyyyyyyyy baby)" 
  },
  { 
    icon: "📸", 
    title: "Hype Man", 
    desc: "Will be the happiest man on your achievements..Hype you up on ur dreams and will be clapping the loudest when You will achieve your dreams.." 
  },
  { 
    icon: "🌎", 
    title: "Trip Planner", 
    desc: "You know I am a travel Freak...Trip plan karunga mast mast..mast mast jagah ghumaunga aapko and I promise to meet you as soon as possible" 
  }
];

export default function ProposePage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Status: 'intro' | 'main' | 'sad' | 'accepted'
  const [status, setStatus] = useState<"intro" | "main" | "sad" | "accepted">("intro");

  // --- 1. INTRO SEQUENCE ---
  useEffect(() => {
      const ctx = gsap.context(() => {
          const tl = gsap.timeline();

          // Ensure texts start invisible
          gsap.set(".intro-text-1, .intro-text-2", { opacity: 0 });

          // Step 1: "Hold My Hands Tanya..."
          tl.to(".intro-text-1", { opacity: 1, duration: 1.5, ease: "power2.inOut" })
            .to(".intro-text-1", { opacity: 0, duration: 1, delay: 1.5 })
            
            // Step 2: "I am nervous..."
            .to(".intro-text-2", { opacity: 1, duration: 1.5, ease: "power2.inOut" })
            .to(".intro-text-2", { opacity: 0, duration: 1, delay: 1.5 })
            
            // Step 3: Start Main Content
            .call(() => setStatus("main"));

      }, containerRef);
      return () => ctx.revert();
  }, []);

  // --- 2. MAIN CONTENT ANIMATION (On Load & Reconsider) ---
  useEffect(() => {
    if (status === "main") {
        const ctx = gsap.context(() => {
          // Restore Background
          gsap.to(".main-bg", { filter: "grayscale(0%) brightness(1)", duration: 1 });

          // --- FIX: RESET CARDS ---
          // This forces any "exploded" cards back to center before animating in
          gsap.killTweensOf(".perk-card");
          gsap.set(".perk-card", { clearProps: "all" }); // Remove transform/opacity styles
          gsap.set(".perk-card", { y: 100, opacity: 0, scale: 0.9 }); // Set start state
          
          gsap.set(".header-text", { y: 50, opacity: 0 });

          // Animate Header
          gsap.to(".header-text",
            { y: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.2 }
          );

          // Animate Cards In
          gsap.to(".perk-card",
            { 
              y: 0, 
              opacity: 1, 
              scale: 1, 
              duration: 0.8, 
              ease: "back.out(1.7)", 
              stagger: 0.1, 
              delay: 0.5
            }
          );
        }, containerRef);
        return () => ctx.revert();
    }
  }, [status]); 

  // --- 3. Handle "No" Click (Explosion) ---
  const handleNoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStatus("sad");
    
    const ctx = gsap.context(() => {
        // Explode Perks
        gsap.to(".perk-card", {
            x: () => (Math.random() - 0.5) * window.innerWidth * 1.2, 
            y: () => (Math.random() - 0.5) * window.innerHeight * 1.2, 
            rotation: () => Math.random() * 720 - 360, 
            opacity: 0,
            scale: 0,
            duration: 1.5,
            ease: "power3.inOut",
            stagger: 0.02
        });

        // Dim Background
        gsap.to(".main-bg", { filter: "grayscale(100%) brightness(0.2)", duration: 1.5 });
        
        // Shake screen
        gsap.fromTo(containerRef.current, { x: -10 }, { x: 10, duration: 0.1, repeat: 5, yoyo: true, clearProps: "x" });
    }, containerRef);
  };

  // --- 4. Handle "Reconsider" Click ---
  const handleReconsider = () => {
    // Setting this to 'main' triggers the useEffect above which resets the cards
    setStatus("main");
  };

  // --- 5. Handle "Yes" Click ---
  const handleAccept = () => {
    setStatus("accepted");
    const ctx = gsap.context(() => {
      
      // Happy Background
      gsap.to(".main-bg", { 
          background: "linear-gradient(to bottom, #4a0404, #000000)", 
          filter: "brightness(1.2)",
          duration: 1 
      });

      // Confetti
      for (let i = 0; i < 100; i++) {
        const heart = document.createElement("div");
        heart.innerHTML = ["❤️", "💍", "✨", "🎉", "😍"][Math.floor(Math.random() * 5)];
        heart.className = "celebration-particle";
        heart.style.position = "fixed";
        heart.style.left = "50%";
        heart.style.top = "50%";
        heart.style.fontSize = `${Math.random() * 40 + 20}px`;
        heart.style.zIndex = "100";
        heart.style.pointerEvents = "none";
        document.body.appendChild(heart);
        
        gsap.to(heart, {
          x: `random(-600, 600)`,
          y: `random(-600, 600)`,
          rotation: `random(0, 1440)`,
          scale: `random(0.5, 2)`,
          duration: `random(2, 4)`,
          ease: "power4.out",
          onComplete: () => heart.remove()
        });
      }

      // Stamp Animation
      gsap.fromTo(".contract-stamp", 
        { scale: 5, opacity: 0, rotate: -45 }, 
        { scale: 1, opacity: 1, rotate: -12, duration: 0.6, ease: "bounce.out", delay: 0.5 }
      );

    }, containerRef);
  };

  return (
    <main 
      ref={containerRef}
      className={`relative w-full min-h-screen bg-[#050202] text-white overflow-x-hidden ${lato.className}`}
    >
      {/* Background Texture */}
      <div className="main-bg fixed inset-0 transition-all duration-1000 z-0">
          <div className="absolute inset-0 bg-[#050202] transition-colors duration-1000" />
          <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
      </div>

      {/* --- INTRO SEQUENCE (Black Screen) --- */}
      {status === "intro" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black text-center pointer-events-none">
              <h1 className={`intro-text-1 absolute text-3xl md:text-5xl text-rose-500 opacity-0 font-light tracking-widest ${playfair.className}`}>
                  Hold My Hands Tanya...
              </h1>
              <h1 className={`intro-text-2 absolute text-3xl md:text-5xl text-white opacity-0 font-light tracking-widest ${playfair.className}`}>
                  I am nervous...
              </h1>
          </div>
      )}
      
      {/* --- MAIN CONTENT --- */}
      {(status === "main" || status === "sad") && (
        <div className="relative z-10 flex flex-col items-center py-20 px-6 animate-in fade-in duration-1000">
          
          {/* Header */}
          <div className="text-center mb-16 max-w-2xl transition-all duration-500">
            <p className={`header-text text-rose-500 text-xs font-bold tracking-[0.3em] uppercase mb-4 ${techMono.className}`}>
               {status === "sad" ? "HEART BROKEN" : "Candidate: Your Hunn Bunn!"}
            </p>
            <h1 className={`header-text text-4xl md:text-6xl font-bold mb-6 ${playfair.className} ${status === "sad" ? "text-gray-500" : ""}`}>
               {status === "sad" ? "Perks Destroyed..." : <>Perks of being <br/><span className="text-rose-500">My Valentine</span></>}
            </h1>
            <p className={`header-text text-sm md:text-base ${status === "sad" ? "text-red-400/80 font-bold" : "text-white/50"}`}>
               {status === "sad" ? "The Contract is deleted..." : "Ek baar Pls Read all the perks below Deeply...."}
            </p>
          </div>

          {/* Grid System */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-32 w-full max-w-6xl perspective-1000">
            {PERKS.map((perk, index) => (
               <div 
                 key={index}
                 className="perk-card p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-rose-500/50 transition-colors duration-300 group min-h-[180px] flex flex-col"
               >
                 <div className="text-4xl mb-4 transition-transform duration-300">
                    {perk.icon}
                 </div>
                 <h3 className={`text-xl font-bold text-rose-100 mb-2 ${playfair.className}`}>
                    {perk.title}
                 </h3>
                 <p className="text-white/60 text-sm leading-relaxed">
                    {perk.desc}
                 </p>
               </div>
            ))}
            
            {/* 9th Item */}
            <div className="perk-card p-6 rounded-2xl bg-gradient-to-br from-rose-900/40 to-black border border-rose-500/40 flex flex-col items-center justify-center text-center shadow-[0_0_30px_rgba(225,29,72,0.2)] min-h-[180px]">
                <span className="text-5xl mb-4 animate-pulse">∞</span>
                <p className={`text-xl text-rose-200 font-bold ${playfair.className}`}>
                    And a lifetime of love...
                </p>
                <p className="text-rose-400/60 text-xs mt-2 uppercase tracking-widest">Non-negotiable</p>
            </div>
          </div>


          {/* Buttons */}
          <div className={`flex flex-col items-center justify-center w-full max-w-xl text-center mb-20 relative transition-opacity duration-500 ${status === 'sad' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
             <div className="w-1 h-20 bg-gradient-to-b from-transparent to-rose-500 mb-8" />
             
             <h2 className={`text-5xl md:text-7xl mb-12 leading-tight ${playfair.className}`}>
                Will you be my <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-rose-600">
                  Valentine?
                </span>
             </h2>

             <div className="flex flex-col md:flex-row gap-8 items-center justify-center w-full">
                <button
                  onClick={handleAccept}
                  className="relative z-20 px-12 py-5 bg-rose-600 rounded-full text-xl font-bold tracking-widest hover:bg-rose-500 hover:scale-105 transition-all shadow-[0_0_40px_rgba(225,29,72,0.5)] active:scale-95 touch-manipulation"
                >
                  YES, I WILL
                </button>

                <button
                  onClick={handleNoClick}
                  className="px-12 py-5 border border-white/10 rounded-full text-xl font-bold tracking-widest text-white/30 hover:text-white hover:border-white transition-all bg-black/50 backdrop-blur-md touch-manipulation hover:bg-red-900/20"
                >
                  NOPE
                </button>
             </div>
          </div>

          {/* SAD OVERLAY */}
          {status === "sad" && (
             <div className="fixed inset-0 z-50 flex flex-col items-center justify-center animate-in zoom-in duration-500 px-6">
                 <div className="bg-black/80 backdrop-blur-md p-8 rounded-3xl border border-white/10 text-center shadow-2xl max-w-sm">
                     <Frown size={60} className="text-gray-400 mb-6 animate-bounce mx-auto" />
                     <h2 className={`text-2xl md:text-3xl mb-4 text-white ${playfair.className}`}>
                        Pakkaa..? 🥺
                     </h2>
                     <p className="text-white/60 text-sm mb-8 leading-relaxed">
                        Tu apni hi hai....Love is still there.
                     </p>
                     <button
                        onClick={handleReconsider}
                        className="w-full py-4 bg-white text-black rounded-full font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2 text-xs md:text-sm"
                     >
                        <RefreshCcw size={16} />
                        Reconsider?
                     </button>
                 </div>
             </div>
          )}

        </div>
      )}
      
      {/* --- SUCCESS STATE (OFFICIAL CONTRACT) --- */}
      {status === "accepted" && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden">
          
          <div className="contract-stamp relative bg-[#fffbf0] text-black p-8 md:p-12 rounded-lg shadow-2xl max-w-md transform -rotate-12 border-8 border-double border-rose-500">
              
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-32 h-12 bg-white/20 backdrop-blur-sm transform rotate-2 border border-white/40 shadow-sm"></div>

              <div className="flex justify-center mb-4">
                  <PartyPopper size={50} className="text-rose-600 animate-bounce" />
              </div>

              <h2 className={`text-4xl md:text-6xl text-center font-black uppercase text-rose-600 leading-none mb-2 ${playfair.className}`}>
                  MY CRUSH SAID YES!
              </h2>
              
              <div className="w-full h-1 bg-black/10 my-4 rounded-full"></div>

              <div className="text-center space-y-2">
                  <p className={`font-bold tracking-widest text-sm uppercase ${techMono.className}`}>Official Contract</p>
                  <p className="text-xl font-medium font-serif italic">Signed by Tanya ❤️</p>
              </div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-4 border-rose-500 rounded-full w-48 h-48 flex items-center justify-center opacity-20 animate-spin-slow pointer-events-none">
                  <span className="text-xs tracking-[0.3em] font-bold text-rose-500 uppercase">Official • Official • Official</span>
              </div>

              <div className="absolute bottom-4 right-4 transform rotate-12">
                  <BadgeCheck size={60} className="text-green-600 fill-green-100" />
              </div>
          </div>

          <div className="mt-12 text-center animate-in slide-in-from-bottom duration-1000 delay-500 z-50">
              <p className="text-2xl md:text-3xl text-white font-bold mb-2">
                  Permanent Booking Hogai Samjho haaannn
              </p>
              <p className="text-white/60 text-sm">
                  You are stuck with me forever hehe(hameshaaaaaaaaa...😉)
              </p>
          </div>
          
          <button 
            onClick={() => router.push("/")}
            className="mt-8 px-8 py-3 bg-white/10 border border-white/20 rounded-full text-white hover:bg-white hover:text-rose-600 transition-all text-xs tracking-[0.2em] uppercase font-bold flex items-center gap-2 z-50"
          >
            Go to Hub
          </button>
        </div>
      )}
    </main>
  );
}