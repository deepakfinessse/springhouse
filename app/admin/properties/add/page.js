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
  ImageUploader,
} from "@/app/components/admin/FormElements";
import slugify from "slugify";
import SEOForm from "@/app/components/admin/SEOForm";

export default function AddPropertyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
    location: "", // Short location
    fullAddress: "",
    locationOnMap: "", // Google Map Link
    amenities: [],
    activeSolutions: [],
    isActive: false, // Published/Draft
    seo: {
      metaTitle: "",
      metaDescription: "",
      codeSnippet: "",
    },
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Fetch Dependencies
  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        const res = await fetch("/api/admin/properties/dependencies");
        const data = await res.json();
        if (data.success) {
          setDependencies(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch dependencies", error);
      }
    };
    fetchDependencies();
  }, []);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      // Auto-generate slug from name
      if (name === "name") {
        newData.slug = slugify(value, { lower: true });
      }

      return newData;
    });
  };

  // Handle Checkbox Grid Change (Amenities/Solutions)
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
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImages((prev) => [...prev, ...files]);

      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "seo") return;
        if (Array.isArray(formData[key])) {
          formData[key].forEach((item) => data.append(key, item));
        } else {
          data.append(key, formData[key]);
        }
      });

      // SEO
      if (formData.seo) {
        data.append("seo[metaTitle]", formData.seo.metaTitle);
        data.append("seo[metaDescription]", formData.seo.metaDescription);
        data.append("seo[codeSnippet]", formData.seo.codeSnippet);
      }

      images.forEach((image) => {
        data.append("images", image);
      });

      const res = await fetch("/api/admin/properties", {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (result.success) {
        router.push("/admin/properties");
      } else {
        alert(result.error || "Failed to create property");
      }
    } catch (error) {
      console.error("Error creating property:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-[1440px] mx-auto w-full"
    >
      <PageHeader
        title="Add New Property"
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
              Save Property
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

          {/* Amenities & Solutions */}
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

            {/* SEO Section */}
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
          {/* Property Status */}
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

          {/* Image Gallery */}
          <ImageUploader
            label="Image Gallery"
            images={imagePreviews}
            onImageChange={handleImageChange}
            onRemoveImage={removeImage}
          />

          {/* Property Code */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <FormInput
              label="Property Code"
              name="propertyCode"
              value={formData.propertyCode}
              onChange={handleChange}
              placeholder="SHGU005"
            />
          </div>

          {/* Location */}
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
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-brand-primary focus:ring-brand-primary"
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
