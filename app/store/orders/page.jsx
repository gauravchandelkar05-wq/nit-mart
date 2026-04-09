"use client";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { MapPin, Store, Loader2, MessageCircle, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function StoreOrdersPage() {
  const { getToken } = useAuth();
  const { isLoaded, user } = useUser();
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && !user) router.push("/");
  }, [isLoaded, user, router]);

  const fetchStoreOrders = useCallback(async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/store/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(data.orders || []);
    } catch (error) {
      toast.error("Failed to load store orders");
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    if (user) fetchStoreOrders();
  }, [user, fetchStoreOrders]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    const loadingToast = toast.loading("Updating status...");
    try {
      const token = await getToken();
      await axios.patch(
        "/api/store/orders",
        { orderId, status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      toast.success("Order updated! 🚀", { id: loadingToast });
      fetchStoreOrders();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update", {
        id: loadingToast,
      });
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-10 pb-20 text-slate-800">
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">
            Store <span className="text-indigo-600">Orders</span>
          </h1>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">
            Manage your sales and campus meetups
          </p>
        </div>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft size={14} /> Back to dashboard
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center p-20 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
          <Store className="mx-auto text-slate-200 mb-4" size={64} />
          <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">
            No orders yet. Keep promoting your shop!
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="text-slate-400 uppercase text-[10px] font-black tracking-widest border-b border-slate-50 bg-slate-50/50">
                <th className="p-6">Product Detail</th>
                <th className="p-6 text-center">Revenue</th>
                <th className="p-6 text-center">Meetup Point</th>
                <th className="p-6 text-center">Current Status</th>
                <th className="p-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-slate-50/30 transition-colors"
                >
                  <td className="p-6">
                    {order.orderItems?.map((item) => (
                      <div
                        key={item.productId}
                        className="flex items-start gap-4 mb-4 last:mb-0"
                      >
                        <div className="size-16 relative rounded-2xl overflow-hidden border border-slate-100 bg-white flex-shrink-0 mt-1">
                          <Image
                            src={
                              item.product?.images?.[0] || "/placeholder.png"
                            }
                            fill
                            className="object-cover p-1"
                            alt={item.product?.name || "Product"}
                          />
                        </div>
                        <div className="flex flex-col">
                          <p className="font-bold text-slate-800 text-sm mb-1 line-clamp-1">
                            {item.product?.name || "Deleted Product"}
                          </p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            ₹{item.price} • Qty: {item.quantity}
                          </p>
                          <p className="text-[9px] font-bold text-slate-300 mt-1 uppercase">
                            ID: {order.id.slice(-8)} •{" "}
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </td>

                  <td className="p-6 text-center">
                    <span className="font-black text-slate-800 text-lg">
                      ₹{order.total}
                    </span>
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">
                      Paid via {order.paymentMethod}
                    </p>
                  </td>

                  <td className="p-6 text-center">
                    <span className="inline-flex items-center gap-1 text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full uppercase tracking-widest">
                      <MapPin size={12} />{" "}
                      {order.address?.city || "Campus Meetup"}
                    </span>
                  </td>

                  <td className="p-6 text-center">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusUpdate(order.id, e.target.value)
                      }
                      className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl outline-none cursor-pointer transition border
                        ${order.status === "ORDER_PLACED" ? "bg-slate-50 text-slate-700 border-slate-200" : ""}
                        ${order.status === "READY_FOR_PICKUP" ? "bg-blue-50 text-blue-700 border-blue-200" : ""}
                        ${order.status === "PICKED_UP" ? "bg-amber-50 text-amber-700 border-amber-200" : ""}
                        ${order.status === "DELIVERED" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : ""}
                        ${order.status === "CANCELLED" ? "bg-rose-50 text-rose-700 border-rose-200" : ""}
                      `}
                    >
                      <option value="ORDER_PLACED">Order Placed</option>
                      <option value="READY_FOR_PICKUP">Ready for Pickup</option>
                      <option value="PICKED_UP">Picked Up</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>

                  <td className="p-6 text-center">
                    <button
                      onClick={() => {
                        const phone = order.user?.phone?.replace(/\D/g, "");
                        if (!phone)
                          return toast.error("Buyer phone number missing");
                        window.open(
                          `https://wa.me/${phone}?text=Hi, this is the seller from NIT-Mart. Regarding your order for ${order.orderItems?.[0]?.product?.name || "items"}...`,
                          "_blank",
                        );
                      }}
                      className="inline-flex items-center gap-1.5 text-[9px] font-black text-emerald-600 bg-emerald-50 hover:bg-emerald-500 hover:text-white px-4 py-2 rounded-xl uppercase tracking-widest transition-colors active:scale-95 border border-emerald-100"
                    >
                      <MessageCircle size={14} /> Contact Buyer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
