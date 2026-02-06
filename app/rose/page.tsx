"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import gsap from "gsap";
import { Playfair_Display, Lato, Dancing_Script } from "next/font/google";
import { Heart, Music, Bird, Disc } from "lucide-react"; 

// --- Fonts ---
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700"] });
const lato = Lato({ subsets: ["latin"], weight: ["300", "400", "700"] });
const handwriting = Dancing_Script({ subsets: ["latin"], weight: ["400", "700"] });

// --- DATA ---
const ROSES_DATA = [
  { id: "red", color: "bg-red-500", icon: "🌹", title: "Red Rose", meaning: "Why Are You My Red Rose?", desc: "Hmm.. Red Rose Means Passion and how deeply you love your partner... and cutuu you always say you are less expressive but I changed it to selectively passionate and expressive, that's a new genre I discovered being with you... and I love this selectively passionate version of yours. You have your own passion to love me. There are so many I can't write them here, but one that is the highlight is that you never put ego above us... Above that I feel that you are very deep inside and I want to know more and more... And I love you so so much for that." },
  { id: "yellow", color: "bg-yellow-400", icon: "🌻", title: "Yellow Rose", meaning: "Why Are You My Yellow Rose?", desc: "Hmm.. Yellow Means Bright and Sunshine.. Just like you, you are happy and cheerful everytime (touchwood aisi hi rahio..). You try to find fun and joy in small small things... Cutuuu Be like that always... Now I am gonna say it, Sorry tujhe bolta hu hamesha you are not a good friend, I take back all my words. You are my friend... You are My best friend.. I can talk with you anything I want, literally anything. Thank youuuuu cutuu for understanding me..." },
  { id: "pink", color: "bg-pink-400", icon: "🌷", title: "Pink Rose", meaning: "Why Are You My Pink Rose?", desc: "Hmm.. Pink means grace, care... Like I have said you are so cutuutututu ekdum.. How can one not take care of my baby girl... And for the grace, you own it Tanya. You have a sophisticated kind of lifestyle.. You live with grace my queen..." },
  { id: "white", color: "bg-white", icon: "🤍", title: "White Rose", meaning: "Why Are You My White Rose?", desc: "Hmm.. White means Calm, Innocence, Pure... and cutuuu I have mentioned it numerous times you are so pure so innocent. You are so calm like talking to you feels like I am relaxing.. it feels like I am in space, weightless ekdum... Aisi hi rhna hamesha... I Love You For That.." },
];

const MEMORIES = [
  { id: 1, img: "/spam2.jpeg", title: "That Gown Pic", desc: "I know I know maine bohot tareef krdi iski but ye yrr hai hi out of the world..This deserves Rose on the first place....I never use that word for you.. But My sexy and stunning Tanya...", fit: "cover" },
  { id: 2, img: "/clg1.jpeg", title: "This Suit Pic..", desc: "Ye mujhe dhyan hai 3rd Nov Hil gaya tha ye dekh ke ek to aapka suit...ek ye coat upar se stethoscope..bhyiiiiii aaj bhi utni hi achi lg rhi hai yrrr..So Proud of you meri jaaan..This truly deserves a rose..", fit: "cover" },
  { id: 3, img: "/eyes1.jpeg", title: "These Eyes They Never Lie", desc: "You sent this to me when you were home ...I remember I was in the gym when I opened the pic I was like ...kya bolu.. itni deep aankhein..kho jaata hu abhi bhi jab dekhta hu inhe..This one is special deserves a rose ..!!", fit: "contain" },
  { id: 4, img: "/love1.jpeg", title: "And This One..", desc: "I remember You Put this on the story or us din to mtlb hogya tha meraa kaaam ki ye ladki mere se baat krti hai bhyi bhyiii...Phir aapne dm mai bhej di maje aagae yrr Thank you love youuuuu meri jaaan.. or kya lag rhi hai isme tu ekdum cutieee .chup hogya mai dekh ke pic ekdum se lol", fit: "contain" },
];

