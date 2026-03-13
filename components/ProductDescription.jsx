"use client";
import { ArrowRight, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const ProductDescription = ({ product }) => {
  const [selectedTab, setSelectedTab] = useState("Description");

  return (
    <div className="my-18 text-sm text-slate-600">
      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6 max-w-2xl">
        {["Description", "Reviews"].map((tab, index) => (
          <button
            className={`${tab === selectedTab ? "border-b-[1.5px] border-indigo-600 font-semibold text-indigo-600" : "text-slate-400"} px-3 py-2 font-medium transition-all`}
            key={index}
            onClick={() => setSelectedTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Description */}
      {selectedTab === "Description" && (
        <p className="max-w-xl leading-relaxed">{product.description}</p>
      )}

      {/* Reviews */}
      {selectedTab === "Reviews" && (
        <div className="flex flex-col gap-3 mt-14">
          {product.rating.map((item, index) => (
            <div key={index} className="flex gap-5 mb-10">
              <Image
                src={item.user.image}
                alt=""
                className="size-10 rounded-full object-cover"
                width={100}
                height={100}
              />
              <div>
                <div className="flex items-center">
                  {Array(5)
                    .fill("")
                    .map((_, index) => (
                      <StarIcon
                        key={index}
                        size={18}
                        className="text-transparent mt-0.5"
                        fill={item.rating >= index + 1 ? "#4F46E5" : "#D1D5DB"}
                      />
                    ))}
                </div>
                <p className="text-sm max-w-lg my-4">{item.review}</p>
                <p className="font-medium text-slate-800">{item.user.name}</p>
                <p className="mt-3 font-light">
                  {new Date(item.createdAt).toDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Store Page */}
      <div className="flex gap-3 mt-14 p-4 bg-slate-50 rounded-xl w-fit">
        <Image
          src={product.store.logo}
          alt=""
          className="size-11 rounded-full ring ring-slate-200"
          width={100}
          height={100}
        />
        <div>
          <p className="font-medium text-slate-600">
            Product by {product.store.name}
          </p>
          <Link
            href={`/shop/${product.store.username}`}
            className="flex items-center gap-1.5 text-indigo-600 font-medium hover:gap-2 transition-all"
          >
            view store <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDescription;
