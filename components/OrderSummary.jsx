"use client";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { clearCart } from "@/lib/features/cart/cartSlice";
import { Banknote, MapPin, Loader2, ShoppingBag } from "lucide-react";

const OrderSummary = ({ totalPrice, items }) => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "₹";

  const handlePlaceOrder = async () => {
    if (loading || items.length === 0) return;

    setLoading(true);

    const orderPromise = (async () => {
      try {
        const token = await getToken();

        const orderData = {
          items: items.map((item) => ({
            id: item.id,
            price: item.price,
            quantity: item.quantity,
          })),
          totalAmount: totalPrice,
        };

        // Pointing perfectly to your /api/orders backend
        const { data } = await axios.post("/api/orders", orderData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // 🔥 Instantly wipes the UI cart in Redux.
        dispatch(clearCart());
        
        // 🔥 THE MAGIC FIX: Hard Redirect instead of router.push
        // This completely bypasses the Next.js cache and forces everything to reload fresh!
        window.location.href = "/orders";

        return data.message || "Order Confirmed! ✨";
      } catch (error) {
        const errorMsg =
          error.response?.data?.error || "Checkout failed. Try again.";
        throw new Error(errorMsg);
      } finally {
        setLoading(false);
      }
    })();

    toast.promise(orderPromise, {
      loading: "Securing your campus deal...",
      success: (msg) => <b>{msg}</b>,
      error: (err) => <b>{err.message}</b>,
    });
  };

  return (
    <div className="w-full lg:max-w-sm bg-white border border-slate-100 shadow-2xl shadow-slate-200/60 rounded-[2.5rem] p-6 sm:p-8 sticky top-24">
      <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-6">
        Trade Summary
      </h2>

      <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl mb-4">
        <div className="p-2 bg-emerald-600 rounded-xl text-white">
          <Banknote size={20} />
        </div>
        <div>
          <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest leading-none mb-1">
            Payment Method
          </p>
          <p className="text-sm font-bold text-emerald-900">
            Pay on Meetup (COD)
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl mb-6">
        <MapPin size={20} className="text-indigo-600 mt-0.5" />
        <div>
          <p className="text-[10px] font-black text-indigo-700 uppercase tracking-widest leading-none mb-1">
            Meetup Point
          </p>
          <p className="text-[11px] font-bold text-indigo-900 leading-tight">
            Trade at Hostel/Canteen. Coordinate via WhatsApp after order.
          </p>
        </div>
      </div>

      <div className="space-y-4 py-6 border-t border-slate-50 mb-6">
        <div className="flex justify-between items-center text-sm">
          <span className="uppercase tracking-widest text-[10px] font-black text-slate-400">
            Subtotal
          </span>
          <span className="text-slate-800 font-bold">
            {currency}
            {totalPrice.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="uppercase tracking-widest text-[10px] font-black text-slate-400">
            Platform Fee
          </span>
          <span className="text-emerald-600 font-black text-xs uppercase">
            FREE
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-8 bg-slate-50 p-5 rounded-3xl">
        <span className="text-slate-800 font-black uppercase text-xs">
          Total
        </span>
        <span className="text-3xl font-black text-indigo-600 tracking-tighter">
          {currency}
          {totalPrice.toLocaleString()}
        </span>
      </div>

      <button
        onClick={handlePlaceOrder}
        disabled={loading || items.length === 0}
        className={`w-full py-5 font-black rounded-2xl transition flex justify-center items-center gap-3 tracking-widest uppercase text-sm shadow-xl shadow-indigo-100/50 
          ${loading ? "bg-indigo-300" : "bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95"}`}
      >
        {loading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <>
            CONFIRM ORDER <ShoppingBag size={18} />
          </>
        )}
      </button>

      <p className="text-[9px] text-slate-400 text-center mt-5 font-bold uppercase tracking-widest">
        Zero hidden charges • Campus meetup only
      </p>
    </div>
  );
};

export default OrderSummary;