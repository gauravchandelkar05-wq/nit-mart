"use client";
import Loading from "@/components/Loading";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import {
  CircleDollarSignIcon,
  ShoppingBasketIcon,
  StarIcon,
  TagsIcon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";

export default function Dashboard() {
  const { getToken } = useAuth();
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "₹";
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    totalEarnings: 0,
    totalOrders: 0,
    ratings: [],
  });

  const dashboardCardsData = [
    {
      title: "Total Products",
      value: dashboardData.totalProducts,
      icon: ShoppingBasketIcon,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Total Earnings",
      value: `${currency}${dashboardData.totalEarnings}`,
      icon: CircleDollarSignIcon,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Total Orders",
      value: dashboardData.totalOrders,
      icon: TagsIcon,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Total Ratings",
      value: dashboardData.ratings?.length || 0,
      icon: StarIcon,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
  ];

  const fetchDashboardData = useCallback(async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/store/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data?.dashboardData) {
        setDashboardData(data.dashboardData);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.error || "Failed to load dashboard data",
      );
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) return <Loading />;

  return (
    <div className="text-slate-500 mb-28 p-4">
      <h1 className="text-2xl font-black uppercase tracking-tight text-slate-800">
        Seller <span className="text-indigo-600">Dashboard</span>
      </h1>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-8">
        {dashboardCardsData.map((card, index) => (
          <div
            key={index}
            className="flex items-center justify-between border border-slate-100 bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col gap-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {card.title}
              </p>
              <b className="text-2xl font-black text-slate-800">{card.value}</b>
            </div>
            <div className={`p-3 rounded-xl ${card.bg}`}>
              <card.icon size={24} className={card.color} />
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-bold text-slate-800 mt-10 mb-4 border-b border-slate-100 pb-2">
        Recent Reviews
      </h2>

      {/* REVIEWS LIST */}
      <div className="mt-5 space-y-4">
        {dashboardData.ratings?.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">No reviews yet.</p>
          </div>
        ) : (
          dashboardData.ratings.map((review, index) => (
            <div
              key={index}
              className="flex max-sm:flex-col gap-5 sm:items-start justify-between p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-indigo-100 transition-colors max-w-4xl"
            >
              <div className="flex-1">
                <div className="flex gap-3 items-center">
                  {/* 🔥 SAFETY CHECK: Fallback image if user is null */}
                  <Image
                    src={
                      review.user?.image ||
                      "https://ui-avatars.com/api/?name=User"
                    }
                    alt="User avatar"
                    className="w-10 h-10 rounded-full object-cover bg-slate-100"
                    width={40}
                    height={40}
                  />
                  <div>
                    <p className="font-bold text-slate-800 text-sm">
                      {review.user?.name || "Anonymous User"}
                    </p>
                    <p className="font-medium text-[10px] text-slate-400 uppercase tracking-wider">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-slate-600 text-sm leading-relaxed max-w-2xl bg-slate-50 p-4 rounded-xl italic">
                  "{review.review}"
                </p>
              </div>

              <div className="flex flex-col sm:items-end justify-between gap-4 min-w-[200px]">
                <div className="flex flex-col sm:items-end bg-slate-50 p-3 rounded-xl w-full">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-500">
                    {review.product?.category || "Product"}
                  </p>
                  <p className="font-bold text-slate-800 text-sm truncate w-full sm:text-right">
                    {review.product?.name || "Deleted Product"}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    {Array(5)
                      .fill("")
                      .map((_, i) => (
                        <StarIcon
                          key={i}
                          size={14}
                          className={
                            i < review.rating
                              ? "text-amber-400 fill-amber-400"
                              : "text-slate-200 fill-slate-200"
                          }
                        />
                      ))}
                  </div>
                </div>

                {/* 🔥 SAFETY CHECK: Don't show button if product was deleted */}
                {review.product?.id && (
                  <button
                    onClick={() => router.push(`/product/${review.product.id}`)}
                    className="w-full sm:w-auto bg-white border border-slate-200 px-4 py-2 hover:bg-slate-50 hover:border-slate-300 font-bold text-xs uppercase tracking-widest rounded-lg transition-all active:scale-95 text-slate-600"
                  >
                    View Product
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
