"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import { Heart, Calendar, MapPin, Music, Send, Wind, Plane, ArrowRight, Cloud, Check } from "lucide-react"; 
import { Playfair_Display, Lato, Share_Tech_Mono } from "next/font/google";
import confetti from "canvas-confetti"; 

// --- FONTS ---
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700"] });
const lato = Lato({ subsets: ["latin"], weight: ["300", "400", "700"] });
const techMono = Share_Tech_Mono({ subsets: ["latin"], weight: ["400"] });

// --- TYPES ---
interface Memory {
  id: number;
  src: string;
  title: string;
  date: string; 
  text: string;
  color: string;
}

// --- DATA ---
const memories: Memory[] = [
  { id: 1, src: "/tanya7.jpeg", title: "The Beginning", date: "Pata nhi Kabse-June 30", text: "I remember exactly how I felt when I took this. You looked at the camera and I knew I was in trouble.", color: "#2a1b18" },
  { id: 2, src: "/tanya10.jpeg", title: "No other Option Hehe", date: "30th June -21st July", text: "The lighting was perfect, but honestly, you make any lighting look perfect.", color: "#1a2a1d" },
  { id: 3, src: "/tanya8.jpeg", title: "First Time I felt Love is Building..", date: "21st July", text: "Just a random moment, but these are the ones I cherish the most.", color: "#181a2a" },
  { id: 4, src: "/tanya9.jpeg", title: "First Post After We Started Talking", date: "Aug 17th", text: "I could write a whole book about this smile alone. It lights up my entire world.", color: "#2a1818" },
  { id: 5, src: "/tanya11.jpeg", title: "I stared it for straight 3 days ngl.", date: "Aug 30th", text: "Every place we go becomes a memory I never want to forget.", color: "#2a2218" },
  { id: 6, src: "/tanya14.jpeg", title: "Hmm.. Diwali Wali Story", date: "Oct 2025-......", text: "Every place we go becomes a memory I never want to forget.", color: "#3a2115" },
  { id: 7, src: "/clg1.jpeg", title: "Hawan Day...", date: "3rd Nov", text: "Every place we go becomes a memory I never want to forget.", color: "#151a2a" },
  { id: 8, src: "/tanya12.jpeg", title: "Got My Eye ... ", date: "Nov 11", text: "Every place we go becomes a memory I never want to forget.", color: "#2a1215" },
  { id: 9, src: "/tanya13.jpeg", title: "Date Se Phele Wali Story...", date: "21st Dec", text: "Every place we go becomes a memory I never want to forget.", color: "#151a2a" },
  { id: 10, src: "/date4.jpeg", title: "First Time Hands Together", date: "24th Dec 2025", text: "Every place we go becomes a memory I never want to forget.", color: "#2a1812" },
  { id: 11, src: "/date1.jpeg", title: "First Coffee Together!", date: "24th Dec 2025..", text: "Every place we go becomes a memory I never want to forget.", color: "#261a15" },
  { id: 12, src: "/date2.jpeg", title: "First Physical Closeness...!!", date: "24th Dec 2025", text: "Every place we go becomes a memory I never want to forget.", color: "#2a0a0f" },
  { id: 13, src: "/date3.jpeg", title: "Auto Ride..", date: "Dec 2024", text: "Every place we go becomes a memory I never want to forget.", color: "#121212" },
  { id: 14, src: "/elante1.jpeg", title: "First Time You Dm'ed Me A Pic Of Yours", date: "Dec 2024", text: "Every place we go becomes a memory I never want to forget.", color: "#1c1a18" },
  { id: 15, src: "/random1.jpeg", title: "On Call Pic..", date: "Dec 2024", text: "Every place we go becomes a memory I never want to forget.", color: "#1c1a18" },
  { id: 16, src: "/appreciate1.jpeg", title: "Story To DMs", date: "Dec 2024", text: "Every place we go becomes a memory I never want to forget.", color: "#1c1a18" },
  { id: 17, src: "/lohri2.jpeg", title: "Adventures", date: "13th Jan", text: "Every place we go becomes a memory I never want to forget.", color: "#1c1a18" },
  { id: 18, src: "/lohri1.jpeg", title: "Adventures", date: "13th Jan", text: "Every place we go becomes a memory I never want to forget.", color: "#1a2024" },
  { id: 19, src: "/lohri3.jpeg", title: "Adventures", date: "13th Jan", text: "Every place we go becomes a memory I never want to forget.", color: "#241a1a" },
  { id: 20, src: "/spam1.jpeg", title: "Adventures", date: "1st Feb", text: "Every place we go becomes a memory I never want to forget.", color: "#1a1816" },
  { id: 21, src: "/spam2.jpeg", title: "Adventures", date: "1st Feb", text: "Every place we go becomes a memory I never want to forget.", color: "#1a1816" },
  { id: 22, src: "/spam3.jpeg", title: "Adventures", date: "1st Feb", text: "Every place we go becomes a memory I never want to forget.", color: "#1a1816" },
  { id: 23, src: "/spam4.jpeg", title: "Adventures", date: "1st Feb", text: "Every place we go becomes a memory I never want to forget.", color: "#1a1816" },
  { id: 24, src: "/spam5.jpeg", title: "Adventures", date: "1st Feb", text: "Every place we go becomes a memory I never want to forget.", color: "#1a1816" },
  { id: 25, src: "/catsleep1.jpeg", title: "Morning Selfie...", date: "Still Pending", text: "Every place we go becomes a memory I never want to forget.", color: "#1a1816" },
];

