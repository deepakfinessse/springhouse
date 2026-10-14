"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import PageHeader from "@/app/components/admin/PageHeader";
import { FormInput, FormSelect } from "@/app/components/admin/FormElements";
import SEOForm from "@/app/components/admin/SEOForm";
import slugify from "slugify";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function AddOtherPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    content: "",
    isActive: true, // Published
    seo: {
      metaTitle: "",
      metaDescription: "",
      codeSnippet: "",
    },
  });

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

  const handleQuillChange = (content) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/other-pages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (result.success) {
        router.push("/admin/other-pages");
      } else {
        alert(result.error || "Failed to create page");
      }
    } catch (error) {
      console.error("Error creating page:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-[1440px] mx-auto w-full pb-20"
    >
      <PageHeader
        title="Create Custom Page"
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
              Save Page
            </button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Column - Left */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <FormInput
              label="Page Title"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Privacy Policy"
              required
            />
            <FormInput
              label="URL Slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="privacy-policy"
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Page Content
            </h3>
            <div className="bg-white rounded-lg">
              <ReactQuill
                theme="snow"
                value={formData.content}
                onChange={handleQuillChange}
                className="h-[500px] mb-12"
              />
            </div>
          </div>

          <SEOForm
            values={formData.seo}
            onChange={(newSeo) =>
              setFormData((prev) => ({ ...prev, seo: newSeo }))
            }
          />
        </div>

        {/* Sidebar - Right */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <FormSelect
              label="Visibility Status"
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
                { value: "true", label: "Active" },
              ]}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
