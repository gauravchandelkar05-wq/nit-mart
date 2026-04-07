// const HowItWorks = () => {
//   return (
//     <section className="py-8 md:py-24 bg-white rounded-[1.5rem] md:rounded-[2rem] my-6 md:my-16 px-4 md:px-6 relative overflow-hidden">
//       <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-indigo-50 rounded-full opacity-30 -translate-y-1/2 translate-x-1/3"></div>

//       <div className="text-center mb-8 md:mb-16 relative z-10">
//         <span className="text-indigo-600 font-semibold bg-indigo-100 px-3 py-1 rounded-full text-[10px] md:text-sm">
//           NIT-Mart Process
//         </span>

//         {/* Title shrunk to text-2xl on mobile so it fits on 1 or 2 lines cleanly */}
//         <h2 className="text-2xl md:text-5xl font-extrabold text-gray-950 mt-3 md:mt-4 mb-2 md:mb-4 leading-tight">
//           Master Your Deals in 3 Moves
//         </h2>
//         <p className="text-gray-600 max-w-xl mx-auto text-xs md:text-lg px-2">
//           The official campus roadmap for hassle-free student trading. Simple,
//           secure, and purely local.
//         </p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 max-w-7xl mx-auto relative z-10">
//         {/* Step 01 */}
//         <div className="bg-white border border-gray-100 p-5 md:p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group">
//           <div className="w-10 h-10 md:w-16 md:h-16 bg-indigo-600 text-white rounded-xl md:rounded-2xl flex items-center justify-center text-lg md:text-3xl font-black mb-4 md:mb-8 rotate-3 group-hover:rotate-0 transition-transform">
//             01
//           </div>
//           <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-1.5 md:mb-2">
//             Unleash Your Items
//           </h3>
//           <p className="text-[11px] md:text-base text-gray-500 leading-relaxed">
//             Turn your Semester 3 books and lab essentials into cash. Snap a
//             photo, set your price, and broadcast it to the college.
//           </p>
//         </div>

//         {/* Step 02 */}
//         <div className="bg-gray-950 p-5 md:p-8 rounded-2xl shadow-2xl relative group transform hover:-translate-y-1 md:hover:-translate-y-2 transition-transform">
//           <div className="w-10 h-10 md:w-16 md:h-16 bg-orange-400 text-gray-950 rounded-xl md:rounded-2xl flex items-center justify-center text-lg md:text-3xl font-black mb-4 md:mb-8 rotate-3 group-hover:rotate-0 transition-transform">
//             02
//           </div>
//           <h3 className="text-lg md:text-2xl font-bold text-white mb-1.5 md:mb-2">
//             Connect & Direct
//           </h3>
//           <p className="text-[11px] md:text-base text-gray-300 leading-relaxed">
//             Connect instantly with student sellers via WhatsApp. Chat secure,
//             verify details, and finalize your trade.
//           </p>
//         </div>

//         {/* Step 03 */}
//         <div className="bg-white border border-gray-100 p-5 md:p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group">
//           <div className="w-10 h-10 md:w-16 md:h-16 bg-green-500 text-white rounded-xl md:rounded-2xl flex items-center justify-center text-lg md:text-3xl font-black mb-4 md:mb-8 rotate-3 group-hover:rotate-0 transition-transform">
//             03
//           </div>
//           <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-1.5 md:mb-2">
//             Finalize & Flow
//           </h3>
//           <p className="text-[11px] md:text-base text-gray-500 leading-relaxed">
//             Meet at the Canteen, Library, or Hostels. No shipping fees, just
//             smart, fast trades within the campus.
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default HowItWorks;


import { Camera, MessageCircle, Handshake } from "lucide-react";

const HowItWorks = () => {
  return (
    <section className="py-12 md:py-24 my-8 md:my-16 relative">
      
      {/* Header */}
      <div className="text-center mb-12 md:mb-20 px-4">
        <span className="text-indigo-600 font-bold bg-indigo-50 border border-indigo-100 px-4 py-1.5 rounded-full text-[10px] md:text-xs uppercase tracking-widest shadow-sm">
          NIT-Mart Process
        </span>
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mt-6 mb-4 tracking-tight">
          Master Your Deals in <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">3 Moves</span>
        </h2>
        <p className="text-slate-500 max-w-xl mx-auto text-sm md:text-base font-medium">
          The official campus roadmap for hassle-free student trading. Simple, secure, and purely local.
        </p>
      </div>

      {/* The Unified Process Container */}
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <div className="relative bg-white rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40 p-6 md:p-12 overflow-hidden">
          
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-indigo-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 relative z-10">
            
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-indigo-100 via-orange-100 to-emerald-100 z-0"></div>

            {/* Step 1: Snap & List */}
            <div className="relative group flex flex-col items-center text-center md:text-left md:items-start">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white border-4 border-indigo-50 rounded-2xl md:rounded-3xl shadow-xl shadow-indigo-100 flex items-center justify-center text-indigo-600 mb-6 relative z-10 group-hover:-translate-y-2 transition-transform duration-300">
                <div className="absolute -top-3 -right-3 w-7 h-7 bg-indigo-600 text-white text-xs font-black rounded-full flex items-center justify-center shadow-md">1</div>
                <Camera size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-3">Unleash Your Items</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Turn your Semester 3 books and lab essentials into cash. Snap a photo, set your price, and broadcast it to the college.
              </p>
            </div>

            {/* Step 2: Chat */}
            <div className="relative group flex flex-col items-center text-center md:text-left md:items-start">
              {/* Connecting Line (Mobile Only - vertical) */}
              <div className="md:hidden absolute -top-10 left-1/2 w-0.5 h-10 bg-gradient-to-b from-indigo-100 to-orange-100 -translate-x-1/2 z-0"></div>
              
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white border-4 border-orange-50 rounded-2xl md:rounded-3xl shadow-xl shadow-orange-100 flex items-center justify-center text-orange-500 mb-6 relative z-10 group-hover:-translate-y-2 transition-transform duration-300">
                <div className="absolute -top-3 -right-3 w-7 h-7 bg-orange-500 text-white text-xs font-black rounded-full flex items-center justify-center shadow-md">2</div>
                <MessageCircle size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-3">Connect & Direct</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Connect instantly with student sellers via WhatsApp. Chat secure, verify details, and finalize your trade.
              </p>
            </div>

            {/* Step 3: Meet */}
            <div className="relative group flex flex-col items-center text-center md:text-left md:items-start">
              {/* Connecting Line (Mobile Only - vertical) */}
              <div className="md:hidden absolute -top-10 left-1/2 w-0.5 h-10 bg-gradient-to-b from-orange-100 to-emerald-100 -translate-x-1/2 z-0"></div>
              
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white border-4 border-emerald-50 rounded-2xl md:rounded-3xl shadow-xl shadow-emerald-100 flex items-center justify-center text-emerald-500 mb-6 relative z-10 group-hover:-translate-y-2 transition-transform duration-300">
                <div className="absolute -top-3 -right-3 w-7 h-7 bg-emerald-500 text-white text-xs font-black rounded-full flex items-center justify-center shadow-md">3</div>
                <Handshake size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-3">Finalize & Flow</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Meet at the Canteen, Library, or Hostels. No shipping fees, just smart, fast trades within the campus.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;