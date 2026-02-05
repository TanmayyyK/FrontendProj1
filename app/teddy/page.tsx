 "use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { Playfair_Display, Lato, Patrick_Hand } from "next/font/google";

// --- Fonts ---
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700"] });
const lato = Lato({ subsets: ["latin"], weight: ["300", "400", "700"] });
const handwritten = Patrick_Hand({ subsets: ["latin"], weight: ["400"] });

// --- 🧸 THE BIG LIST OF OPTIONS ---
const BASES = [
  { id: "brown", icon: "🧸", name: "Cuddler", desc: "I am Big in Size (Meri tarah hai ye)..Cuddle will Feel like a Home!! dekhloo and all types of Hug available hai jaise soft...to...bone crushing" },
  { id: "panda", icon: "🐼", name: "Pandaa", desc: "Sleeps 20 hours/day to aapke sapne dekhega or mast mast not nightmares....Waise bhi mai so hi rha hota hu maximum time.(Par mai to boring sapne dekhta hu naa..🥹)" },
  { id: "polar", icon: "🐻‍❄️", name: "Snowy Softyyyy", desc: "Dikhne mai Cool andar se ekdum Warm(Meri tarah😎)...or haa he will help you to fulfil ur bucket list task 1 i.e. Snowfallll❄️)" },
  { id: "koala", icon: "🐨", name: "Koala", desc: "Ekdum Chep..Will never let u go jaise phone nhi katega poore din message spam...mtlb basically Attention seeker ( mai aisa nhi hoon haan 😌)" },
  { id: "pink", icon: "🐷", name: "Bear", desc: "Shy....Aapki tarah ekdum To kam bolega ( to ye chup hi rhega ekdum to phir apni call par silence rhega maximum time to wo bhi dekh lena 😗)" },
  { id: "lion", icon: "🦁", name: "Lion", desc: "Darta nhi kisi se bas haaa apni madam ji se thoda darta hai (aapko protect karega hamesha ekdum)...." },
];

const HEARTS = [
  { id: "red", icon: "❤️", name: "True Love", desc: "Beats only for you, You can trust him always, Always yours." },
  { id: "sparkle", icon: "💖", name: "Drama", desc: "Full OF Drama and Nautanki...mtlb baat baat par naraaj ho jaega phir manate rhnaa (tantrums full..bhai ko princess treatment chahiye..)" },
  { id: "fire", icon: "❤️‍🔥", name: " Passionate", desc: "Intense ekdum Intense haa dekh lena sab kuch passionate ..kiss..hug..love..sab kuch.." },
  { id: "blue", icon: "💙", name: "Loyal & Chill", desc: "Needs BareMinimum Kinda guy aapka hai hamesha or haa cool rhega aap ki daant sun lega saamne se ulte jawab bhi nhi dega ..(wo to mai hu thoda sa nhi..?)" },
  { id: "gold", icon: "💛", name: "Pure", desc: "Ekdum innocent and true ekdum unfiltered( mtlb aap jitna pure innocent to nhi aap to mtlb next level ekdum)" },
  { id: "bandaid", icon: "❤️‍🩹", name: "Healing Heart", desc: "Bandage for your Low days sun lega aapke bad days ko or practical solutions de dega ...at the end you will be healed (emotional solutions hmmm...)" },
];

const ACCESSORIES = [
  { id: "steth", icon: "🩺", name: "Dr.Tanya Special", desc: "Ready for CPR ..test subject basically( kabhi kabhi Mouth to Mouth bhi💋)." },
  { id: "glasses", icon: "👓", name: "Smarty", desc: "Sab khud soch lega aapko dimaag lagane ki jaroorat nhi Practical and Smart Solutions(emotional thode kam..😗)" },
  { id: "tie", icon: "👔", name: "Gentleman", desc: "Gentleman ekdum mtlb Green flag but Fashion wgrh krega ye...Kamaam kam dikhawa jyada aaapki story wgrh bhi laga dega ye hmmmm.." },
  { id: "flower", icon: "🌹", name: "Romantic", desc: "Romantic Baatein karehga hameshaaa...(risk hai ki serious hona chahoge tab bhi ye romance hi ghusa na de khi wo dekh lena)" },
  { id: "coffee", icon: "☕", name: "Night Owl", desc: "Soega nhi jab tak aap so na jao( ye to pretty much mai hu nhi..hn bas 2 baar hi soya hu 🫵🏻?)" },
  { id: "crown", icon: "👑", name: "King", desc: "Leader(will lead whereever needed) but Tanya ji ke aage Bow down ekdum" },
];

