"use client";
import React, { useState, useEffect } from "react";
import { Loader2, Save, Plus, Trash2, GripVertical } from "lucide-react";
import PageHeader from "@/app/components/admin/PageHeader";
import { FormInput } from "@/app/components/admin/FormElements";
import SEOForm from "@/app/components/admin/SEOForm";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

// This functional component handles an individual Section and its array of Questions
const FaqSectionEditor = ({
  sectionIdx,
  section,
  onRemoveSection,
  onUpdateSectionName,
  onAddQuestion,
  onRemoveQuestion,
  onUpdateQuestion,
}) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
    <div className="flex justify-between items-start mb-4 gap-4">
      <div className="flex-1">
        <FormInput
          label="Section Name"
          value={section.sectionName || ""}
          onChange={(e) => onUpdateSectionName(sectionIdx, e.target.value)}
          placeholder="e.g. General FAQs"
          required
        />
      </div>
      <button
        type="button"
        onClick={() => onRemoveSection(sectionIdx)}
        className="mt-7 p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
        title="Remove Section"
      >
        <Trash2 size={18} />
      </button>
    </div>

    {/* Questions loop */}
    <div className="space-y-4 bg-gray-50/50 p-4 rounded-lg border border-gray-100">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-gray-700">
          Questions & Answers
        </span>
        <button
          type="button"
          onClick={() => onAddQuestion(sectionIdx)}
          className="text-xs font-semibold text-brand-primary hover:text-teal-700 flex items-center gap-1"
        >
          <Plus size={14} /> Add Question
        </button>
      </div>

      {(!section.questions || section.questions.length === 0) && (
        <div className="text-sm text-gray-400 italic">
          No questions added to this section yet.
        </div>
      )}

      {section.questions &&
        section.questions.map((q, qIdx) => (
          <div
            key={qIdx}
            className="flex gap-4 items-start bg-white p-4 rounded border border-gray-200 shadow-sm relative group"
          >
            <div className="text-gray-300 cursor-move mt-2">
              <GripVertical size={18} />
            </div>
            <div className="flex-1 space-y-3">
              <input
                type="text"
                value={q.question || ""}
                onChange={(e) =>
                  onUpdateQuestion(sectionIdx, qIdx, "question", e.target.value)
                }
                placeholder="Question (e.g. What are your opening hours?)"
                className="w-full text-sm font-medium outline-none border-b border-transparent focus:border-brand-primary pb-1 transition-colors"
                required
              />
              <div className="bg-white rounded-lg">
                <ReactQuill
                  theme="snow"
                  value={q.answer || ""}
                  onChange={(content) =>
                    onUpdateQuestion(sectionIdx, qIdx, "answer", content)
                  }
                  placeholder="Answer..."
                  className="bg-white"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => onRemoveQuestion(sectionIdx, qIdx)}
              className="text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition mt-1"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
    </div>
  </div>
);

export default function FaqAdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sections, setSections] = useState([]);
  const [globalSeo, setGlobalSeo] = useState({
    metaTitle: "",
    metaDescription: "",
    codeSnippet: "",
  });

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await fetch("/api/faqs");
        const json = await res.json();
        if (json.success && json.data) {
          // Format state to handle incoming array.
          setSections(json.data);
          if (json.data.length > 0 && json.data[0].seo) {
            setGlobalSeo({
              metaTitle: json.data[0].seo.metaTitle || "",
              metaDescription: json.data[0].seo.metaDescription || "",
              codeSnippet: json.data[0].seo.codeSnippet || "",
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch FAQs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  // Section Handlers
  const addSection = () => {
    setSections((prev) => [...prev, { sectionName: "", questions: [] }]);
  };

  const removeSection = (sectionIdx) => {
    setSections((prev) => {
      const newArray = [...prev];
      newArray.splice(sectionIdx, 1);
      return newArray;
    });
  };

  const updateSectionName = (sectionIdx, value) => {
    setSections((prev) => {
      const newArray = [...prev];
      newArray[sectionIdx].sectionName = value;
      return newArray;
    });
  };

  // Question Handlers
  const addQuestion = (sectionIdx) => {
    setSections((prev) => {
      const newArray = JSON.parse(JSON.stringify(prev));
      if (!newArray[sectionIdx].questions) {
        newArray[sectionIdx].questions = [];
      }
      newArray[sectionIdx].questions.push({ question: "", answer: "" });
      return newArray;
    });
  };

  const removeQuestion = (sectionIdx, qIdx) => {
    setSections((prev) => {
      const newArray = JSON.parse(JSON.stringify(prev));
      newArray[sectionIdx].questions.splice(qIdx, 1);
      return newArray;
    });
  };

  const updateQuestion = (sectionIdx, qIdx, field, value) => {
    setSections((prev) => {
      const newArray = JSON.parse(JSON.stringify(prev));
      newArray[sectionIdx].questions[qIdx][field] = value;
      return newArray;
    });
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    // Inject global SEO into the first section
    const currentSections = JSON.parse(JSON.stringify(sections));
    if (currentSections.length > 0) {
      currentSections[0].seo = globalSeo;
    } else {
      currentSections.push({
        sectionName: "General FAQs",
        questions: [],
        seo: globalSeo,
      });
    }

    try {
      const res = await fetch("/api/admin/faq/bulk", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections: currentSections }),
      });
      const result = await res.json();
      if (result.success) {
        alert("FAQs saved successfully!");
      } else {
        alert(result.error || "Failed to save FAQs");
      }
    } catch (error) {
      console.error("Save Error:", error);
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[60vh]">
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
        title="FAQ Management"
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
            Save All Categories
          </button>
        }
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="flex justify-between items-center bg-gray-50 p-6 border-b border-gray-200 rounded-t-xl">
          <div>
            <h2 className="text-lg font-bold text-gray-800">FAQ Sections</h2>
            <p className="text-sm text-gray-500 mt-1">
              Organize your FAQs by creating categorized sections.
            </p>
          </div>
          <button
            type="button"
            onClick={addSection}
            className="flex items-center gap-1.5 text-sm font-medium text-brand-primary bg-white px-5 py-2.5 border border-brand-primary/20 rounded-md hover:bg-brand-primary/5 transition shadow-sm"
          >
            <Plus size={16} /> Add FAQ Section
          </button>
        </div>

        <div className="p-6">
          {sections.map((section, idx) => (
            <FaqSectionEditor
              key={section._id ? section._id.toString() : `new-${idx}`}
              sectionIdx={idx}
              section={section}
              onRemoveSection={removeSection}
              onUpdateSectionName={updateSectionName}
              onAddQuestion={addQuestion}
              onRemoveQuestion={removeQuestion}
              onUpdateQuestion={updateQuestion}
            />
          ))}

          {sections.length === 0 && (
            <div className="text-center py-16 bg-gray-50/50 rounded-xl border border-dashed border-gray-300 text-gray-500">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <Plus className="text-gray-400" />
              </div>
              <p className="font-medium text-gray-700">
                No FAQ Sections Created
              </p>
              <p className="text-sm mt-1 mb-4">
                Click &quot;Add FAQ Section&quot; above to get started.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mb-6">
        <SEOForm
          values={globalSeo}
          onChange={(newSeo) => setGlobalSeo(newSeo)}
        />
      </div>
    </form>
  );
}
