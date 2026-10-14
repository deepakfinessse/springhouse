/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
import { Plus, Trash2, MoreHorizontal, Pencil } from "lucide-react";
import PageHeader from "@/app/components/admin/PageHeader";
import DataTable from "@/app/components/admin/DataTable";
import Modal from "@/app/components/admin/Modal";

export default function AreasPage() {
  // Cities State (Needed for Dropdown)
  const [cities, setCities] = useState([]);

  // Areas State
  const [areas, setAreas] = useState([]);
  const [loadingAreas, setLoadingAreas] = useState(true);
  const [newAreaName, setNewAreaName] = useState("");
  const [newAreaCity, setNewAreaCity] = useState("");
  const [creatingArea, setCreatingArea] = useState(false);
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [areaPagination, setAreaPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Edit Area State
  const [isEditAreaOpen, setIsEditAreaOpen] = useState(false);
  const [editingArea, setEditingArea] = useState(null);
  const [updatingArea, setUpdatingArea] = useState(false);

  // Action Menu State
  const [activeMenu, setActiveMenu] = useState(null);

  // Fetch Data
  const fetchCities = async () => {
    try {
      // Fetch all cities for dropdown (limit 100 for now or implement search)
      const res = await fetch(`/api/admin/cities?page=1&limit=100`);
      const data = await res.json();
      if (data.success) {
        setCities(data.data);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const fetchAreas = async (page = 1) => {
    setLoadingAreas(true);
    try {
      const res = await fetch(
        `/api/admin/areas?page=${page}&limit=${areaPagination.limit}`,
      );
      const data = await res.json();
      if (data.success) {
        setAreas(data.data);
        setAreaPagination((prev) => ({ ...data.pagination, page }));
      }
    } catch (error) {
      console.error("Error fetching areas:", error);
    } finally {
      setLoadingAreas(false);
    }
  };

  useEffect(() => {
    fetchCities();
    fetchAreas();
  }, []);

  // --- MENU ACTIONS ---
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

  // --- AREA ACTIONS ---

  const handleCreateArea = async () => {
    if (!newAreaName.trim() || !newAreaCity) return;
    setCreatingArea(true);
    try {
      const res = await fetch("/api/admin/areas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newAreaName, city: newAreaCity }),
      });
      const data = await res.json();
      if (data.success) {
        setNewAreaName("");
        setNewAreaCity("");
        fetchAreas();
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert("Failed to create area");
    } finally {
      setCreatingArea(false);
    }
  };

  const handleUpdateArea = async () => {
    if (!editingArea || !editingArea.name.trim() || !editingArea.city) return;
    setUpdatingArea(true);
    try {
      const res = await fetch(`/api/admin/areas/${editingArea._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editingArea.name,
          city: editingArea.city,
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchAreas();
        setIsEditAreaOpen(false);
        setEditingArea(null);
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert("Failed to update area");
    } finally {
      setUpdatingArea(false);
    }
  };

  const deleteAreas = async (ids) => {
    if (!confirm(`Delete ${ids.length} areas?`)) return;
    try {
      const res = await fetch("/api/admin/areas", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      if (res.ok) {
        fetchAreas();
        setSelectedAreas([]);
      }
    } catch (error) {
      alert("Failed to delete");
    }
  };

  const openEditAreaModal = (area) => {
    setEditingArea({
      _id: area._id,
      name: area.name,
      city: area.cityId || "", // Fallback
    });
    setIsEditAreaOpen(true);
    setActiveMenu(null);
  };

  // --- COLUMNS ---

  const areaColumns = [
    {
      header: "Area",
      accessor: "name",
      render: (r) => (
        <span className="font-medium text-gray-900">{r.name}</span>
      ),
    },
    {
      header: "City",
      accessor: "cityName",
      render: (r) => <span className="text-gray-600">{r.cityName}</span>,
    },
    {
      header: "No. Properties",
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
                  openEditAreaModal(row);
                }}
                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Pencil className="mr-2 h-3.5 w-3.5 text-gray-400" />
                Edit Area
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteAreas([row._id]);
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
      <PageHeader title="Areas" /> 

      {/* AREAS SECTION */}
      <section className="space-y-6">
        {/* <h2 className="text-lg font-heading font-bold text-gray-800">
          Add Area
        </h2> */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Add Area Form */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <select
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-brand-primary focus:ring-brand-primary bg-white"
              value={newAreaCity}
              onChange={(e) => setNewAreaCity(e.target.value)}
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city._id} value={city._id}>
                  {city.name}
                </option>
              ))}
            </select>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Area Name"
                className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-brand-primary focus:ring-brand-primary"
                value={newAreaName}
                onChange={(e) => setNewAreaName(e.target.value)}
              />
			</div>
			  <div className="flex gap-4">
              <button
                onClick={handleCreateArea}
                disabled={creatingArea || !newAreaName || !newAreaCity}
                className="flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-teal-600 disabled:opacity-50 transition shadow-sm uppercase whitespace-nowrap"
              >
                <Plus size={16} /> Add Area
              </button>
            </div>
          </div>

          {/* Areas Table */}
          <div className="lg:col-span-2 mt-[-50px]">
            <div
              className={`mb-4  flex justify-end ${selectedAreas.length === 0 ? "invisible" : ""}`}
            >
              <button
                onClick={() => deleteAreas(selectedAreas)}
                className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-100 transition shadow-sm uppercase"
              >
                <Trash2 size={14} />
                Delete Selected ({selectedAreas.length})
              </button>
            </div>
            <DataTable
              columns={areaColumns}
              data={areas}
              loading={loadingAreas}
              pagination={areaPagination}
              onPageChange={(page) => fetchAreas(page)}
              selection={{
                selectedItems: selectedAreas,
                onSelectAll: (e) =>
                  setSelectedAreas(
                    e.target.checked ? areas.map((a) => a._id) : [],
                  ),
                onSelectItem: (id) =>
                  setSelectedAreas((prev) =>
                    prev.includes(id)
                      ? prev.filter((i) => i !== id)
                      : [...prev, id],
                  ),
              }}
            />
          </div>
        </div>
      </section>

      {/* MODALS */}
      <Modal
        isOpen={isEditAreaOpen}
        onClose={() => setIsEditAreaOpen(false)}
        title="Edit Area"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <select
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-brand-primary focus:ring-brand-primary bg-white"
              value={editingArea?.city || ""}
              onChange={(e) =>
                setEditingArea((prev) => ({ ...prev, city: e.target.value }))
              }
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city._id} value={city._id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Area Name
            </label>
            <input
              type="text"
              value={editingArea?.name || ""}
              onChange={(e) =>
                setEditingArea((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-brand-primary focus:ring-brand-primary"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setIsEditAreaOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateArea}
              disabled={updatingArea}
              className="px-4 py-2 text-sm font-medium text-white bg-brand-primary hover:bg-teal-600 rounded-lg transition-colors disabled:opacity-50"
            >
              {updatingArea ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
