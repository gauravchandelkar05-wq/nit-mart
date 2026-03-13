"use client";
import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";

const AdminNavbar = () => {
  const { user } = useUser();

  return (
    <div className="flex items-center justify-between px-12 py-3 border-b border-slate-200 transition-all bg-white">
      <Link
        href="/admin"
        className="relative text-4xl font-semibold text-slate-700"
      >
        <span className="text-indigo-600">NIT</span>-Mart
        <span className="text-indigo-600 text-5xl leading-0">.</span>
        <p className="absolute text-xs font-semibold -top-1 -right-13 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-indigo-600">
          Admin
        </p>
      </Link>
      <div className="flex items-center gap-4">
        <p className="text-slate-600">Hi, {user?.firstName}</p>
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
};

export default AdminNavbar;
