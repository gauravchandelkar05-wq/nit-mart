"use client";
import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, Store, Mail, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

export default function ApproveStorePage() {
  const [pendingStores, setPendingStores] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingStores = async () => {
    try {
      // 🔥 FIXED: Pointing exactly to the backend route we created
      const { data } = await axios.get("/api/admin/approve-store");
      setPendingStores(data.stores || []);
    } catch (error) {
      // 🔥 TRAP: This will print the exact server error in your browser console
      console.error("Fetch error:", error.response?.data || error.message);
      toast.error("Failed to load stores. Check console, bro.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingStores();
  }, []);

  const handleAction = async (id, action) => {
    try {
      // Sending 'id' and 'action' to our POST route
      await axios.post(`/api/admin/approve-store`, { id, action });
      toast.success(`Store ${action}!`, {
        icon: action === "approved" ? "✅" : "❌",
      });
      // Remove it from the UI so you don't have to refresh
      setPendingStores((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Action error:", error.response?.data || error.message);
      toast.error(error.response?.data?.error || "Action failed.");
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">
          Store <span className="text-indigo-600">Approvals</span>
        </h1>
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2">
          Verify campus sellers manually
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="size-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      ) : pendingStores.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {pendingStores.map((store) => (
            <div
              key={store.id}
              className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-xl shadow-slate-200/40 flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-indigo-100 transition-all"
            >
              <div className="flex items-center gap-6">
                <div className="size-20 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
                  <Store className="text-slate-300" size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 leading-tight">
                    {store.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mb-3">
                    @{store.username}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <Mail size={12} className="text-indigo-500" />{" "}
                      {store.email}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleAction(store.id, "rejected")}
                  className="p-4 rounded-2xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
                >
                  <XCircle size={18} /> Reject
                </button>
                <button
                  onClick={() => handleAction(store.id, "approved")}
                  className="p-4 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
                >
                  <CheckCircle size={18} /> Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 py-20 text-center">
          <ShieldCheck className="mx-auto text-slate-200 mb-4" size={48} />
          <h2 className="text-lg font-black text-slate-400 uppercase tracking-tight">
            No pending requests!
          </h2>
        </div>
      )}
    </div>
  );
}
