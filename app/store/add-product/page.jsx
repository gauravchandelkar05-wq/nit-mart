"use client";

import { assets } from "@/assets/assets";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function StoreAddProduct() {
  const categories = [
    "Books & Study Material",
    "Electronics & Gadgets",
    "Dorm & Hostel Essentials",
    "Stationery & Art Supplies",
    "Project & Lab Kits",
    "Clothing & Uniforms",
    "Sports & Fitness",
    "Bicycles & Transport",
    "Events & Tickets",
    "Others",
  ];

  const [images, setImages] = useState({ 1: null, 2: null, 3: null, 4: null });
  const [productInfo, setProductInfo] = useState({
    name: "",
    description: "",
    mrp: 0,
    price: 0,
    category: "",
    stock: 1,
  });
  const [loading, setLoading] = useState(false);

  const { getToken } = useAuth();

  const onChangeHandler = (e) => {
    setProductInfo({ ...productInfo, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (key, file) => {
    if (file) {
      setImages((prev) => ({ ...prev, [key]: file }));
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (!images[1] && !images[2] && !images[3] && !images[4]) {
        return toast.error("Please upload at least one image");
      }
      setLoading(true);

      const formData = new FormData();
      formData.append("name", productInfo.name);
      formData.append("description", productInfo.description);
      formData.append("mrp", productInfo.mrp);
      formData.append("price", productInfo.price);
      formData.append("category", productInfo.category);
      formData.append("stock", productInfo.stock);

      Object.keys(images).forEach((key) => {
        images[key] && formData.append("images", images[key]);
      });

      const token = await getToken();
      const { data } = await axios.post("/api/store/product", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(data.message);

      // Reset form
      setProductInfo({
        name: "",
        description: "",
        mrp: 0,
        price: 0,
        category: "",
        stock: 1,
      });
      setImages({ 1: null, 2: null, 3: null, 4: null });
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={(e) =>
        toast.promise(onSubmitHandler(e), { loading: "Adding Product..." })
      }
      className="text-slate-500 mb-28"
    >
      <h1 className="text-2xl">
        Add New <span className="text-slate-800 font-medium">Products</span>
      </h1>

      <p className="mt-7 font-medium text-slate-700">Product Images</p>

      <div className="flex gap-3 mt-4">
        {Object.keys(images).map((key) => (
          <label key={key} htmlFor={`images${key}`}>
            <Image
              width={300}
              height={300}
              className="h-20 w-auto border border-slate-200 rounded-md cursor-pointer hover:border-indigo-300 transition-all object-cover"
              src={
                images[key]
                  ? URL.createObjectURL(images[key])
                  : assets.upload_area
              }
              alt="Upload placeholder"
            />
            <input
              type="file"
              id={`images${key}`}
              onChange={(e) => handleImageUpload(key, e.target.files[0])}
              hidden
            />
          </label>
        ))}
      </div>

      <div className="flex flex-col gap-2 mt-6">
        <p>Product Name</p>
        <input
          type="text"
          name="name"
          onChange={onChangeHandler}
          value={productInfo.name}
          placeholder="e.g. C++ Programming Textbook"
          className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded focus:border-indigo-500"
          required
        />
      </div>

      <div className="flex flex-col gap-2 mt-6">
        <p>Description</p>
        <textarea
          name="description"
          onChange={onChangeHandler}
          value={productInfo.description}
          placeholder="Describe the condition, edition, etc."
          rows={4}
          className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded resize-none focus:border-indigo-500"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-sm sm:max-w-xl mt-6">
        <label className="flex flex-col gap-2">
          Actual Price (₹)
          <input
            type="number"
            name="mrp"
            onChange={onChangeHandler}
            value={productInfo.mrp}
            className="w-full p-2 px-4 border border-slate-200 rounded"
            required
          />
        </label>
        <label className="flex flex-col gap-2">
          Offer Price (₹)
          <input
            type="number"
            name="price"
            onChange={onChangeHandler}
            value={productInfo.price}
            className="w-full p-2 px-4 border border-slate-200 rounded font-semibold text-slate-800"
            required
          />
        </label>
        <label className="flex flex-col gap-2">
          Quantity
          <input
            type="number"
            name="stock"
            onChange={onChangeHandler}
            value={productInfo.stock}
            className="w-full p-2 px-4 border border-slate-200 rounded"
            required
          />
        </label>
      </div>

      <div className="flex flex-col gap-2 mt-6">
        <p>Category</p>
        <select
          onChange={(e) =>
            setProductInfo({ ...productInfo, category: e.target.value })
          }
          value={productInfo.category}
          className="w-full max-w-sm p-2 px-4 border border-slate-200 rounded bg-white"
          required
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <button
        disabled={loading}
        className="bg-slate-800 text-white px-10 mt-8 py-3 hover:bg-slate-900 rounded-md transition-all disabled:bg-slate-400"
      >
        {loading ? "Adding..." : "Add Product"}
      </button>
    </form>
  );
}
