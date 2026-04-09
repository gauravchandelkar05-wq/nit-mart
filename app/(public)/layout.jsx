"use client";
import Banner from "@/components/Banner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/lib/features/product/productSlice";
import { useUser, useAuth } from "@clerk/nextjs";
import { fetchCart, uploadCart } from "@/lib/features/cart/cartSlice";
import { fetchAddress } from "@/lib/features/address/addressSlice";
import { fetchUserRatings } from "@/lib/features/rating/ratingSlice";

export default function PublicLayout({ children }) {
  const dispatch = useDispatch();
  const { user } = useUser();
  const { getToken } = useAuth();

  const { cartItems } = useSelector((state) => state.cart);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    dispatch(fetchProducts({}));
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(fetchCart({ getToken }));
      dispatch(fetchAddress({ getToken }));
      dispatch(fetchUserRatings({ getToken }));
    }
  }, [user, getToken, dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(uploadCart({ getToken }));
    }
  }, [cartItems, user, getToken, dispatch]);

  if (!isMounted) {
    return (
      <div className="invisible">
        <Banner />
        <Navbar />
        {children}
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Banner />
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
