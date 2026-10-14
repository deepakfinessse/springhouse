/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
import { Loader2, Save } from "lucide-react";
import PageHeader from "@/app/components/admin/PageHeader";
import {
  FormInput,
  FormTextarea,
  FormCheckboxGrid,
} from "@/app/components/admin/FormElements";
import SEOForm from "@/app/components/admin/SEOForm";

export default function HomepageAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Dependencies for checkboxes
  const [cities, setCities] = useState([]);
  const [solutions, setSolutions] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    heading: "",
    subHeading: "",
    presence: [
      { number: "", title: "", beforeNumber: "", afterNumber: "" },
      { number: "", title: "", beforeNumber: "", afterNumber: "" },
      { number: "", title: "", beforeNumber: "", afterNumber: "" },
      { number: "", title: "", beforeNumber: "", afterNumber: "" },
    ],
    activeCities: [], // Array of ObjectIds
    activeSolutions: [], // Array of ObjectIds
    features: [
      { content: "" },
      { content: "" },
      { content: "" },
      { content: "" },
    ],
    solutionsForEveryone: {
      content: "",
      cta: "",
      ctaLink: "",
    },
    networking: {
      title: "",
      content: "",
      image: "",
      tooltips: ["", "", ""],
    },
    testimonials: [], // Array of ObjectIds
    seo: {
      metaTitle: "",
      metaDescription: "",
      codeSnippet: "",
    },
  });

  // Form State
  const [imageFiles, setImageFiles] = useState({
    mainBanner: null,
    heroVideo: null,
    features: [null, null, null, null],
    solution: null,
    networking: null,
    ourCommunity: [null, null, null, null],
  });

  const [previews, setPreviews] = useState({
    mainBanner: "",
    heroVideo: "",
    features: ["", "", "", ""],
    solution: "",
    networking: "",
    ourCommunity: ["", "", "", ""],
  });

  // Fetch Initial Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [homepageRes, citiesRes, solutionsRes, testimonialsRes] = await Promise.all([
          fetch("/api/admin/homepage"),
          fetch("/api/admin/cities?limit=100"),
          fetch("/api/admin/solutions?limit=100"),
          fetch("/api/admin/testimonials?limit=100"),
        ]);

        const hData = await homepageRes.json();
        const cData = await citiesRes.json();
        const sData = await solutionsRes.json();
        const tData = await testimonialsRes.json();

        if (cData.success) setCities(cData.data);
        if (sData.success) setSolutions(sData.data);
        if (tData.success) setTestimonials(tData.data);

        if (hData.success && hData.data) {
          const hp = hData.data;

          setFormData({
            heading: hp.heading || "",
            subHeading: hp.subHeading || "",
            presence:
              hp.presence && hp.presence.length === 4
                ? hp.presence
                : formData.presence,
            activeCities: hp.activeCities || [],
            activeSolutions: hp.activeSolutions || [],
            features:
              hp.features && hp.features.length === 4
                ? hp.features
                : formData.features,
            solutionsForEveryone: {
              content: hp.solutionsForEveryone?.content || "",
              cta: hp.solutionsForEveryone?.cta || "",
              ctaLink: hp.solutionsForEveryone?.ctaLink || "",
            },
            networking: {
              title: hp.networking?.title || "",
              content: hp.networking?.content || "",
              tooltips: Array.isArray(hp.networking?.tooltips)
                ? [
                    hp.networking.tooltips[0] || "",
                    hp.networking.tooltips[1] || "",
                    hp.networking.tooltips[2] || ""
                  ]
                : ["", "", ""],
            },
            testimonials: hp.testimonials || [],
            seo: {
              metaTitle: hp.seo?.metaTitle || "",
              metaDescription: hp.seo?.metaDescription || "",
              codeSnippet: hp.seo?.codeSnippet || "",
            },
          });

          const communityArr = [...(hp.ourCommunity || [])];

          setPreviews({
            mainBanner: hp.mainBanner || "",
            heroVideo: hp.heroVideo || "",
            features: hp.features?.map((f) => f.image || "") || [
              "",
              "",
              "",
              "",
            ],
            solution: hp.solutionsForEveryone?.image || "",
            networking: hp.networking?.image || "",
            ourCommunity: communityArr,
          });
        }
      } catch (error) {
        console.error("Failed to fetch homepage data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [section, field] = name.split(".");
      setFormData((prev) => {
        // Handle tooltips specifically
        if (section === "networking" && field.startsWith("tooltip")) {
          const index = parseInt(field.replace("tooltip", ""), 10) - 1;
          const newTooltips = [...(prev.networking.tooltips || ["", "", ""])];
          newTooltips[index] = value;
          return {
            ...prev,
            networking: { ...prev.networking, tooltips: newTooltips },
          };
        }

        return {
          ...prev,
          [section]: { ...prev[section], [field]: value },
        };
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayChange = (index, arrayName, field, value) => {
    setFormData((prev) => {
      const newArray = [...prev[arrayName]];
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prev, [arrayName]: newArray };
    });
  };

  const handleCheckboxChange = (category, id) => {
    setFormData((prev) => {
      const list = prev[category];
      if (list.includes(id)) {
        return { ...prev, [category]: list.filter((item) => item !== id) };
      } else {
        return { ...prev, [category]: [...list, id] };
      }
    });
  };

  const handleImageChange = (e, field, index = null, isMultiple = false) => {
    if (isMultiple) {
      const files = Array.from(e.target.files);
      if (!files.length) return;

      setImageFiles((prev) => ({
        ...prev,
        [field]: [...(prev[field] || []), ...files],
      }));
      setPreviews((prev) => ({
        ...prev,
        [field]: [
          ...(prev[field] || []),
          ...files.map((file) => URL.createObjectURL(file)),
        ],
      }));
      return;
    }

    const file = e.target.files[0];
    if (!file) return;

    if (index !== null) {
      setImageFiles((prev) => {
        const newArr = [...prev[field]];
        newArr[index] = file;
        return { ...prev, [field]: newArr };
      });
      setPreviews((prev) => {
        const newArr = [...prev[field]];
        newArr[index] = URL.createObjectURL(file);
        return { ...prev, [field]: newArr };
      });
    } else {
      setImageFiles((prev) => ({ ...prev, [field]: file }));
      setPreviews((prev) => ({ ...prev, [field]: URL.createObjectURL(file) }));
    }
  };

  const removeImage = (field, index = null) => {
    if (index !== null) {
      setImageFiles((prev) => {
        const newArr = [...prev[field]];
        if (field === "ourCommunity") {
          newArr.splice(index, 1); // Remove from array for dynamic gallery
        } else {
          newArr[index] = null; // Set to null for fixed-slot features
        }
        return { ...prev, [field]: newArr };
      });
      setPreviews((prev) => {
        const newArr = [...prev[field]];
        if (field === "ourCommunity") {
          newArr.splice(index, 1);
        } else {
          newArr[index] = "";
        }
        return { ...prev, [field]: newArr };
      });
    } else {
      setImageFiles((prev) => ({ ...prev, [field]: null }));
      setPreviews((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data = new FormData();
      data.append("heading", formData.heading);
      data.append("subHeading", formData.subHeading);

      // Presence
      formData.presence.forEach((p, i) => {
        data.append(`presence[${i}][number]`, p.number || "");
        data.append(`presence[${i}][title]`, p.title || "");
        data.append(`presence[${i}][beforeNumber]`, p.beforeNumber || "");
        data.append(`presence[${i}][afterNumber]`, p.afterNumber || "");
      });

      // Cities
      formData.activeCities.forEach((id) => data.append("activeCities", id));

      // Solutions
      formData.activeSolutions.forEach((id) => data.append("activeSolutions", id));

      // Features
      formData.features.forEach((f, i) => {
        data.append(`features[${i}][content]`, f.content || "");
        if (imageFiles.features[i]) {
          data.append(`features[${i}][image]`, imageFiles.features[i]);
        }
      });

      // Solution
      data.append(
        "solutionsForEveryone[content]",
        formData.solutionsForEveryone.content,
      );
      data.append(
        "solutionsForEveryone[cta]",
        formData.solutionsForEveryone.cta,
      );
      data.append(
        "solutionsForEveryone[ctaLink]",
        formData.solutionsForEveryone.ctaLink,
      );
      if (imageFiles.solution) {
        data.append("solutionsForEveryoneImage", imageFiles.solution);
      }

      // Networking
      data.append("networking[title]", formData.networking.title);
      data.append("networking[content]", formData.networking.content);
      
      if (formData.networking.tooltips) {
        data.append("networking[tooltip1]", formData.networking.tooltips[0] || "");
        data.append("networking[tooltip2]", formData.networking.tooltips[1] || "");
        data.append("networking[tooltip3]", formData.networking.tooltips[2] || "");
      }
      if (imageFiles.networking) {
        data.append("networkingImage", imageFiles.networking);
      }

      // Hero
      if (imageFiles.mainBanner) {
        data.append("mainBanner", imageFiles.mainBanner);
      }
      
      if (imageFiles.heroVideo) {
        data.append("heroVideo", imageFiles.heroVideo);
      }

      // Community Images
      const communityMaxLen = Math.max(
        imageFiles.ourCommunity.length,
        previews.ourCommunity.length
      );
      for (let i = 0; i < communityMaxLen; i++) {
        if (imageFiles.ourCommunity[i]) {
          data.append("communityImages", imageFiles.ourCommunity[i]);
        } else if (
          previews.ourCommunity[i] &&
          !previews.ourCommunity[i].startsWith("blob:")
        ) {
          data.append("existingCommunityImages", previews.ourCommunity[i]);
        }
      }

      // Testimonials
      formData.testimonials.forEach((id) => data.append("testimonials", id));

      if (formData.seo) {
        data.append("seo[metaTitle]", formData.seo.metaTitle || "");
        data.append("seo[metaDescription]", formData.seo.metaDescription || "");
        data.append("seo[codeSnippet]", formData.seo.codeSnippet || "");
      }

      const res = await fetch("/api/admin/homepage", {
        method: "PUT",
        body: data,
      });

      const result = await res.json();

      if (result.success) {
        alert("Homepage saved successfully!");
      } else {
        alert(result.error || "Failed to save homepage");
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

  // MiniUploader component tailored for consistent aspect ratios
  const MiniUploader = ({
    preview,
    onUpload,
    onRemove,
    label = "Upload Image",
    heightClass = "min-h-[140px]",
    accept = "image/*",
    isVideo = false,
  }) => (
    <div
      className={`bg-[#D0E6E4] rounded-lg p-4 flex flex-col items-center justify-center relative w-full ${heightClass}`}
    >
      {preview ? (
        <>
          {isVideo ? (
            <video
              src={preview}
              className="w-full h-full object-cover rounded-md absolute inset-0"
              autoPlay
              muted
              loop
            />
          ) : (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover rounded-md absolute inset-0"
            />
          )}
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
          {label === "+" ? (
            <span className="text-3xl text-brand-primary font-light">+</span>
          ) : (
            <>
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
            </>
          )}
          <input
            type="file"
            className="hidden"
            accept={accept}
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
        title="Homepage"
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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <FormInput
                label="Heading"
                name="heading"
                value={formData.heading}
                onChange={handleInputChange}
                placeholder="A space to work.&#10;A community to grow."
              />
              <FormInput
                label="Sub Heading"
                name="subHeading"
                value={formData.subHeading}
                onChange={handleInputChange}
                placeholder="CREATE. SIEZE. PROGRESS."
              />
            </div>
            <div className="flex flex-col lg:col-span-1">
              <span className="block text-[13px] font-medium text-gray-700 mb-1">
                Main Banner (Fallback Image)
              </span>
              <MiniUploader
                preview={previews.mainBanner}
                onUpload={(e) => handleImageChange(e, "mainBanner")}
                onRemove={() => removeImage("mainBanner")}
                label="Upload Banner Image"
                heightClass="h-full min-h-[140px]"
              />
            </div>
            <div className="flex flex-col lg:col-span-1">
              <span className="block text-[13px] font-medium text-gray-700 mb-1">
                Hero Video (Primary)
              </span>
              <MiniUploader
                preview={previews.heroVideo}
                onUpload={(e) => handleImageChange(e, "heroVideo")}
                onRemove={() => removeImage("heroVideo")}
                label="Upload Banner Video"
                heightClass="h-full min-h-[140px]"
                accept="video/*"
                isVideo={true}
              />
            </div>
          </div>
        </div>
      </section>

      <hr className="border-gray-300" />

      {/* Presence */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-bold text-gray-800">Presence</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="space-y-4 bg-white border border-gray-100 p-5 rounded-xl shadow-sm"
            >
              <FormInput
                label="Number"
                type="number"
                value={formData.presence[i].number}
                onChange={(e) =>
                  handleArrayChange(i, "presence", "number", e.target.value)
                }
                placeholder="25"
              />
              <FormInput
                label="Title"
                value={formData.presence[i].title}
                onChange={(e) =>
                  handleArrayChange(i, "presence", "title", e.target.value)
                }
                placeholder="Locations"
              />
              {/* <FormInput
                label="Before Number"
                value={formData.presence[i].beforeNumber}
                onChange={(e) =>
                  handleArrayChange(
                    i,
                    "presence",
                    "beforeNumber",
                    e.target.value,
                  )
                }
                placeholder=""
              /> */}
              <FormInput
                label="After Number"
                value={formData.presence[i].afterNumber}
                onChange={(e) =>
                  handleArrayChange(
                    i,
                    "presence",
                    "afterNumber",
                    e.target.value,
                  )
                }
                placeholder="+"
              />
            </div>
          ))}
        </div>
      </section>

      <hr className="border-gray-300" />

      {/* Active Cities */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <FormCheckboxGrid
          label={
            <span className="text-[15px] font-bold text-gray-800">
              Active Cities
            </span>
          }
          name="activeCities"
          options={cities.map((c) => ({ value: c._id, label: c.name }))}
          selectedValues={formData.activeCities}
          onChange={handleCheckboxChange}
        />
      </section>

      <hr className="border-gray-300" />

      {/* Active Solutions */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <FormCheckboxGrid
          label={
            <span className="text-[15px] font-bold text-gray-800">
              Active Solutions
            </span>
          }
          name="activeSolutions"
          options={solutions.map((s) => ({ value: s._id, label: s.name || s.title || s.slug }))}
          selectedValues={formData.activeSolutions}
          onChange={handleCheckboxChange}
        />
      </section>

      <hr className="border-gray-300" />

      {/* Features */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-bold text-gray-800">Features</h2>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="w-1/3">
                  <span className="block text-[13px] font-medium text-white mb-1">
                    &nbsp;
                  </span>
                  <MiniUploader
                    preview={previews.features[i]}
                    onUpload={(e) => handleImageChange(e, "features", i)}
                    onRemove={() => removeImage("features", i)}
                    heightClass="h-[72px]"
                  />
                </div>
                <div className="w-2/3">
                  <FormInput
                    label="Content"
                    value={formData.features[i].content}
                    onChange={(e) =>
                      handleArrayChange(
                        i,
                        "features",
                        "content",
                        e.target.value,
                      )
                    }
                    placeholder="Open Work Space"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="border-gray-300" />

      {/* Solution for Everyone */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-bold text-gray-800">
          Solution for Everyone
        </h2>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
          <FormTextarea
            label="Content"
            name="solutionsForEveryone.content"
            value={formData.solutionsForEveryone.content}
            onChange={handleInputChange}
            rows={5}
            placeholder="Content"
          />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div className="md:col-span-1">
              <MiniUploader
                preview={previews.solution}
                onUpload={(e) => handleImageChange(e, "solution")}
                onRemove={() => removeImage("solution")}
                heightClass="h-[72px]"
              />
            </div>
          </div>
        </div>
      </section>

      <hr className="border-gray-300" />

      {/* Networking */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-bold text-gray-800">Networking</h2>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <MiniUploader
                preview={previews.networking}
                onUpload={(e) => handleImageChange(e, "networking")}
                onRemove={() => removeImage("networking")}
                heightClass="h-[140px]"
              />
            </div>
            <div className="md:col-span-2 space-y-6">
              <FormInput
                label="Title"
                name="networking.title"
                value={formData.networking.title}
                onChange={handleInputChange}
                placeholder="Helen Keller"
              />
              <FormInput
                label="Content"
                name="networking.content"
                value={formData.networking.content}
                onChange={handleInputChange}
                placeholder="Alone we can do so little; together we can do so much..."
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput
                  label="Tooltip 1"
                  name="networking.tooltip1"
                  value={formData.networking.tooltips?.[0] || ""}
                  onChange={handleInputChange}
                  placeholder="Spring House Gurugram"
                />
                <FormInput
                  label="Tooltip 2"
                  name="networking.tooltip2"
                  value={formData.networking.tooltips?.[1] || ""}
                  onChange={handleInputChange}
                  placeholder="Spring House Gurugram"
                />
                <FormInput
                  label="Tooltip 3"
                  name="networking.tooltip3"
                  value={formData.networking.tooltips?.[2] || ""}
                  onChange={handleInputChange}
                  placeholder="Spring House Delhi"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="border-gray-300" />

      {/* Our Community */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-[15px] font-bold text-gray-800">Our Community (Recommended Dimension 400*150)</h2>
          <label className="cursor-pointer bg-brand-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-600 transition shadow-sm">
            Add Images
            <input
              type="file"
              multiple
              className="hidden"
              accept="image/*"
              onChange={(e) => handleImageChange(e, "ourCommunity", null, true)}
            />
          </label>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[160px]">
          {previews.ourCommunity.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              No images added yet. Click &apos;Add Images&apos; to upload.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {previews.ourCommunity.map((preview, i) => (
                <div
                  key={i}
                  className="h-28 relative rounded-lg overflow-hidden border border-gray-200 group"
                >
                  <img
                    src={preview}
                    alt="Community"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage("ourCommunity", i)}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10"
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
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <hr className="border-gray-300" />

      {/* Testimonials */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <FormCheckboxGrid
          label={
            <span className="text-[15px] font-bold text-gray-800">
              Testimonials
            </span>
          }
          name="testimonials"
          options={testimonials.map((t) => ({
            value: t._id,
            label: t.name || t.clientName || "Unnamed Testimonial",
          }))}
          selectedValues={formData.testimonials}
          onChange={handleCheckboxChange}
        />
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
