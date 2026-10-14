"use client";
import React, { useState, useEffect } from "react";
import { Loader2, Save, Plus, Trash2, GripVertical } from "lucide-react";
import PageHeader from "@/app/components/admin/PageHeader";
import {
  FormInput,
  SingleImageUploader,
} from "@/app/components/admin/FormElements";

// Specialized Editor for the Header Menu (which includes a Root URL and Title)
const MenuBlockEditor = ({
  items,
  onAddBlock,
  onRemoveBlock,
  onUpdateBlock,
  onAddLink,
  onRemoveLink,
  onUpdateLink,
}) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center bg-gray-50 p-4 border border-gray-200 rounded-lg">
      <div>
        <h2 className="text-base font-bold text-gray-800">Navigation Menus</h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage your top-level navigation links and their dropdown sub-menus
          here.
        </p>
      </div>
      <button
        type="button"
        onClick={onAddBlock}
        className="flex items-center gap-1.5 text-sm font-medium text-brand-primary bg-white px-4 py-2 border border-brand-primary/20 rounded-md hover:bg-brand-primary/5 transition"
      >
        <Plus size={16} /> Add Menu Button
      </button>
    </div>

    <div className="grid grid-cols-1 gap-6">
      {items.map((block, blockIdx) => (
        <div
          key={blockIdx}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-5"
        >
          <div className="flex justify-between items-start mb-4 gap-4">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Menu Label"
                value={block.title}
                onChange={(e) =>
                  onUpdateBlock(blockIdx, "title", e.target.value)
                }
                placeholder="e.g. Services or About Us"
                required
              />
              <FormInput
                label="Direct Link (Optional)"
                value={block.url || ""}
                onChange={(e) => onUpdateBlock(blockIdx, "url", e.target.value)}
                placeholder="e.g. /services"
              />
            </div>
            <button
              type="button"
              onClick={() => onRemoveBlock(blockIdx)}
              className="mt-7 p-2 text-red-500 hover:bg-red-50 rounded-lg transition shrink-0"
              title="Remove Menu"
            >
              <Trash2 size={18} />
            </button>
          </div>

          {/* Links loop */}
          <div className="space-y-3 bg-gray-50/50 p-4 rounded-lg border border-gray-100 mt-2">
            <div className="flex justify-between items-center mb-2">
              <div>
                <span className="text-sm font-semibold text-gray-700 block">
                  Sub-Menu Links
                </span>
                <span className="text-xs text-gray-400">
                  Links appearing in the dropdown (Optional)
                </span>
              </div>
              <button
                type="button"
                onClick={() => onAddLink(blockIdx)}
                className="text-xs font-semibold text-brand-primary hover:text-teal-700 flex items-center gap-1"
              >
                + Add Sub-Link
              </button>
            </div>

            {block.links.length === 0 && (
              <div className="text-sm text-gray-400 italic mt-2">
                No dropdown links added. This menu item will just act as a
                direct link!
              </div>
            )}

            {block.links.map((link, linkIdx) => (
              <div
                key={linkIdx}
                className="flex gap-4 items-center bg-white p-3 rounded border border-gray-200 shadow-sm relative group"
              >
                <div className="text-gray-300 cursor-move">
                  <GripVertical size={18} />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) =>
                      onUpdateLink(blockIdx, linkIdx, "label", e.target.value)
                    }
                    placeholder="Dropdown Item Label"
                    className="w-full text-sm outline-none border-b border-transparent focus:border-brand-primary pb-1 transition-colors"
                    required
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) =>
                      onUpdateLink(blockIdx, linkIdx, "url", e.target.value)
                    }
                    placeholder="URL (e.g. /services/web)"
                    className="w-full text-sm outline-none border-b border-transparent focus:border-brand-primary pb-1 text-gray-500 transition-colors font-mono"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveLink(blockIdx, linkIdx)}
                  className="text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
      {items.length === 0 && (
        <div className="text-center py-10 bg-white rounded-xl border border-gray-200 text-gray-500">
          No menus added yet. Click &quot;Add Menu Button&quot; above to start
          building the header.
        </div>
      )}
    </div>
  </div>
);

