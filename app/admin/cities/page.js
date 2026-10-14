/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Trash2, MoreHorizontal, Pencil, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import PageHeader from "@/app/components/admin/PageHeader";
import DataTable from "@/app/components/admin/DataTable";

export default function CitiesPage() {
  const router = useRouter();
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCities, setSelectedCities] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Action Menu State
  const [activeMenu, setActiveMenu] = useState(null);

  // Fetch Data
  const fetchCities = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/cities?page=${page}&limit=${pagination.limit}`,
      );
      const data = await res.json();
      if (data.success) {
        setCities(data.data);
        setPagination({ ...data.pagination, page });
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, [pagination.page]); // Refetch on page change

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

  const deleteCities = async (ids) => {
    if (
      !confirm(
        `Delete ${ids.length} cities? This will also delete associated areas.`,
      )
    )
      return;
    try {
      const res = await fetch("/api/admin/cities", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      if (res.ok) {
        fetchCities(pagination.page);
        setSelectedCities([]);
      } else {
        alert("Failed to delete");
      }
    } catch (error) {
      alert("Error deleting cities");
    }
  };

  const deleteSingleCity = async (id) => {
    if (!confirm("Are you sure you want to delete this city?")) return;
    try {
      const res = await fetch(`/api/admin/cities/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchCities(pagination.page);
      } else {
        alert("Failed to delete");
      }
    } catch (error) {
      alert("Error deleting city");
    }
  };

  // --- COLUMNS ---

  const columns = [
    {
      header: "City",
      accessor: "name",
      render: (r) => (
        <span className="font-medium text-gray-900">{r.name}</span>
      ),
    },
    {
      header: "No. of Areas",
      accessor: "areaCount",
      render: (r) => (
        <span className="text-gray-600 font-mono">{r.areaCount}</span>
      ),
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
                  router.push(`/admin/cities/edit/${row._id}`);
                }}
                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 group transition-colors"
              >
                <Pencil className="mr-3 h-3.5 w-3.5 text-gray-400 group-hover:text-brand-primary" />
                Edit
              </button>
              <div className="h-px bg-gray-100 my-1"></div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSingleCity(row._id);
                }}
                className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="mr-3 h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto w-full">
      <PageHeader
        title="Cities"
        actions={
          <>
            {selectedCities.length > 0 && (
              <button
                onClick={() => deleteCities(selectedCities)}
                className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-100 transition shadow-sm uppercase"
              >
                <Trash2 size={16} />
                Delete ({selectedCities.length})
              </button>
            )}
            <Link href="/admin/cities/add">
              <button className="flex items-center gap-2 rounded-lg bg-brand-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-600 transition shadow-sm uppercase">
                <Plus size={16} />
                Add New City
              </button>
            </Link>
          </>
        }
      />

      <DataTable
        columns={columns}
        data={cities}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
        selection={{
          selectedItems: selectedCities,
          onSelectAll: (e) =>
            setSelectedCities(e.target.checked ? cities.map((c) => c._id) : []),
          onSelectItem: (id) =>
            setSelectedCities((prev) =>
              prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
            ),
        }}
      />
    </div>
  );
}
