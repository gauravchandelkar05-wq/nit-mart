import { Send, ShieldCheck, Headphones } from "lucide-react";

const OurSpecs = () => {
  return (
    <section className="py-12 md:py-20 bg-white text-center max-w-7xl mx-auto px-4 sm:px-6 my-10">
      {/* Header Section */}
      <div className="mb-10 md:mb-16 max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
          Our Specifications
        </h2>
        <p className="text-slate-600 text-sm md:text-base leading-relaxed px-4">
          We offer top-tier service and convenience to ensure your shopping
          experience is smooth, secure and completely hassle-free.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {/* Card 1: Delivery */}
        <div className="bg-indigo-50/40 border border-indigo-100 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 flex flex-col items-center group">
          <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-200 transform -rotate-3 group-hover:rotate-0 transition-transform">
            <Send size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">
            On-Campus Delivery
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Fast exchange between hostels and departments—no shipping fees.
          </p>
        </div>

        {/* Card 2: THE FIXED VERIFICATION CARD */}
        <div className="bg-orange-50/40 border border-orange-100 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 flex flex-col items-center group">
          <div className="w-14 h-14 bg-orange-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-orange-200 transform rotate-3 group-hover:rotate-0 transition-transform">
            <ShieldCheck size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">
            Trusted Community
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Trade with confidence. Secure profile authentication ensures you're
            always dealing with real, verified peers.
          </p>
        </div>

        {/* Card 3: Support */}
        <div className="bg-purple-50/40 border border-purple-100 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 flex flex-col items-center group">
          <div className="w-14 h-14 bg-purple-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-200 transform -rotate-3 group-hover:rotate-0 transition-transform">
            <Headphones size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">
            Student Support
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Run by students, for students. We're here to help you trade safely.
          </p>
        </div>
      </div>
    </section>
  );
};

export default OurSpecs;