export default function RosePage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null); 
  
  // --- STATES ---
  const [stage, setStage] = useState<"gate" | "intro" | "selection" | "interim" | "gallery" | "pre_finale" | "finale">("gate");
  const [clickedRoses, setClickedRoses] = useState<string[]>([]);
  const [activeRose, setActiveRose] = useState<typeof ROSES_DATA[0] | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isTrans, setIsTrans] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false); // Music State

  // --- AUDIO LOGIC ---
  const enterGarden = () => {
      if (audioRef.current) {
          audioRef.current.volume = 0.3; 
          audioRef.current.play().then(() => {
              setIsPlaying(true);
              setStage("intro");
          }).catch(e => {
              console.error("Audio failed:", e);
              setIsPlaying(false);
              setStage("intro"); 
          });
      } else {
          setStage("intro");
      }
  };

  const toggleMusic = () => {
      if (!audioRef.current) return;
      if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
      } else {
          audioRef.current.play();
          setIsPlaying(true);
      }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (stage === "selection") {
        gsap.to(audio, { volume: 0.02, duration: 2, ease: "power2.out" });
    } 
    else if (stage === "gallery") {
        gsap.to(audio, { volume: 0.1, duration: 2, ease: "power2.in" });
    }
  }, [stage]);

  // --- ANIMATIONS ---
  // 1. GATE ANIMATION (Fireflies & Birds)
  useEffect(() => {
      if (stage === "gate") {
          const ctx = gsap.context(() => {
              
              // A. Fireflies
              for (let i = 0; i < 20; i++) {
                  const fly = document.createElement("div");
                  fly.className = "firefly absolute w-1 h-1 bg-rose-400 rounded-full blur-[1px] opacity-0 pointer-events-none";
                  fly.style.left = `${Math.random() * 100}%`;
                  fly.style.top = `${Math.random() * 100}%`;
                  containerRef.current?.appendChild(fly);

                  gsap.to(fly, {
                      opacity: `random(0.3, 0.8)`,
                      scale: `random(0.5, 1.5)`,
                      x: `random(-50, 50)`,
                      y: `random(-50, 50)`,
                      duration: `random(3, 6)`,
                      repeat: -1,
                      yoyo: true,
                      ease: "sine.inOut"
                  });
              }

              // B. Birds
              gsap.to(".bird-glider", {
                  x: "120vw", 
                  y: "random(-50, 50)",
                  duration: "random(15, 25)",
                  repeat: -1,
                  ease: "linear",
                  stagger: 5,
                  opacity: 0.4
              });

          }, containerRef);
          return () => ctx.revert();
      }
  }, [stage]);

  // 2. INTRO ANIMATION
  useEffect(() => {
    if (stage !== "intro") return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: () => setStage("selection") });
      tl.to(".intro-text-1", { opacity: 1, y: 0, duration: 1.5 }).to(".intro-text-1", { opacity: 0, y: -20, duration: 1, delay: 1 })
        .to(".intro-text-2", { opacity: 1, y: 0, duration: 1.5 }).to(".intro-text-2", { opacity: 0, y: -20, duration: 1, delay: 1 })
        .to(".intro-text-3", { opacity: 1, y: 0, duration: 1.5 }).to(".intro-text-3", { opacity: 0, y: -20, duration: 1, delay: 1 });
    }, containerRef);
    return () => ctx.revert();
  }, [stage]);

  useEffect(() => {
    if (stage === "selection" && clickedRoses.length === 4) setTimeout(() => setStage("interim"), 800);
  }, [clickedRoses, stage]);

  const handleRoseClick = (rose: typeof ROSES_DATA[0]) => setActiveRose(rose);
  const collectAndCloseModal = () => {
    if (activeRose && !clickedRoses.includes(activeRose.id)) setClickedRoses((prev) => [...prev, activeRose.id]);
    setActiveRose(null);
  };

  useEffect(() => {
    if (stage === "interim") gsap.fromTo(".interim-text", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.5, delay: 0.5 });
  }, [stage]);

  const startGallery = () => gsap.to(".interim-container", { opacity: 0, y: -50, duration: 0.8, onComplete: () => setStage("gallery") });

  const giveRoseToPhoto = () => {
    if (isTrans) return;
    setIsTrans(true);
    const ctx = gsap.context(() => {
      gsap.to([".photo-card-container", ".text-container"], { 
        opacity: 0, y: -30, duration: 0.5, ease: "power2.in",
        onComplete: () => {
             if (photoIndex < MEMORIES.length - 1) {
                setPhotoIndex(prev => prev + 1);
                setImageLoaded(false); 
            } else {
                setStage("pre_finale");
            }
        }
      });
    }, containerRef);
  };

  useEffect(() => {
    if (stage === "gallery" && imageLoaded && isTrans) {
        const ctx = gsap.context(() => {
            gsap.set([".photo-card-container", ".text-container"], { y: 30 }); 
            gsap.to([".photo-card-container", ".text-container"], { 
                opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
                onComplete: () => setIsTrans(false) 
            });
        }, containerRef);
        return () => ctx.revert();
    }
  }, [imageLoaded, stage, photoIndex]);

  useEffect(() => {
    if (stage === "pre_finale") {
        const ctx = gsap.context(() => {
            gsap.fromTo(".pre-finale-text", { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1.5, delay: 0.5 });
            gsap.to(".pre-finale-text", { opacity: 0, y: -20, duration: 1, delay: 3.5, onComplete: () => setStage("finale") });
        }, containerRef);
        return () => ctx.revert();
    }
  }, [stage]);

  const handleImageError = () => setImageLoaded(true); 

  return (
    <main ref={containerRef} className={`relative w-full min-h-screen bg-black text-white overflow-x-hidden overflow-y-auto flex flex-col items-center justify-center ${lato.className}`}>
      
      {/* AUDIO PLAYER */}
      <audio ref={audioRef} loop src="/bg4.mp3" preload="auto" />

      {/* --- FLOATING MUSIC BUTTON (Visible only after gate) --- */}
      {stage !== 'gate' && (
          <button 
            onClick={toggleMusic}
            className="fixed top-6 right-6 z-[60] w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:scale-110 transition-transform active:scale-95 shadow-lg"
          >
              <div className={isPlaying ? "animate-spin-slow" : ""}>
                  <Disc size={20} className="text-rose-200" />
              </div>
              {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-0.5 h-6 bg-rose-500 rotate-45 rounded-full" />
                  </div>
              )}
          </button>
      )}

      {/* BACKGROUND GRADIENT (Dynamic for Gate) */}
      <div className={`fixed inset-0 transition-all duration-1000 pointer-events-none z-0 ${stage === 'gate' ? 'bg-[radial-gradient(circle_at_center,_#500724_0%,_#090103_100%)]' : 'bg-[radial-gradient(circle_at_center,_#3f0a12_0%,_#000000_100%)] opacity-60'}`}></div>

      {/* --- STAGE 0: THE ROMANTIC GATE --- */}
      {stage === "gate" && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-1000 overflow-hidden">
              
              {/* Floating Birds (SVG Gliders) */}
              {[...Array(3)].map((_, i) => (
                  <div key={i} className="bird-glider absolute opacity-0 pointer-events-none text-rose-200/30" style={{ top: `${15 + i * 20}%`, left: '-10%', transform: `scale(${0.5 + Math.random()})` }}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 12C21 12 19 13 17 13C15 13 14 12 14 12C14 12 13 8 11 8C9 8 7 12 7 12C7 12 5 12 3 11C1 10 0 12 0 12C0 12 3 15 7 15C11 15 13 11 13 11C13 11 15 16 21 16C27 16 24 12 24 12C24 12 23 12 21 12Z" />
                      </svg>
                  </div>
              ))}

              {/* Floating Heart Decor */}
              <div className="absolute top-1/4 left-1/4 text-rose-500/20 text-4xl animate-pulse">❤</div>
              <div className="absolute bottom-1/4 right-1/4 text-rose-500/20 text-2xl animate-pulse delay-700">❤</div>

              <div className="mb-2 flex items-center gap-2 text-rose-300/60 text-xs tracking-[0.3em] uppercase">
                  <Music size={12} className="animate-spin-slow" />
                  <span></span>
              </div>

              <h1 className={`text-5xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-rose-500 to-rose-300 mb-6 drop-shadow-[0_0_15px_rgba(225,29,72,0.5)] ${playfair.className}`}>
                  The Rose Garden
              </h1>
              
              <p className={`text-xl md:text-2xl text-rose-100/80 mb-12 font-light ${handwriting.className}`}>
                  "For my Tulip...."
              </p>

              <button 
                onClick={enterGarden}
                className="group relative px-10 py-4 bg-transparent overflow-hidden rounded-full transition-all hover:scale-105 active:scale-95"
              >
                  {/* Glowing Border */}
                  <div className="absolute inset-0 border border-rose-500/50 rounded-full shadow-[0_0_20px_rgba(225,29,72,0.4)] group-hover:shadow-[0_0_40px_rgba(225,29,72,0.6)] transition-all duration-500 animate-pulse"></div>
                  
                  {/* Button Content */}
                  <span className={`relative z-10 text-rose-200 uppercase tracking-widest text-xs font-bold flex items-center gap-3 ${lato.className}`}>
                      Enter
                      <Heart size={14} className="fill-rose-500 text-rose-500 animate-bounce" />
                  </span>
                  
                  {/* Subtle Fill on Hover */}
                  <div className="absolute inset-0 bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </button>
          </div>
      )}

      {/* --- STAGE 1: INTRO SEQUENCE --- */}
      {stage === "intro" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 pointer-events-none z-50">
          <h1 className={`intro-text-1 absolute text-4xl md:text-6xl text-rose-500 opacity-0 translate-y-10 ${playfair.className}`}>Millions of roses in the world...</h1>
          <h1 className={`intro-text-2 absolute text-4xl md:text-6xl text-white opacity-0 translate-y-10 ${playfair.className}`}>But only one is mine.</h1>
          <h1 className={`intro-text-3 absolute text-4xl md:text-6xl text-rose-300 opacity-0 translate-y-10 ${playfair.className}`}>And it's you, my Baby. ❤️</h1>
        </div>
      )}

      {/* --- STAGE 2: SELECTION --- */}
      {stage === "selection" && (
        <div className="w-full max-w-lg px-6 py-12 animate-in fade-in duration-1000 z-10 flex flex-col items-center justify-center min-h-screen">
            <h2 className={`text-3xl text-center mb-8 text-rose-100 ${playfair.className}`}>Collect Your Bouquet</h2>
            <p className="text-center text-white/50 text-xs mb-12 uppercase tracking-widest">Tap each flower to know why it's yours</p>
            <div className="grid grid-cols-2 gap-6 w-full">
                {ROSES_DATA.map((rose) => (
                    <button key={rose.id} onClick={() => handleRoseClick(rose)} disabled={clickedRoses.includes(rose.id)} className={`relative aspect-square rounded-2xl border border-white/10 flex flex-col items-center justify-center gap-2 transition-all duration-300 transform-gpu touch-manipulation ${clickedRoses.includes(rose.id) ? 'bg-white/5 opacity-40 grayscale cursor-default' : 'bg-white/5 hover:bg-white/10 hover:scale-105'}`}>
                        <span className="text-5xl filter drop-shadow-lg">{rose.icon}</span>
                        {clickedRoses.includes(rose.id) && <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl animate-in zoom-in duration-300"><span className="text-green-400 text-2xl font-bold">✓</span></div>}
                    </button>
                ))}
            </div>
            {activeRose && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-xl p-6" onClick={collectAndCloseModal}>
                    <div className="bg-[#1a0b0b] border border-rose-900/50 p-8 rounded-2xl max-w-md text-center shadow-[0_0_50px_rgba(225,29,72,0.3)] animate-in zoom-in duration-300 overflow-y-auto max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
                        <div className="text-6xl mb-4 animate-bounce">{activeRose.icon}</div>
                        <h3 className={`text-2xl text-rose-400 mb-2 ${playfair.className}`}>{activeRose.title}</h3>
                        <p className={`text-lg mb-4 text-white font-bold italic ${playfair.className}`}>{activeRose.meaning}</p>
                        <p className="text-white/80 text-sm md:text-base leading-relaxed mb-8 text-justify font-light opacity-90">{activeRose.desc}</p>
                        <button onClick={collectAndCloseModal} className="w-full py-4 bg-rose-600 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-rose-500 hover:scale-105 transition-all shadow-lg touch-manipulation">Collect Rose</button>
                    </div>
                </div>
            )}
        </div>
      )}

      {/* --- STAGE 3: INTERIM --- */}
      {stage === "interim" && (
        <div className="interim-container absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-50">
            <div className="interim-text opacity-0">
                <h1 className={`text-3xl md:text-5xl mb-6 text-rose-300 ${playfair.className}`}>Now... how should I give <br/> my cutuuu roses?</h1>
                <p className="text-white/60 mb-10 text-sm uppercase tracking-widest">Hmm... I think I know a way.</p>
                <button onClick={startGallery} className="px-10 py-4 bg-white/10 border border-white/20 rounded-full hover:bg-white/20 transition-all uppercase tracking-widest text-sm font-bold touch-manipulation">Show Me</button>
            </div>
        </div>
      )}

      {/* --- STAGE 4: GALLERY --- */}
      {stage === "gallery" && (
        <>
            {/* Background Blur Image (Opacity logic avoids flash) */}
            <div className="fixed inset-0 z-0 bg-black/80">
                <Image 
                    src={MEMORIES[photoIndex].img} 
                    alt="bg" 
                    fill 
                    sizes="100vw"
                    priority={true}
                    className={`object-cover opacity-20 blur-3xl scale-110 duration-1000 ${imageLoaded ? 'opacity-20' : 'opacity-0'}`} 
                    key={photoIndex} 
                />
            </div>

            <div className="relative z-10 w-full h-full flex flex-col md:flex-row items-center justify-center p-4 md:p-12 gap-6 max-w-7xl mx-auto min-h-screen">
                
                {/* 1. PHOTO CARD */}
                <div className="photo-card-container w-full max-w-[320px] md:max-w-md aspect-[3/4] relative shadow-2xl flex-shrink-0">
                    
                    <div className="w-full h-full relative rounded-2xl overflow-hidden border-4 border-white/10 bg-[#1a0505] flex items-center justify-center">
                        
                        {/* A. HEART LOADER: Visible only when NOT loaded */}
                        {!imageLoaded && (
                            <div className="absolute z-20 animate-bounce">
                                <Heart className="text-rose-600 fill-rose-600" size={48} />
                            </div>
                        )}

                        {/* B. MAIN IMAGE: Opacity 0 until 'onLoadingComplete' fires */}
                        <Image 
                            src={MEMORIES[photoIndex].img} 
                            alt="Memory" 
                            fill 
                            priority={true}
                            sizes="(max-width: 768px) 100vw, 50vw" 
                            onLoadingComplete={() => setImageLoaded(true)}
                            onError={handleImageError} 
                            className={`transition-opacity duration-700 ease-in-out ${imageLoaded ? 'opacity-100' : 'opacity-0'} ${MEMORIES[photoIndex].fit === "contain" ? "object-contain" : "object-cover"}`}
                        />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                    </div>
                </div>

                {/* 2. TEXT & CONTROLS */}
                <div className="text-container flex flex-col items-center md:items-start text-center md:text-left w-full max-w-md pb-10 md:pb-0">
                     <h2 className={`text-2xl md:text-4xl text-white mb-2 md:mb-4 ${playfair.className}`}>{MEMORIES[photoIndex].title}</h2>
                     <p className={`text-xs md:text-base text-rose-200 leading-snug font-light opacity-90 mb-4 ${lato.className}`}>"{MEMORIES[photoIndex].desc}"</p>
                    <button 
                        onClick={giveRoseToPhoto} 
                        disabled={isTrans || !imageLoaded} 
                        className={`
                            px-8 py-3 md:px-10 md:py-4 rounded-full font-bold uppercase tracking-widest shadow-[0_0_30px_rgba(225,29,72,0.4)] transition-all transform touch-manipulation
                            ${(isTrans || !imageLoaded) ? 'bg-gray-800 text-gray-500 scale-95 cursor-not-allowed' : 'bg-rose-600 text-white hover:scale-105 hover:bg-rose-500'}
                        `}
                    >
                        {(isTrans || !imageLoaded) ? "Loading..." : "Give Rose 🌹"}
                    </button>
                    <p className="mt-4 text-[10px] md:text-xs text-white/30 uppercase tracking-widest">Pic {photoIndex + 1} of {MEMORIES.length}</p>
                </div>
            </div>
        </>
      )}

      {/* --- PRE-FINALE --- */}
      {stage === "pre_finale" && (
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center z-50">
            <h1 className={`pre-finale-text text-3xl md:text-5xl text-rose-200 leading-tight opacity-0 ${playfair.className}`}>And not just that... <br/> I could add endless photos of yours...</h1>
        </div>
      )}

      {/* --- FINALE --- */}
      {stage === "finale" && (
        <div className="text-center px-6 animate-in zoom-in duration-1000 z-10 min-h-screen flex flex-col items-center justify-center">
            <div className="text-6xl mb-6 animate-bounce">🚚</div>
            <h1 className={`text-4xl md:text-6xl text-rose-500 mb-6 ${playfair.className}`}>Wait for your rose...</h1>
            <p className={`text-xl md:text-2xl text-white/80 mb-8 ${handwriting.className}`}>It is on its way to you, my love. <br/> Hope You Like it..</p>
            <div className="w-48 mx-auto h-1 bg-gray-800 rounded-full overflow-hidden mb-8"><div className="h-full bg-rose-500 animate-[width_3s_ease-in-out_infinite]" style={{width: '30%'}}></div></div>
            <button onClick={() => router.push("/")} className="text-white/40 hover:text-white uppercase tracking-widest text-xs border-b border-transparent hover:border-white transition-all pb-1 touch-manipulation">Back to Hub</button>
        </div>
      )}
    </main>
  );
}