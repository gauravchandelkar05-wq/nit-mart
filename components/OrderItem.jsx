"use client";
import Image from "next/image";
import { DotIcon, MessageCircle } from "lucide-react";
import { useSelector } from "react-redux";
import Rating from "./Rating";
import { useState } from "react";
import RatingModal from "./RatingModal";

const OrderItem = ({ order }) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "₹";
  const [ratingModal, setRatingModal] = useState(null);
  const { ratings } = useSelector((state) => state.rating);

  return (
    <>
      <tr className="text-sm">
        <td className="text-left">
          <div className="flex flex-col gap-6">
            {order.orderItems.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-20 aspect-square bg-slate-100 flex items-center justify-center rounded-md">
                  <Image
                    className="h-14 w-auto object-cover"
                    src={item.product?.images?.[0] || "/placeholder.png"}
                    alt="product_img"
                    width={50}
                    height={50}
                  />
                </div>
                <div className="flex flex-col justify-center text-sm">
                  <p className="font-medium text-slate-800 text-base">
                    {item.product?.name || "Product Unnamed"}
                  </p>
                  <p className="text-slate-500 text-xs mt-1">
                    {currency}
                    {item.price} • Qty: {item.quantity}
                  </p>
                  <p className="mb-2 text-xs text-slate-400">
                    {new Date(order.createdAt).toDateString()}
                  </p>

                  {/* RATINGS LOGIC */}
                  <div className="flex items-center gap-3">
                    {ratings.find(
                      (rating) =>
                        order.id === rating.orderId &&
                        item.product?.id === rating.productId,
                    ) ? (
                      <Rating
                        value={
                          ratings.find(
                            (rating) =>
                              order.id === rating.orderId &&
                              item.product?.id === rating.productId,
                          ).rating
                        }
                      />
                    ) : (
                      <button
                        onClick={() =>
                          setRatingModal({
                            orderId: order.id,
                            productId: item.product?.id,
                          })
                        }
                        className={`text-[10px] font-black uppercase text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded transition ${
                          order.status !== "DELIVERED" ? "hidden" : ""
                        }`}
                      >
                        Rate Product
                      </button>
                    )}

                    {/* 🔥 WhatsApp Button Added Here Too */}
                    <a
                      href={`https://wa.me/${item.product?.store?.contact || ""}?text=Hi, I ordered ${item.product?.name} on NIT-Mart. When can we meet?`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-[10px] font-black uppercase text-green-600 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded transition"
                    >
                      <MessageCircle size={12} /> Contact Seller
                    </a>
                  </div>

                  {ratingModal && (
                    <RatingModal
                      ratingModal={ratingModal}
                      setRatingModal={setRatingModal}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </td>

        <td className="text-center max-md:hidden font-black text-slate-800">
          {currency}
          {order.total}
        </td>

        {/* 🔥 ADDRESS FIX: Safely Handle Null Address */}
        <td className="text-left max-md:hidden text-slate-600 text-xs">
          {order.address ? (
            <>
              <p className="font-bold text-slate-800">{order.address.name}</p>
              <p>{order.address.street}</p>
              <p>
                {order.address.city}, {order.address.state}
              </p>
            </>
          ) : (
            <div className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg inline-block font-bold">
              Campus Pickup
            </div>
          )}
        </td>

        <td className="text-left space-y-2 text-xs font-black max-md:hidden uppercase tracking-widest">
          <div
            className={`flex items-center justify-center gap-1 rounded-full p-2 ${
              order.status === "DELIVERED"
                ? "text-indigo-600 bg-indigo-50"
                : "text-slate-500 bg-slate-100"
            }`}
          >
            <DotIcon size={14} className="scale-150" />
            {order.status.replace(/_/g, " ")}
          </div>
        </td>
      </tr>

      {/* MOBILE VIEW (Hidden on Desktop) */}
      <tr className="md:hidden">
        <td colSpan={5} className="py-4 px-2">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            {/* 🔥 Mobile Address Fix */}
            {order.address ? (
              <>
                <p className="font-bold text-slate-800 text-sm">
                  {order.address.name}
                </p>
                <p className="text-slate-600 text-xs mt-1">
                  {order.address.street}, {order.address.city}
                </p>
              </>
            ) : (
              <p className="font-black text-indigo-600 uppercase text-xs tracking-widest bg-indigo-100/50 p-2 rounded-lg inline-block">
                Campus Pickup
              </p>
            )}

            <div className="flex items-center mt-4">
              <span className="text-center mx-auto px-6 py-2 rounded-xl bg-slate-800 text-white font-black text-[10px] uppercase tracking-widest w-full">
                {order.status.replace(/_/g, " ")}
              </span>
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td colSpan={4}>
          <div className="border-b border-slate-100 w-full my-6" />
        </td>
      </tr>
    </>
  );
};

export default OrderItem;
