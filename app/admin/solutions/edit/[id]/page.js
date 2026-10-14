/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2, Save, UploadCloud, X, Plus } from "lucide-react";
import PageHeader from "@/app/components/admin/PageHeader";
import {
  FormInput,
  FormTextarea,
  FormSelect,
  FormCheckboxGrid,
  ImageUploader,
} from "@/app/components/admin/FormElements";
import slugify from "slugify";
import SEOForm from "@/app/components/admin/SEOForm";

const ALL_SECTIONS = [
  { key: "intro", label: "Introduction" },
  { key: "testimonials", label: "Testimonials" },
  { key: "companyImages", label: "Company Images" },
  { key: "featuredSpaces", label: "Featured Spaces" },
  { key: "availableProperties", label: "Available Properties" },
  { key: "ourCommunity", label: "Our Community" },
  { key: "networking", label: "Networking" },
  { key: "otherSolutions", label: "Other Solutions" },
  { key: "contactForm", label: "Contact Form" },
];

export default function EditSolutionPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [dependencies, setDependencies] = useState({
    testimonials: [],
  });

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    isActive: false,
    fourPoints: ["", "", "", ""],
    testimonials: [],
    visibleSections: ALL_SECTIONS.map((s) => s.key),
    seo: {
      metaTitle: "",
      metaDescription: "",
      codeSnippet: "",
    },
  });

  const toggleSection = (key) => {
    setFormData((prev) => {
      const sections = prev.visibleSections.includes(key)
        ? prev.visibleSections.filter((s) => s !== key)
        : [...prev.visibleSections, key];
      return { ...prev, visibleSections: sections };
    });
  };

  const isSectionVisible = (key) => formData.visibleSections.includes(key);

  // Image States
  const [image, setImage] = useState(null); // File object (for new upload)
  const [imagePreview, setImagePreview] = useState(null); // URL (existing or new preview)

  // Company Images: array of { backgroundImage, backgroundImagePreview, backgroundImageFile, logo, logoPreview, logoFile, link }
  const [companyImages, setCompanyImages] = useState([]);

  // Featured Spaces
  const [featuredSpaces, setFeaturedSpaces] = useState([]);

  // Fetch Dependencies and Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Dependencies
        const depRes = await fetch("/api/admin/solutions/dependencies");
        const depData = await depRes.json();
        if (depData.success) {
          setDependencies(depData.data);
        }

        // Fetch Solution Data
        const res = await fetch(`/api/admin/solutions/${id}`);
        const data = await res.json();

        if (data.success) {
          const s = data.data;
          setFormData({
            name: s.name || "",
            slug: s.slug || "",
            description: s.description || "",
            isActive: s.isActive,
            fourPoints:
              s.fourPoints && s.fourPoints.length === 4
                ? s.fourPoints
                : ["", "", "", ""],
            testimonials: s.testimonials
              ? s.testimonials.map((t) => (typeof t === "object" ? t._id : t))
              : [],
            visibleSections:
              s.visibleSections && s.visibleSections.length > 0
                ? s.visibleSections
                : ALL_SECTIONS.map((sec) => sec.key),
            seo: {
              metaTitle: s.seo?.metaTitle || "",
              metaDescription: s.seo?.metaDescription || "",
              codeSnippet: s.seo?.codeSnippet || "",
            },
          });

          if (s.image) setImagePreview(s.image);

          if (s.companyImages && s.companyImages.length > 0) {
            setCompanyImages(
              s.companyImages.map((ci) => {
                // Handle old string format gracefully
                if (typeof ci === "string") {
                  return {
                    backgroundImage: ci,
                    backgroundImagePreview: ci,
                    backgroundImageFile: null,
                    logo: "",
                    logoPreview: "",
                    logoFile: null,
                    link: "",
                  };
                }
                return {
                  backgroundImage: ci.backgroundImage || "",
                  backgroundImagePreview: ci.backgroundImage || "",
                  backgroundImageFile: null,
                  logo: ci.logo || "",
                  logoPreview: ci.logo || "",
                  logoFile: null,
                  link: ci.link || "",
                };
              })
            );
          }

          if (s.featuredSpaces && s.featuredSpaces.length > 0) {
            setFeaturedSpaces(
              s.featuredSpaces.map((space) => ({
                name: space.name,
                image: null,
                preview: space.image,
              })),
            );
          } else {
            setFeaturedSpaces([{ name: "", image: null, preview: "" }]);
          }
        } else {
          alert("Failed to fetch solution details");
          router.push("/admin/solutions");
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setInitialLoading(false);
      }
    };

    if (id) fetchData();
  }, [id, router]);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
      return newData;
    });
  };

  const handlePointChange = (index, value) => {
    const newPoints = [...formData.fourPoints];
    newPoints[index] = value;
    setFormData((prev) => ({ ...prev, fourPoints: newPoints }));
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

  // Image Handlers
  const handleFeaturedImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const addCompanyImage = () => {
    setCompanyImages((prev) => [
      ...prev,
      {
        backgroundImage: "",
        backgroundImagePreview: "",
        backgroundImageFile: null,
        logo: "",
        logoPreview: "",
        logoFile: null,
        link: "",
      },
    ]);
  };

  const removeCompanyImage = (index) => {
    setCompanyImages((prev) => prev.filter((_, i) => i !== index));
  };

  const updateCompanyImageField = (index, field, value) => {
    setCompanyImages((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleCompanyBgChange = (index, e) => {
    const file = e.target.files?.[0];
    if (file) {
      updateCompanyImageField(index, "backgroundImageFile", file);
      updateCompanyImageField(index, "backgroundImagePreview", URL.createObjectURL(file));
    }
  };

  const handleCompanyLogoChange = (index, e) => {
    const file = e.target.files?.[0];
    if (file) {
      updateCompanyImageField(index, "logoFile", file);
      updateCompanyImageField(index, "logoPreview", URL.createObjectURL(file));
    }
  };

  const addSpace = () => {
    setFeaturedSpaces((prev) => [
      ...prev,
      { name: "", image: null, preview: "" },
    ]);
  };

  const removeSpace = (index) => {
    setFeaturedSpaces((prev) => prev.filter((_, i) => i !== index));
  };

  const updateSpaceName = (index, value) => {
    const newSpaces = [...featuredSpaces];
    newSpaces[index].name = value;
    setFeaturedSpaces(newSpaces);
  };

  const updateSpaceImage = (index, file) => {
    const newSpaces = [...featuredSpaces];
    newSpaces[index].image = file;
    newSpaces[index].preview = URL.createObjectURL(file);
    setFeaturedSpaces(newSpaces);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("slug", formData.slug);
      data.append("description", formData.description);
      data.append("isActive", formData.isActive);

      // SEO
      if (formData.seo) {
        data.append("seo[metaTitle]", formData.seo.metaTitle);
        data.append("seo[metaDescription]", formData.seo.metaDescription);
        data.append("seo[codeSnippet]", formData.seo.codeSnippet);
      }

      formData.fourPoints.forEach((point) => data.append("fourPoints", point));
      formData.testimonials.forEach((id) => data.append("testimonials", id));
      data.append("visibleSectionsUpdate", "true");
      formData.visibleSections.forEach((s) => data.append("visibleSections", s));

      if (image) {
        data.append("image", image);
      } else if (imagePreview) {
        // If no new file, but we have a preview (existing URL), we might not need to send anything
        // if the backend keeps existing by default.
        // BUT my backend logic checks: if (imageFile === "") ...
        // if (imageFile && typeof imageFile === "object") ...
        // If I don't send "image" field, result is null.
        // Backend: const imageFile = formData.get("image"); let imagePath = existingSolution.image;
        // So if field is missing, it keeps existing. GOOD.
      }

      // Company Images (structured)
      companyImages.forEach((ci, index) => {
        if (ci.backgroundImageFile) {
          data.append(`companyImages[${index}][backgroundImage]`, ci.backgroundImageFile);
        } else if (ci.backgroundImage) {
          data.append(`companyImages[${index}][backgroundImage]`, ci.backgroundImage);
        }
        if (ci.logoFile) {
          data.append(`companyImages[${index}][logo]`, ci.logoFile);
        } else if (ci.logo) {
          data.append(`companyImages[${index}][logo]`, ci.logo);
        }
        data.append(`companyImages[${index}][link]`, ci.link || "");
      });

      // Community Images and Networking were moved globally

      // Featured Spaces
      featuredSpaces.forEach((space, index) => {
        data.append(`featuredSpaces[${index}][name]`, space.name);
        if (space.image) {
          data.append(`featuredSpaces[${index}][image]`, space.image);
        } else if (space.preview) {
          data.append(`featuredSpaces[${index}][image]`, space.preview);
        }
      });

      const res = await fetch(`/api/admin/solutions/${id}`, {
        method: "PUT",
        body: data,
      });

      const result = await res.json();

      if (result.success) {
        router.push("/admin/solutions");
      } else {
        alert(result.error || "Failed to update solution");
      }
    } catch (error) {
      console.error("Error updating solution:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="p-10 flex justify-center">
        <Loader2 className="animate-spin text-brand-primary" />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-[1440px] mx-auto w-full"
    >
      <PageHeader
        title="Edit Solution"
        actions={
          <>
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 uppercase transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-brand-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-teal-600 transition shadow-sm uppercase disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Save size={16} />
              )}
              Update
            </button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Column - Left */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <FormInput
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Managed Office"
              required
            />
            <FormInput
              label="Slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="url"
            />
            <FormTextarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write Short Description"
              rows={6}
            />
          </div>

          {/* Company Images */}
          {isSectionVisible("companyImages") && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Company Images</h3>
              <button
                type="button"
                onClick={addCompanyImage}
                className="flex items-center gap-2 text-sm text-brand-primary font-medium hover:text-teal-700"
              >
                <Plus size={16} /> Add Entry
              </button>
            </div>
            <div className="space-y-4">
              {companyImages.map((ci, index) => (
                <div key={index} className="p-4 border border-gray-100 rounded-lg bg-gray-50/50 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-gray-500 uppercase">Entry {index + 1}</span>
                    <button type="button" onClick={() => removeCompanyImage(index)} className="text-gray-400 hover:text-red-500 p-1">
                      <X size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Background Image */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Background Image</label>
                      <label className="flex flex-col items-center justify-center w-full h-28 rounded-lg border-2 border-dashed border-gray-300 bg-white hover:bg-gray-50 cursor-pointer overflow-hidden">
                        {ci.backgroundImagePreview ? (
                          <img src={ci.backgroundImagePreview} alt="BG" className="w-full h-full object-cover" />
                        ) : (
                          <>
                            <UploadCloud size={20} className="text-gray-400" />
                            <span className="text-[10px] text-gray-500 mt-1">Upload</span>
                          </>
                        )}
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleCompanyBgChange(index, e)} />
                      </label>
                    </div>
                    {/* Logo */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Logo</label>
                      <label className="flex flex-col items-center justify-center w-full h-28 rounded-lg border-2 border-dashed border-gray-300 bg-white hover:bg-gray-50 cursor-pointer overflow-hidden">
                        {ci.logoPreview ? (
                          <img src={ci.logoPreview} alt="Logo" className="w-full h-full object-contain p-2" />
                        ) : (
                          <>
                            <UploadCloud size={20} className="text-gray-400" />
                            <span className="text-[10px] text-gray-500 mt-1">Upload</span>
                          </>
                        )}
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleCompanyLogoChange(index, e)} />
                      </label>
                    </div>
                  </div>
                  {/* Link */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Link (URL)</label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-primary focus:ring-brand-primary bg-white"
                      placeholder="https://example.com"
                      value={ci.link}
                      onChange={(e) => updateCompanyImageField(index, "link", e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          )}

          {isSectionVisible("featuredSpaces") && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Featured Spaces
            </h3>
            <div className="space-y-4">
              {featuredSpaces.map((space, index) => (
                <div
                  key={index}
                  className="flex gap-4 items-start p-4 border border-gray-100 rounded-lg bg-gray-50/50"
                >
                  <label className="flex flex-col items-center justify-center w-24 h-24 shrink-0 rounded-lg border-2 border-dashed border-gray-300 bg-white hover:bg-gray-50 cursor-pointer overflow-hidden">
                    {space.preview ? (
                      <img
                        src={space.preview}
                        alt="Space"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <>
                        <UploadCloud size={20} className="text-gray-400" />
                        <span className="text-[10px] text-gray-500 mt-1 text-center px-1">
                          Upload Image
                        </span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0])
                          updateSpaceImage(index, e.target.files[0]);
                      }}
                    />
                  </label>

                  <div className="flex-1 space-y-2">
                    <label className="block text-xs font-semibold text-gray-700">
                      Content
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-primary focus:ring-brand-primary bg-white"
                      placeholder="naraina, arise building, delhi"
                      value={space.name}
                      onChange={(e) => updateSpaceName(index, e.target.value)}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeSpace(index)}
                    className="text-gray-400 hover:text-red-500 p-1"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addSpace}
                className="flex items-center gap-2 text-sm text-brand-primary font-medium hover:text-teal-700"
              >
                <Plus size={16} /> Add Another Space
              </button>
            </div>
          </div>
          )}

          {/* Testimonials */}
          {isSectionVisible("testimonials") && (
          <FormCheckboxGrid
            label="Testimonials"
            name="testimonials"
            options={dependencies.testimonials.map((t) => ({
              value: t._id,
              label: t.clientName,
            }))}
            selectedValues={formData.testimonials}
            onChange={handleCheckboxChange}
          />
          )}

          <SEOForm
            values={formData.seo}
            onChange={(newSeo) =>
              setFormData((prev) => ({ ...prev, seo: newSeo }))
            }
          />
        </div>

        {/* Sidebar - Right */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <FormSelect
              label="Property Status"
              name="isActive"
              value={formData.isActive.toString()}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isActive: e.target.value === "true",
                }))
              }
              options={[
                { value: "false", label: "Draft" },
                { value: "true", label: "Published" },
              ]}
            />
          </div>

          {/* Visible Sections */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Visible Sections</h3>
            <p className="text-xs text-gray-500">Toggle which sections appear on the frontend page.</p>
            {ALL_SECTIONS.map((section) => (
              <label key={section.key} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.visibleSections.includes(section.key)}
                  onChange={() => toggleSection(section.key)}
                  className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary h-4 w-4"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">{section.label}</span>
              </label>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Featured Image
            </h3>
            <div className="w-full h-48 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center overflow-hidden relative group">
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Featured"
                    className="w-full h-full object-cover"
                  />
                  <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <span className="text-white text-sm font-medium">
                      Change Image
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFeaturedImageChange}
                    />
                  </label>
                </>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-gray-100 transition-colors">
                  <UploadCloud size={32} className="text-brand-primary mb-2" />
                  <span className="text-sm text-gray-500">Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFeaturedImageChange}
                  />
                </label>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">
              Featured Points
            </h3>
            {formData.fourPoints.map((point, index) => (
              <input
                key={index}
                type="text"
                value={point}
                onChange={(e) => handlePointChange(index, e.target.value)}
                placeholder={`Point ${index + 1}`}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-brand-primary focus:ring-brand-primary"
              />
            ))}
          </div>
        </div>
      </div>
    </form>
  );
}
