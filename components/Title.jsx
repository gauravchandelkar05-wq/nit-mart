"use client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const Title = ({ title, description, visibleButton = true, href = "" }) => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-3xl font-semibold text-slate-800">{title}</h2>
      <Link
        href={href}
        className="flex flex-col items-center gap-2 text-sm text-slate-600 mt-2 group"
      >
        <p className="max-w-xl text-center leading-relaxed">{description}</p>
        {visibleButton && (
          <button className="text-indigo-600 flex items-center gap-1 font-medium mt-1 group-hover:gap-2 transition-all">
            View more <ArrowRight size={14} />
          </button>
        )}
      </Link>
    </div>
  );
};

export default Title;
