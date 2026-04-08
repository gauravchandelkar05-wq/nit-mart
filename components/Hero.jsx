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

const VARIATIONS = [
  {
    tagline: "NIT Peer Trading",
    h1: "Smart Gear &",
    h2: "Better Deals.",
    description:
      "Exchange lab kits and study materials within the NIT network. Get the professional tools you need at student-friendly prices.",
    glow: "from-indigo-400/40 via-purple-400/30 to-orange-400/40",
    bg: "bg-gradient-to-br from-indigo-50 via-white to-orange-50",
    theme: "text-indigo-600",
  },
  {
    tagline: "The Campus Hub",
    h1: "Quality Tools &",
    h2: "Lower Rates.",
    description:
      "Your central hub for verified campus essentials. Connect with seniors for seamless resource sharing and cost-effective trading.",
    glow: "from-emerald-400/40 via-teal-400/30 to-blue-400/40",
    bg: "bg-gradient-to-br from-emerald-50 via-white to-blue-50",
    theme: "text-emerald-600",
  },
  {
    tagline: "Student Marketplace",
    h1: "Verified Gear &",
    h2: "Campus Prices.",
    description:
      "Don't let high retail costs hold you back. Access pre-loved engineering essentials verified by your peers in a secure environment.",
    glow: "from-rose-400/40 via-pink-400/30 to-purple-400/40",
    bg: "bg-gradient-to-br from-rose-50 via-white to-purple-50",
    theme: "text-rose-600",
  },
];

