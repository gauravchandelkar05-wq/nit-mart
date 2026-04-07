"use client";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  MapPin,
  XCircle,
  ShoppingBag,
  ArrowLeft,
  Loader2,
  AlertTriangle,
  MessageCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function MyOrdersPage() {
  const { getToken } = useAuth();
  const { isLoaded, user } = useUser();
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [cancelModal, setCancelModal] = useState({
    isOpen: false,
    orderId: null,
  });

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/");
    }
  }, [isLoaded, user, router]);

  const fetchOrders = useCallback(async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(data.orders || []);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user, fetchOrders]);

  const openCancelModal = (orderId) => {
    setCancelModal({ isOpen: true, orderId });
  };

  const closeCancelModal = () => {
    setCancelModal({ isOpen: false, orderId: null });
  };

  const confirmCancelOrder = async () => {
    const orderIdToCancel = cancelModal.orderId;
    closeCancelModal();

    const loadingToast = toast.loading("Cancelling order & restoring stock...");
    try {
      const token = await getToken();

      await axios.patch(
        "/api/orders",
        { orderId: orderIdToCancel },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success("Order Cancelled. Stock restored! ♻️", {
        id: loadingToast,
      });
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to cancel", {
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

  const activeOrders = orders.filter((order) => order.status !== "CANCELLED");

  return (
    <>
      <div className="max-w-6xl mx-auto p-4 sm:p-10 pb-20 text-slate-800">
        <div className="mb-10">
          <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">
            My <span className="text-indigo-600">Orders</span>
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
              Showing {activeOrders.length} active orders
            </p>
            <Link
              href="/shop"
              className="text-xs text-indigo-600 font-black uppercase tracking-widest hover:underline flex items-center gap-1"
            >
              <ArrowLeft size={12} /> Go to shop
            </Link>
          </div>
        </div>

        {activeOrders.length === 0 ? (
          <div className="text-center p-20 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
            <ShoppingBag className="mx-auto text-slate-200 mb-4" size={64} />
            <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">
              You have no active orders.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="text-slate-400 uppercase text-[10px] font-black tracking-widest border-b border-slate-50 bg-slate-50/50">
                  <th className="p-6">Product</th>
                  <th className="p-6 text-center">Total Price</th>
                  <th className="p-6 text-center">Address</th>
                  <th className="p-6 text-center">Status</th>
                  <th className="p-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {activeOrders.map((order) => (
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
                              alt=""
                            />
                          </div>
                          <div className="flex flex-col">
                            <p className="font-bold text-slate-800 text-sm mb-1 line-clamp-1">
                              {item.product?.name || "Deleted Product"}
                            </p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              ₹{item.price} • Qty: {item.quantity}
                            </p>
                            <p className="text-[9px] font-bold text-slate-300 mt-1 mb-2">
                              {new Date(order.createdAt).toDateString()}
                            </p>
                            <a
                              href={`https://wa.me/${item.product?.store?.phone || ""}?text=Hi, I recently ordered ${item.product?.name} on NIT-Mart. When can we meet up?`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-[9px] font-black text-emerald-600 bg-emerald-50 hover:bg-emerald-500 hover:text-white px-3 py-1.5 rounded-lg uppercase tracking-widest transition-colors active:scale-95 border border-emerald-100 w-fit"
                            >
                              <MessageCircle size={12} /> Contact Seller
                            </a>
                          </div>
                        </div>
                      ))}
                    </td>
                    <td className="p-6 text-center font-black text-slate-800">
                      ₹{order.total}
                    </td>
                    <td className="p-6 text-center">
                      <span className="inline-flex items-center gap-1 text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full uppercase tracking-widest">
                        <MapPin size={12} />
                        {order.address?.city || "Campus Pickup"}
                      </span>
                    </td>
                    <td className="p-6 text-center">
                      <span
                        className={`text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest border whitespace-nowrap
                        ${order.status === "ORDER_PLACED" ? "bg-slate-50 text-slate-600 border-slate-200" : ""}
                        ${order.status === "READY_FOR_PICKUP" ? "bg-blue-50 text-blue-600 border-blue-200" : ""}
                        ${order.status === "DELIVERED" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : ""}
                      `}
                      >
                        • {order.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="p-6 text-center">
                      {order.status === "ORDER_PLACED" ? (
                        <button
                          onClick={() => openCancelModal(order.id)}
                          className="inline-flex items-center gap-2 text-[10px] font-black text-rose-500 hover:text-white hover:bg-rose-500 border border-rose-200 px-4 py-2 rounded-xl transition-all uppercase tracking-widest active:scale-95 shadow-sm"
                        >
                          <XCircle size={14} /> Cancel
                        </button>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                          Locked
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {cancelModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl shadow-slate-900/20 text-center transform scale-100 animate-in zoom-in-95 duration-200">
            <div className="mx-auto w-16 h-16 bg-rose-50 text-rose-500 rounded-[1.5rem] flex items-center justify-center mb-6 shadow-inner">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-3">
              Cancel Order?
            </h3>
            <p className="text-xs font-bold text-slate-500 mb-8 tracking-wide leading-relaxed">
              This action cannot be undone. The item will be relisted on
              NIT-Mart so other students can buy it.
            </p>
            <div className="flex gap-4">
              <button
                onClick={closeCancelModal}
                className="flex-1 py-4 bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-colors active:scale-95"
              >
                Nevermind
              </button>
              <button
                onClick={confirmCancelOrder}
                className="flex-1 py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-rose-200 transition-colors active:scale-95"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
