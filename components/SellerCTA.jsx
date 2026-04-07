import Link from "next/link";

const SellerCTA = () => {
  return (
    <div className="relative overflow-hidden bg-indigo-900 rounded-2xl md:rounded-[2rem] p-6 md:p-12 my-8 md:my-20 text-center shadow-2xl mx-4 md:mx-0">
      <div className="absolute -top-12 -right-12 md:-top-24 md:-right-24 w-32 h-32 md:w-64 md:h-64 bg-indigo-500 rounded-full opacity-20"></div>

      <div className="relative z-10">
        <h2 className="text-xl md:text-5xl font-black text-white mb-3 md:mb-6 leading-tight">
          Your Room is full of{" "}
          <span className="text-indigo-400 underline decoration-wavy">
            Cash!
          </span>
        </h2>

        <p className="text-indigo-100 text-xs md:text-xl mb-6 md:mb-10 max-w-2xl mx-auto">
          Don't let your old books collect dust. Join other students making a
          difference. Become a student-vendor in 60 seconds.
        </p>

        <div className="flex flex-col sm:flex-row gap-2.5 md:gap-4 justify-center">
          {/* 🔥 THE FIX: Now points to /create-store instead of /store */}
          <Link
            href="/create-store"
            className="bg-white text-indigo-900 px-5 py-2.5 md:px-10 md:py-4 rounded-lg md:rounded-xl font-bold text-xs md:text-lg hover:scale-105 transition-transform"
          >
            Start Selling Now
          </Link>

          <Link
            href="/shop"
            className="border-2 border-indigo-400 text-white px-5 py-2.5 md:px-10 md:py-4 rounded-lg md:rounded-xl font-bold text-xs md:text-lg hover:bg-indigo-800 transition"
          >
            Browse All Listings
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SellerCTA;
