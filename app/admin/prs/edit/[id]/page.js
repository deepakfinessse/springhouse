"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import PageHeader from "@/app/components/admin/PageHeader";
import {
  FormInput,
  FormSelect,
  ImageUploader,
} from "@/app/components/admin/FormElements";
import slugify from "slugify";

export default function EditPRPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    link: "",
    isActive: true,
    publishDate: "",
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    const fetchPR = async () => {
      try {
        setFetching(true);
        const res = await fetch(`/api/admin/prs/${params.id}`);
        const result = await res.json();

        if (result.success && result.data) {
          const pr = result.data;
          setFormData({
            title: pr.title || "",
            link: pr.link || "",
            isActive: pr.isActive !== false,
            publishDate: pr.publishDate 
              ? new Date(pr.publishDate).toISOString().split("T")[0]
              : new Date(pr.createdAt || Date.now()).toISOString().split("T")[0],
          });

          if (pr.imageURL) {
            setImagePreviews([pr.imageURL]);
          }
        }
      } catch (e) {
        console.error("Error fetching PR:", e);
      } finally {
        setFetching(false);
      }
    };

    if (params.id) fetchPR();
  }, [params.id]);

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

  // Handle Image Upload
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const file = files[0];
      setImages([file]);
      setImagePreviews([URL.createObjectURL(file)]);
    }
  };

  const removeImage = () => {
    setImages([]);
    setImagePreviews([]);
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key] === null ? "" : formData[key]);
      });

      if (images.length > 0) {
        data.append("image", images[0]);
      }

      const res = await fetch(`/api/admin/prs/${params.id}`, {
        method: "PUT",
        body: data,
      });

      const result = await res.json();

      if (result.success) {
        router.push("/admin/prs");
      } else {
        alert(result.error || "Failed to edit PR");
      }
    } catch (error) {
      console.error("Error editing PR:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-full min-h-[60vh]">
        <Loader2 className="animate-spin text-brand-primary" size={32} />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-[1440px] mx-auto w-full pb-20"
    >
      <PageHeader
        title="Edit PR"
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
              label="PR Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter PR title"
              required
            />
            <FormInput
              label="External Link URL"
              name="link"
              type="url"
              value={formData.link}
              onChange={handleChange}
              placeholder="https://example.com/pr-article"
              required
            />
          </div>
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
                { value: "true", label: "Published" },
              ]}
            />
            <div className="mt-4">
              <FormInput
                label="Publish Date"
                type="date"
                name="publishDate"
                value={formData.publishDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Thumbnail Uploader */}
          <ImageUploader
            label="PR Thumbnail"
            images={imagePreviews}
            onImageChange={handleImageChange}
            onRemoveImage={removeImage}
            maxUploads={1}
          />
        </div>
      </div>
    </form>
  );
}
