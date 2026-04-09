"use client";
import Counter from "@/components/Counter";
import OrderSummary from "@/components/OrderSummary";
import PageTitle from "@/components/PageTitle";
import { deleteItemFromCart } from "@/lib/features/cart/cartSlice";
import { Trash2Icon, ShoppingBag, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUser, useClerk } from "@clerk/nextjs";

export default function Cart() {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "₹";
  const dispatch = useDispatch();

  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();

  const { cartItems } = useSelector((state) => state.cart);
  const products = useSelector((state) => state.product.list);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { cartArray, totalPrice } = useMemo(() => {
    let currentTotal = 0;
    const tempArray = [];

    for (const [key, value] of Object.entries(cartItems)) {
      const product = products.find((p) => p.id === key);
      if (product) {
        tempArray.push({
          ...product,
          quantity: value,
        });
        currentTotal += product.price * value;
      }
    }
    return { cartArray: tempArray, totalPrice: currentTotal };
  }, [cartItems, products]);

  if (!isMounted) return null;

  return cartArray.length > 0 ? (
    <div className="min-h-screen mx-4 sm:mx-6 pb-20 text-slate-800 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto">
        <PageTitle
          heading="My Cart"
          text={`${cartArray.length} items ready for a campus meetup`}
        />

        <div className="flex items-start justify-between gap-10 max-lg:flex-col mt-8">
          <div className="w-full max-w-4xl">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-slate-400 uppercase text-[9px] font-black tracking-widest border-b border-slate-50 bg-slate-50/30">
                    <th className="p-6">Product</th>
                    <th className="p-6 text-center">Qty</th>
                    <th className="p-6 text-center">Subtotal</th>
                    <th className="p-6 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {cartArray.map((item) => (
                    <tr
                      key={item.id}
                      className="group hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="p-6">
                        <div className="flex gap-4 items-center">
                          <div className="relative size-16 sm:size-20 rounded-2xl overflow-hidden border border-slate-100 bg-white flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                            <Image
                              src={item.images[0] || "/placeholder.png"}
                              fill
                              className="object-cover p-1"
                              alt={item.name}
                            />
                          </div>
                          <div className="flex flex-col">
                            <p className="font-black text-slate-800 leading-tight mb-1 text-sm sm:text-base">
                              {item.name}
                            </p>
                            <span className="text-[10px] w-fit bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">
                              {item.category}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="p-6 text-center">
                        <div className="flex justify-center scale-90 sm:scale-100">
                          <Counter productId={item.id} max={item.stock} />
                        </div>
                      </td>

                      <td className="p-6 text-center font-black text-slate-800 text-sm sm:text-base">
                        {currency}
                        {(item.price * item.quantity).toLocaleString()}
                      </td>

                      <td className="p-6 text-center">
                        <button
                          onClick={() =>
                            dispatch(deleteItemFromCart({ productId: item.id }))
                          }
                          className="text-slate-300 hover:text-rose-600 hover:bg-rose-50 p-2 sm:p-3 rounded-2xl transition-all active:scale-90"
                        >
                          <Trash2Icon size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Link
              href="/shop"
              className="inline-flex items-center gap-2 mt-6 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition ml-4"
            >
              <ArrowRight size={14} className="rotate-180" /> Keep Browsing
            </Link>
          </div>

          <div className="w-full lg:max-w-sm sticky top-24">
            <OrderSummary
              totalPrice={totalPrice}
              items={cartArray}
              isSignedIn={isSignedIn}
              openSignIn={openSignIn}
            />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-[70vh] flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
      <div className="bg-slate-50 p-10 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center gap-6">
        <div className="p-8 bg-white rounded-full shadow-xl shadow-slate-200/50">
          <ShoppingBag size={48} className="text-slate-200" />
        </div>
        <div className="text-center">
          <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">
            Your cart is <span className="text-indigo-600">Ghosting</span> you.
          </h1>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">
            Go find some seniors selling their stash!
          </p>
        </div>
        <Link
          href="/shop"
          className="bg-slate-800 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-600 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-indigo-100"
        >
          Go find deals
        </Link>
      </div>
    </div>
  );
}
