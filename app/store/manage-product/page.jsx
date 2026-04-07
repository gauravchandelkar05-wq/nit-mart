"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Loading from "@/components/Loading";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { Trash2, Pencil, X, AlertTriangle, UploadCloud } from "lucide-react";

export default function StoreManageProducts() {
  const { getToken } = useAuth();
  const { user } = useUser();

  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "₹";

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  // Modal States
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    productId: null,
  });

  const [editModal, setEditModal] = useState({
    isOpen: false,
    productId: null,
    name: "",
    description: "",
    mrp: "",
    price: "",
    stock: "",
    category: "",
    imagePreviews: [], // Existing images from DB
    newFiles: [], // New images added by user
  });

  const fetchProducts = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/store/product", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(
        data.products.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        ),
      );
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    }
    setLoading(false);
  };

  const confirmDelete = async () => {
    try {
      const token = await getToken();
      await toast.promise(
        axios.delete(`/api/store/product?id=${deleteModal.productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        {
          loading: "Deleting product...",
          success: "Product removed!",
          error: "Failed to delete product.",
        },
      );
      fetchProducts();
      setDeleteModal({ isOpen: false, productId: null });
    } catch (error) {
      console.error(error);
    }
  };

  // 🔥 NEW: Image Management Functions
  const handleImageAdd = (e) => {
    const files = Array.from(e.target.files);
    setEditModal((prev) => ({
      ...prev,
      newFiles: [...prev.newFiles, ...files],
    }));
  };

  const removeExistingImage = (indexToRemove) => {
    setEditModal((prev) => ({
      ...prev,
      imagePreviews: prev.imagePreviews.filter(
        (_, idx) => idx !== indexToRemove,
      ),
    }));
  };

  const removeNewImage = (indexToRemove) => {
    setEditModal((prev) => ({
      ...prev,
      newFiles: prev.newFiles.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const confirmEdit = async () => {
    if (!editModal.name || !editModal.description || !editModal.category) {
      return toast.error("Please fill all fields correctly.");
    }

    if (
      editModal.imagePreviews.length === 0 &&
      editModal.newFiles.length === 0
    ) {
      return toast.error("You must have at least one product image.");
    }

    try {
      const token = await getToken();
      const formData = new FormData();
      formData.append("id", editModal.productId);
      formData.append("name", editModal.name);
      formData.append("description", editModal.description);
      formData.append("category", editModal.category);
      formData.append("mrp", Number(editModal.mrp));
      formData.append("price", Number(editModal.price));
      formData.append("stock", Number(editModal.stock));

      // Send the kept existing images so the backend knows what wasn't deleted
      formData.append(
        "existingImages",
        JSON.stringify(editModal.imagePreviews),
      );

      // Append all new files
      editModal.newFiles.forEach((file) => {
        formData.append("images", file);
      });

      await toast.promise(
        axios.put("/api/store/product", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }),
        {
          loading: "Updating listing...",
          success: "Product updated!",
          error: "Failed to update product.",
        },
      );

      fetchProducts();
      closeEditModal();
    } catch (error) {
      console.error(error);
    }
  };

  const closeEditModal = () => {
    setEditModal({
      isOpen: false,
      productId: null,
      name: "",
      description: "",
      mrp: "",
      price: "",
      stock: "",
      category: "",
      imagePreviews: [],
      newFiles: [],
    });
  };

  useEffect(() => {
    if (user) fetchProducts();
  }, [user]);

  if (loading) return <Loading />;

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-2xl text-slate-500 mb-6 sm:mb-8">
        Manage <span className="text-slate-800 font-bold">Inventory</span>
      </h1>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[340px]">
          <thead className="bg-slate-50 text-slate-400 uppercase text-[9px] sm:text-[10px] font-bold tracking-widest">
            <tr>
              <th className="px-3 sm:px-6 py-4">Product</th>
              <th className="px-3 sm:px-6 py-4 hidden md:table-cell">Price</th>
              <th className="px-2 sm:px-6 py-4 text-center">Stock</th>
              <th className="px-2 sm:px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-slate-700">
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-3 sm:px-6 py-4 max-w-[140px] sm:max-w-xs">
                  <div className="flex gap-2 sm:gap-4 items-center">
                    <Image
                      width={48}
                      height={48}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl border border-slate-100 object-cover aspect-square flex-shrink-0"
                      src={product.images[0]}
                      alt=""
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-900 truncate text-xs sm:text-sm">
                        {product.name}
                      </p>
                      <p className="text-[8px] sm:text-[10px] text-indigo-500 font-black uppercase truncate mt-0.5">
                        {product.category}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-3 sm:px-6 py-4 font-bold text-slate-700 hidden md:table-cell">
                  {currency}
                  {product.price.toLocaleString()}
                </td>
                <td className="px-2 sm:px-6 py-4 text-center">
                  <span
                    className={`px-1.5 py-1 sm:px-2 rounded-lg text-[9px] sm:text-[10px] font-black uppercase whitespace-nowrap ${product.stock < 3 ? "bg-rose-50 text-rose-600" : "bg-slate-50 text-slate-500"}`}
                  >
                    {product.stock} {product.stock === 1 ? "unit" : "units"}
                  </span>
                </td>
                <td className="px-2 sm:px-6 py-4">
                  <div className="flex items-center justify-center gap-1 sm:gap-2">
                    <button
                      onClick={() =>
                        setEditModal({
                          isOpen: true,
                          productId: product.id,
                          name: product.name,
                          description: product.description,
                          mrp: product.mrp,
                          price: product.price,
                          stock: product.stock,
                          category: product.category,
                          imagePreviews: product.images || [],
                          newFiles: [],
                        })
                      }
                      className="p-1.5 sm:p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg sm:rounded-xl transition"
                    >
                      <Pencil size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </button>
                    <button
                      onClick={() =>
                        setDeleteModal({ isOpen: true, productId: product.id })
                      }
                      className="p-1.5 sm:p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg sm:rounded-xl transition"
                    >
                      <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DELETE MODAL */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-sm w-full animate-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-800 uppercase">
                Delete Product?
              </h3>
              <p className="text-slate-500 mt-2 text-sm">
                This action is permanent and cannot be undone.
              </p>
            </div>
            <div className="mt-8 flex gap-3">
              <button
                onClick={() =>
                  setDeleteModal({ isOpen: false, productId: null })
                }
                className="flex-1 py-3 font-bold text-slate-400 hover:text-slate-600 transition"
              >
                CANCEL
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-3 font-black text-white bg-rose-500 hover:bg-rose-600 transition rounded-xl"
              >
                DELETE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl max-w-xl w-full overflow-y-auto max-h-[90vh] animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                Update Product
              </h3>
              <button
                onClick={closeEditModal}
                className="text-slate-400 hover:text-slate-600 p-2 bg-slate-50 hover:bg-slate-100 rounded-full transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* 🔥 NEW: IMAGE MANAGEMENT SECTION */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">
                  Product Images
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {/* Existing Images (Hover to delete) */}
                  {editModal.imagePreviews.map((img, idx) => (
                    <div
                      key={`existing-${idx}`}
                      className="relative aspect-square rounded-xl border border-slate-200 overflow-hidden group"
                    >
                      <Image src={img} fill className="object-cover" alt="" />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(idx)}
                        className="absolute top-1 right-1 bg-rose-500/90 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}

                  {/* New Images added right now (Hover to delete) */}
                  {editModal.newFiles.map((file, idx) => (
                    <div
                      key={`new-${idx}`}
                      className="relative aspect-square rounded-xl border-2 border-indigo-400 overflow-hidden group"
                    >
                      <Image
                        src={URL.createObjectURL(file)}
                        fill
                        className="object-cover"
                        alt=""
                      />
                      <div className="absolute inset-0 bg-indigo-500/20 pointer-events-none"></div>
                      <button
                        type="button"
                        onClick={() => removeNewImage(idx)}
                        className="absolute top-1 right-1 bg-rose-500/90 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}

                  {/* Add New Image Button */}
                  <label className="relative aspect-square rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50 transition cursor-pointer">
                    <UploadCloud size={24} className="mb-1" />
                    <span className="text-[10px] font-bold">Add Photo</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageAdd}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                  Name
                </label>
                <input
                  type="text"
                  value={editModal.name}
                  onChange={(e) =>
                    setEditModal({ ...editModal, name: e.target.value })
                  }
                  className="w-full px-5 py-3 border border-slate-200 rounded-2xl bg-slate-50 outline-none focus:border-indigo-400 transition"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editModal.description}
                  onChange={(e) =>
                    setEditModal({ ...editModal, description: e.target.value })
                  }
                  className="w-full px-5 py-3 border border-slate-200 rounded-2xl bg-slate-50 outline-none resize-none focus:border-indigo-400 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                    Price ({currency})
                  </label>
                  <input
                    type="number"
                    value={editModal.price}
                    onChange={(e) =>
                      setEditModal({ ...editModal, price: e.target.value })
                    }
                    className="w-full px-5 py-3 border border-slate-200 rounded-2xl bg-slate-50 outline-none font-bold text-indigo-600 focus:border-indigo-400 transition"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                    Stock
                  </label>
                  <input
                    type="number"
                    value={editModal.stock}
                    onChange={(e) =>
                      setEditModal({ ...editModal, stock: e.target.value })
                    }
                    className="w-full px-5 py-3 border border-slate-200 rounded-2xl bg-slate-50 outline-none font-bold focus:border-indigo-400 transition"
                  />
                </div>
              </div>
            </div>

            <div className="mt-10 flex gap-3 sm:gap-4">
              <button
                type="button"
                onClick={closeEditModal}
                className="flex-1 py-4 text-sm font-bold text-slate-400 hover:text-slate-600 transition"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={confirmEdit}
                className="flex-1 sm:flex-2 py-4 px-6 sm:px-10 text-sm font-black text-white bg-indigo-600 hover:bg-indigo-700 transition rounded-2xl shadow-xl shadow-indigo-200"
              >
                SAVE CHANGES
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
