"use client";
import React, { useState, useEffect } from "react";
import { Loader2, Save, Plus, Trash2, GripVertical } from "lucide-react";
import PageHeader from "@/app/components/admin/PageHeader";
import { FormInput, SingleImageUploader } from "@/app/components/admin/FormElements";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

// Moved completely outside of the main component scope
const LinkBlockEditor = ({
  title,
  sectionName,
  items,
  onAddBlock,
  onRemoveBlock,
  onUpdateBlockTitle,
  onAddLink,
  onRemoveLink,
  onUpdateLink,
}) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center bg-gray-50 p-4 border border-gray-200 rounded-lg">
      <div>
        <h2 className="text-base font-bold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage the groups of links here.
        </p>
      </div>
      <button
        type="button"
        onClick={() => onAddBlock(sectionName)}
        className="flex items-center gap-1.5 text-sm font-medium text-brand-primary bg-white px-4 py-2 border border-brand-primary/20 rounded-md hover:bg-brand-primary/5 transition"
      >
        <Plus size={16} /> Add Block
      </button>
    </div>

    <div className="grid grid-cols-1 gap-6">
      {items.map((block, blockIdx) => (
        <div
          key={blockIdx}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-5"
        >
          <div className="flex justify-between items-start mb-4 gap-4">
            <div className="flex-1">
              <FormInput
                label="Block Title"
                value={block.title}
                onChange={(e) =>
                  onUpdateBlockTitle(sectionName, blockIdx, e.target.value)
                }
                placeholder="e.g. COMPANY"
                required
              />
            </div>
            <button
              type="button"
              onClick={() => onRemoveBlock(sectionName, blockIdx)}
              className="mt-7 p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
              title="Remove Block"
            >
              <Trash2 size={18} />
            </button>
          </div>

          {/* Links loop */}
          <div className="space-y-3 bg-gray-50/50 p-4 rounded-lg border border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700">Links</span>
              <button
                type="button"
                onClick={() => onAddLink(sectionName, blockIdx)}
                className="text-xs font-semibold text-brand-primary hover:text-teal-700 flex items-center gap-1"
              >
                + Add Link
              </button>
            </div>

            {block.links.length === 0 && (
              <div className="text-sm text-gray-400 italic">
                No links added to this block yet.
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
                      onUpdateLink(
                        sectionName,
                        blockIdx,
                        linkIdx,
                        "label",
                        e.target.value,
                      )
                    }
                    placeholder="Label (e.g. Blogs)"
                    className="w-full text-sm outline-none border-b border-transparent focus:border-brand-primary pb-1 transition-colors"
                    required
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) =>
                      onUpdateLink(
                        sectionName,
                        blockIdx,
                        linkIdx,
                        "url",
                        e.target.value,
                      )
                    }
                    placeholder="URL (e.g. /blogs or https://...)"
                    className="w-full text-sm outline-none border-b border-transparent focus:border-brand-primary pb-1 text-gray-500 transition-colors font-mono"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveLink(sectionName, blockIdx, linkIdx)}
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
          No blocks added yet. Click &quot;Add Block&quot; above.
        </div>
      )}
    </div>
  </div>
);

