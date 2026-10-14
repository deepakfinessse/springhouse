/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  MoreHorizontal,
  Pencil,
  UploadCloud,
  X,
} from "lucide-react";
import PageHeader from "@/app/components/admin/PageHeader";
import DataTable from "@/app/components/admin/DataTable";
import Modal from "@/app/components/admin/Modal";

export default function AmenitiesPage() {
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [newName, setNewName] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [creating, setCreating] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null);

  // Edit State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState(null);
  const [editImage, setEditImage] = useState(null); // File object
  const [editImagePreview, setEditImagePreview] = useState(null); // URL
  const [updating, setUpdating] = useState(false);

  // Fetch Data
  const fetchAmenities = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/amenities?page=${page}&limit=${pagination.limit}`,
      );
      const data = await res.json();
      if (data.success) {
        setAmenities(data.data);
        setPagination((prev) => ({ ...data.pagination, page }));
      }
    } catch (error) {
      console.error("Error fetching amenities:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmenities();
  }, []);

  // --- ACTIONS ---

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setCreating(true);

    const formData = new FormData();
    formData.append("name", newName);
    if (newImage) formData.append("image", newImage);

    try {
      const res = await fetch("/api/admin/amenities", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setNewName("");
        setNewImage(null);
        setImagePreview(null);
        fetchAmenities();
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert("Failed to create amenity");
    } finally {
      setCreating(false);
    }
  };

  const deleteAmenities = async (ids) => {
    if (!confirm(`Delete ${ids.length} amenities?`)) return;
    try {
      const res = await fetch("/api/admin/amenities", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      if (res.ok) {
        fetchAmenities();
        setSelectedItems([]);
      }
    } catch (error) {
      alert("Failed to delete");
    }
  };

  // --- EDIT ACTIONS ---

  const openEditModal = (amenity) => {
    setEditingAmenity(amenity);
    setEditImagePreview(amenity.featuredIcon || null);
    setEditImage(null);
    setIsEditOpen(true);
    setActiveMenu(null);
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditImage(file);
      setEditImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    if (!editingAmenity || !editingAmenity.name.trim()) return;
    setUpdating(true);

    const formData = new FormData();
    formData.append("name", editingAmenity.name);
    if (editImage) formData.append("image", editImage);

    try {
      const res = await fetch(`/api/admin/amenities/${editingAmenity._id}`, {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        fetchAmenities();
        setIsEditOpen(false);
        setEditingAmenity(null);
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert("Failed to update amenity");
    } finally {
      setUpdating(false);
    }
  };

  // --- MENU ---
  const toggleMenu = (id) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  useEffect(() => {
    const handleClickOutside = () => setActiveMenu(null);
    if (activeMenu) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [activeMenu]);

  // --- COLUMNS ---
  const columns = [
    {
      header: "Icon",
      render: (r) => (
        <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100">
          {r.featuredIcon ? (
            <img
              src={r.featuredIcon}
              alt={r.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-xs text-gray-400">N/A</span>
          )}
        </div>
      ),
    },
    {
      header: "Amenity",
      accessor: "name",
      render: (r) => (
        <span className="font-medium text-gray-900">{r.name}</span>
      ),
    },
    {
      header: "No. Properties with this Amenity",
      accessor: "propertyCount",
      render: (r) => (
        <span className="text-gray-600 font-mono">{r.propertyCount}</span>
      ),
    },
    {
      header: "",
      className: "text-right",
      render: (row) => (
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleMenu(row._id);
            }}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
          >
            <MoreHorizontal size={18} />
          </button>
          {activeMenu === row._id && (
            <div className="absolute right-8 top-0 z-20 w-40 origin-top-right rounded-lg bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none py-1 border border-gray-100">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openEditModal(row);
                }}
                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Pencil className="mr-2 h-3.5 w-3.5 text-gray-400" />
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteAmenities([row._id]);
                }}
                className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-12 max-w-[1440px] mx-auto w-full">
      {/* <PageHeader title="Amenities" /> */}

      <section className="space-y-6">
        <h2 className="text-lg font-heading font-bold text-gray-800">
          Add Amenities
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Add Form */}
          <div className="space-y-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            {/* Image Upload Box */}
            <label className="flex w-full h-48 rounded-xl border-2 border-dashed border-gray-300 bg-teal-50/50 hover:bg-teal-50 transition-colors cursor-pointer flex-col items-center justify-center relative overflow-hidden group">
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-sm font-medium">
                      Change Image
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <UploadCloud size={32} className="text-brand-primary mb-2" />
                  <span className="text-sm font-medium text-gray-600">
                    Upload Image
                  </span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>

            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Amenity Name"
                className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-brand-primary focus:ring-brand-primary"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
			</div>
			<div className="flex gap-4">
              <button
                onClick={handleCreate}
                disabled={creating || !newName}
                className="flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-teal-600 disabled:opacity-50 transition shadow-sm uppercase whitespace-nowrap"
              >
                <Plus size={16} /> Add Amenity
              </button>
            </div>
          </div>

          {/* List Table */}
          <div className="lg:col-span-2 mt-[-50px]">
            {" "}
            {/* Adjusted margin as per user preference on prev page */}
            <div
              className={`mb-4 flex justify-end ${selectedItems.length === 0 ? "invisible" : ""}`}
            >
              <button
                onClick={() => deleteAmenities(selectedItems)}
                className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-100 transition shadow-sm uppercase"
              >
                <Trash2 size={14} />
                Delete Selected ({selectedItems.length})
              </button>
            </div>
            <DataTable
              columns={columns}
              data={amenities}
              loading={loading}
              pagination={pagination}
              onPageChange={(page) => fetchAmenities(page)}
              selection={{
                selectedItems: selectedItems,
                onSelectAll: (e) =>
                  setSelectedItems(
                    e.target.checked ? amenities.map((a) => a._id) : [],
                  ),
                onSelectItem: (id) =>
                  setSelectedItems((prev) =>
                    prev.includes(id)
                      ? prev.filter((i) => i !== id)
                      : [...prev, id],
                  ),
              }}
            />
          </div>
        </div>
      </section>

      {/* EDIT MODAL */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Amenity"
      >
        <div className="space-y-5">
          {/* Edit Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Featured Image
            </label>
            <label className="w-full h-40 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer flex flex-col items-center justify-center relative overflow-hidden group">
              {editImagePreview ? (
                <>
                  <img
                    src={editImagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-sm font-medium">
                      Change Image
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center">
                  <UploadCloud size={24} className="text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">
                    Upload New Image
                  </span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleEditImageChange}
              />
            </label>
          </div>

          {/* Edit Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amenity Name
            </label>
            <input
              type="text"
              value={editingAmenity?.name || ""}
              onChange={(e) =>
                setEditingAmenity((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-brand-primary focus:ring-brand-primary"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setIsEditOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={updating}
              className="px-4 py-2 text-sm font-medium text-white bg-brand-primary hover:bg-teal-600 rounded-lg transition-colors disabled:opacity-50"
            >
              {updating ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
