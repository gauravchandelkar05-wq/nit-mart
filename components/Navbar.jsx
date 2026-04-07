"use client";
import {
  PackageIcon,
  Search,
  ShoppingCart,
  User as UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useUser, useClerk, UserButton, Protect } from "@clerk/nextjs";

const Navbar = () => {
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  // Correctly getting total items in cart
  const cartItems = useSelector((state) => state.cart.cartItems);
  const cartCount = Object.values(cartItems).reduce((a, b) => a + b, 0);

  // Set mounted to true once component loads in browser to fix hydration errors
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/shop?search=${search}`);
    }
  };

  return (
    <nav className="relative bg-white sticky top-0 z-50 border-b border-slate-100">
      <div className="mx-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto py-4 transition-all">
          {/* LOGO */}
          <Link
            href="/"
            className="relative text-3xl font-black text-slate-800 tracking-tighter"
          >
            <span className="text-indigo-600">NIT</span>-Mart
            <span className="text-indigo-600 text-4xl">.</span>
            {/* Membership Badge */}
            {isMounted && (
              <Protect plan="plus">
                <p className="absolute text-[8px] font-black -top-1 -right-10 px-2 py-0.5 rounded-full text-white bg-indigo-600 uppercase tracking-widest shadow-lg shadow-indigo-100">
                  Plus
                </p>
              </Protect>
            )}
          </Link>

          {/* DESKTOP LINKS */}
          <div className="hidden sm:flex items-center gap-6 lg:gap-10 text-slate-500 font-bold text-xs uppercase tracking-widest">
            <Link href="/" className="hover:text-indigo-600 transition">
              Home
            </Link>
            <Link href="/shop" className="hover:text-indigo-600 transition">
              Shop
            </Link>
            <Link href="/about" className="hover:text-indigo-600 transition">
              About
            </Link>
            <Link href="/contact" className="hover:text-indigo-600 transition">
              Contact
            </Link>

            {/* SEARCH BAR */}
            <form
              onSubmit={handleSearch}
              className="hidden xl:flex items-center w-64 gap-2 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-100 focus-within:border-indigo-200 transition-all"
            >
              <Search size={14} className="text-slate-400" />
              <input
                className="w-full bg-transparent outline-none placeholder-slate-400 text-xs font-bold lowercase"
                type="text"
                placeholder="Find books, kits..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>

            {/* CART */}
            <Link
              href="/cart"
              className="relative flex items-center gap-2 group"
            >
              <div className="p-2.5 bg-slate-50 rounded-xl group-hover:bg-indigo-50 transition">
                <ShoppingCart
                  size={18}
                  className="text-slate-600 group-hover:text-indigo-600"
                />
              </div>

              {/* Cart Bubble */}
              {isMounted && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-black text-white ring-4 ring-white animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* DESKTOP AUTH SECTION */}
            {!isMounted ? (
              <div className="size-10 bg-slate-100 animate-pulse rounded-full"></div>
            ) : !user ? (
              <button
                onClick={openSignIn}
                className="px-8 py-3 bg-slate-900 hover:bg-black transition text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-200"
              >
                Login
              </button>
            ) : (
              <UserButton
                appearance={{
                  elements: { userButtonAvatarBox: "size-10 rounded-xl" },
                }}
              >
                <UserButton.MenuItems>
                  <UserButton.Action
                    labelIcon={<PackageIcon size={16} />}
                    label="My Orders"
                    onClick={() => router.push("/orders")}
                  />
                  <UserButton.Action
                    labelIcon={<UserIcon size={16} />}
                    label="Store Dashboard"
                    onClick={() => router.push("/store")}
                  />
                </UserButton.MenuItems>
              </UserButton>
            )}
          </div>

          {/* MOBILE NAV */}
          <div className="sm:hidden flex items-center gap-4">
            {/* Mobile Cart */}
            {isMounted && user && (
              <Link
                href="/cart"
                className="relative p-2 bg-slate-50 rounded-lg"
              >
                <ShoppingCart size={20} className="text-slate-600" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[8px] size-4 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* MOBILE AUTH SECTION WITH FIXED MENU ITEMS */}
            {isMounted &&
              (!user ? (
                <button
                  onClick={openSignIn}
                  className="px-5 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase rounded-xl"
                >
                  Login
                </button>
              ) : (
                <UserButton
                  appearance={{ elements: { userButtonAvatarBox: "size-9" } }}
                >
                  <UserButton.MenuItems>
                    <UserButton.Action
                      labelIcon={<PackageIcon size={16} />}
                      label="My Orders"
                      onClick={() => router.push("/orders")}
                    />
                    <UserButton.Action
                      labelIcon={<UserIcon size={16} />}
                      label="Store Dashboard"
                      onClick={() => router.push("/store")}
                    />
                  </UserButton.MenuItems>
                </UserButton>
              ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
