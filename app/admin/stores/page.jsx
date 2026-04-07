// "use client";
// import StoreInfo from "@/components/admin/StoreInfo";
// import Loading from "@/components/Loading";
// import { useAuth, useUser } from "@clerk/nextjs";
// import axios from "axios";
// import { useEffect, useState, useCallback } from "react";
// import toast from "react-hot-toast";

// // 🔥 Ensure there is exactly ONE "export default"
// export default function AdminStores() {
//   const { user } = useUser();
//   const { getToken } = useAuth();

//   const [stores, setStores] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Memoized fetch function
//   const fetchStores = useCallback(async () => {
//     try {
//       const token = await getToken();
//       const { data } = await axios.get("/api/admin/stores", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setStores(data.stores || []);
//     } catch (error) {
//       console.error("Fetch Error:", error);
//       toast.error(error?.response?.data?.error || "Failed to load stores");
//     } finally {
//       setLoading(false);
//     }
//   }, [getToken]);

//   const toggleIsActive = async (storeId) => {
//     try {
//       const token = await getToken();
//       const { data } = await axios.post(
//         "/api/admin/toggle-store",
//         { storeId },
//         { headers: { Authorization: `Bearer ${token}` } },
//       );
//       await fetchStores();
//       toast.success(data.message || "Status updated");
//     } catch (error) {
//       toast.error(error?.response?.data?.error || "Update failed");
//     }
//   };

//   useEffect(() => {
//     if (user) {
//       fetchStores();
//     }
//   }, [user, fetchStores]);

//   if (loading) return <Loading />;

//   return (
//     <div className="text-slate-500 mb-28 p-4">
//       <h1 className="text-2xl">
//         Live <span className="text-slate-800 font-medium">Stores</span>
//       </h1>

//       {stores.length > 0 ? (
//         <div className="flex flex-col gap-4 mt-4">
//           {stores.map((store) => (
//             <div
//               key={store.id}
//               className={`bg-white border ${store.status === "blocked" ? "border-red-200 bg-red-50/20" : "border-slate-200"} rounded-lg shadow-sm p-6 flex max-md:flex-col gap-4 md:items-end justify-between max-w-4xl transition-all`}
//             >
//               <StoreInfo store={store} />

//               <div className="flex items-center gap-3 pt-2">
//                 <p className="text-sm font-bold text-slate-600">
//                   {store.status === "blocked" ? "BANNED" : "Active"}
//                 </p>
//                 <label className="relative inline-flex items-center cursor-pointer">
//                   <input
//                     type="checkbox"
//                     className="sr-only peer"
//                     onChange={() =>
//                       toast.promise(toggleIsActive(store.id), {
//                         loading: "Updating...",
//                         success: "Done!",
//                         error: "Error updating",
//                       })
//                     }
//                     checked={store.isActive}
//                     disabled={store.status === "blocked"}
//                   />
//                   <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:bg-indigo-600 transition-colors duration-200 peer-disabled:opacity-40"></div>
//                   <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4 shadow-sm"></span>
//                 </label>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="flex flex-col items-center justify-center h-80 border-2 border-dashed border-slate-200 rounded-2xl mt-6">
//           <h1 className="text-2xl text-slate-400 font-medium italic">
//             No stores available
//           </h1>
//           <button
//             onClick={fetchStores}
//             className="mt-4 text-indigo-600 font-bold hover:underline"
//           >
//             Refresh Database
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }
"use client";
import StoreInfo from "@/components/admin/StoreInfo";
import Loading from "@/components/Loading";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react"; // 🔥 Imported Danger Icons

export default function AdminStores() {
  const { user } = useUser();
  const { getToken } = useAuth();

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Modal & Delete States
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    storeId: null,
  });
  const [deleting, setDeleting] = useState(false);

  // Memoized fetch function
  const fetchStores = useCallback(async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/admin/stores", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStores(data.stores || []);
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error(error?.response?.data?.error || "Failed to load stores");
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  const toggleIsActive = async (storeId) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        "/api/admin/toggle-store",
        { storeId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      await fetchStores();
      toast.success(data.message || "Status updated");
    } catch (error) {
      toast.error(error?.response?.data?.error || "Update failed");
    }
  };

  // 🔥 Handle Admin Delete Store
  const confirmDeleteStore = async () => {
    setDeleting(true);
    try {
      const token = await getToken();
      // Using query params to pass the ID to your DELETE route
      await toast.promise(
        axios.delete(`/api/admin/stores?id=${deleteModal.storeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        {
          loading: "Erasing store from database...",
          success: "Store permanently deleted!",
          error: "Failed to delete store.",
        },
      );

      setDeleteModal({ isOpen: false, storeId: null });
      fetchStores(); // Refresh the list
    } catch (error) {
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchStores();
    }
  }, [user, fetchStores]);

  if (loading) return <Loading />;

  return (
    <div className="text-slate-500 mb-28 p-4">
      <h1 className="text-2xl">
        Live <span className="text-slate-800 font-medium">Stores</span>
      </h1>

      {stores.length > 0 ? (
        <div className="flex flex-col gap-4 mt-4">
          {stores.map((store) => (
            <div
              key={store.id}
              className={`bg-white border ${store.status === "blocked" ? "border-red-200 bg-red-50/20" : "border-slate-200"} rounded-lg shadow-sm p-6 flex max-md:flex-col gap-4 md:items-end justify-between max-w-4xl transition-all hover:shadow-md`}
            >
              <StoreInfo store={store} />

              <div className="flex items-center gap-3 pt-2">
                <p className="text-sm font-bold text-slate-600">
                  {store.status === "blocked" ? "BANNED" : "Active"}
                </p>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    onChange={() =>
                      toast.promise(toggleIsActive(store.id), {
                        loading: "Updating...",
                        success: "Done!",
                        error: "Error updating",
                      })
                    }
                    checked={store.isActive}
                    disabled={store.status === "blocked"}
                  />
                  <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:bg-indigo-600 transition-colors duration-200 peer-disabled:opacity-40"></div>
                  <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4 shadow-sm"></span>
                </label>
                {/* 🔥 ADMIN DELETE BUTTON */}
                <div className="w-px h-6 bg-slate-200 mx-1"></div>{" "}
                {/* Divider line */}
                <button
                  onClick={() =>
                    setDeleteModal({ isOpen: true, storeId: store.id })
                  }
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all group"
                  title="Delete Store Permanently"
                >
                  <Trash2
                    size={18}
                    className="group-hover:scale-110 transition-transform"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-80 border-2 border-dashed border-slate-200 rounded-2xl mt-6 bg-slate-50">
          <h1 className="text-2xl text-slate-400 font-medium italic">
            No stores available
          </h1>
          <button
            onClick={fetchStores}
            className="mt-4 text-indigo-600 font-bold hover:underline"
          >
            Refresh Database
          </button>
        </div>
      )}

      {/* 🔥 DELETE CONFIRMATION MODAL */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-sm w-full animate-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-4 border border-rose-100 shadow-inner">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                Erase Store?
              </h3>
              <p className="text-slate-500 mt-2 text-sm font-medium leading-relaxed">
                As an Admin, this action is absolute. The store and all
                associated products will be permanently destroyed.
              </p>
            </div>
            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteModal({ isOpen: false, storeId: null })}
                className="flex-1 py-3.5 font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={confirmDeleteStore}
                disabled={deleting}
                className="flex-1 py-3.5 font-black text-white bg-rose-600 hover:bg-rose-700 transition rounded-xl shadow-lg shadow-rose-200 flex justify-center items-center"
              >
                {deleting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  "NUKE IT"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
