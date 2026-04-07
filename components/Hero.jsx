"use client";
import {
  ArrowRightIcon,
  BookOpen,
  Archive,
  Building2,
  Laptop,
  Cpu,
} from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import CategoriesMarquee from "./CategoriesMarquee";

const HERO_DATA = {
  tagline: "Campus Marketplace",
  headlinePart1: "Cheap Gadgets &",
  headlinePart2: "Ace Finals.",
  priceLabel: "Used Study Material Starts from",
  price: "160",
};

export default function Hero() {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "₹";
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="mx-4 sm:mx-6">
      <div className="flex max-xl:flex-col gap-6 max-w-7xl mx-auto my-6 sm:my-10">
        {/* =========================================
            LEFT SIDE: MAIN HERO BANNER 
        ========================================= */}
        <div
          className={`relative flex-1 rounded-[2rem] sm:rounded-[2.5rem] group overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-2 items-center min-h-[400px] lg:min-h-[480px] border border-indigo-50/50 bg-[#f8fafc] transition-all duration-1000 ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          {/* Ambient Glow Background */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-gradient-to-br from-slate-50 to-indigo-50/30">
            <div className="absolute top-[-20%] left-[-10%] w-[30rem] h-[30rem] bg-orange-300/20 rounded-full mix-blend-multiply filter blur-[80px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-indigo-400/10 rounded-full mix-blend-multiply filter blur-[100px]"></div>
          </div>

          {/* LEFT TEXT BOX */}
          <div className="p-6 sm:p-8 md:p-12 relative z-20 flex flex-col justify-center">
            {/* Badge */}
            <div className="inline-flex w-fit items-center gap-1.5 pr-3 p-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-6 border border-orange-200 bg-orange-50 text-orange-600 shadow-sm">
              <span className="p-1 md:p-1.5 rounded-full flex items-center justify-center bg-orange-500 text-white shadow-md">
                <Building2 size={12} />
              </span>
              {HERO_DATA.tagline}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-[4rem] leading-[1.05] font-black text-slate-900 tracking-tight mb-4 md:mb-6">
              {HERO_DATA.headlinePart1} <br />
              <span className="text-indigo-600 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-500">
                {HERO_DATA.headlinePart2}
              </span>
            </h1>

            {/* Description */}
            <p className="text-slate-600 text-sm md:text-base mb-6 md:mb-10 max-w-md font-medium leading-relaxed">
              Turn your pre-loved lab kits, drafters, and study materials into
              cash. Verified trading exclusively for NIT departments.
            </p>

            {/* Bottom Row: Price & Button */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10">
              <div>
                <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                  {HERO_DATA.priceLabel}
                </p>
                <p className="text-4xl md:text-5xl font-black text-slate-800 flex items-center gap-1">
                  <span className="text-slate-400 font-medium text-2xl md:text-3xl">
                    {currency}
                  </span>
                  {HERO_DATA.price}
                </p>
              </div>

              <Link
                href="/shop"
                className="py-3 px-6 md:py-4 md:px-8 rounded-xl font-black uppercase text-[10px] md:text-xs tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 md:gap-3 w-full sm:w-fit bg-slate-900 text-white shadow-xl shadow-slate-900/20 hover:scale-105 hover:bg-slate-800 group"
              >
                START BROWSING
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </Link>
            </div>
          </div>

          {/* RIGHT SIDE: ANIMATED CAMPUS NEXUS */}
          <div className="relative z-20 p-6 flex items-center justify-center h-[320px] sm:h-[400px] lg:h-full w-full overflow-hidden">
            <div className="relative w-full max-w-[320px] aspect-square flex items-center justify-center">
              {/* Glowing Connection Lines (SVG) */}
              <svg
                className="absolute inset-0 w-full h-full z-10 pointer-events-none opacity-40 animate-pulse"
                viewBox="0 0 320 320"
              >
                <line
                  x1="160"
                  y1="160"
                  x2="60"
                  y2="80"
                  stroke="#818cf8"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                <line
                  x1="160"
                  y1="160"
                  x2="260"
                  y2="100"
                  stroke="#fb923c"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                <line
                  x1="160"
                  y1="160"
                  x2="80"
                  y2="260"
                  stroke="#34d399"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                <line
                  x1="160"
                  y1="160"
                  x2="260"
                  y2="240"
                  stroke="#a78bfa"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
              </svg>

              {/* Central Core: NIT Hub */}
              <div className="absolute z-30 w-28 h-28 bg-white/90 backdrop-blur-xl rounded-full border border-indigo-100 shadow-[0_0_50px_rgba(99,102,241,0.4)] flex flex-col items-center justify-center">
                <div
                  className="absolute inset-0 rounded-full border-4 border-indigo-500/20 animate-ping opacity-50"
                  style={{ animationDuration: "3s" }}
                ></div>
                <Building2 size={28} className="text-indigo-600 mb-1" />
                <span className="font-black text-slate-800 text-[10px] tracking-widest uppercase text-center">
                  NIT
                  <br />
                  Nexus
                </span>
              </div>

              {/* Floating Node 1: Gadgets (Top Left) */}
              <div
                className="absolute z-20 top-8 left-4 animate-bounce"
                style={{ animationDuration: "4s" }}
              >
                <div className="w-14 h-14 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-indigo-100 flex items-center justify-center hover:scale-110 transition-transform">
                  <Laptop size={20} className="text-indigo-500" />
                </div>
              </div>

              {/* Floating Node 2: Books (Top Right) */}
              <div
                className="absolute z-20 top-16 right-4 animate-bounce"
                style={{ animationDuration: "3.5s", animationDelay: "0.5s" }}
              >
                <div className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full shadow-xl border border-orange-100 flex items-center justify-center hover:scale-110 transition-transform">
                  <BookOpen size={18} className="text-orange-500" />
                </div>
              </div>

              {/* Floating Node 3: Lab Kits (Bottom Left) */}
              <div
                className="absolute z-20 bottom-12 left-10 animate-bounce"
                style={{ animationDuration: "4.5s", animationDelay: "1s" }}
              >
                <div className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full shadow-xl border border-emerald-100 flex items-center justify-center hover:scale-110 transition-transform">
                  <Archive size={18} className="text-emerald-500" />
                </div>
              </div>

              {/* Floating Node 4: Hard Tech (Bottom Right) */}
              <div
                className="absolute z-20 bottom-16 right-8 animate-bounce"
                style={{ animationDuration: "3.8s", animationDelay: "1.5s" }}
              >
                <div className="w-14 h-14 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-purple-100 flex items-center justify-center hover:scale-110 transition-transform">
                  <Cpu size={20} className="text-purple-500" />
                </div>
              </div>

              {/* Outer Energy Ring */}
              <div
                className="absolute w-[280px] h-[280px] rounded-full border border-slate-200 border-dashed animate-spin opacity-40 z-0 pointer-events-none"
                style={{ animationDuration: "20s" }}
              ></div>
              <div
                className="absolute w-[200px] h-[200px] rounded-full border-2 border-indigo-100 border-dashed animate-spin opacity-40 z-0 pointer-events-none"
                style={{
                  animationDuration: "15s",
                  animationDirection: "reverse",
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* =========================================
            RIGHT SIDE: SIDE CARDS (Unchanged)
        ========================================= */}
        <div className="flex flex-col md:flex-row xl:flex-col gap-5 w-full xl:max-w-[320px]">
          {/* Card 1 */}
          <Link
            href="/shop"
            className="flex-1 flex flex-col justify-center bg-orange-50 border border-orange-100 rounded-[2rem] p-6 sm:p-8 group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden relative min-h-[180px] xl:min-h-0"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-1 text-[10px] font-black uppercase text-orange-500 mb-2 tracking-widest">
                <BookOpen size={12} /> New Semester
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-800 leading-tight mb-2">
                Gear for new Semesters
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-[200px]">
                Find textbooks, drafters, and aprons at prices seniors swear by.
              </p>
            </div>
            <BookOpen
              size={100}
              className="absolute -right-4 -bottom-4 text-orange-200/50 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500 z-0"
              strokeWidth={1}
            />
          </Link>

          {/* Card 2 */}
          <Link
            href="/shop"
            className="flex-1 flex flex-col justify-center bg-emerald-50 border border-emerald-100 rounded-[2rem] p-6 sm:p-8 group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden relative min-h-[180px] xl:min-h-0"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-1 text-[10px] font-black uppercase text-emerald-600 mb-2 tracking-widest">
                <Archive size={12} /> Vacating Room
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-800 leading-tight mb-2">
                End-of-Hostel Sales
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-[200px]">
                Quickly clear out old electronics & furniture before you leave.
              </p>
            </div>
            <Archive
              size={100}
              className="absolute -right-4 -bottom-4 text-emerald-200/50 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 z-0"
              strokeWidth={1}
            />
          </Link>
        </div>
      </div>
      <CategoriesMarquee />
    </div>
  );
}
