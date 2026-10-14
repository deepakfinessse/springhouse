/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Eye, Pencil, Trash2, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import PageHeader from "@/app/components/admin/PageHeader";
import DataTable from "@/app/components/admin/DataTable";

export default function PRsPage() {
  const router = useRouter();
  const [prs, setPrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Action Menu State
  const [activeMenu, setActiveMenu] = useState(null);

  // Selection State
  const [selectedItems, setSelectedItems] = useState([]);

  const fetchPRs = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/prs?page=${page}&limit=${pagination.limit}`,
      );
      const data = await res.json();
      if (data.success) {
        setPrs(data.data);
        setPagination(data.pagination);
        setSelectedItems([]); // Reset selection on page change
      }
    } catch (error) {
      console.error("Error fetching PRs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPRs(pagination.page);
  }, [pagination.page]);

  // Toggle Menu
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

  // Selection Logic
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(prs.map((p) => p._id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  // Delete Logic
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this PR?")) return;

    try {
      const res = await fetch(`/api/admin/prs/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        fetchPRs(pagination.page);
      } else {
        alert("Failed to delete PR");
      }
    } catch (error) {
      alert("Error deleting PR");
    }
  };

  const handleBulkDelete = async () => {
    if (
      !confirm(`Are you sure you want to delete ${selectedItems.length} PRs?`)
    )
      return;

    try {
      const res = await fetch(`/api/admin/prs`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedItems }),
      });
      const data = await res.json();
      if (data.success) {
        fetchPRs(pagination.page);
        setSelectedItems([]);
      } else {
        alert("Failed to delete PRs");
      }
    } catch (error) {
      alert("Error deleting PRs");
    }
  };

  const columns = [
    {
      header: "Title",
      accessor: "title",
      render: (row) => (
        <div>
          <div className="text-sm font-bold text-gray-900 line-clamp-1">
            {row.title}
          </div>
          {row.link && (
            <div className="text-xs text-brand-primary mt-0.5 line-clamp-1">
              <a href={row.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {row.link}
              </a>
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Date",
      render: (row) => (
        <div className="text-sm text-gray-500">
          {new Date(row.publishDate || row.createdAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </div>
      ),
    },
    {
      header: "Status",
      render: (row) => (
        <span
          className={`inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-full border ${
            row.isActive
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-yellow-50 text-yellow-700 border-yellow-200"
          }`}
        >
          {row.isActive ? "Published" : "Draft"}
        </span>
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
                  router.push(`/admin/prs/edit/${row._id}`);
                }}
                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 group transition-colors"
              >
                <Pencil className="mr-3 h-3.5 w-3.5 text-gray-400 group-hover:text-brand-primary" />
                Edit
              </button>
              {row.link && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(row.link, "_blank");
                  }}
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 group transition-colors"
                >
                  <Eye className="mr-3 h-3.5 w-3.5 text-gray-400 group-hover:text-brand-primary" />
                  View Link
                </button>
              )}
              <div className="h-px bg-gray-100 my-1"></div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(row._id);
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
        title="Public Relations (PR)"
        actions={
          <>
            {selectedItems.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-100 transition shadow-sm uppercase"
              >
                <Trash2 size={16} />
                Delete ({selectedItems.length})
              </button>
            )}

            <Link href="/admin/prs/add">
              <button className="flex items-center gap-2 rounded-lg bg-brand-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-600 transition shadow-sm uppercase">
                <Plus size={16} />
                Add PR
              </button>
            </Link>
          </>
        }
      />

      <DataTable
        columns={columns}
        data={prs}
        loading={loading}
        pagination={pagination}
        onPageChange={(newPage) =>
          setPagination((prev) => ({ ...prev, page: newPage }))
        }
        selection={{
          selectedItems,
          onSelectAll: handleSelectAll,
          onSelectItem: handleSelectItem,
        }}
      />
    </div>
  );
}
