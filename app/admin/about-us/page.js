/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
import { Loader2, Save, Plus } from "lucide-react";
import PageHeader from "@/app/components/admin/PageHeader";
import { FormInput, FormTextarea } from "@/app/components/admin/FormElements";
import SEOForm from "@/app/components/admin/SEOForm";

export default function AboutUsAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    heading: "",
    history: [],
    whyUs: ["", "", "", ""],
    whoAreWe: [
      { title: "", description: "", isReverse: false },
      { title: "", description: "", isReverse: false },
      { title: "", description: "", isReverse: false },
      { title: "", description: "", isReverse: false },
    ],
    seo: {
      metaTitle: "",
      metaDescription: "",
      codeSnippet: "",
    },
  });

  // Image states
  const [imageFile, setImageFile] = useState({
    mainBanner: null,
    whoAreWeFront: [null, null, null, null],
    whoAreWeBack: [null, null, null, null],
  });
  const [preview, setPreview] = useState({
    mainBanner: "",
    whoAreWeFront: ["", "", "", ""],
    whoAreWeBack: ["", "", "", ""],
  });

  // Fetch Initial Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin/about-us");
        const json = await res.json();

        if (json.success && json.data) {
          const data = json.data;

          // Process history
          const historyArr = Array.isArray(data.history) && data.history.length > 0
            ? data.history.map(h => ({
                year: h.year !== undefined && h.year !== null ? h.year : "",
                content: h.content || "",
              }))
            : [{ year: "", content: "" }];

          // Process whyUs
          const whyUsArr = [...(data.whyUs || [])];
          while (whyUsArr.length < 4) whyUsArr.push("");

          // Process whoAreWe
          let whoAreWeArr = [];
          if (Array.isArray(data.whoAreWe)) {
            whoAreWeArr = data.whoAreWe.map(item => {
              if (typeof item === 'string') {
                return { title: item, description: "", isReverse: false, frontImg: "", backImg: "" };
              }
              return {
                title: item?.title || "",
                description: item?.description || "",
                isReverse: item?.isReverse || false,
                frontImg: item?.frontImg || "",
                backImg: item?.backImg || "",
              };
            });
          }
          while (whoAreWeArr.length < 4) {
            whoAreWeArr.push({
              title: "",
              description: "",
              isReverse: false,
              frontImg: "",
              backImg: "",
            });
          }

          setFormData({
            heading: data.heading || "",
            history: historyArr,
            whyUs: whyUsArr.slice(0, 4),
            whoAreWe: whoAreWeArr.slice(0, 4),
            seo: {
              metaTitle: data.seo?.metaTitle || "",
              metaDescription: data.seo?.metaDescription || "",
              codeSnippet: data.seo?.codeSnippet || "",
            },
          });

          setPreview({
            mainBanner: data.mainBanner || "",
            whoAreWeFront: whoAreWeArr.slice(0, 4).map((w) => w.frontImg || ""),
            whoAreWeBack: whoAreWeArr.slice(0, 4).map((w) => w.backImg || ""),
          });
        }
      } catch (error) {
        console.error("Failed to fetch about us data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleWhoAreWeChange = (index, field, value) => {
    setFormData((prev) => {
      const newArray = [...prev.whoAreWe];
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prev, whoAreWe: newArray };
    });
  };

  const handleWhoAreWeImage = (e, index, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === "front") {
      setImageFile((prev) => {
        const arr = [...prev.whoAreWeFront];
        arr[index] = file;
        return { ...prev, whoAreWeFront: arr };
      });
      setPreview((prev) => {
        const arr = [...prev.whoAreWeFront];
        arr[index] = URL.createObjectURL(file);
        return { ...prev, whoAreWeFront: arr };
      });
    } else {
      setImageFile((prev) => {
        const arr = [...prev.whoAreWeBack];
        arr[index] = file;
        return { ...prev, whoAreWeBack: arr };
      });
      setPreview((prev) => {
        const arr = [...prev.whoAreWeBack];
        arr[index] = URL.createObjectURL(file);
        return { ...prev, whoAreWeBack: arr };
      });
    }
  };

  const removeWhoAreWeImage = (index, type) => {
    if (type === "front") {
      setImageFile((prev) => {
        const arr = [...prev.whoAreWeFront];
        arr[index] = null;
        return { ...prev, whoAreWeFront: arr };
      });
      setPreview((prev) => {
        const arr = [...prev.whoAreWeFront];
        arr[index] = "";
        return { ...prev, whoAreWeFront: arr };
      });
    } else {
      setImageFile((prev) => {
        const arr = [...prev.whoAreWeBack];
        arr[index] = null;
        return { ...prev, whoAreWeBack: arr };
      });
      setPreview((prev) => {
        const arr = [...prev.whoAreWeBack];
        arr[index] = "";
        return { ...prev, whoAreWeBack: arr };
      });
    }
  };

  const handleStringArrayChange = (index, arrayName, value) => {
    setFormData((prev) => {
      const newArray = [...prev[arrayName]];
      newArray[index] = value;
      return { ...prev, [arrayName]: newArray };
    });
  };

  // History Handlers
  const handleHistoryChange = (index, field, value) => {
    setFormData((prev) => {
      const newHistory = [...prev.history];
      newHistory[index] = { ...newHistory[index], [field]: value };
      return { ...prev, history: newHistory };
    });
  };

  const addHistoryItem = () => {
    setFormData((prev) => ({
      ...prev,
      history: [...prev.history, { year: "", content: "" }],
    }));
  };

  const removeHistoryItem = (index) => {
    setFormData((prev) => {
      const newHistory = [...prev.history];
      newHistory.splice(index, 1);
      return { ...prev, history: newHistory };
    });
  };

  // Image Handlers
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile({ mainBanner: file });
    setPreview({ mainBanner: URL.createObjectURL(file) });
  };

  const removeImage = () => {
    setImageFile({ mainBanner: null });
    setPreview({ mainBanner: "" });
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data = new FormData();
      data.append("heading", formData.heading);



      // History
      formData.history.forEach((h, i) => {
        data.append(`history[${i}][year]`, h.year || "");
        data.append(`history[${i}][content]`, h.content || "");
      });

      // Why Us
      formData.whyUs.forEach((text, i) => {
        data.append(`whyUs[${i}]`, text || "");
      });

      // Who Are We
      formData.whoAreWe.forEach((w, i) => {
        data.append(`whoAreWe[${i}][title]`, w.title || "");
        data.append(`whoAreWe[${i}][description]`, w.description || "");
        data.append(`whoAreWe[${i}][isReverse]`, w.isReverse ? "true" : "false");

        if (imageFile.whoAreWeFront[i]) {
          data.append(`whoAreWe[${i}][frontImg]`, imageFile.whoAreWeFront[i]);
        }
        if (imageFile.whoAreWeBack[i]) {
          data.append(`whoAreWe[${i}][backImg]`, imageFile.whoAreWeBack[i]);
        }
      });

      // Banner
      if (imageFile.mainBanner) {
        data.append("mainBanner", imageFile.mainBanner);
      }

      if (formData.seo) {
        data.append("seo[metaTitle]", formData.seo.metaTitle || "");
        data.append("seo[metaDescription]", formData.seo.metaDescription || "");
        data.append("seo[codeSnippet]", formData.seo.codeSnippet || "");
      }

      const res = await fetch("/api/admin/about-us", {
        method: "PUT",
        body: data,
      });

      const result = await res.json();

      if (result.success) {
        alert("About Us saved successfully!");
      } else {
        alert(result.error || "Failed to save about us");
      }
    } catch (error) {
      console.error("Error saving:", error);
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-brand-primary" size={32} />
      </div>
    );
  }

  // MiniUploader component for hero
  const MiniUploader = ({
    preview,
    onUpload,
    onRemove,
    label = "Upload Image",
  }) => (
    <div className="bg-[#D0E6E4] rounded-lg p-4 flex flex-col items-center justify-center relative w-full h-full min-h-[140px]">
      {preview ? (
        <>
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover rounded-md absolute inset-0"
          />
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-red-50 text-red-500 z-10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </>
      ) : (
        <label className="cursor-pointer flex flex-col items-center justify-center text-center w-full h-full">
          <svg
            className="w-6 h-6 text-brand-primary mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            ></path>
          </svg>
          <span className="text-xs text-gray-700 font-medium">{label}</span>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={onUpload}
          />
        </label>
      )}
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 max-w-[1440px] mx-auto w-full pb-20"
    >
      <PageHeader
        title="About Us"
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
            Save
          </button>
        }
      />

     

      {/* Hero Section */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-bold text-gray-800">Hero Section</h2>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <FormInput
                label="Heading"
                name="heading"
                value={formData.heading}
                onChange={handleInputChange}
                placeholder="A space to work.&#10;A community to grow."
              />

            </div>
            <div className="flex flex-col">
              <span className="block text-[13px] font-medium text-gray-700 mb-1">
                Main Banner
              </span>
              <MiniUploader
                preview={preview.mainBanner}
                onUpload={handleImageChange}
                onRemove={removeImage}
                label="Upload / Drag and Drop the Image"
              />
            </div>
          </div>
        </div>
      </section>



      <hr className="border-gray-300" />

      {/* History */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-[15px] font-bold text-gray-800">History</h2>
          <button
            type="button"
            onClick={addHistoryItem}
            className="flex items-center gap-1.5 rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-teal-600 transition shadow-sm"
          >
            <Plus size={16} />
            Add New
          </button>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
          {formData.history.length === 0 ? (
            <div className="text-gray-400 text-sm text-center py-4">
              No history items. Click Add New.
            </div>
          ) : (
            formData.history.map((item, i) => (
              <div
                key={i}
                className="space-y-4 relative border border-gray-100 p-4 rounded-lg bg-gray-50 group"
              >
                <FormInput
                  label="Year"
                  value={item.year !== undefined && item.year !== null ? item.year : ""}
                  onChange={(e) =>
                    handleHistoryChange(i, "year", e.target.value)
                  }
                  placeholder="2015-16"
                />
                <FormTextarea
                  label="Content"
                  value={item.content || ""}
                  onChange={(e) =>
                    handleHistoryChange(i, "content", e.target.value)
                  }
                  rows={3}
                  placeholder="Spring House Coworking was founded..."
                />

                <button
                  type="button"
                  onClick={() => removeHistoryItem(i)}
                  className="absolute top-2 right-2 text-red-500 bg-white shadow-sm hover:bg-red-50 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove item"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      <hr className="border-gray-300" />

      {/* Why Us */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-bold text-gray-800">Why Us</h2>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
            {[0, 1, 2, 3].map((i) => (
              <FormInput
                key={i}
                label={`${i + 1}`}
                value={formData.whyUs[i] || ""}
                onChange={(e) =>
                  handleStringArrayChange(i, "whyUs", e.target.value)
                }
                placeholder={
                  i === 0
                    ? "Open Work Space"
                    : i === 1
                      ? "Client Lounge & Reception"
                      : i === 2
                        ? "Private Focus Pods"
                        : "Leisure Zones"
                }
              />
            ))}
          </div>
        </div>
      </section>

      <hr className="border-gray-300" />

      {/* Who Are We */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-bold text-gray-800">Who Are We</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4"
            >
              <h3 className="text-sm font-semibold text-gray-700">Section {i + 1}</h3>
              <FormInput
                label="Title"
                value={formData.whoAreWe[i]?.title || ""}
                onChange={(e) =>
                  handleWhoAreWeChange(i, "title", e.target.value)
                }
                placeholder={
                  i === 0 ? "Mission" : i === 1 ? "Vision" : i === 2 ? "Culture" : "Values"
                }
              />
              <FormTextarea
                label="Description"
                value={formData.whoAreWe[i]?.description || ""}
                onChange={(e) =>
                  handleWhoAreWeChange(i, "description", e.target.value)
                }
                rows={3}
                placeholder="Description..."
              />

              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  id={`reverse-${i}`}
                  checked={formData.whoAreWe[i]?.isReverse || false}
                  onChange={(e) =>
                    handleWhoAreWeChange(i, "isReverse", e.target.checked)
                  }
                  className="w-4 h-4 text-brand-primary border-gray-300 rounded focus:ring-brand-primary"
                />
                <label htmlFor={`reverse-${i}`} className="text-sm text-gray-700 font-medium cursor-pointer">
                  Reverse Image Render Order (CSS Flip)
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4 h-40">
                <div className="flex flex-col h-full">
                  <span className="block text-[13px] font-medium text-gray-700 mb-1">
                    Front Image
                  </span>
                  <MiniUploader
                    preview={preview.whoAreWeFront[i]}
                    onUpload={(e) => handleWhoAreWeImage(e, i, "front")}
                    onRemove={() => removeWhoAreWeImage(i, "front")}
                    label="Upload Front Image"
                  />
                </div>
                <div className="flex flex-col h-full">
                  <span className="block text-[13px] font-medium text-gray-700 mb-1">
                    Back Image
                  </span>
                  <MiniUploader
                    preview={preview.whoAreWeBack[i]}
                    onUpload={(e) => handleWhoAreWeImage(e, i, "back")}
                    onRemove={() => removeWhoAreWeImage(i, "back")}
                    label="Upload Back Image"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

       {/* SEO Section */}
      <div className="mb-6">
        <SEOForm
          values={formData.seo}
          onChange={(newSeo) =>
            setFormData((prev) => ({ ...prev, seo: newSeo }))
          }
        />
      </div>
    </form>
  );
}
