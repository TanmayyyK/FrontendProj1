"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { Fira_Code } from "next/font/google";

const firaCode = Fira_Code({ subsets: ["latin"], weight: ["400", "500"] });

export default function CelebrationPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  // Terminal Lines that appear one by one
  const [lines, setLines] = useState<string[]>([
    "> npm run heart",
    " ",
    "Initializing Love ... [OK]",
    "Connecting to  Cutuus's Heart... [ACCOMPLISHED]",
    "Bypassing Distance Firewall... [SUCCESS]",
    "Downloading Cuteness... 100%",
    " ",
    "------------------------------------------------",
    "SUCCESS: TEDDY DAY COMPLETED",
    "------------------------------------------------",
    " ",
    "Status: Miss You 3000",
    "Action: Sending Virtual Hugs...(Soon Physical)",
    "Executed in 0.4s."
  ]);

  useEffect(() => {
    // --- FALLING TEDDY ANIMATION ---
    const interval = setInterval(() => {
      if (!containerRef.current) return;

      const element = document.createElement("div");
      // Random icons: Bear, Heart, Chocolate, Rose
      element.innerText = ["🧸", "❤️", "🍫", "🌹", "✨"][Math.floor(Math.random() * 5)];
      
      // Random styling
      element.style.position = "absolute";
      element.style.left = `${Math.random() * 100}%`;
      element.style.top = "-50px";
      element.style.fontSize = `${Math.random() * 40 + 20}px`;
      element.style.opacity = Math.random().toString();
      element.style.zIndex = "0"; // Behind terminal
      element.style.userSelect = "none";
      element.style.pointerEvents = "none";
      
      containerRef.current.appendChild(element);

      // Animate falling down
      gsap.to(element, {
        y: window.innerHeight + 100,
        rotation: Math.random() * 360,
        duration: Math.random() * 4 + 3, // 3 to 7 seconds
        ease: "linear",
        onComplete: () => {
            if(element.parentNode) element.parentNode.removeChild(element);
        }
      });
    }, 300); // Spawn new item every 300ms

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`w-full h-screen bg-[#0d0d0d] overflow-hidden relative flex items-center justify-center p-4 ${firaCode.className}`}
    >
      
      {/* --- MAXIMIZED TERMINAL WINDOW --- */}
      <div className="relative z-10 w-full max-w-4xl bg-[#1e1e1e]/90 backdrop-blur-md rounded-lg shadow-2xl border border-gray-700 animate-in zoom-in duration-500 flex flex-col h-[70vh] md:h-[60vh]">
          
          {/* Terminal Header */}
          <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-gray-700 rounded-t-lg">
              <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="text-gray-400 text-xs font-mono">tanmay@heart:~/celebration</div>
              <div className="w-4"></div> {/* Spacer for centering */}
          </div>

          {/* Terminal Body */}
          <div className="flex-1 p-6 font-mono text-sm md:text-lg text-gray-300 overflow-y-auto space-y-2">
              {lines.map((line, i) => (
                  <div key={i} className="break-words">
                      {line.startsWith(">") ? (
                          // The Command Line
                          <span className="text-white">
                              <span className="text-green-400 mr-2">➜</span>
                              <span className="text-blue-400 mr-2">~</span>
                              {line.substring(2)}
                          </span>
                      ) : line.includes("SUCCESS") || line.includes("COMPLETED") || line.includes("OK") ? (
                          // Success Messages
                          <span className="text-green-400">{line}</span>
                      ) : line.includes("Miss You") ? (
                          // Emotional Messages
                          <span className="text-rose-400 font-bold">{line}</span>
                      ) : (
                          // Standard Output
                          <span>{line}</span>
                      )}
                  </div>
              ))}
              
              {/* Blinking Cursor at the end */}
              <div className="mt-4 flex items-center">
                  <span className="text-green-400 mr-2">➜</span>
                  <span className="text-blue-400 mr-2">~</span>
                  <span className="w-2 h-5 bg-gray-400 animate-pulse"></span>
              </div>
          </div>
          
          {/* Action Buttons */}
          <div className="p-6 border-t border-gray-700 bg-[#1e1e1e] flex justify-end gap-4">
               <button 
                  onClick={() => router.push("/")}
                  className="px-6 py-2 border border-gray-600 rounded text-gray-400 hover:text-white hover:border-white transition-all text-sm uppercase tracking-widest"
               >
                   Close Terminal
               </button>
               <button 
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded font-bold shadow-lg shadow-green-900/20 transition-all text-sm uppercase tracking-widest"
               >
                   Re-Run Script
               </button>
          </div>
      </div>

    </div>
  );
}