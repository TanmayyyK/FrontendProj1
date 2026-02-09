"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Fira_Code } from "next/font/google";

const firaCode = Fira_Code({ subsets: ["latin"], weight: ["400", "500"] });

// --- THE CODE TO TYPE (With Colors) ---
const CODE_SNIPPETS = [
  { text: "import", color: "text-purple-400" },
  { text: " { Love, Passion, Loyalty } ", color: "text-white" },
  { text: "from", color: "text-purple-400" },
  { text: " 'my_heart';", color: "text-green-400" },
  { text: "\n\n", color: "text-white" },
  { text: "const", color: "text-blue-400" },
  { text: " world ", color: "text-yellow-200" },
  { text: "= ", color: "text-white" },
  { text: "\"My Tanya\";", color: "text-green-400" },
  { text: "\n", color: "text-white" },
  { text: "const", color: "text-blue-400" },
  { text: " distance ", color: "text-yellow-200" },
  { text: "= ", color: "text-white" },
  { text: "0;", color: "text-orange-300" },
  { text: " // Physical Distance is there but no emotional distance...(haina..)", color: "text-gray-500 italic" },
  { text: "\n\n", color: "text-white" },
  { text: "function", color: "text-blue-400" },
  { text: " checkMood", color: "text-yellow-200" },
  { text: "(", color: "text-purple-400" },
  { text: "status", color: "text-orange-300" },
  { text: ") {", color: "text-purple-400" },
  { text: "\n  ", color: "text-white" },
  { text: "if", color: "text-purple-400" },
  { text: " (status === ", color: "text-white" },
  { text: "\"Sad||Silent\"", color: "text-green-400" },
  { text: ") {", color: "text-white" },
  { text: "\n    ", color: "text-white" },
  { text: "return", color: "text-purple-400" },
  { text: " \"Hugs_&_kisses\";", color: "text-green-400" },
  { text: "\n  } ", color: "text-white" },
  { text: "else", color: "text-purple-400" },
  { text: " {", color: "text-white" },
  { text: "\n    ", color: "text-white" },
  { text: "return", color: "text-purple-400" },
  { text: " \"2H and 1S\";", color: "text-green-400" },
  { text: "\n  }", color: "text-white" },
  { text: "\n}", color: "text-purple-400" },
  { text: "\n\n", color: "text-white" },
  { text: "while", color: "text-purple-400" },
  { text: " (", color: "text-white" },
  { text: "breathing", color: "text-blue-400" },
  { text: ") {", color: "text-white" },
  { text: "\n  ", color: "text-white" },
  { text: "love(Tanya);", color: "text-yellow-200" },
    { text: "\n  ", color: "text-white" },

  { text: "Care(Tanya);", color: "text-yellow-200" },
    { text: "\n  ", color: "text-white" },

  { text: "makeTanyaSleep();", color: "text-yellow-200" },
    { text: "\n  ", color: "text-white" },

  { text: "missTanya();", color: "text-yellow-200" },
    { text: "\n  ", color: "text-white" },

  { text: "beOnlyTanya's();", color: "text-yellow-200" },
  { text: "\n}", color: "text-white" },
];

