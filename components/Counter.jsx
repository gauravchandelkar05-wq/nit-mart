"use client";
import {
  addToCart,
  removeFromCart,
  deleteItemFromCart,
} from "@/lib/features/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { useEffect } from "react";

const Counter = ({ productId, max }) => {
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const currentQty = cartItems[productId] || 0;

  // 🔥 AUTO-CORRECT LOGIC:
  // If stock changes to 3, but cart has 10, this force-fixes it to 3.
  useEffect(() => {
    if (max !== undefined && currentQty > max) {
      // Reset to max if over limit
      for (let i = 0; i < currentQty - max; i++) {
        dispatch(removeFromCart({ productId }));
      }
      toast.error(`Stock reduced! Adjusted to maximum available (${max})`, {
        id: "auto-fix",
      });
    }
  }, [max, currentQty, productId, dispatch]);

  const addToCartHandler = () => {
    const limit = max !== undefined ? max : 1; // Default to 1 if unknown for safety
    if (currentQty < limit) {
      dispatch(addToCart({ productId }));
    } else {
      toast.error(`Only ${limit} units available!`, { id: "stock-limit" });
    }
  };

  const removeFromCartHandler = () => {
    dispatch(removeFromCart({ productId }));
  };

  return (
    <div className="inline-flex items-center gap-3 px-3 py-1 rounded border border-slate-200 bg-white shadow-sm">
      <button
        onClick={removeFromCartHandler}
        className="p-1 px-2 text-slate-400 hover:text-slate-800"
      >
        -
      </button>
      <p className="font-bold text-slate-800">{currentQty}</p>
      <button
        onClick={addToCartHandler}
        className={`p-1 px-2 ${currentQty >= (max || 1) ? "text-slate-200 cursor-not-allowed" : "text-slate-400 hover:text-slate-800"}`}
      >
        +
      </button>
    </div>
  );
};
export default Counter;
