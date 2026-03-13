"use client";

import { Star } from "lucide-react";
import React, { useState } from "react";
import { XIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";
import { useDispatch } from "react-redux";
import axios from "axios";
import { addRating } from "@/lib/features/rating/ratingSlice";

const RatingModal = ({ ratingModal, setRatingModal }) => {
  const { getToken } = useAuth();
  const dispatch = useDispatch();

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const handleSubmit = async () => {
    if (rating <= 0 || rating > 5) {
      return toast.error("Please select a rating");
    }
    if (review.length < 5) {
      return toast.error("Write at least a short review (5+ characters)");
    }
    try {
      const token = await getToken();
      const { data } = await axios.post(
        "/api/rating",
        {
          productId: ratingModal.productId,
          orderId: ratingModal.orderId,
          rating,
          review,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      dispatch(addRating(data.rating));
      toast.success(data.message);
      setRatingModal(null);
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-96 relative border border-slate-100">
        <button
          onClick={() => setRatingModal(null)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <XIcon size={20} />
        </button>
        <h2 className="text-xl font-semibold text-slate-800 mb-6 text-center">
          Rate Product
        </h2>
        <div className="flex items-center justify-center gap-2 mb-6">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className={`size-8 cursor-pointer transition-all duration-200 ${
                rating > i
                  ? "text-indigo-500 fill-indigo-500 scale-110"
                  : "text-slate-300 hover:text-indigo-300"
              }`}
              onClick={() => setRating(i + 1)}
            />
          ))}
        </div>
        <textarea
          className="w-full p-3 border border-slate-200 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700 placeholder:text-slate-400"
          placeholder="Share your experience with this product..."
          rows="4"
          value={review}
          onChange={(e) => setReview(e.target.value)}
        ></textarea>
        <button
          onClick={() =>
            toast.promise(handleSubmit(), {
              loading: "Submitting your review...",
              success: "Review submitted!",
              error: "Failed to submit review",
            })
          }
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-md shadow-indigo-200"
        >
          Submit Rating
        </button>
      </div>
    </div>
  );
};

export default RatingModal;
