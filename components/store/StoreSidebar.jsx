"use client";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  LayoutListIcon,
  SquarePenIcon,
  SquarePlusIcon,
  SettingsIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const StoreSidebar = ({ storeInfo }) => {
  const pathname = usePathname();

  const sidebarLinks = [
    { name: "Dashboard", href: "/store", icon: HomeIcon },
    { name: "Add Product", href: "/store/add-product", icon: SquarePlusIcon },
    {
      name: "Manage Product",
      href: "/store/manage-product",
      icon: SquarePenIcon,
    },
    { name: "Orders", href: "/store/orders", icon: LayoutListIcon },
    {
      name: "Settings",
      href: "/store/settings",
      icon: SettingsIcon,
    },
  ];

  return (
    <div className="inline-flex h-full flex-col gap-5 border-r border-slate-200 sm:min-w-60 bg-white shadow-sm">
      {/* Store Branding Section */}
      <div className="flex flex-col gap-3 justify-center items-center pt-8 max-sm:hidden">
        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-indigo-50 shadow-sm">
          <Image
            className="object-cover"
            src={storeInfo?.logo || "/placeholder-logo.png"}
            alt="Store Logo"
            fill
          />
        </div>
        <div className="text-center px-4">
          <p className="text-slate-800 font-bold text-sm line-clamp-1">
            {storeInfo?.name || "My Store"}
          </p>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">
            Seller Dashboard
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="max-sm:mt-6 flex flex-col gap-1">
        {sidebarLinks.map((link, index) => {
          const isActive = pathname === link.href;

          return (
            <Link
              key={index}
              href={link.href}
              className={`relative flex items-center gap-3 py-3 px-4 transition-all duration-200 group ${
                isActive
                  ? "bg-indigo-50 text-indigo-600 font-bold"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <link.icon
                size={20}
                className={`sm:ml-4 transition-transform group-hover:scale-110 ${
                  isActive ? "text-indigo-600" : "text-slate-400"
                }`}
              />
              <p className="max-sm:hidden text-sm">{link.name}</p>

              {/* Active Indicator Bar */}
              {isActive && (
                <span className="absolute bg-indigo-600 right-0 top-2 bottom-2 w-1 sm:w-1.5 rounded-l-full shadow-[0_0_10px_rgba(79,70,229,0.4)]"></span>
              )}
            </Link>
          );
        })}
      </div>

      {/* DYNAMIC STATUS FOOTER */}
      <div className="mt-auto p-6 max-sm:hidden">
        <div
          className={`rounded-2xl p-4 border transition-colors ${
            storeInfo?.isActive
              ? "bg-emerald-50/50 border-emerald-100"
              : "bg-rose-50/50 border-rose-100"
          }`}
        >
          <p
            className={`text-[10px] font-black uppercase tracking-widest mb-1 ${
              storeInfo?.isActive ? "text-emerald-500" : "text-rose-500"
            }`}
          >
            Status
          </p>
          <div className="flex items-center gap-2.5">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                storeInfo?.isActive
                  ? "bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                  : "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"
              }`}
            ></span>
            <span
              className={`text-xs font-bold ${
                storeInfo?.isActive ? "text-emerald-900" : "text-rose-900"
              }`}
            >
              {storeInfo?.isActive ? "Store Active" : "Store Inactive"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreSidebar;
