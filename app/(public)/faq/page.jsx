import React from "react";

export default function CampusPolicies() {
  const faqs = [
    {
      question: "Who can use NIT-Mart?",
      answer:
        "NIT-Mart is exclusively for the students, faculty, and staff of our college. You must use a valid campus email to register and buy or sell items.",
    },
    {
      question: "How do I pay for an item?",
      answer:
        "NIT-Mart is a peer-to-peer platform. Payments are handled directly between the buyer and seller. We recommend using UPI (GPay, PhonePe) or Cash when you meet on campus to exchange the item.",
    },
    {
      question: "How does delivery work?",
      answer:
        "There is no shipping! Buyers and sellers arrange a meetup location on campus (like the canteen, library, or hostel gate) to hand over the item.",
    },
    {
      question: "Can I return an item if I don't like it?",
      answer:
        "Since this is a student-to-student marketplace, all sales are final unless you and the seller agree otherwise. Always check the condition, age, and features of the item before handing over your money.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 mb-20 text-slate-700">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">
        Campus Policies & FAQ
      </h1>
      <p className="text-slate-500 mb-10">
        Everything you need to know about buying and selling safely on campus.
      </p>

      {/* FAQ Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-slate-800 mb-6 border-b pb-2">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm"
            >
              <h3 className="font-medium text-lg text-indigo-600 mb-2">
                {faq.question}
              </h3>
              <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Safe Meetup Guidelines */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-slate-800 mb-6 border-b pb-2">
          Safe Meetup Guidelines
        </h2>
        <ul className="list-disc pl-5 space-y-3 text-slate-600">
          <li>
            <strong className="text-slate-800">Meet in Public:</strong> Always
            arrange exchanges in well-lit, public campus areas during daylight
            hours.
          </li>
          <li>
            <strong className="text-slate-800">Inspect Before You Pay:</strong>{" "}
            Take a minute to check that the textbook has all its pages or the
            calculator turns on before completing the trade.
          </li>
          <li>
            <strong className="text-slate-800">Protect Your Data:</strong> Do
            not share personal banking details or passwords. Stick to standard
            UPI QR codes or cash.
          </li>
        </ul>
      </section>
    </div>
  );
}
