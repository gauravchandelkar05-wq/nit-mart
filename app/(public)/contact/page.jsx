"use client";
import React, { useState } from "react";
import { Mail, MessageSquare, MapPin, Send, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target);

    // 🔥 Your specific Web3Forms Access Key is locked in here
    formData.append("access_key", "b667f447-c9e6-4d04-9f3d-1269b969678c");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Message sent! We'll get back to you soon. 🚀");
        e.target.reset(); // This clears the form fields
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      toast.error("Network error. Could not send message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 sm:p-10 pb-20">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black text-slate-800 uppercase tracking-tight">
          Get in <span className="text-indigo-600">Touch</span>
        </h1>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">
          Have questions about a trade? We're here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* CONTACT INFO */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
            <h3 className="text-xl font-black text-slate-800 mb-6 uppercase tracking-tight">
              Campus Support
            </h3>

            <div className="space-y-6">
              {/* 🔥 CLICKABLE EMAIL */}
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Email Us
                  </p>
                  <a
                    href="mailto:nitmart.support@gmail.com"
                    className="text-sm font-bold text-slate-700 hover:text-indigo-600 transition-colors"
                  >
                    nitmart.support@gmail.com
                  </a>
                </div>
              </div>

              {/* 🔥 CLICKABLE WHATSAPP */}
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-50 text-green-600 rounded-2xl">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    WhatsApp Group
                  </p>
                  <a
                    href="https://chat.whatsapp.com/CLw1jNHjBqt3ZNxWsAAwgH"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-bold text-green-600 hover:underline transition-all"
                  >
                    Join Community Feed
                  </a>
                </div>
              </div>

              {/* LOCATION */}
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Main Meetup Point
                  </p>
                  <p className="text-sm font-bold text-slate-700">
                    Central Canteen / Library Plaza
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CONTACT FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-4"
        >
          {/* Name & Email fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                className="w-full mt-1 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-indigo-200 transition"
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Email ID"
                className="w-full mt-1 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-indigo-200 transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              placeholder="Query about a book, kit, etc."
              className="w-full mt-1 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-indigo-200 transition"
              required
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Message
            </label>
            <textarea
              name="message"
              rows={4}
              placeholder="Describe your issue..."
              className="w-full mt-1 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:border-indigo-200 transition resize-none"
              required
            />
          </div>

          <button
            disabled={isSubmitting}
            className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition flex justify-center items-center gap-2 uppercase tracking-widest text-xs disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                Send Message <Send size={16} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
