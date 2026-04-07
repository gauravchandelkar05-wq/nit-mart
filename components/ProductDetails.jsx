"use client";

import { addToCart } from "@/lib/features/cart/cartSlice";
import { StarIcon, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Counter from "./Counter";
import { useDispatch, useSelector } from "react-redux";

const ProductDetails = ({ product }) => {
  const productId = product.id;
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "₹";

  const cart = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const router = useRouter();

  const [mainImage, setMainImage] = useState(product.images[0]);

  const addToCartHandler = () => {
    dispatch(addToCart({ productId }));
  };

  const handleNegotiate = () => {
    let cleanedNumber = product?.store?.contact?.replace(/\D/g, "") || "";
    if (cleanedNumber.startsWith("0")) {
      cleanedNumber = "91" + cleanedNumber.substring(1);
    } else if (cleanedNumber.length === 10 && !cleanedNumber.startsWith("91")) {
      cleanedNumber = "91" + cleanedNumber;
    }
    const message = `Hi! I'm interested in your listing for "${product?.name}" on NIT-Mart. Can we negotiate the price?`;
    const whatsappUrl = `https://wa.me/${cleanedNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const averageRating =
    product.rating?.length > 0
      ? product.rating.reduce((acc, item) => acc + item.rating, 0) /
        product.rating.length
      : 0;

  return (
    <div className="flex max-lg:flex-col gap-12 mt-4">
      {/* Left: Image Gallery */}
      <div className="flex max-sm:flex-col-reverse gap-3">
        <div className="flex sm:flex-col gap-3">
          {product.images.map((image, index) => (
            <div
              key={index}
              onClick={() => setMainImage(product.images[index])}
              className={`bg-slate-100 flex items-center justify-center size-24 rounded-lg group cursor-pointer border transition-all ${
                mainImage === image
                  ? "border-indigo-500 shadow-sm"
                  : "border-transparent"
              }`}
            >
              <Image
                src={image}
                className="group-hover:scale-105 transition object-contain"
                alt=""
                width={60}
                height={60}
              />
            </div>
          ))}
        </div>
        <div className="relative flex justify-center items-center h-100 sm:size-113 bg-slate-100 rounded-xl border overflow-hidden">
          <Image
            src={mainImage}
            alt={product.name}
            width={400}
            height={400}
            className={`object-contain hover:scale-105 transition-transform duration-500 ${product.stock <= 0 ? "grayscale opacity-50" : ""}`}
          />
          {product.stock <= 0 && (
            <div className="absolute bg-rose-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl">
              Sold Out
            </div>
          )}
        </div>
      </div>

      {/* Right: Product Info */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          {product.name}
        </h1>

        <div className="flex items-center mt-3">
          {Array(5)
            .fill("")
            .map((_, index) => (
              <StarIcon
                key={index}
                size={16}
                fill={averageRating >= index + 1 ? "#FACC15" : "#D1D5DB"}
                stroke="none"
              />
            ))}
          <p className="text-sm ml-3 text-slate-500 font-medium">
            ({product.rating?.length || 0} Reviews)
          </p>
        </div>

        <div className="flex items-baseline my-8 gap-4">
          <p className="text-4xl font-extrabold text-indigo-600">
            {currency}
            {product.price}
          </p>
          <p className="text-xl text-slate-400 line-through font-medium">
            {currency}
            {product.mrp}
          </p>
          <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-md uppercase">
            Save{" "}
            {(((product.mrp - product.price) / product.mrp) * 100).toFixed(0)}%
          </span>
        </div>

        {/* 🔥 THE INVENTORY LOGIC SWAP */}
        {product.stock > 0 ? (
          <>
            {/* Low Stock Warning */}
            {product.stock <= 3 && (
              <p className="mb-4 text-amber-600 text-xs font-bold animate-pulse">
                ⚠️ Only {product.stock} {product.stock === 1 ? "unit" : "units"}{" "}
                left! Grab it fast.
              </p>
            )}

            {/* Buying Controls */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                {cart[productId] && (
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
                      Qty
                    </span>
                    <Counter productId={productId} max={product.stock} />
                  </div>
                )}

                <button
                  onClick={() =>
                    !cart[productId] ? addToCartHandler() : router.push("/cart")
                  }
                  className={`flex-1 py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all shadow-lg active:scale-95 ${
                    !cart[productId]
                      ? "bg-slate-900 text-white hover:bg-black shadow-slate-200"
                      : "bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100"
                  }`}
                >
                  {!cart[productId] ? "Add to Cart" : "View in Cart"}
                </button>
              </div>

              <button
                onClick={handleNegotiate}
                className="flex items-center justify-center gap-3 w-full py-4 bg-[#25D366] text-white font-bold rounded-xl hover:bg-[#128C7E] active:scale-95 transition shadow-lg uppercase text-sm tracking-widest"
              >
                <MessageCircle size={20} fill="white" />
                Negotiate on WhatsApp
              </button>
            </div>
          </>
        ) : (
          /* 🔥 OUT OF STOCK UI */
          <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 sm:p-8 text-center my-6 shadow-inner">
            <h3 className="text-2xl font-black text-rose-600 uppercase tracking-tight mb-2">
              Out of Stock 🚫
            </h3>
            <p className="text-rose-400 text-[11px] font-bold uppercase tracking-widest leading-relaxed">
              Someone just grabbed the last one! <br />
              Check back later in case the order gets cancelled.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
