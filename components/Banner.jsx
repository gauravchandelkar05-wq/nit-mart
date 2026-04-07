// 'use client'
// import React from 'react'
// import toast from 'react-hot-toast';

// export default function Banner() {

//     const [isOpen, setIsOpen] = React.useState(true);

//     const handleClaim = () => {
//         setIsOpen(false);
//         toast.success('Coupon copied to clipboard!');
//         navigator.clipboard.writeText('NEW20');
//     };

//     return isOpen && (
//         <div className="w-full px-6 py-1 font-medium text-sm text-white text-center bg-gradient-to-r from-violet-500 via-[#9938CA] to-[#E0724A]">
//             <div className='flex items-center justify-between max-w-7xl  mx-auto'>
//                 <p>Get 20% OFF on Your First Order!</p>
//                 <div className="flex items-center space-x-6">
//                     <button onClick={handleClaim} type="button" className="font-normal text-gray-800 bg-white px-7 py-2 rounded-full max-sm:hidden">Claim Offer</button>
//                     <button onClick={() => setIsOpen(false)} type="button" className="font-normal text-gray-800 py-2 rounded-full">
//                         <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
//                             <rect y="12.532" width="17.498" height="2.1" rx="1.05" transform="rotate(-45.74 0 12.532)" fill="#fff" />
//                             <rect x="12.533" y="13.915" width="17.498" height="2.1" rx="1.05" transform="rotate(-135.74 12.533 13.915)" fill="#fff" />
//                         </svg>
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };
"use client";
import { XIcon } from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";

const Banner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="w-full px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-sm relative z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="hidden sm:block w-24"></div>

        <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-center flex-1">
          🚀 Welcome to NIT-Mart • Zero Platform Fees • Pure Campus Trading
        </p>

        <div className="flex items-center gap-4">
          <Link
            href="/shop"
            className="font-black text-indigo-600 bg-white px-5 py-1.5 rounded-full text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all max-sm:hidden shadow-lg shadow-indigo-900/20"
          >
            Start Trading
          </Link>
          <button
            onClick={() => setIsVisible(false)}
            type="button"
            className="font-bold text-white hover:bg-white/20 p-1.5 rounded-full transition"
          >
            <XIcon size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;