export default function CodePage() {
  const router = useRouter();
  
  // State
  const [activeFile, setActiveFile] = useState("love.ts");
  const [displayedContent, setDisplayedContent] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(true);
  
  // Terminal State
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    "Microsoft Windows [Version 10.0.19045.2311]",
    "(c) Microsoft Corporation. All rights reserved.",
    "",
    "C:\\Users\\Tanmay\\Heart> compiling love.ts...",
    "C:\\Users\\Tanmay\\Heart> ....................",
  ]);
  
  const terminalInputRef = useRef<HTMLInputElement>(null);
  const codeContainerRef = useRef<HTMLDivElement>(null);
  
  // Ref to store the timer ID so we can cancel it when tabs change
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // --- HUMAN TYPING LOGIC ---
  useEffect(() => {
    // 1. If we are NOT on love.ts, clear any existing timers and do nothing.
    if (activeFile !== "love.ts") {
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        return;
    }

    // 2. If we ARE on love.ts, RESET EVERYTHING and start fresh.
    setDisplayedContent([]);
    setIsTyping(true);
    setShowTerminal(false);
    
    // Variables for this specific run
    let currentIndex = 0;
    let currentText = "";
    let isMistake = false;
    
    const typeNextChar = () => {
      // Check if finished
      if (currentIndex >= CODE_SNIPPETS.length) {
        setIsTyping(false);
        typingTimeoutRef.current = setTimeout(() => {
            setShowTerminal(true);
            setTimeout(() => terminalInputRef.current?.focus(), 500);
        }, 1000);
        return;
      }

      const snippet = CODE_SNIPPETS[currentIndex];
      const targetText = snippet.text;
      
      // Move to next snippet if current is done
      if (currentText === targetText) {
        setDisplayedContent(prev => {
           // Ensure the full snippet is committed to state before moving on
           const newContent = [...prev];
           // If list is empty or last item isn't this snippet, add it.
           if (newContent.length === 0 || newContent[newContent.length - 1].text !== snippet.text) {
              return [...prev, { ...snippet, content: snippet.text }];
           }
           return prev;
        });
        
        currentIndex++;
        currentText = "";
        typingTimeoutRef.current = setTimeout(typeNextChar, 100);
        return;
      }

      // HUMAN ERROR SIMULATION (10% chance)
      if (!isMistake && Math.random() < 0.05 && targetText.length > 3 && currentText.length < targetText.length - 1) {
         isMistake = true;
         const typoChar = String.fromCharCode(97 + Math.floor(Math.random() * 26)); 
         
         // Visually add typo
         setDisplayedContent(prev => {
            const newContent = [...prev];
            // If starting new snippet
            if (newContent.length === currentIndex) {
                newContent.push({ ...snippet, content: currentText + typoChar });
            } else {
                newContent[currentIndex].content = currentText + typoChar;
            }
            return newContent;
         });
         
         // Wait, then fix it
         typingTimeoutRef.current = setTimeout(() => {
            isMistake = false;
            typingTimeoutRef.current = setTimeout(typeNextChar, 150); 
         }, 300);
         return;
      }

      // Normal Typing
      const char = targetText[currentText.length];
      currentText += char;
      
      setDisplayedContent(prev => {
        const newContent = [...prev];
        if (newContent.length === currentIndex) {
            newContent.push({ ...snippet, content: char });
        } else {
            newContent[currentIndex].content = currentText;
        }
        return newContent;
      });

      // Auto Scroll
      if (codeContainerRef.current) {
        codeContainerRef.current.scrollTop = codeContainerRef.current.scrollHeight;
      }

      // Loop with random speed
      typingTimeoutRef.current = setTimeout(typeNextChar, Math.random() * 50 + 30);
    };

    // Start the loop
    typeNextChar();

    // CLEANUP: Stop typing if the user leaves this tab or component unmounts
    return () => {
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [activeFile]); // Dependency ensures this runs every time activeFile changes


  // --- TERMINAL HANDLER ---
  const handleTerminalSubmit = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
        const command = terminalInput.trim();
        setTerminalHistory(prev => [...prev, `C:\\Users\\Tanmay\\Heart> ${command}`]);
        
        if (command === "npm run heart") {
            setTerminalHistory(prev => [...prev, "Running scripts...", "Launching Celebration ..."]);
            setTimeout(() => {
                router.push("/teddy/celebration");
            }, 1500);
        } else {
            setTerminalHistory(prev => [...prev, `'${command}' is not recognized. Try: npm run heart`]);
        }
        setTerminalInput("");
    }
  };

  return (
    <div className={`w-full h-screen bg-[#1e1e1e] text-gray-300 flex overflow-hidden ${firaCode.className}`}>
      
      {/* --- SIDEBAR ICONS --- */}
      <div className="w-12 bg-[#333] flex flex-col items-center py-4 gap-6 border-r border-black/20 z-20">
        <div className="opacity-100 text-white cursor-pointer">📄</div>
        <div className="opacity-50 hover:opacity-100 cursor-pointer">🔍</div>
        <div className="opacity-50 hover:opacity-100 cursor-pointer">📦</div>
      </div>

      {/* --- FILE EXPLORER --- */}
      <div className="w-64 bg-[#252526] flex flex-col border-r border-black/20 hidden md:flex">
        <div className="p-3 text-xs font-bold tracking-widest uppercase text-gray-500">Explorer</div>
        
        <div className="px-4 py-1 flex items-center gap-2 hover:bg-[#37373d] cursor-pointer text-blue-300">
             <span>📂</span> src
        </div>
        
        {/* FILE: love.ts */}
        <div 
            onClick={() => setActiveFile("love.ts")}
            className={`px-8 py-1 flex items-center gap-2 cursor-pointer ${activeFile === "love.ts" ? "bg-[#37373d] text-white border-l-2 border-blue-400" : "hover:bg-[#2a2d2e]"}`}
        >
             <span className="text-blue-400">TS</span> love.ts
        </div>

        {/* FILE: teddy.json */}
        <div 
            onClick={() => setActiveFile("teddy.json")}
            className={`px-8 py-1 flex items-center gap-2 cursor-pointer ${activeFile === "teddy.json" ? "bg-[#37373d] text-white border-l-2 border-yellow-400" : "hover:bg-[#2a2d2e]"}`}
        >
             <span className="text-yellow-400">{}</span> teddy.json
        </div>

        {/* FILE: certificate.png */}
        <div 
            onClick={() => setActiveFile("certificate.png")}
            className={`px-8 py-1 flex items-center gap-2 cursor-pointer ${activeFile === "certificate.png" ? "bg-[#37373d] text-white border-l-2 border-purple-400" : "hover:bg-[#2a2d2e]"}`}
        >
             <span className="text-purple-400">🖼️</span> final_letter.png
        </div>
      </div>

      {/* --- MAIN EDITOR --- */}
      <div className="flex-1 flex flex-col relative bg-[#1e1e1e]">
         
         {/* TABS */}
         <div className="flex bg-[#252526] text-sm">
             <div className="px-4 py-2 bg-[#1e1e1e] text-white border-t-2 border-blue-400 flex items-center gap-2 pr-8">
                 {activeFile} <span className="ml-2 text-xs opacity-50">✕</span>
             </div>
         </div>

         {/* CONTENT AREA */}
         <div className="flex-1 p-6 overflow-y-auto" ref={codeContainerRef}>
            
            {/* 1. TYPING VIEW */}
            {activeFile === "love.ts" && (
                <div className="whitespace-pre-wrap font-mono text-sm md:text-base leading-relaxed">
                    {displayedContent.map((snippet, i) => (
                        <span key={i} className={snippet.color}>{snippet.content}</span>
                    ))}
                    {isTyping && <span className="w-2 h-5 bg-blue-400 inline-block align-middle animate-pulse ml-1"/>}
                </div>
            )}

            {/* 2. JSON VIEW */}
            {activeFile === "teddy.json" && (
                <div className="font-mono text-sm text-yellow-100 whitespace-pre-wrap animate-in fade-in">
{`{
  "project": "Valentine's 2026",
  "sender": "Tanmay",
  "recipient": " Tanya",
  "status": "Missing Her",
  "message": "Even though I am coding this thodi help bhi li  but  the feelings are not artificial. They are 100% deep from my dilll.",
  "promise": "To debug every bad day you(I can say we..) have."
}`}
                </div>
            )}

            {/* 3. IMAGE VIEW */}
            {activeFile === "certificate.png" && (
                <div className="flex flex-col items-center justify-center h-full animate-in zoom-in">
                    <div className="bg-[#fdfbf7] p-8 rounded shadow-xl text-black max-w-sm rotate-1">
                        <h2 className="text-2xl font-bold font-serif text-rose-800 mb-2">Certificate of Cuteness</h2>
                        <p className="text-sm text-gray-600">Issued to my cutuuu Billi.</p>
                        <div className="my-4 text-4xl text-center">🧸</div>
                        <p className="font-handwriting text-lg">"My Partner"</p>
                        <div className="mt-4 border-t border-gray-300 pt-2 flex justify-between text-xs text-gray-400 uppercase">
                            <span>Auth: Tanmay</span>
                            <span>Date: Feb 2026</span>
                        </div>
                    </div>
                    <p className="mt-4 text-gray-500 text-xs">Binary Preview (1.2 MB)</p>
                </div>
            )}
         </div>

         {/* --- INTERACTIVE TERMINAL --- */}
         <div className={`
            border-t border-gray-700 bg-[#1e1e1e] transition-all duration-500 ease-out flex flex-col
            ${showTerminal ? "h-[40vh]" : "h-0 opacity-0 overflow-hidden"}
         `}>
             <div className="flex justify-between items-center px-4 py-1 bg-[#252526] text-xs uppercase tracking-widest text-gray-400">
                 <div className="flex gap-4">
                     <span className="text-white underline decoration-blue-500 underline-offset-4 cursor-pointer">TERMINAL</span>
                     <span className="hover:text-white cursor-pointer">OUTPUT</span>
                     <span className="hover:text-white cursor-pointer">DEBUG CONSOLE</span>
                 </div>
                 <span onClick={() => setShowTerminal(false)} className="cursor-pointer hover:text-white">✕</span>
             </div>

             <div className="flex-1 p-4 font-mono text-sm overflow-y-auto" onClick={() => terminalInputRef.current?.focus()}>
                 {terminalHistory.map((line, i) => (
                     <div key={i} className="mb-1 text-gray-300">{line}</div>
                 ))}
                 
                 {/* INPUT LINE */}
                 <div className="flex items-center text-gray-100">
                     <span className="text-green-400 mr-2">➜</span>
                     <span className="text-blue-400 mr-2">C:\Users\Tanmay\Heart{'>'}</span>
                     
                     <div className="relative flex-1">
                        <input 
                            ref={terminalInputRef}
                            type="text" 
                            value={terminalInput}
                            onChange={(e) => setTerminalInput(e.target.value)}
                            onKeyDown={handleTerminalSubmit}
                            className="bg-transparent outline-none border-none w-full text-gray-100 font-mono"
                            autoFocus
                            autoComplete="off"
                        />
                        {/* Blinking Cursor if input is empty */}
                        {terminalInput.length === 0 && (
                             <span className="absolute left-0 top-0 w-2 h-5 bg-gray-400 opacity-50 animate-pulse pointer-events-none"/>
                        )}
                     </div>
                 </div>
                 
                 {/* HINT */}
                 {terminalHistory.length < 6 && (
                     <div className="mt-4 text-gray-500 text-xs italic">
                         (Hint: Type <span className="text-yellow-300">npm run heart</span> and press Enter)
                     </div>
                 )}
             </div>
         </div>
      </div>
    </div>
  );
}