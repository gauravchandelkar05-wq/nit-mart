"use client";
import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { toast } from "react-hot-toast";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation"; // 🔥 Added for redirection
import {
  UploadCloud,
  Store,
  User,
  Mail,
  Phone,
  MapPin,
  Loader2,
  ArrowLeft,
  Trash2, // 🔥 Added icon
  AlertTriangle, // 🔥 Added icon
} from "lucide-react";
import Link from "next/link";
import Loading from "@/components/Loading";

export default function StoreSettings() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const router = useRouter(); // Initialize router

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false); // 🔥 Deletion loading state
  const [showDeleteModal, setShowDeleteModal] = useState(false); // 🔥 Modal visibility

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    description: "",
    email: "",
    contact: "",
    address: "",
    logoPreview: null,
    newLogoFile: null,
  });

  // 1. Fetch current store data to pre-fill the form
  const fetchStoreData = async () => {
    try {
      const { data } = await axios.get("/api/store");
      if (data.store) {
        setFormData({
          name: data.store.name || "",
          username: data.store.username || "",
          description: data.store.description || "",
          email: data.store.email || "",
          contact: data.store.contact || "",
          address: data.store.address || "",
          logoPreview: data.store.logo || null,
          newLogoFile: null,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load store profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchStoreData();
  }, [user]);

  // 2. Handle the Update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = await getToken();
      const fd = new FormData();

      fd.append("name", formData.name);
      fd.append("username", formData.username);
      fd.append("description", formData.description);
      fd.append("email", formData.email);
      fd.append("contact", formData.contact);
      fd.append("address", formData.address);

      if (formData.newLogoFile) {
        fd.append("logo", formData.newLogoFile);
      }

      await axios.put("/api/store", fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Store Profile Updated!");
      fetchStoreData();
    } catch (error) {
      toast.error(error.response?.data?.error || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  // 🔥 3. Handle Store Deletion
  const handleDeleteStore = async () => {
    setDeleting(true);
    try {
      const token = await getToken();
      await toast.promise(
        axios.delete("/api/store", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        {
          loading: "Erasing store data...",
          success: "Store successfully deleted.",
          error: "Failed to delete store.",
        },
      );

      // Close modal and redirect to home page, forcing a refresh
      setShowDeleteModal(false);
      window.location.href = "/";
    } catch (error) {
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-10 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/store"
          className="p-2 hover:bg-slate-100 rounded-full transition"
        >
          <ArrowLeft size={20} className="text-slate-500" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
            Store <span className="text-indigo-600">Settings</span>
          </h1>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
            Update your profile & contact info
          </p>
        </div>
      </div>

      <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
        {/* SETTINGS FORM */}
        <form onSubmit={handleUpdate} className="space-y-8">
          {/* LOGO UPLOAD SECTION */}
          <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 group hover:border-indigo-300 transition">
            <label className="cursor-pointer flex flex-col items-center">
              <div className="relative size-28 rounded-full overflow-hidden border-4 border-white shadow-xl mb-3">
                <Image
                  src={formData.logoPreview || "/placeholder.png"}
                  fill
                  className="object-cover"
                  alt="Logo"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <UploadCloud className="text-white" size={24} />
                </div>
              </div>
              <span className="text-[10px] font-black uppercase text-indigo-600 tracking-widest">
                Change Store Logo
              </span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file)
                    setFormData({
                      ...formData,
                      newLogoFile: file,
                      logoPreview: URL.createObjectURL(file),
                    });
                }}
              />
            </label>
          </div>

          {/* INPUT FIELDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Display Name"
              icon={<Store size={18} />}
              value={formData.name}
              onChange={(val) => setFormData({ ...formData, name: val })}
            />
            <InputField
              label="Store Username"
              icon={<User size={18} />}
              value={formData.username}
              onChange={(val) => setFormData({ ...formData, username: val })}
            />
            <InputField
              label="Business Email"
              icon={<Mail size={18} />}
              value={formData.email}
              onChange={(val) => setFormData({ ...formData, email: val })}
            />
            <InputField
              label="Contact Number"
              icon={<Phone size={18} />}
              value={formData.contact}
              onChange={(val) => setFormData({ ...formData, contact: val })}
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block ml-2">
              Store Description
            </label>
            <textarea
              rows={3}
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:ring-4 focus:ring-indigo-50 transition font-medium text-slate-700"
              placeholder="Tell students about your store..."
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block ml-2">
              Pickup Address
            </label>
            <div className="relative">
              <MapPin
                className="absolute left-4 top-4 text-slate-300"
                size={20}
              />
              <textarea
                rows={2}
                value={formData.address || ""}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full p-4 pl-12 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:ring-4 focus:ring-indigo-50 transition font-medium text-slate-700"
                placeholder="e.g. near parking, Room 202..."
              />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            disabled={saving}
            type="submit"
            className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition flex justify-center items-center gap-3 tracking-widest uppercase text-sm"
          >
            {saving ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Save Profile Changes"
            )}
          </button>
        </form>

        {/* 🔥 DANGER ZONE */}
        <div className="mt-16 pt-8 border-t border-rose-100">
          <h2 className="text-xl font-black text-rose-600 uppercase tracking-tight mb-2">
            Danger Zone
          </h2>
          <p className="text-sm text-slate-500 mb-6 font-medium">
            Once you delete your store, there is no going back. All of your
            products, ratings, and store data will be permanently wiped from the
            marketplace.
          </p>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="px-6 py-3.5 bg-rose-50 text-rose-600 font-bold rounded-xl border border-rose-100 hover:bg-rose-500 hover:text-white hover:shadow-lg hover:shadow-rose-200 transition-all flex items-center gap-2 text-sm uppercase tracking-widest"
          >
            <Trash2 size={18} /> Delete Store Permanently
          </button>
        </div>
      </div>

      {/* 🔥 DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-sm w-full animate-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                Delete Store?
              </h3>
              <p className="text-slate-500 mt-2 text-sm font-medium leading-relaxed">
                This action is permanent. Your store and all its products will
                be destroyed immediately.
              </p>
            </div>
            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3.5 font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleDeleteStore}
                disabled={deleting}
                className="flex-1 py-3.5 font-black text-white bg-rose-500 hover:bg-rose-600 transition rounded-xl shadow-lg shadow-rose-200 flex justify-center items-center"
              >
                {deleting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  "CONFIRM DELETE"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Reusable Input Sub-component
function InputField({ label, icon, value, onChange }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2 block">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
          {icon}
        </div>
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-4 pl-12 bg-slate-50 rounded-2xl border border-slate-100 outline-none focus:ring-4 focus:ring-indigo-50 transition font-bold text-slate-700"
        />
      </div>
    </div>
  );
}
