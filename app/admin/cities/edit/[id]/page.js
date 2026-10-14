/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import PageHeader from "@/app/components/admin/PageHeader";
import {
  FormInput,
  FormTextarea,
  FormSelect,
  FormCheckboxGrid,
} from "@/app/components/admin/FormElements";
import slugify from "slugify";
import SEOForm from "@/app/components/admin/SEOForm";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function EditCityPage({ params }) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dependencies, setDependencies] = useState({
    solutions: [],
  });

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    isActive: false,
    image: "", // Featured Image
    activeSolutions: [],
    seo: {
      metaTitle: "",
      metaDescription: "",
      codeSnippet: "",
    },
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // Fetch Data & Dependencies
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cityRes, amenitiesRes, solutionsRes] = await Promise.all([
          fetch(`/api/admin/cities/${id}`),
          fetch("/api/admin/amenities?limit=100"),
          fetch("/api/admin/solutions?limit=100"),
        ]);

        const cityData = await cityRes.json();
        const amenitiesData = await amenitiesRes.json();
        const solutionsData = await solutionsRes.json();

        if (solutionsData.success) {
          setDependencies((prev) => ({
            ...prev,
            solutions: solutionsData.data,
          }));
        }

        if (cityData.success) {
          const city = cityData.data;
          setFormData({
            name: city.name || "",
            slug: city.slug || "",
            description: city.description || "",
            isActive: city.isActive ?? false,
            image: city.image || "",
            activeSolutions: city.activeSolutions || [],
            seo: {
              metaTitle: city.seo?.metaTitle || "",
              metaDescription: city.seo?.metaDescription || "",
              codeSnippet: city.seo?.codeSnippet || "",
            },
          });

          if (city.image) setImagePreview(city.image);
        } else {
          alert("Failed to fetch city details");
          router.push("/admin/cities");
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, router]);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      isActive: e.target.value === "true",
    }));
  };

  // Handle Checkbox Grid Change (Amenities)
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

  // Handle Image Upload
  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === "main") {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
      }
    }
  };

  const removeImage = (type) => {
    if (type === "main") {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("slug", formData.slug);
      data.append("description", formData.description);
      data.append("isActive", formData.isActive);

      formData.activeSolutions.forEach((id) => data.append("activeSolutions", id));

      if (formData.seo) {
        data.append("seo[metaTitle]", formData.seo.metaTitle);
        data.append("seo[metaDescription]", formData.seo.metaDescription);
        data.append("seo[codeSnippet]", formData.seo.codeSnippet);
      }

      if (imageFile) {
        data.append("image", imageFile);
      }

      const res = await fetch(`/api/admin/cities/${id}`, {
        method: "PUT",
        body: data,
      });

      const result = await res.json();

      if (result.success) {
        router.push("/admin/cities");
      } else {
        alert(result.error || "Failed to update city");
      }
    } catch (error) {
      console.error("Error updating city:", error);
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-[1440px] mx-auto w-full"
    >
      <PageHeader
        title="Edit City"
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
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-brand-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-teal-600 transition shadow-sm uppercase disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Save size={16} />
              )}
              Save Changes
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
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <ReactQuill
                theme="snow"
                value={formData.description}
                onChange={(content) => setFormData((prev) => ({ ...prev, description: content }))}
                className="h-[200px] mb-12"
              />
            </div>
          </div>

          <div className="space-y-6">

            <FormCheckboxGrid
              label="Active Solutions"
              name="activeSolutions"
              options={dependencies.solutions.map((s) => ({
                value: s._id,
                label: s.name || s.title || s.slug,
              }))}
              selectedValues={formData.activeSolutions}
              onChange={handleCheckboxChange}
            />

            <SEOForm
              values={formData.seo}
              onChange={(newSeo) =>
                setFormData((prev) => ({ ...prev, seo: newSeo }))
              }
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <FormSelect
              label="Property Status"
              name="isActive"
              value={formData.isActive.toString()}
              onChange={handleStatusChange}
              options={[
                { value: "false", label: "Draft" },
                { value: "true", label: "Published" },
              ]}
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-2">
            <h3 className="block text-sm font-semibold text-gray-700 mb-1">
              Featured Image
            </h3>
            <div className="bg-[#D0E6E4] border-none rounded-lg p-10 text-center flex flex-col items-center justify-center min-h-[200px]">
              {imagePreview ? (
                <div className="relative w-full h-full">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-auto object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage("main")}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-red-50 text-red-500"
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
              ) : (
                <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                  <svg
                    className="w-10 h-10 text-brand-primary mb-3"
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
                  <span className="text-sm text-gray-600 font-medium">
                    Upload / Drag and Drop the Image
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, "main")}
                  />
                </label>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