export default function FooterAdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    columns: [],
    bottomBlocks: "",
    socialLinks: { instagram: "", facebook: "", linkedin: "" },
    contactInfo: { address: "", phone: "", whatsapp: "", email: "" },
    formImages: { contactFormImage: "", careerFormImage: "" },
    pageBanners: { careerHeroBanner: "" },
  });
  const [newImageFiles, setNewImageFiles] = useState({
    contactFormImage: null,
    careerFormImage: null,
    careerHeroBanner: null,
  });

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const res = await fetch("/api/admin/footer");
        const json = await res.json();
        if (json.success && json.data) {
          const d = json.data;
          setFormData({
            columns: d.columns || [],
            bottomBlocks: d.bottomBlocks || "",
            socialLinks: d.socialLinks || {
              instagram: "",
              facebook: "",
              linkedin: "",
            },
            contactInfo: d.contactInfo || {
              address: "",
              phone: "",
              whatsapp: "",
              email: "",
            },
            formImages: d.formImages || {
              contactFormImage: "",
              careerFormImage: "",
            },
            pageBanners: d.pageBanners || {
              careerHeroBanner: "",
            },
          });
        }
      } catch (error) {
        console.error("Failed to fetch footer data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFooter();
  }, []);

  // Basic Object Handlers (Social & Contact)
  const handleObjectChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  // Complex Nested Array Handlers (Columns / BottomBlocks)
  // 1. Blocks / Columns
  const addBlock = (section) => {
    setFormData((prev) => ({
      ...prev,
      [section]: [...prev[section], { title: "", links: [] }],
    }));
  };

  const removeBlock = (section, blockIdx) => {
    setFormData((prev) => {
      const newArray = [...prev[section]];
      newArray.splice(blockIdx, 1);
      return { ...prev, [section]: newArray };
    });
  };

  const updateBlockTitle = (section, blockIdx, value) => {
    setFormData((prev) => {
      const newArray = [...prev[section]];
      newArray[blockIdx].title = value;
      return { ...prev, [section]: newArray };
    });
  };

  // 2. Links inside Blocks/Columns
  const addLink = (section, blockIdx) => {
    setFormData((prev) => {
      const newArray = JSON.parse(JSON.stringify(prev[section])); // Deep copy for nested mutation safety
      newArray[blockIdx].links.push({ label: "", url: "" });
      return { ...prev, [section]: newArray };
    });
  };

  const removeLink = (section, blockIdx, linkIdx) => {
    setFormData((prev) => {
      const newArray = JSON.parse(JSON.stringify(prev[section]));
      newArray[blockIdx].links.splice(linkIdx, 1);
      return { ...prev, [section]: newArray };
    });
  };

  const updateLink = (section, blockIdx, linkIdx, field, value) => {
    setFormData((prev) => {
      const newArray = JSON.parse(JSON.stringify(prev[section]));
      newArray[blockIdx].links[linkIdx][field] = value;
      return { ...prev, [section]: newArray };
    });
  };

  // Image handlers for form images
  const handleFormImageChange = (field) => (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewImageFiles((prev) => ({ ...prev, [field]: file }));
    // Show preview
    const previewUrl = URL.createObjectURL(file);
    setFormData((prev) => ({
      ...prev,
      formImages: { ...prev.formImages, [field]: previewUrl },
    }));
  };

  const handleRemoveFormImage = (field) => () => {
    setNewImageFiles((prev) => ({ ...prev, [field]: null }));
    setFormData((prev) => ({
      ...prev,
      formImages: { ...prev.formImages, [field]: "" },
    }));
  };

  const handlePageBannerImageChange = (field) => (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewImageFiles((prev) => ({ ...prev, [field]: file }));
    const previewUrl = URL.createObjectURL(file);
    setFormData((prev) => ({
      ...prev,
      pageBanners: { ...prev.pageBanners, [field]: previewUrl },
    }));
  };

  const handleRemovePageBannerImage = (field) => () => {
    setNewImageFiles((prev) => ({ ...prev, [field]: null }));
    setFormData((prev) => ({
      ...prev,
      pageBanners: { ...prev.pageBanners, [field]: "" },
    }));
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const submitData = new FormData();
      submitData.append("data", JSON.stringify(formData));

      if (newImageFiles.contactFormImage) {
        submitData.append("contactFormImage", newImageFiles.contactFormImage);
      }
      if (newImageFiles.careerFormImage) {
        submitData.append("careerFormImage", newImageFiles.careerFormImage);
      }
      if (newImageFiles.careerHeroBanner) {
        submitData.append("careerHeroBanner", newImageFiles.careerHeroBanner);
      }

      const res = await fetch("/api/admin/footer", {
        method: "PUT",
        body: submitData,
      });
      const result = await res.json();
      if (result.success) {
        // Update state with saved data from server
        if (result.data?.formImages) {
          setFormData((prev) => ({
            ...prev,
            formImages: result.data.formImages,
          }));
        }
        if (result.data?.pageBanners) {
          setFormData((prev) => ({
            ...prev,
            pageBanners: result.data.pageBanners,
          }));
        }
        setNewImageFiles({ contactFormImage: null, careerFormImage: null, careerHeroBanner: null });
        alert("Footer configurations saved successfully!");
      } else {
        alert(result.error || "Failed to save footer configurations");
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
        title="Footer Configuration"
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
            Save Footer
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Top Columns */}
          <section>
            <LinkBlockEditor
              title="Top Columns"
              sectionName="columns"
              items={formData.columns}
              onAddBlock={addBlock}
              onRemoveBlock={removeBlock}
              onUpdateBlockTitle={updateBlockTitle}
              onAddLink={addLink}
              onRemoveLink={removeLink}
              onUpdateLink={updateLink}
            />
          </section>

          <hr className="border-gray-300" />

          {/* Bottom Blocks Editor */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-base font-bold text-gray-800 mb-2">
              Bottom Content Editor
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Use the rich text editor below to format text, add links, and
              change heading sizes for the footer&apos;s bottom section.
            </p>
            <div className="bg-white rounded-lg">
              <ReactQuill
                theme="snow"
                value={formData.bottomBlocks}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, bottomBlocks: val }))
                }
                className="h-[250px] mb-12"
              />
            </div>
          </section>
        </div>

        {/* Sidebar for Static Objects (Contact & Social) */}
        <div className="space-y-6">
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-base font-bold text-gray-800 mb-4">
              Contact Information
            </h3>
            <div className="space-y-4">
              <FormInput
                label="Headquarters Address"
                value={formData.contactInfo.address}
                onChange={(e) =>
                  handleObjectChange("contactInfo", "address", e.target.value)
                }
                placeholder="LG 006, DLF Grand Mall..."
              />
              <FormInput
                label="Phone Number"
                value={formData.contactInfo.phone}
                onChange={(e) =>
                  handleObjectChange("contactInfo", "phone", e.target.value)
                }
                placeholder="+91-9899936669"
              />
              <FormInput
                label="WhatsApp Number"
                value={formData.contactInfo.whatsapp}
                onChange={(e) =>
                  handleObjectChange("contactInfo", "whatsapp", e.target.value)
                }
                placeholder="+91 74285 73675"
              />
              <FormInput
                label="Email Address"
                value={formData.contactInfo.email}
                onChange={(e) =>
                  handleObjectChange("contactInfo", "email", e.target.value)
                }
                placeholder="springup@springhouse.in"
              />
            </div>
          </section>

          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-base font-bold text-gray-800 mb-4">
              Social Links
            </h3>
            <div className="space-y-4">
              <FormInput
                label="Instagram URL"
                value={formData.socialLinks.instagram}
                onChange={(e) =>
                  handleObjectChange("socialLinks", "instagram", e.target.value)
                }
                placeholder="https://instagram.com/..."
              />
              <FormInput
                label="Facebook URL"
                value={formData.socialLinks.facebook}
                onChange={(e) =>
                  handleObjectChange("socialLinks", "facebook", e.target.value)
                }
                placeholder="https://facebook.com/..."
              />
              <FormInput
                label="LinkedIn URL"
                value={formData.socialLinks.linkedin}
                onChange={(e) =>
                  handleObjectChange("socialLinks", "linkedin", e.target.value)
                }
                placeholder="https://linkedin.com/..."
              />
            </div>
          </section>

          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-base font-bold text-gray-800 mb-4">
              Form Images
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Upload sidebar images for the Contact Form and Career Form.
            </p>
            <div className="space-y-4">
              <SingleImageUploader
                label="Contact Form Image"
                image={formData.formImages.contactFormImage}
                onImageChange={handleFormImageChange("contactFormImage")}
                onRemoveImage={handleRemoveFormImage("contactFormImage")}
                helperText="Image shown beside the Contact / Lead form"
              />
              <SingleImageUploader
                label="Career Form Image"
                image={formData.formImages.careerFormImage}
                onImageChange={handleFormImageChange("careerFormImage")}
                onRemoveImage={handleRemoveFormImage("careerFormImage")}
                helperText="Image shown beside the Career application form"
              />
            </div>
          </section>

          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-base font-bold text-gray-800 mb-4">
              Page Banners
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Upload top hero banners for specific pages.
            </p>
            <div className="space-y-4">
              <SingleImageUploader
                label="Career Page Hero Banner"
                image={formData.pageBanners.careerHeroBanner}
                onImageChange={handlePageBannerImageChange("careerHeroBanner")}
                onRemoveImage={handleRemovePageBannerImage("careerHeroBanner")}
                helperText="Hero Banner shown at the top of the careers page"
              />
            </div>
          </section>
        </div>
      </div>
    </form>
  );
}