// --- 1. MEMORY CARD COMPONENT ---
const MemoryCard = ({ memory, index, total }: { memory: Memory, index: number, total: number }) => {
  const container = useRef<HTMLDivElement>(null);
  const isInView = useInView(container, { margin: "50% 0px 50% 0px" });

  return (
    <div ref={container} className="relative w-screen h-[100dvh] flex-shrink-0 snap-center flex items-center justify-center p-4 md:p-8 bg-black overflow-hidden">
        {isInView ? (
            <>
                <div className="absolute inset-0 z-0 transition-colors duration-1000" style={{ backgroundColor: memory.color }}>
                     <div className="absolute inset-0 bg-black/40 backdrop-blur-3xl" />
                     <img src={memory.src} className="absolute inset-0 w-full h-full object-cover opacity-20 blur-[100px]" alt="bg" loading="lazy" />
                </div>
                <div className="relative z-10 w-full max-w-md md:max-w-4xl h-[85vh] md:h-[80vh] bg-black/20 backdrop-blur-md rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl flex flex-col md:flex-row will-change-transform">
                    <div className="w-full md:w-1/2 h-[55%] md:h-full relative bg-black/50">
                        <img src={memory.src} alt={memory.title} className="w-full h-full object-contain p-4 md:p-8" loading={index < 3 ? "eager" : "lazy"} decoding="async" />
                    </div>
                    <div className="w-full md:w-1/2 h-[45%] md:h-full p-6 md:p-12 flex flex-col justify-center text-center md:text-left relative bg-gradient-to-t from-black/80 to-transparent md:bg-none">
                        <div className="absolute top-6 right-6 text-xs font-mono text-white/30">{index + 1} / {total}</div>
                        <div className={`flex items-center justify-center md:justify-start gap-3 text-rose-300/80 text-[10px] md:text-xs tracking-[0.2em] uppercase mb-4 font-medium ${techMono.className}`}>
                            <span className="flex items-center gap-1"><Calendar size={12}/> {memory.date}</span>
                        </div>
                        <h2 className={`text-3xl md:text-5xl text-white mb-6 leading-tight drop-shadow-lg ${playfair.className}`}>{memory.title}</h2>
                        <p className={`text-white/80 text-sm md:text-lg leading-relaxed font-light italic opacity-90 ${lato.className}`}>"{memory.text}"</p>
                    </div>
                </div>
            </>
        ) : (
            <div className="w-full max-w-md md:max-w-4xl h-[85vh] border border-white/5 rounded-[2rem]" />
        )}
    </div>
  );
};

