/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, UploadCloud } from "lucide-react";
import PageHeader from "@/app/components/admin/PageHeader";
import {
  FormInput,
  FormTextarea,
  FormSelect,
} from "@/app/components/admin/FormElements";

export default function AddTestimonialPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    clientName: "",
    companyName: "",
    review: "",
    isActive: true, // Default Published
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("clientName", formData.clientName);
      data.append("companyName", formData.companyName);
      data.append("review", formData.review);
      data.append("isActive", formData.isActive);

      if (image) {
        data.append("featuredImage", image);
      }

      const res = await fetch("/api/admin/testimonials", {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (result.success) {
        router.push("/admin/testimonials");
      } else {
        alert(result.error || "Failed to create testimonial");
      }
    } catch (error) {
      console.error("Error creating testimonial:", error);
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
        title="Add New Testimonial"
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
              Save
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
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              placeholder="Sunder P."
              required
            />
            <FormInput
              label="Company Name"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Google"
            />
            <FormTextarea
              label="Review"
              name="review"
              value={formData.review}
              onChange={handleChange}
              placeholder="Write a review"
              rows={6}
              required
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

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Featured Image
            </h3>
            <div className="w-full h-48 rounded-lg bg-[#D0E8E6] flex flex-col items-center justify-center overflow-hidden relative group transition-colors hover:bg-[#c2e0dd]">
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Client"
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
                      onChange={handleImageChange}
                    />
                  </label>
                </>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                  <UploadCloud size={32} className="text-brand-primary mb-2" />
                  <span className="text-xs font-medium text-gray-500">
                    Upload / Drag and Drop the Image
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
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
