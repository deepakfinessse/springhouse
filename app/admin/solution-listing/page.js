/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
import { Loader2, Save } from "lucide-react";
import PageHeader from "@/app/components/admin/PageHeader";
import {
    FormTextarea,
    FormCheckboxGrid,
} from "@/app/components/admin/FormElements";
import SEOForm from "@/app/components/admin/SEOForm";

export default function SolutionListingAdmin() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Checkbox dependencies
    const [solutions, setSolutions] = useState([]);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        activeSolutions: [], // Array of ObjectIds
        seo: {
            metaTitle: "",
            metaDescription: "",
            codeSnippet: "",
        },
    });

    // Fetch Initial Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [pageRes, solutionsRes] = await Promise.all([
                    fetch("/api/admin/solutions-page"),
                    fetch("/api/admin/solutions?limit=100"),
                ]);

                const pData = await pageRes.json();
                const sData = await solutionsRes.json();

                if (sData.success) setSolutions(sData.data);

                if (pData.success && pData.data) {
                    const hp = pData.data;

                    setFormData({
                        title: hp.title || "",
                        description: hp.description || "",
                        activeSolutions: hp.activeSolutions || [],
                        seo: {
                            metaTitle: hp.seo?.metaTitle || "",
                            metaDescription: hp.seo?.metaDescription || "",
                            codeSnippet: hp.seo?.codeSnippet || "",
                        },
                    });
                }
            } catch (error) {
                console.error("Failed to fetch solutions page data", error);
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
            setFormData((prev) => ({
                ...prev,
                [section]: { ...prev[section], [field]: value },
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleCheckboxChange = (category, id) => {
        setFormData((prev) => {
            const list = prev[category] || [];
            if (list.includes(id)) {
                return { ...prev, [category]: list.filter((item) => item !== id) };
            } else {
                return { ...prev, [category]: [...list, id] };
            }
        });
    };

    // Submit Form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const data = new FormData();
            data.append("title", formData.title);
            data.append("description", formData.description);

            // Solutions
            formData.activeSolutions.forEach((id) =>
                data.append("activeSolutions", id),
            );

            // SEO
            if (formData.seo) {
                data.append("seo[metaTitle]", formData.seo.metaTitle || "");
                data.append("seo[metaDescription]", formData.seo.metaDescription || "");
                data.append("seo[codeSnippet]", formData.seo.codeSnippet || "");
            }

            const res = await fetch("/api/admin/solutions-page", {
                method: "PUT",
                body: data,
            });

            const result = await res.json();

            if (result.success) {
                alert("Solutions Page saved successfully!");
            } else {
                alert(result.error || "Failed to save data");
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

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-8 max-w-[1440px] mx-auto w-full pb-20"
        >
            <PageHeader
                title="Solutions Page Admin"
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

            {/* Basic Details Section */}
            <section className="space-y-4">
                <h2 className="text-[15px] font-bold text-gray-800">Heading & Description</h2>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col space-y-4">
                    <FormTextarea
                        label="Title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        rows={2}
                        placeholder="tailored workspaces for every business"
                    />
                    <FormTextarea
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={5}
                        placeholder="Description here..."
                    />
                </div>
            </section>

            <hr className="border-gray-300" />

            {/* Active Solutions Section */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <FormCheckboxGrid
                    label={
                        <span className="text-[15px] font-bold text-gray-800">
                            Active Solutions to Show
                        </span>
                    }
                    name="activeSolutions"
                    options={solutions.map((s) => ({
                        value: s._id,
                        label: s.name || s.title || s.slug,
                    }))}
                    selectedValues={formData.activeSolutions}
                    onChange={handleCheckboxChange}
                />
            </section>

            <hr className="border-gray-300" />

            {/* SEO Section */}
            <SEOForm
                values={formData.seo}
                onChange={(newSeo) => {
                    setFormData((prev) => ({
                        ...prev,
                        seo: newSeo,
                    }));
                }}
            />
        </form>
    );
}
