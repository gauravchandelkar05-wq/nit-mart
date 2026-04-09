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
  Star,
  Send,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const MyOrdersPage = () => {
  const { getToken } = useAuth();
  const { isLoaded, user } = useUser();
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelModal, setCancelModal] = useState({
    isOpen: false,
    orderId: null,
  });
  const [reviewModal, setReviewModal] = useState({
    isOpen: false,
    productId: null,
    orderId: null,
    rating: 0,
    review: "",
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

  const confirmCancelOrder = async () => {
    const orderIdToCancel = cancelModal.orderId;
    setCancelModal({ isOpen: false, orderId: null });

    const loadingToast = toast.loading("Cancelling order...");
    try {
      const token = await getToken();
      await axios.patch(
        "/api/orders",
        { orderId: orderIdToCancel },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Order Cancelled! ♻️", { id: loadingToast });
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to cancel", {
        id: loadingToast,
      });
    }
  };

  const submitReview = async () => {
    if (reviewModal.rating === 0)
      return toast.error("Please select a star rating!");
    if (!reviewModal.review.trim())
      return toast.error("Please write a short review!");

    const loadingToast = toast.loading("Submitting your review...");
    try {
      const token = await getToken();
      await axios.post(
        "/api/rating",
        {
          productId: reviewModal.productId,
          orderId: reviewModal.orderId,
          rating: reviewModal.rating,
          review: reviewModal.review,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success("Review submitted! ✨", { id: loadingToast });
      setReviewModal({
        isOpen: false,
        productId: null,
        orderId: null,
        rating: 0,
        review: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to submit review", {
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
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  const phone =
                                    item.product?.store?.contact?.replace(
                                      /\D/g,
                                      "",
                                    );
                                  if (!phone)
                                    return toast.error(
                                      "Seller contact not available",
                                    );
                                  window.open(
                                    `https://wa.me/${phone}?text=Hi, regarding my order for ${item.product?.name}...`,
                                    "_blank",
                                  );
                                }}
                                className="inline-flex items-center gap-1.5 text-[9px] font-black text-emerald-600 bg-emerald-50 hover:bg-emerald-500 hover:text-white px-3 py-1.5 rounded-lg uppercase tracking-widest transition-colors border border-emerald-100"
                              >
                                <MessageCircle size={12} /> Contact Seller
                              </button>

                              {order.status === "DELIVERED" && (
                                <button
                                  onClick={() =>
                                    setReviewModal({
                                      isOpen: true,
                                      productId: item.productId,
                                      orderId: order.id,
                                      rating: 0,
                                      review: "",
                                    })
                                  }
                                  className="inline-flex items-center gap-1.5 text-[9px] font-black text-amber-600 bg-amber-50 hover:bg-amber-500 hover:text-white px-3 py-1.5 rounded-lg uppercase tracking-widest transition-colors border border-amber-100"
                                >
                                  <Star size={12} /> Rate Product
                                </button>
                              )}
                            </div>
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
                          onClick={() =>
                            setCancelModal({ isOpen: true, orderId: order.id })
                          }
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="mx-auto w-16 h-16 bg-rose-50 text-rose-500 rounded-[1.5rem] flex items-center justify-center mb-6 shadow-inner">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-3">
              Cancel Order?
            </h3>
            <p className="text-xs font-bold text-slate-500 mb-8 tracking-wide">
              The item will be relisted on NIT-Mart for other students.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setCancelModal({ isOpen: false, orderId: null })}
                className="flex-1 py-4 bg-slate-50 text-slate-500 border border-slate-200 rounded-2xl font-black uppercase text-[10px]"
              >
                Nevermind
              </button>
              <button
                onClick={confirmCancelOrder}
                className="flex-1 py-4 bg-rose-500 text-white rounded-2xl font-black uppercase text-[10px]"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {reviewModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl transform animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-2">
              Share your <span className="text-amber-500">Feedback</span>
            </h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 border-b pb-4">
              Rate your campus purchase
            </p>

            <div className="flex justify-center gap-2 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() =>
                    setReviewModal({ ...reviewModal, rating: star })
                  }
                  className="transition-transform active:scale-125"
                >
                  <Star
                    size={36}
                    fill={star <= reviewModal.rating ? "#f59e0b" : "none"}
                    className={
                      star <= reviewModal.rating
                        ? "text-amber-500"
                        : "text-slate-200"
                    }
                  />
                </button>
              ))}
            </div>

            <textarea
              value={reviewModal.review}
              onChange={(e) =>
                setReviewModal({ ...reviewModal, review: e.target.value })
              }
              placeholder="How was the product? Was the meetup smooth?"
              className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-amber-100 outline-none transition-all h-32 mb-6"
            />

            <div className="flex gap-4">
              <button
                onClick={() =>
                  setReviewModal({ ...reviewModal, isOpen: false })
                }
                className="flex-1 py-4 text-slate-400 font-black uppercase text-[10px] tracking-widest"
              >
                Cancel
              </button>
              <button
                onClick={submitReview}
                className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all"
              >
                Submit Review <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyOrdersPage;
