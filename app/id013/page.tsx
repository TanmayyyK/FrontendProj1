"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Playfair_Display, Share_Tech_Mono, Great_Vibes, Lato } from "next/font/google";
import { Lock, ArrowRight, Heart, Stamp } from "lucide-react"; // Added Heart & Stamp
import confetti from "canvas-confetti"; 

// --- FONTS ---
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700"] });
const techMono = Share_Tech_Mono({ subsets: ["latin"], weight: ["400"] });
const signature = Great_Vibes({ subsets: ["latin"], weight: ["400"] });
const lato = Lato({ subsets: ["latin"], weight: ["300", "400", "700"] });

export default function KissBankPage() {
  const [balance, setBalance] = useState(0);
  const [isDepositing, setIsDepositing] = useState(true);
  const [showCheque, setShowCheque] = useState(false);
  const [targetBalance] = useState(10000); // 10k Kisses

  // --- 1. DEPOSIT ANIMATION LOGIC ---
  useEffect(() => {
    if (!isDepositing) return;

    const interval = setInterval(() => {
      setBalance((prev) => {
        const increment = Math.floor(Math.random() * 150) + 50; 
        if (prev + increment >= targetBalance) {
          clearInterval(interval);
          setIsDepositing(false);
          return targetBalance;
        }
        return prev + increment;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isDepositing, targetBalance]);

  // --- 2. VOUCHER REVEAL ---
  const handleWithdraw = () => {
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#e11d48', '#fb7185', '#fff']
    });
    setShowCheque(true);
  };

  return (
    <main className={`relative w-screen h-[100dvh] bg-black text-white overflow-hidden flex flex-col items-center justify-center ${lato.className}`}>
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
      
      <AnimatePresence mode="wait">
        
        {/* --- STAGE 1: THE VAULT --- */}
        {!showCheque ? (
          <motion.div 
            key="vault"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-md px-6 text-center z-10"
          >
            {/* Header */}
            <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-rose-500/30 bg-rose-900/10 mb-4">
                    <Lock size={12} className="text-rose-500" />
                    <span className={`text-[10px] uppercase tracking-widest text-rose-300 ${techMono.className}`}>Secure Vault • Kiss Day</span>
                </div>
                <h1 className={`text-3xl md:text-4xl text-white ${playfair.className}`}>The Kiss Bank</h1>
                <p className="text-white/50 text-xs mt-2">Since I can't kiss you today, I'm saving them for later.</p>
            </div>

            {/* Counter */}
            <div className="bg-[#111] border border-white/10 rounded-2xl p-8 relative overflow-hidden mb-8 shadow-[0_0_40px_rgba(225,29,72,0.1)]">
                {/* Floating Kisses BG */}
                <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
                    {isDepositing && [...Array(10)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ y: "100%", x: Math.random() * 100 - 50, opacity: 0 }}
                            animate={{ y: "-100%", opacity: [0, 1, 0] }}
                            transition={{ duration: Math.random() * 2 + 1, repeat: Infinity, delay: Math.random() }}
                            className="absolute bottom-0 left-1/2 text-2xl"
                        >
                            💋
                        </motion.div>
                    ))}
                </div>

                <p className={`text-xs uppercase tracking-[0.2em] text-green-400 mb-2 ${techMono.className}`}>
                    {isDepositing ? "🟢 DEPOSITING..." : "✅ SAVINGS SECURED"}
                </p>
                
                <h2 className={`text-5xl md:text-6xl font-bold text-white tabular-nums ${techMono.className}`}>
                    {balance.toLocaleString()}
                </h2>
                <p className="text-white/30 text-xs mt-1">Total Kisses Pending</p>
            </div>

            {/* Button */}
            {!isDepositing && (
                <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleWithdraw}
                    className="w-full py-4 bg-gradient-to-r from-rose-600 to-rose-800 rounded-xl font-bold text-white tracking-widest uppercase shadow-lg shadow-rose-900/50 flex items-center justify-center gap-2"
                >
                    Create Voucher <ArrowRight size={16} />
                </motion.button>
            )}
          </motion.div>
        ) : (
          
          /* --- STAGE 2: THE HUMAN VOUCHER --- */
          <motion.div 
            key="cheque"
            initial={{ y: 50, opacity: 0, rotateX: -10 }}
            animate={{ y: 0, opacity: 1, rotateX: 0 }}
            transition={{ type: "spring", bounce: 0.4 }}
            className="w-full max-w-lg px-4 z-10"
          >
             <div className="bg-[#fefce8] text-gray-900 rounded-xl p-6 md:p-8 shadow-2xl relative transform rotate-1 md:rotate-0 border border-white/20">
                
                {/* Dashed Border Inside */}
                <div className="border-2 border-rose-900/20 border-dashed rounded-lg p-6 relative">
                    
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className={`text-2xl font-bold text-rose-900 ${playfair.className}`}>Love Voucher</h2>
                            <p className="text-[10px] uppercase tracking-widest text-rose-800/60">Non-Transferable • Valid Forever</p>
                        </div>
                        <Heart className="text-rose-900/20" size={40} />
                    </div>

                    {/* Content */}
                    <div className="space-y-6">
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Issued To</p>
                            <p className={`text-xl font-bold border-b border-gray-300 pb-1 ${lato.className}`}>
                                Tanya (Dr. Cutuuu)
                            </p>
                        </div>

                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Redeemable For</p>
                            <p className={`text-3xl text-rose-600 font-bold border-b border-gray-300 pb-1 ${playfair.className}`}>
                                10,000 Kisses
                            </p>
                        </div>

                        <div className="flex justify-between items-end pt-4">
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Date</p>
                                <p className="text-sm font-medium">13th Feb, 2026</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">Signed</p>
                                {/* Only the signature uses the fancy font */}
                                <p className={`text-3xl text-black -rotate-3 ${signature.className}`}>Tanmay</p>
                            </div>
                        </div>
                    </div>

                    {/* "Stamp" Effect */}
                    <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-20 rotate-12 border-4 border-rose-600 rounded-full p-2">
                        <div className="border-2 border-rose-600 rounded-full w-24 h-24 flex items-center justify-center text-center">
                            <span className="text-rose-600 font-bold text-xs uppercase tracking-widest">Official<br/>Promise</span>
                        </div>
                    </div>

                </div>
             </div>

             <div className="text-center mt-8">
                <p className="text-white/40 text-xs uppercase tracking-widest animate-pulse">Save this for when we meet</p>
             </div>
          </motion.div>
        )}

      </AnimatePresence>
    </main>
  );
}