const MESSAGES = [
  { id: "love", text: "I love you more than sleep!", icon: "😴" },
  { id: "proud", text: "So proud of you, Doctor!(always proud of ur achievements)", icon: "👩‍⚕️" },
  { id: "miss", text: "I miss you meri jaaan cutuuuuu... ( miss krta rhega aapko 24*7)", icon: "🥺" },
  { id: "health", text: "Brush Kari..?, Paani peeya....?, Kaisi hai..?, Ab to dard nhi hai..?", icon: "🍲" },
  { id: "hug", text: "Sending virtual Hugss come baby...come to me Hug mee plsss!", icon: "🤗" },
];

export default function TeddyPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const bearRef = useRef<HTMLDivElement>(null);
  
  // State
  const [step, setStep] = useState(1);
  const [selections, setSelections] = useState({ 
    base: BASES[0], 
    heart: null as any, 
    accessory: null as any,
    message: null as any 
  });
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  // --- Animation on Selection ---
  const handleSelection = (category: string, item: any) => {
    setSelections((prev) => ({ ...prev, [category]: item }));
    
    // Animate the bear preview to show update
    if (bearRef.current) {
        gsap.fromTo(bearRef.current, 
            { scale: 0.9, rotate: -5 },
            { scale: 1, rotate: 0, duration: 0.4, ease: "back.out(1.7)" }
        );
    }
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
    else finalizeBear();
  };

  const finalizeBear = () => {
    setIsFinalizing(true);
    
    // Dramatic pausing sequence
    setTimeout(() => {
        setIsFinalizing(false);
        setShowCertificate(true);
        triggerConfetti();
    }, 2500);
  };

  const triggerConfetti = () => {
    const ctx = gsap.context(() => {
        for (let i = 0; i < 60; i++) {
            const confetti = document.createElement("div");
            confetti.innerHTML = ["🧸", "❤️", "✨", "🌸"][Math.floor(Math.random() * 4)];
            confetti.style.position = "absolute";
            confetti.style.left = "50%";
            confetti.style.top = "50%";
            confetti.style.fontSize = `${Math.random() * 20 + 10}px`;
            confetti.style.pointerEvents = "none";
            containerRef.current?.appendChild(confetti);

            gsap.to(confetti, {
                x: `random(-400, 400)`,
                y: `random(-600, 600)`,
                rotation: `random(0, 720)`,
                opacity: 0,
                duration: 2.5,
                ease: "power3.out",
                onComplete: () => confetti.remove()
            });
        }
    }, containerRef);
  };

  return (
    <main 
      ref={containerRef}
      className={`relative w-full min-h-screen bg-[#1a1515] text-white flex flex-col items-center py-6 px-4 overflow-x-hidden ${lato.className}`}
    >
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/felt.png')] pointer-events-none" />

      {/* --- HEADER --- */}
      {!showCertificate && (
        <div className="w-full max-w-lg flex justify-between items-end mb-8 border-b border-white/10 pb-4 z-10">
            <div>
                <p className={`text-rose-400 text-xs tracking-widest uppercase mb-1 ${lato.className}`}>Teddy Day Special <br />(isme bohot dimaag laga meri jaaan I hope U like it..)</p>
                <h1 className={`text-3xl font-bold ${playfair.className}`}>The Bear Factory</h1>
            </div>
            <div className="text-right">
                <span className="text-4xl opacity-50 font-bold">{step}</span>
                <span className="text-sm opacity-30">/4</span>
            </div>
        </div>
      )}

      {/* --- LIVE PREVIEW AREA --- */}
      {!showCertificate && (
        <div className="relative z-10 mb-8">
            <div className="w-64 h-64 bg-white/5 rounded-full border border-white/10 flex items-center justify-center shadow-[0_0_60px_rgba(255,255,255,0.05)] relative overflow-visible">
                {/* Spotlight Glow */}
                <div className="absolute inset-0 bg-rose-500/10 rounded-full blur-xl" />
                
                {/* THE BEAR CONSTRUCT */}
                <div ref={bearRef} className="relative text-[140px] leading-none filter drop-shadow-2xl select-none transition-all duration-300">
                    
                    {/* Base Layer */}
                    <div className="relative z-10">{selections.base.icon}</div>
                    
                    {/* Heart Layer (Pulsing) */}
                    {selections.heart && (
                        <div className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40px] z-20 animate-pulse">
                            {selections.heart.icon}
                        </div>
                    )}

                    {/* Accessory Layer */}
                    {selections.accessory && (
                        <div className="absolute top-[25%] -right-4 text-[60px] z-30 transform rotate-12 drop-shadow-lg">
                            {selections.accessory.icon}
                        </div>
                    )}

                    {/* Message Bubble Layer */}
                    {selections.message && (
                        <div className={`absolute -top-10 -left-16 bg-white text-black text-xs p-3 rounded-xl rounded-br-none shadow-xl w-32 animate-bounce ${handwritten.className}`}>
                            "{selections.message.text}"
                        </div>
                    )}
                </div>
            </div>
            <p className="text-center text-white/30 text-xs mt-4 uppercase tracking-widest">Live Preview</p>
        </div>
      )}

      {/* --- SELECTION AREA --- */}
      {!isFinalizing && !showCertificate && (
        <div className="w-full max-w-lg flex-1 flex flex-col z-10 animate-in slide-in-from-bottom duration-500">
            
            {/* Step Title */}
            <h2 className={`text-2xl mb-6 text-center ${playfair.className}`}>
                {step === 1 && "First, pick his fur color."}
                {step === 2 && "Now, give him a soul."}
                {step === 3 && "Add some personality."}
                {step === 4 && "Finally, what does he say?"}
            </h2>

            {/* Grid Options */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                {step === 1 && BASES.map((item) => (
                    <OptionCard 
                        key={item.id} 
                        item={item} 
                        isSelected={selections.base.id === item.id}
                        onClick={() => handleSelection('base', item)} 
                    />
                ))}
                {step === 2 && HEARTS.map((item) => (
                    <OptionCard 
                        key={item.id} 
                        item={item} 
                        isSelected={selections.heart?.id === item.id}
                        onClick={() => handleSelection('heart', item)} 
                    />
                ))}
                {step === 3 && ACCESSORIES.map((item) => (
                    <OptionCard 
                        key={item.id} 
                        item={item} 
                        isSelected={selections.accessory?.id === item.id}
                        onClick={() => handleSelection('accessory', item)} 
                    />
                ))}
                {step === 4 && MESSAGES.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => handleSelection('message', item)}
                        className={`p-4 rounded-xl border transition-all text-left flex items-center gap-3
                            ${selections.message?.id === item.id 
                                ? "bg-rose-600 border-rose-500" 
                                : "bg-white/5 border-white/10 hover:bg-white/10"}
                        `}
                    >
                        <span className="text-2xl">{item.icon}</span>
                        <span className={`text-sm ${handwritten.className} text-lg`}>{item.text}</span>
                    </button>
                ))}
            </div>

            {/* Navigation */}
            <div className="mt-auto pt-4 flex justify-between items-center border-t border-white/10">
                 {step > 1 && (
                    <button 
                        onClick={() => setStep(step - 1)}
                        className="text-white/50 hover:text-white text-sm uppercase tracking-widest px-4 py-2"
                    >
                        ← Back
                    </button>
                 )}
                 <button 
                    onClick={nextStep}
                    disabled={
                        (step === 2 && !selections.heart) || 
                        (step === 3 && !selections.accessory) ||
                        (step === 4 && !selections.message)
                    }
                    className={`
                        ml-auto px-8 py-3 rounded-full font-bold tracking-widest transition-all
                        ${((step === 2 && !selections.heart) || (step === 3 && !selections.accessory) || (step === 4 && !selections.message))
                            ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                            : "bg-white text-black hover:scale-105 shadow-lg"}
                    `}
                >
                    {step === 4 ? "Bring to Life ✨" : "Next Step →"}
                </button>
            </div>
        </div>
      )}

      {/* --- LOADING SCREEN --- */}
      {isFinalizing && (
        <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center">
            <div className="text-6xl animate-bounce mb-8">🧵</div>
            <h2 className={`text-2xl text-rose-400 ${playfair.className}`}>Hmm.. In Progress...</h2>
            <p className="text-white/40 text-sm mt-2">Adding some extra Cotton...</p>
        </div>
      )}

      {/* --- FINAL CERTIFICATE --- */}
      {showCertificate && (
        <div className="relative z-20 flex flex-col items-center justify-center animate-in zoom-in duration-700 p-4">
             <div className="w-full max-w-sm bg-[#fdfbf7] text-gray-900 p-8 rounded-sm shadow-2xl transform rotate-1 relative overflow-hidden">
                {/* Paper Texture Overlay */}
                <div className="absolute inset-0 opacity-50 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]" />

                {/* Bear Portrait */}
                <div className="w-32 h-32 mx-auto bg-gray-100 rounded-full border-4 border-double border-rose-200 flex items-center justify-center mb-6 relative">
                     <span className="text-6xl">{selections.base.icon}</span>
                     <span className="absolute text-2xl top-16 right-6">{selections.heart.icon}</span>
                     <span className="absolute text-3xl top-14 left-6">{selections.accessory.icon}</span>
                </div>

                <div className="text-center mb-8">
                    <h2 className={`text-3xl font-bold text-rose-900 mb-1 ${playfair.className}`}>Birth Certificate</h2>
                    <p className="text-xs tracking-[0.3em] text-gray-400 uppercase">Baby Version Of Me</p>
                </div>

                <div className="space-y-4 text-left border-t border-b border-gray-200 py-6 mb-6">
                    <div className="flex justify-between items-end">
                         <span className="text-xs text-gray-400 uppercase tracking-widest">Name</span>
                         <span className={`text-xl font-bold ${handwritten.className}`}>Mr. {selections.base.name.split(" ")[0]}</span>
                    </div>
                    <div className="flex justify-between items-end">
                         <span className="text-xs text-gray-400 uppercase tracking-widest">Personality</span>
                         <span className={`text-lg ${handwritten.className}`}>{selections.heart.name}</span>
                    </div>
                    <div className="flex justify-between items-end">
                         <span className="text-xs text-gray-400 uppercase tracking-widest">Job</span>
                         <span className={`text-lg ${handwritten.className}`}>{selections.accessory.name}</span>
                    </div>
                    <div className="mt-4 bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                        <span className="text-xs text-yellow-600 uppercase tracking-widest block mb-1">He is...:</span>
                        <p className={`text-lg leading-tight ${handwritten.className}`}>"{selections.message.text}"</p>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 uppercase">Created By</p>
                        <p className={`text-lg ${handwritten.className}`}>Dr. Tanya</p>
                    </div>
                    <div className="w-16 h-16 border-2 border-rose-800 rounded-full flex items-center justify-center opacity-80 rotate-[-15deg]">
                        <span className="text-[10px] font-bold text-rose-800 uppercase text-center leading-tight">100%<br/>CUTE<br/>VERIFIED</span>
                    </div>
                </div>
             </div>

             <button 
                onClick={() => router.push("/")}
                className="mt-12 text-white/40 hover:text-white uppercase tracking-widest text-xs transition-colors"
             >
                Return to Hub
             </button>
        </div>
      )}

    </main>
  );
}

// --- Helper Component for Options ---
function OptionCard({ item, isSelected, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`
                relative p-4 rounded-xl border text-left transition-all duration-200 group
                ${isSelected 
                    ? "bg-rose-900/30 border-rose-500 shadow-[0_0_20px_rgba(225,29,72,0.2)]" 
                    : "bg-white/5 border-white/10 hover:bg-white/10"}
            `}
        >
            <div className="flex items-center justify-between mb-2">
                <span className="text-3xl transform group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
                {isSelected && <span className="text-rose-500 text-lg">✓</span>}
            </div>
            <h3 className={`font-bold text-sm mb-1 ${isSelected ? "text-rose-200" : "text-white"}`}>{item.name}</h3>
            <p className="text-[10px] text-white/50 leading-tight">{item.desc}</p>
        </button>
    )
}