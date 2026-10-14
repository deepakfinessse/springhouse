/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2, Save, UploadCloud, X } from "lucide-react";
import PageHeader from "@/app/components/admin/PageHeader";
import {
  FormInput,
  FormTextarea,
  FormSelect,
  FormCheckboxGrid,
} from "@/app/components/admin/FormElements";
import slugify from "slugify";
import SEOForm from "@/app/components/admin/SEOForm";

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [dependencies, setDependencies] = useState({
    cities: [],
    areas: [],
    amenities: [],
    solutions: [],
  });

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    propertyCode: "",
    description: "",
    city: "",
    area: "",
    size: "",
    location: "",
    fullAddress: "",
    locationOnMap: "",
    amenities: [],
    activeSolutions: [],
    isActive: false,
    seo: {
      metaTitle: "",
      metaDescription: "",
      codeSnippet: "",
    },
  });

  // Gallery State: Array of { type: 'url' | 'file', url: string, file?: File }
  const [gallery, setGallery] = useState([]);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Dependencies
        const depRes = await fetch("/api/admin/properties/dependencies");
        const depData = await depRes.json();
        if (depData.success) {
          setDependencies(depData.data);
        }

        // Property Data
        const res = await fetch(`/api/admin/properties/${id}`);
        const data = await res.json();

        if (data.success) {
          const p = data.data;
          setFormData({
            name: p.name || "",
            slug: p.slug || "",
            propertyCode: p.propertyCode || "",
            description: p.description || "",
            city: p.city?._id || p.city || "",
            area: p.area?._id || p.area || "",
            size: p.size || "",
            location: p.location || "",
            fullAddress: p.fullAddress || "",
            locationOnMap: p.locationOnMap || "",
            amenities: p.amenities
              ? p.amenities.map((a) => (typeof a === "object" ? a._id : a))
              : [],
            activeSolutions: p.activeSolutions
              ? p.activeSolutions.map((s) =>
                  typeof s === "object" ? s._id : s,
                )
              : [],
            isActive: p.isActive,
            seo: {
              metaTitle: p.seo?.metaTitle || "",
              metaDescription: p.seo?.metaDescription || "",
              codeSnippet: p.seo?.codeSnippet || "",
            },
          });

          // Gallery
          if (p.images && p.images.length > 0) {
            setGallery(p.images.map((url) => ({ type: "url", url })));
          }
        } else {
          alert("Failed to fetch property details");
          router.push("/admin/properties");
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setInitialLoading(false);
      }
    };

    if (id) fetchData();
  }, [id, router]);

  // Handlers
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

  // Gallery Handlers
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newItems = files.map((file) => ({
        type: "file",
        file,
        url: URL.createObjectURL(file),
      }));
      setGallery((prev) => [...prev, ...newItems]);
    }
  };

  const removeImage = (index) => {
    setGallery((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();

      // Basic Fields
      Object.keys(formData).forEach((key) => {
        if (key === "seo" || key === "amenities" || key === "activeSolutions")
          return;
        data.append(key, formData[key]);
      });

      // Checkbox Arrays
      formData.amenities.forEach((id) => data.append("amenities", id));
      formData.activeSolutions.forEach((id) =>
        data.append("activeSolutions", id),
      );

      // SEO
      if (formData.seo) {
        data.append("seo[metaTitle]", formData.seo.metaTitle);
        data.append("seo[metaDescription]", formData.seo.metaDescription);
        data.append("seo[codeSnippet]", formData.seo.codeSnippet);
      }

      // Images
      gallery.forEach((item) => {
        if (item.type === "url") {
          data.append("existingImages", item.url);
        } else if (item.type === "file") {
          data.append("images", item.file);
        }
      });

      const res = await fetch(`/api/admin/properties/${id}`, {
        method: "PUT",
        body: data,
      });

      const result = await res.json();

      if (result.success) {
        router.push("/admin/properties");
      } else {
        alert(result.error || "Failed to update property");
      }
    } catch (error) {
      console.error("Error updating property:", error);
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
        title="Edit Property"
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
              placeholder="Enter name"
              required
            />
            <FormInput
              label="Slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="url"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormSelect
                label="Select City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                options={dependencies.cities.map((c) => ({
                  value: c._id,
                  label: c.name,
                }))}
                placeholder="Select"
                required
              />
              <FormSelect
                label="Select Area"
                name="area"
                value={formData.area}
                onChange={handleChange}
                options={dependencies.areas
                  .filter((a) => a.city === formData.city)
                  .map((a) => ({ value: a._id, label: a.name }))}
                placeholder="Select"
                required
              />
              <FormInput
                label="Size (in sqf.)"
                name="size"
                type="number"
                value={formData.size}
                onChange={handleChange}
                placeholder="235"
              />
            </div>
            <FormTextarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write Short Description"
              rows={4}
            />
          </div>

          <div className="space-y-6">
            <FormCheckboxGrid
              label="Amenities"
              name="amenities"
              options={dependencies.amenities.map((a) => ({
                value: a._id,
                label: a.name,
              }))}
              selectedValues={formData.amenities}
              onChange={handleCheckboxChange}
            />

            <FormCheckboxGrid
              label="Active Solutions"
              name="activeSolutions"
              options={dependencies.solutions.map((s) => ({
                value: s._id,
                label: s.name,
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

          {/* Custom Gallery Logic since FormElements ImageUploader might rely on simple implementation */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Image Gallery
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              {gallery.map((item, index) => (
                <div
                  key={index}
                  className="relative aspect-video rounded-lg overflow-hidden group border border-gray-200"
                >
                  <img
                    src={item.url}
                    alt={`Gallery ${index}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>

            <label className="flex flex-col items-center justify-center w-full h-32 cursor-pointer hover:bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg transition-colors">
              <UploadCloud size={32} className="text-brand-primary mb-2" />
              <span className="text-sm text-gray-500">Upload New Images</span>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <FormInput
              label="Property Code"
              name="propertyCode"
              value={formData.propertyCode}
              onChange={handleChange}
              placeholder="SHGU005"
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            {/* <h3 className="text-sm font-semibold text-gray-900">Location</h3> */}
            <div className="space-y-4">
              {/* <FormInput
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Plot No. 1SP"
              /> */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Location on Google Map
                </label>
                <input
                  type="text"
                  name="locationOnMap"
                  value={formData.locationOnMap}
                  onChange={handleChange}
                  placeholder="Paste google map link"
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-brand-primary focus:ring-brand-primary"
                />
              </div>
              <FormTextarea
                label="Full Address"
                name="fullAddress"
                value={formData.fullAddress}
                onChange={handleChange}
                placeholder="Complete postal address..."
                rows={2}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
