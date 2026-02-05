import type { Metadata } from "next";
import { Inter, Great_Vibes } from "next/font/google";
import "./globals.css";

// 1. Standard Font for the app
const inter = Inter({ subsets: ["latin"] });

// 2. Signature Font for your name
const signatureFont = Great_Vibes({ 
  subsets: ["latin"], 
  weight: ["400"] 
});

export const metadata: Metadata = {
  title: "Tanya's World",
  description: "A digital universe for my favorite person.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        
        {/* --- MAIN APP CONTENT --- */}
        {children}

        {/* --- YOUR GLOBAL SIGNATURE --- */}
        <div 
          className={`
            fixed bottom-4 right-6 z-[100] 
            text-white/30 text-xl md:text-2xl 
            pointer-events-none select-none 
            mix-blend-difference 
            ${signatureFont.className}
          `}
        >
          Made by Tanmay
        </div>

      </body>
    </html>
  );
}