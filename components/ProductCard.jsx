"use client";
import { StarIcon, ImageOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ProductCard = ({ product }) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "₹";

  const ratingCount = product?.rating?.length || 0;
  const rating =
    ratingCount > 0
      ? Math.round(
          product.rating.reduce((acc, curr) => acc + curr.rating, 0) /
            ratingCount,
        )
      : 0;

  const hasImage = product?.images && product.images.length > 0;
  const productId = product?._id || product?.id || "";

  if (!productId) return null;

  return (
    <Link
      href={`/product/${productId}`}
      className="group block w-full max-w-[260px] mx-auto"
    >
      <div className="bg-[#F9F9F9] border border-slate-100 w-full aspect-[4/5] rounded-2xl overflow-hidden relative flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
        {hasImage ? (
          <Image
            src={product.images[0]}
            alt={product?.name || "Product"}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, 260px"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-300">
            <ImageOff size={40} strokeWidth={1} />
            <span className="text-[10px] font-bold mt-2 uppercase tracking-widest">
              No Image
            </span>
          </div>
        )}

        {product?.category && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-[9px] font-black text-indigo-600 uppercase tracking-widest border border-white/50 shadow-sm">
            {product.category}
          </div>
        )}
      </div>

      <div className="pt-4 px-1">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1">
            <h3 className="font-bold text-slate-800 text-sm line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
              {product?.name || "Unnamed Product"}
            </h3>

            <div className="flex items-center gap-0.5 mt-2">
              {Array(5)
                .fill("")
                .map((_, index) => (
                  <StarIcon
                    key={index}
                    size={12}
                    className={
                      index < rating
                        ? "text-emerald-500 fill-emerald-500"
                        : "text-slate-200 fill-slate-200"
                    }
                  />
                ))}
              <span className="text-[10px] text-slate-400 ml-1 font-medium">
                ({ratingCount})
              </span>
            </div>
          </div>

          <div className="text-right">
            <p className="font-black text-indigo-600 text-base">
              {currency}
              {product?.price || 0}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