export default function HeaderAdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    menu: [],
    logo: "", // Saved string path from backend
  });

  const [logoFile, setLogoFile] = useState([]);
  const [logoPreview, setLogoPreview] = useState([]);

  useEffect(() => {
    const fetchHeader = async () => {
      try {
        const res = await fetch("/api/admin/header");
        const json = await res.json();
        if (json.success && json.data) {
          const d = json.data;
          setFormData({
            menu: d.menu || [],
            logo: d.logo || "",
          });

          if (d.logo) {
            setLogoPreview([d.logo]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch header data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHeader();
  }, []);

  // -- LOGO FILE HANDLERS --
  const handleLogoChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const file = files[0];
      setLogoFile([file]);
      setLogoPreview([URL.createObjectURL(file)]);
    }
  };

  const removeLogo = () => {
    setLogoFile([]);
    setLogoPreview([]);
    setFormData((prev) => ({ ...prev, logo: null })); // Mark for deletion if needed
  };

  // -- MENU NESTED HANDLERS --
  const addBlock = () => {
    setFormData((prev) => ({
      ...prev,
      menu: [...prev.menu, { title: "", url: "", links: [] }],
    }));
  };

  const removeBlock = (blockIdx) => {
    setFormData((prev) => {
      const newArray = [...prev.menu];
      newArray.splice(blockIdx, 1);
      return { ...prev, menu: newArray };
    });
  };

  const updateBlock = (blockIdx, field, value) => {
    setFormData((prev) => {
      const newArray = [...prev.menu];
      newArray[blockIdx][field] = value;
      return { ...prev, menu: newArray };
    });
  };

  const addLink = (blockIdx) => {
    setFormData((prev) => {
      const newArray = JSON.parse(JSON.stringify(prev.menu));
      newArray[blockIdx].links.push({ label: "", url: "" });
      return { ...prev, menu: newArray };
    });
  };

  const removeLink = (blockIdx, linkIdx) => {
    setFormData((prev) => {
      const newArray = JSON.parse(JSON.stringify(prev.menu));
      newArray[blockIdx].links.splice(linkIdx, 1);
      return { ...prev, menu: newArray };
    });
  };

  const updateLink = (blockIdx, linkIdx, field, value) => {
    setFormData((prev) => {
      const newArray = JSON.parse(JSON.stringify(prev.menu));
      newArray[blockIdx].links[linkIdx][field] = value;
      return { ...prev, menu: newArray };
    });
  };

  // -- SUBMIT --
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();

      // Append stringified nested array
      data.append("menu", JSON.stringify(formData.menu));

      // Append logo
      if (logoFile.length > 0) {
        data.append("logo", logoFile[0]);
      } else if (formData.logo) {
        data.append("logo", formData.logo);
      } else if (formData.logo === null) {
        data.append("logo", "null"); // Send a signal it was removed
      }

      const res = await fetch("/api/admin/header", {
        method: "PUT",
        body: data, // No headers needed for native formdata
      });

      const result = await res.json();
      if (result.success) {
        alert("Header configurations saved successfully!");
      } else {
        alert(result.error || "Failed to save header configurations");
      }
    } catch (error) {
      console.error("Save Error:", error);
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[60vh]">
        <Loader2 className="animate-spin text-brand-primary" size={32} />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 max-w-[1440px] mx-auto w-full pb-20"
    >
      <PageHeader
        title="Header Global Settings"
        actions={
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-brand-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-teal-600 transition shadow-sm uppercase disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Save size={16} />
            )}
            Save Header
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <MenuBlockEditor
            items={formData.menu}
            onAddBlock={addBlock}
            onRemoveBlock={removeBlock}
            onUpdateBlock={updateBlock}
            onAddLink={addLink}
            onRemoveLink={removeLink}
            onUpdateLink={updateLink}
          />
        </div>

        {/* Sidebar for Logo */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-base font-bold text-gray-800 mb-4">
              Website Logo
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Upload the main logo that appears on the far left side of the
              global navbar.
            </p>
            <SingleImageUploader
              label="Header Logo"
              image={logoPreview[0] || null}
              onImageChange={handleLogoChange}
              onRemoveImage={removeLogo}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
