/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Trash2,
  Download,
  CheckCircle2,
  Circle,
  ChevronDown,
  X,
  Eye,
} from "lucide-react";
import * as XLSX from "xlsx";
import PageHeader from "@/app/components/admin/PageHeader";
import DataTable from "@/app/components/admin/DataTable";

export default function CareersPage() {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [selectedItems, setSelectedItems] = useState([]);

  // Detail Modal state
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState(null);

  // Dropdown & modal state
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [dateModalOpen, setDateModalOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateError, setDateError] = useState("");

  const fetchCareers = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/careers?page=${page}&limit=${pagination.limit}`,
      );
      const data = await res.json();
      if (data.success) {
        setCareers(data.data);
        setPagination(data.pagination);
        setSelectedItems([]);
      }
    } catch (error) {
      console.error("Error fetching careers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCareers(pagination.page);
  }, [pagination.page]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleToggleRead = async (id, currentStatus) => {
    try {
      const res = await fetch(`/api/admin/careers`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isRead: !currentStatus }),
      });
      const data = await res.json();
      if (data.success) fetchCareers(pagination.page);
      else alert("Failed to update status");
    } catch {
      alert("Error updating status");
    }
  };

  const handleSelectAll = (e) => {
    setSelectedItems(e.target.checked ? careers.map((c) => c._id) : []);
  };

  const handleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleBulkDelete = async () => {
    if (
      !confirm(
        `Are you sure you want to delete ${selectedItems.length} applicants?`,
      )
    )
      return;
    try {
      const res = await fetch(`/api/admin/careers`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedItems }),
      });
      const data = await res.json();
      if (data.success) {
        fetchCareers(pagination.page);
        setSelectedItems([]);
      } else alert("Failed to delete applicants");
    } catch {
      alert("Error deleting applicants");
    }
  };

  const handleDownloadResume = (resumeUrl) => {
    if (!resumeUrl) {
      alert("No resume attached for this applicant.");
      return;
    }
    window.open(resumeUrl, "_blank");
  };

  // --- Excel Export Helpers ---
  const formatForExcel = (rows) =>
    rows.map((row) => ({
      "Full Name": row.fullName || "",
      Email: row.email || "",
      "Contact Number": row.contactNumber || "",
      "Applying For": row.applyingFor || "",
      "Resume URL": row.resume || "",
      "LinkedIn URL": row.linkedinURL || "",
      "Why Join Us": row.whyWannaJoin || "",
      Status: row.isRead ? "Viewed" : "New",
      "Date Applied": new Date(row.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    }));

  const downloadExcel = (rows, filename) => {
    const ws = XLSX.utils.json_to_sheet(formatForExcel(rows));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Applicants");
    XLSX.writeFile(wb, filename);
  };

  const handleDownloadAll = async () => {
    setDropdownOpen(false);
    setExportLoading(true);
    try {
      const res = await fetch(`/api/admin/careers?export=true`);
      const data = await res.json();
      if (data.success) downloadExcel(data.data, "all_applicants.xlsx");
      else alert("Failed to fetch all applicants");
    } catch {
      alert("Error exporting applicants");
    } finally {
      setExportLoading(false);
    }
  };

  const handleDownloadSelected = () => {
    const selectedData = careers.filter((c) => selectedItems.includes(c._id));
    downloadExcel(selectedData, "selected_applicants.xlsx");
  };

  const handleDateExport = async () => {
    setDateError("");
    if (!startDate || !endDate) {
      setDateError("Please select both start and end dates.");
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setDateError("Start date cannot be after end date.");
      return;
    }
    setExportLoading(true);
    setDateModalOpen(false);
    setDropdownOpen(false);
    try {
      const res = await fetch(
        `/api/admin/careers?export=true&startDate=${startDate}&endDate=${endDate}`,
      );
      const data = await res.json();
      if (data.success) {
        if (data.data.length === 0) {
          alert("No applicants found for the selected date range.");
        } else {
          downloadExcel(
            data.data,
            `applicants_${startDate}_to_${endDate}.xlsx`,
          );
        }
      } else alert("Failed to fetch applicants for date range");
    } catch {
      alert("Error exporting applicants");
    } finally {
      setExportLoading(false);
      setStartDate("");
      setEndDate("");
    }
  };

  const columns = [
    {
      header: "Applicant",
      accessor: "fullName",
      render: (row) => (
        <div>
          <div className="text-sm font-bold text-gray-900">{row.fullName}</div>
          <div className="text-xs text-brand-primary mt-0.5">{row.email}</div>
        </div>
      ),
    },
    {
      header: "Applying For",
      accessor: "applyingFor",
      render: (row) => (
        <div className="text-sm text-gray-700 font-medium whitespace-nowrap">
          {row.applyingFor || "Not Specified"}
        </div>
      ),
    },
    {
      header: "Contact",
      accessor: "contactNumber",
      render: (row) => (
        <div className="text-sm text-gray-600">
          {row.contactNumber || "N/A"}
        </div>
      ),
    },
    {
      header: "Date Applied",
      render: (row) => (
        <div className="text-sm text-gray-500">
          {new Date(row.createdAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </div>
      ),
    },
    {
      header: "Resume",
      render: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDownloadResume(row.resume);
          }}
          disabled={!row.resume}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold border transition ${
            row.resume
              ? "bg-brand-primary/10 text-brand-primary border-brand-primary/20 hover:bg-brand-primary/20"
              : "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed hidden md:flex"
          }`}
          title={row.resume ? "Download Resume" : "No resume found"}
        >
          <Download size={14} />
          {row.resume ? "Download" : "None"}
        </button>
      ),
    },
    {
      header: "Status",
      render: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleToggleRead(row._id, row.isRead);
          }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm transition-all border-2 ${
            row.isRead
              ? "bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100 opacity-60 hover:opacity-100"
              : "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
          }`}
        >
          {row.isRead ? (
            <>
              <CheckCircle2 size={14} /> Viewed
            </>
          ) : (
            <>
              <Circle size={14} className="fill-red-500/20 text-red-500" /> New
            </>
          )}
        </button>
      ),
    },
    {
      header: "Details",
      render: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedCareer(row);
            setDetailModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold border transition bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
          title="View Full Application"
        >
          <Eye size={14} /> View
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto w-full">
      <PageHeader
        title="Careers Submissions"
        actions={
          <div className="flex items-center gap-2">
            {selectedItems.length > 0 && (
              <>
                <button
                  onClick={handleDownloadSelected}
                  className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-sm font-medium text-green-700 hover:bg-green-100 transition shadow-sm uppercase"
                >
                  <Download size={16} />
                  Export Selected ({selectedItems.length})
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-100 transition shadow-sm uppercase"
                >
                  <Trash2 size={16} />
                  Delete ({selectedItems.length})
                </button>
              </>
            )}

            {/* Export dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                disabled={exportLoading}
                className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700 hover:bg-blue-100 transition shadow-sm uppercase disabled:opacity-60"
              >
                <Download size={16} />
                {exportLoading ? "Exporting..." : "Export"}
                <ChevronDown
                  size={14}
                  className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                  <button
                    onClick={handleDownloadAll}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition"
                  >
                    <Download size={14} />
                    Export All Applicants
                  </button>
                  <div className="border-t border-gray-100" />
                  <button
                    onClick={() => {
                      setDateModalOpen(true);
                      setDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition"
                  >
                    <Download size={14} />
                    Export by Date Range
                  </button>
                </div>
              )}
            </div>
          </div>
        }
      />

      <DataTable
        columns={columns}
        data={careers}
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

      {/* Date Range Modal */}
      {dateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900">
                Export by Date Range
              </h2>
              <button
                onClick={() => {
                  setDateModalOpen(false);
                  setDateError("");
                  setStartDate("");
                  setEndDate("");
                }}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              {dateError && <p className="text-xs text-red-500">{dateError}</p>}
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => {
                  setDateModalOpen(false);
                  setDateError("");
                  setStartDate("");
                  setEndDate("");
                }}
                className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDateExport}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailModalOpen && selectedCareer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6 space-y-5 my-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                Applicant Details
              </h2>
              <button
                onClick={() => {
                  setDetailModalOpen(false);
                  setSelectedCareer(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <p className="text-sm font-medium text-gray-900">{selectedCareer.fullName}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Email
                  </label>
                  <a href={`mailto:${selectedCareer.email}`} className="text-sm text-blue-600 hover:underline break-all">
                    {selectedCareer.email}
                  </a>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Contact Number
                  </label>
                  <p className="text-sm text-gray-900">{selectedCareer.contactNumber || "N/A"}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Applying For
                  </label>
                  <p className="text-sm text-gray-900">{selectedCareer.applyingFor || "Not Specified"}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    LinkedIn URL
                  </label>
                  {selectedCareer.linkedinURL ? (
                    <a href={selectedCareer.linkedinURL} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline break-all">
                      View Profile
                    </a>
                  ) : (
                    <p className="text-sm text-gray-500">Not Provided</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Why do you want to join Spring House?
                </label>
                <div className="text-sm text-gray-700 bg-gray-50 rounded-lg p-4 whitespace-pre-wrap border border-gray-100 min-h-[80px]">
                  {selectedCareer.whyWannaJoin || "Not Provided"}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setDetailModalOpen(false);
                  setSelectedCareer(null);
                }}
                className="w-full rounded-lg bg-gray-100 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
