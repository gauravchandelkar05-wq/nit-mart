"use client";
import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ShoppingCart, PackageIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const StoreNavbar = () => {
  const { user } = useUser();
  const router = useRouter();

  return (
    <div className="flex items-center justify-between px-6 sm:px-12 py-3 border-b border-slate-200 transition-all bg-white">
      {/* LOGO */}
      <Link
        href="/store"
        className="relative text-3xl sm:text-4xl font-semibold text-slate-700"
      >
        <span className="text-indigo-600">NIT</span>-Mart
        <span className="text-indigo-600 text-4xl sm:text-5xl leading-0">
          .
        </span>
        <p className="absolute text-[10px] sm:text-xs font-semibold -top-1 -right-11 px-2.5 py-0.5 rounded-full flex items-center gap-2 text-white bg-indigo-600 shadow-sm">
          Store
        </p>
      </Link>

      {/* USER & MENU */}
      <div className="flex items-center gap-3 sm:gap-4">
        <p className="text-sm text-slate-600 hidden sm:block font-medium">
          Hi, {user?.firstName}
        </p>

        {/* 🔥 THE FIXED USER BUTTON */}
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: { userButtonAvatarBox: "size-9 rounded-xl" },
          }}
        >
          <UserButton.MenuItems>
            {/* Back to Marketplace */}
            <UserButton.Action
              labelIcon={<ShoppingCart size={16} />}
              label="Back to Marketplace"
              onClick={() => router.push("/")}
            />

            {/* My Orders */}
            <UserButton.Action
              labelIcon={<PackageIcon size={16} />}
              label="My Orders"
              onClick={() => router.push("/orders")}
            />
          </UserButton.MenuItems>
        </UserButton>
      </div>
    </div>
  );
};

export default StoreNavbar;