export default function Hero() {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "₹";
  const [isMounted, setIsMounted] = useState(false);
  const [content, setContent] = useState(VARIATIONS[0]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * VARIATIONS.length);
    setContent(VARIATIONS[randomIndex]);
    setTimeout(() => setIsMounted(true), 100);
  }, []);

  return (
    <div className="mx-4 sm:mx-6">
      <div className="flex max-xl:flex-col gap-6 max-w-7xl mx-auto my-6 sm:my-10">
        <div
          className={`relative flex-1 rounded-[2.5rem] group overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-2 items-center min-h-[450px] lg:min-h-[520px] border-2 border-white transition-all duration-1000 ease-out ${content.bg} ${isMounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-95"}`}
        >
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div
              className={`absolute -top-24 -left-24 w-[40rem] h-[40rem] rounded-full mix-blend-multiply filter blur-[120px] animate-pulse bg-gradient-to-r ${content.glow}`}
            ></div>
            <div
              className={`absolute -bottom-24 -right-24 w-[35rem] h-[35rem] rounded-full mix-blend-multiply filter blur-[100px] opacity-50 bg-gradient-to-l ${content.glow}`}
            ></div>
          </div>

          <div className="p-8 sm:p-10 md:p-14 relative z-20 flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 pr-4 p-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] mb-8 border border-slate-200 bg-white/80 backdrop-blur-md text-slate-700 shadow-sm">
              <span className="p-2 rounded-full flex items-center justify-center bg-slate-900 text-white shadow-lg">
                <Building2 size={14} />
              </span>
              {content.tagline}
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] leading-[0.95] font-black text-slate-900 tracking-tighter mb-6">
              {content.h1} <br />
              <span
                className={`bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 ${content.theme}`}
              >
                {content.h2}
              </span>
            </h1>

            <p className="text-slate-700 text-base md:text-lg mb-8 md:mb-12 max-w-md font-semibold leading-relaxed">
              {content.description}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-8 sm:gap-12">
              <div className="transform hover:scale-110 transition-transform">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] mb-2">
                  Deals from
                </p>
                <p className="text-5xl md:text-6xl font-black text-slate-900 flex items-center gap-1">
                  <span className="text-indigo-500 font-bold text-3xl md:text-4xl">
                    {currency}
                  </span>
                  160
                </p>
              </div>

              <Link
                href="/shop"
                className="py-4 px-10 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all duration-500 flex items-center justify-center gap-3 w-full sm:w-fit bg-slate-900 text-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] hover:-translate-y-1 group"
              >
                START BROWSING
                <span className="group-hover:translate-x-2 transition-transform duration-300">
                  →
                </span>
              </Link>
            </div>
          </div>

          <div className="relative z-20 p-8 flex items-center justify-center h-[350px] sm:h-[450px] lg:h-full w-full overflow-hidden">
            <div className="relative w-full max-w-[350px] aspect-square flex items-center justify-center">
              <svg
                className="absolute inset-0 w-full h-full z-10 pointer-events-none opacity-60 animate-pulse"
                viewBox="0 0 320 320"
              >
                <line
                  x1="160"
                  y1="160"
                  x2="60"
                  y2="80"
                  stroke="#6366f1"
                  strokeWidth="3"
                  strokeDasharray="6 6"
                />
                <line
                  x1="160"
                  y1="160"
                  x2="260"
                  y2="100"
                  stroke="#f97316"
                  strokeWidth="3"
                  strokeDasharray="6 6"
                />
                <line
                  x1="160"
                  y1="160"
                  x2="80"
                  y2="260"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeDasharray="6 6"
                />
                <line
                  x1="160"
                  y1="160"
                  x2="260"
                  y2="240"
                  stroke="#8b5cf6"
                  strokeWidth="3"
                  strokeDasharray="6 6"
                />
              </svg>

              <div className="absolute z-30 w-32 h-32 bg-white/95 backdrop-blur-2xl rounded-full border-4 border-indigo-50 shadow-[0_20px_60px_rgba(99,102,241,0.5)] flex flex-col items-center justify-center transition-transform hover:scale-110">
                <div
                  className="absolute inset-0 rounded-full border-8 border-indigo-500/10 animate-ping opacity-60"
                  style={{ animationDuration: "2.5s" }}
                ></div>
                <Building2 size={36} className="text-indigo-600 mb-1" />
                <span className="font-black text-slate-900 text-[11px] tracking-[0.2em] uppercase text-center leading-tight">
                  NIT
                  <br />
                  Nexus
                </span>
              </div>

              <div
                className="absolute z-20 top-4 left-4 animate-bounce hover:scale-125 transition-transform"
                style={{ animationDuration: "3.5s" }}
              >
                <div className="w-16 h-16 bg-white/90 backdrop-blur-md rounded-[1.25rem] shadow-2xl border-2 border-indigo-50 flex items-center justify-center">
                  <Laptop size={24} className="text-indigo-600" />
                </div>
              </div>

              <div
                className="absolute z-20 top-12 right-0 animate-bounce hover:scale-125 transition-transform"
                style={{ animationDuration: "4s", animationDelay: "0.2s" }}
              >
                <div className="w-14 h-14 bg-white/90 backdrop-blur-md rounded-full shadow-2xl border-2 border-orange-50 flex items-center justify-center">
                  <BookOpen size={22} className="text-orange-600" />
                </div>
              </div>

              <div
                className="absolute z-20 bottom-8 left-6 animate-bounce hover:scale-125 transition-transform"
                style={{ animationDuration: "4.5s", animationDelay: "0.4s" }}
              >
                <div className="w-14 h-14 bg-white/90 backdrop-blur-md rounded-full shadow-2xl border-2 border-emerald-50 flex items-center justify-center">
                  <Archive size={22} className="text-emerald-600" />
                </div>
              </div>

              <div
                className="absolute z-20 bottom-12 right-6 animate-bounce hover:scale-125 transition-transform"
                style={{ animationDuration: "3.8s", animationDelay: "0.6s" }}
              >
                <div className="w-16 h-16 bg-white/90 backdrop-blur-md rounded-[1.25rem] shadow-2xl border-2 border-purple-50 flex items-center justify-center">
                  <Cpu size={24} className="text-purple-600" />
                </div>
              </div>

              <div
                className="absolute w-[300px] h-[300px] rounded-full border-2 border-slate-300 border-dashed animate-spin opacity-30 z-0 pointer-events-none"
                style={{ animationDuration: "25s" }}
              ></div>
              <div
                className="absolute w-[220px] h-[220px] rounded-full border-2 border-indigo-200 border-dashed animate-spin opacity-40 z-0 pointer-events-none"
                style={{
                  animationDuration: "18s",
                  animationDirection: "reverse",
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row xl:flex-col gap-6 w-full xl:max-w-[340px]">
          <Link
            href="/shop"
            className="flex-1 flex flex-col justify-center bg-orange-50/80 border border-orange-200 rounded-[2.5rem] p-8 group cursor-pointer hover:shadow-2xl transition-all duration-500 overflow-hidden relative min-h-[200px] xl:min-h-0"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-[11px] font-black uppercase text-orange-600 mb-3 tracking-[0.2em]">
                <BookOpen size={14} /> SEMESTER PREP
              </div>
              <h3 className="text-2xl font-black text-slate-900 leading-tight mb-3">
                New Semester Essentials
              </h3>
              <p className="text-sm text-slate-700 font-bold max-w-[220px]">
                Procure textbooks and drafting tools verified by the NIT
                community.
              </p>
            </div>
            <BookOpen
              size={120}
              className="absolute -right-6 -bottom-6 text-orange-400/20 group-hover:scale-125 group-hover:-rotate-12 transition-transform duration-700 z-0"
              strokeWidth={1}
            />
          </Link>

          <Link
            href="/shop"
            className="flex-1 flex flex-col justify-center bg-emerald-50/80 border border-emerald-200 rounded-[2.5rem] p-8 group cursor-pointer hover:shadow-2xl transition-all duration-500 overflow-hidden relative min-h-[200px] xl:min-h-0"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-[11px] font-black uppercase text-emerald-700 mb-3 tracking-[0.2em]">
                <Archive size={14} /> RAPID EXIT
              </div>
              <h3 className="text-2xl font-black text-slate-900 leading-tight mb-3">
                Exit-Phase Liquidation
              </h3>
              <p className="text-sm text-slate-700 font-bold max-w-[220px]">
                Effortlessly offload electronics and furniture before program
                completion.
              </p>
            </div>
            <Archive
              size={120}
              className="absolute -right-6 -bottom-6 text-emerald-400/20 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-700 z-0"
              strokeWidth={1}
            />
          </Link>
        </div>
      </div>
      <CategoriesMarquee />
    </div>
  );
}