// --- 2. BOARDING PASS SLIDE ---
const BoardingPassSlide = () => {
    const [isTorn, setIsTorn] = useState(false);
    return (
        <div className="relative w-screen h-[100dvh] flex-shrink-0 snap-center flex items-center justify-center bg-[#0a0a0a] p-4">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"></div>
            {!isTorn ? (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full max-w-3xl bg-[#f4f1ea] rounded-3xl shadow-[0_20px_60px_rgba(255,255,255,0.1)] overflow-hidden flex flex-col md:flex-row text-[#1a1a1a]">
                    <div className="flex-1 p-8 md:p-10 border-b-2 md:border-b-0 md:border-r-2 border-dashed border-gray-400 relative">
                        <div className="flex justify-between items-start mb-8"><div><h3 className={`text-xs uppercase tracking-[0.3em] text-gray-500 mb-1 ${techMono.className}`}>Airline</h3><h1 className={`text-2xl md:text-3xl font-bold text-rose-900 ${playfair.className}`}>Future Together</h1></div><Plane className="text-rose-900 rotate-45" size={32} /></div>
                        <div className="flex justify-between items-center mb-10"><div><p className="text-4xl font-black text-black">LDR</p><p className="text-[10px] uppercase tracking-widest text-gray-500">Distance</p></div><div className="flex-1 mx-4 border-t-2 border-gray-300 relative"><Plane className="absolute -top-3 left-1/2 -translate-x-1/2 text-gray-400 rotate-90" size={20} /></div><div className="text-right"><p className="text-4xl font-black text-rose-600">HOME</p><p className="text-[10px] uppercase tracking-widest text-gray-500">In My Arms</p></div></div>
                        <div className="grid grid-cols-3 gap-4 text-xs md:text-sm"><div><p className="text-gray-400 uppercase tracking-widest">Passenger</p><p className="font-bold">Tanya</p></div><div><p className="text-gray-400 uppercase tracking-widest">Date</p><p className="font-bold">Sooner Than You Think</p></div><div><p className="text-gray-400 uppercase tracking-widest">Seat</p><p className="font-bold text-rose-600">In My Arms</p></div></div>
                    </div>
                    <div className="w-full md:w-64 bg-gray-50 p-8 flex flex-col items-center justify-center relative group cursor-pointer" onClick={() => setIsTorn(true)}>
                        <div className="absolute -left-3 top-0 bottom-0 w-6 flex flex-col justify-between hidden md:flex">{[...Array(10)].map((_,i) => <div key={i} className="w-1 h-1 rounded-full bg-gray-300"></div>)}</div>
                        <div className="text-center"><h2 className={`text-xl font-bold text-black mb-2 ${playfair.className}`}>Boarding Pass</h2><p className="text-[10px] text-gray-400 uppercase tracking-widest mb-6">Class: Forever</p><div className="h-12 w-full bg-[url('https://upload.wikimedia.org/wikipedia/commons/5/5d/UPC-A-036000291452.svg')] bg-cover opacity-60 mb-6"></div><button className="px-6 py-2 bg-rose-600 text-white text-xs uppercase font-bold tracking-widest rounded-full animate-pulse shadow-lg">Tear to Board</button></div>
                    </div>
                </motion.div>
            ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center"><Plane className="w-16 h-16 text-rose-500 animate-pulse mx-auto mb-6" /><h1 className={`text-3xl md:text-5xl text-white mb-4 ${playfair.className}`}>Welcome Aboard.</h1><p className={`text-white/50 text-xs tracking-[0.3em] uppercase ${techMono.className}`}>Next Stop: My Arms</p><p className="text-white/20 text-[10px] mt-8 animate-bounce">Swipe Right →</p></motion.div>
            )}
        </div>
    );
};

// --- 3. FLIGHT SIMULATION SLIDE (FIXED MOVEMENT) ---
const FlightSlide = () => {
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { amount: 0.5, once: true }); 
    const [landed, setLanded] = useState(false);

    useEffect(() => {
        if (isInView && !landed) {
            // Land after 4 seconds (matching flight duration)
            const timer = setTimeout(() => setLanded(true), 4000);
            return () => clearTimeout(timer);
        }
    }, [isInView, landed]);

    return (
        <div ref={containerRef} className="relative w-screen h-[100dvh] flex-shrink-0 snap-center flex flex-col items-center justify-center bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#312e81] overflow-hidden">
            
            {/* Clouds */}
            <motion.div animate={{ x: [-100, -1000] }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }} className="absolute top-10 left-0 flex gap-40 opacity-20">
                {[...Array(5)].map((_, i) => <Cloud key={i} size={100 + i*20} className="text-white" />)}
            </motion.div>

            {/* ANIMATION AREA */}
            <div className="relative w-full max-w-4xl h-64 flex items-center px-4 md:px-8">
                
                {/* Dotted Line */}
                <div className="absolute left-10 right-10 top-1/2 h-0.5 border-t-2 border-dashed border-white/20"></div>

                {/* THE PLANE (Now using 'left' instead of 'x' for reliable full-width travel) */}
                <motion.div
                    initial={{ left: "0%", scale: 0.8 }}
                    animate={isInView ? { left: "calc(100% - 80px)", scale: 1 } : {}}
                    transition={{ duration: 4, ease: "easeInOut" }}
                    className="absolute z-20 text-white top-1/2 -translate-y-1/2" // Vertically Centered
                >
                    <Plane size={48} className="fill-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] rotate-90" />
                    {/* Jet Stream */}
                    {!landed && <div className="absolute top-1/2 -left-10 w-20 h-1 bg-gradient-to-l from-white/50 to-transparent blur-sm -translate-y-1/2"></div>}
                </motion.div>

                {/* DESTINATION (Right Side) */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                    <motion.div initial={{ scale: 0 }} animate={landed ? { scale: [1, 1.2, 1] } : { scale: 1 }} transition={{ repeat: landed ? Infinity : 0, duration: 1.5 }}>
                        <Heart size={60} className={`fill-rose-500 text-rose-500 ${landed ? "drop-shadow-[0_0_30px_rgba(225,29,72,1)]" : "opacity-50"}`} />
                    </motion.div>
                    <p className={`mt-4 text-white font-bold text-xs uppercase tracking-widest ${techMono.className}`}>My Arms</p>
                </div>
            </div>

            {/* TEXT */}
            <div className="mt-16 text-center h-24">
                <AnimatePresence mode="wait">
                    {!landed ? (
                        <motion.div key="flying" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                            <h2 className={`text-2xl text-white/80 ${playfair.className}`}>On my way...</h2>
                            <p className="text-white/40 text-xs mt-2 font-mono">Just a few more miles.</p>
                        </motion.div>
                    ) : (
                        <motion.div key="landed" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                            <h2 className={`text-4xl text-white font-bold ${playfair.className}`}>Finally.</h2>
                            <p className="text-rose-300 text-sm mt-2 uppercase tracking-widest">Safe in my arms.</p>
                            <p className="text-white/20 text-[10px] mt-6 animate-pulse">Swipe Right →</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

// --- 4. PROPOSAL SLIDE ---
const ProposalSlide = () => {
    const [holdProgress, setHoldProgress] = useState(0);
    const [accepted, setAccepted] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const startHold = () => { if (accepted) return; intervalRef.current = setInterval(() => { setHoldProgress((prev) => { if (prev >= 100) { clearInterval(intervalRef.current!); completeProposal(); return 100; } return prev + 2; }); }, 30); };
    const endHold = () => { if (accepted) return; if (intervalRef.current) clearInterval(intervalRef.current); setHoldProgress(0); };
    const completeProposal = () => { setAccepted(true); confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#e11d48', '#ffffff'] }); };

    return (
        <div className="relative w-screen h-[100dvh] flex-shrink-0 snap-center flex flex-col items-center justify-center bg-[#1a0505] text-center p-6">
            {!accepted ? (
                <>
                    <p className={`text-rose-500 text-xs tracking-[0.3em] uppercase mb-6 ${techMono.className} animate-pulse`}>The Final Question</p>
                    <h1 className={`text-4xl md:text-6xl text-white mb-12 ${playfair.className}`}>Will you be my<br/><span className="text-rose-600">Valentine?</span></h1>
                    <div className="relative group cursor-pointer select-none touch-none" onMouseDown={startHold} onMouseUp={endHold} onMouseLeave={endHold} onTouchStart={startHold} onTouchEnd={endHold}>
                        <Heart size={120} className="text-white/10" />
                        <div className="absolute inset-0 overflow-hidden" style={{ height: `${holdProgress}%`, transition: 'height 0.05s linear' }}><Heart size={120} className="text-rose-600 fill-rose-600 drop-shadow-[0_0_15px_rgba(225,29,72,0.8)]" /></div>
                        <p className="mt-8 text-white/40 text-xs tracking-widest uppercase">{holdProgress > 0 ? "Keep Holding..." : "Hold Heart to Say Yes"}</p>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center"><Heart size={100} className="text-rose-500 fill-rose-500 animate-bounce mb-8" /><h1 className={`text-4xl md:text-6xl text-white ${playfair.className}`}>She Said Yes! ❤️</h1><p className="text-white/50 mt-4 text-sm tracking-widest uppercase">My Heart is Yours, Forever.</p><div className="mt-12 animate-pulse flex flex-col items-center gap-2 text-white/30 text-xs uppercase tracking-widest"><span>One last thing...</span><ArrowRight size={16} /></div></div>
            )}
        </div>
    );
};

// --- 5. FEEDBACK SLIDE ---
const FeedbackSlide = () => {
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState<"idle" | "fading" | "sent">("idle");
    const [checks, setChecks] = useState({ special: false, gifts: false, enjoyed: false });
    const handleSend = () => { const phone = "919416008686"; const text = `Hey Tanmay! ❤️\n\nAbout the valentine week:\nDid I feel special? ${checks.special ? "YES" : "No"}\nDid I like the gifts? ${checks.gifts ? "YES" : "No"}\nDid I enjoy? ${checks.enjoyed ? "YES" : "No"}\n\nMy Message:\n${message}`; window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank"); setStatus("sent"); };
    const handleFade = () => { setStatus("fading"); setTimeout(() => { setMessage(""); setStatus("idle"); alert("Your message has been whispered to the universe... (It's gone!)"); }, 1500); };
    return (
        <div className="relative w-screen h-[100dvh] flex-shrink-0 snap-center flex flex-col items-center justify-center bg-black text-center p-6">
            <div className="w-full max-w-lg">
                <p className={`text-white/40 text-xs tracking-[0.3em] uppercase mb-4 ${techMono.className}`}>The Epilogue</p>
                <h1 className={`text-3xl md:text-4xl text-white mb-8 ${playfair.className}`}>Before this week ends...</h1>
                <div className="flex flex-wrap justify-center gap-3 mb-8">{[ { key: "special", label: "Felt Special?" }, { key: "gifts", label: "Liked Gifts?" }, { key: "enjoyed", label: "Did you enjoy?" } ].map((item) => ( <button key={item.key} onClick={() => setChecks(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof checks] }))} className={`px-4 py-2 rounded-full border text-xs uppercase tracking-widest transition-all ${checks[item.key as keyof typeof checks] ? "bg-rose-600 border-rose-600 text-white" : "border-white/20 text-white/40 hover:border-white/50"}`}>{item.label}</button> ))}</div>
                <div style={{ opacity: status === "fading" ? 0 : 1, transition: "opacity 1s" }}><textarea className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-rose-500/50 transition-colors placeholder:text-white/20 resize-none" placeholder="Now your turn... wanna say something?" value={message} onChange={(e) => setMessage(e.target.value)} /></div>
                <div className="flex gap-4 mt-6"><button onClick={handleFade} className="flex-1 py-3 border border-white/10 rounded-lg text-white/40 text-xs uppercase tracking-widest hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-2 group"><Wind size={14} className="group-hover:translate-x-1 transition-transform" /> Fade Away</button><button onClick={handleSend} className="flex-1 py-3 bg-white text-black rounded-lg text-xs uppercase tracking-widest font-bold hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]"><Send size={14} /> Send to Him</button></div>
            </div>
        </div>
    );
};

// --- MAIN PAGE ---
export default function HorizontalGallery() {
  const [started, setStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {!started ? (
        <div className="h-[100dvh] w-full bg-[#050202] flex flex-col items-center justify-center cursor-pointer px-4 text-center z-50 relative overflow-hidden" onClick={() => setStarted(true)}>
             <div className="absolute inset-0 opacity-[0.05] bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/Noise_overlay.png')] pointer-events-none"></div>
             <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 1.2, repeat: Infinity, repeatType: "reverse" }} className="mb-8 p-6 border border-white/5 rounded-full bg-white/5 backdrop-blur-sm">
                <Heart className="text-rose-500 fill-rose-500 w-12 h-12" />
             </motion.div>
             <h1 className={`text-white text-4xl md:text-5xl tracking-[0.1em] ${playfair.className}`}>For Her</h1>
             <p className={`text-rose-400/60 text-xs mt-4 tracking-[0.3em] uppercase ${techMono.className}`}>Tap to Open</p>
        </div>
      ) : (
        <div className="relative w-screen h-[100dvh] bg-black">
            <audio autoPlay loop src="/music/your-song.mp3" />
            <div ref={containerRef} className="w-full h-full overflow-x-scroll overflow-y-hidden flex snap-x snap-mandatory scroll-smooth custom-scrollbar-hide">
                <div className="relative w-screen h-full flex-shrink-0 snap-center flex flex-col items-center justify-center bg-black text-center p-8">
                     <p className={`text-rose-500 text-xs tracking-[0.3em] uppercase mb-4 ${techMono.className}`}>Swipe Right →</p>
                     <h1 className={`text-white text-5xl md:text-7xl ${playfair.className}`}>Us, Across<br/>The Miles</h1>
                </div>
                {memories.map((memory, index) => <MemoryCard key={index} memory={memory} index={index} total={memories.length} />)}
                <BoardingPassSlide />
                <FlightSlide />
                <ProposalSlide />
                <FeedbackSlide />
            </div>
            
            <style jsx global>{`
                .custom-scrollbar-hide::-webkit-scrollbar { display: none; }
                .custom-scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
      )}
    </>
  );
}