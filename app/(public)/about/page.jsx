import React from "react";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center mb-28">
      <h1 className="text-4xl font-bold text-slate-800 mb-6">
        About <span className="text-indigo-600">NIT-Mart</span>
      </h1>
      <p className="text-slate-600 text-lg leading-relaxed mb-6">
        NIT-Mart is an exclusive, student-run marketplace designed specifically
        for our campus community. Whether you need a second-hand textbook for
        next semester, a lab kit, or just some dorm essentials, you can find it
        here from trusted peers.
      </p>
      <p className="text-slate-600 text-lg leading-relaxed">
        Built to solve the problem of fragmented WhatsApp groups and unsafe
        public marketplaces, NIT-Mart uses modern web tech to make trading on
        campus faster, safer, and smarter.
      </p>
    </div>
  );
}
