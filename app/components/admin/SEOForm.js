import React from "react";

export default function SEOForm({ values, onChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...values, [name]: value });
  };

  return (
    <div className="space-y-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-medium text-gray-900">SEO Settings</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Meta Title
          </label>
          <input
            type="text"
            name="metaTitle"
            placeholder="SEO Title (60 chars max recommended)"
            value={values?.metaTitle || ""}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-brand-primary focus:ring-brand-primary"
          />
          <p className="mt-1 text-xs text-gray-500">
            {values?.metaTitle?.length || 0} characters (60 recommended)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Meta Description
          </label>
          <textarea
            name="metaDescription"
            placeholder="SEO Description (160 chars max recommended)"
            value={values?.metaDescription || ""}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-brand-primary focus:ring-brand-primary h-24 resize-none"
          />
          <p className="mt-1 text-xs text-gray-500">
            {values?.metaDescription?.length || 0} characters (160 recommended)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Custom Code Snippet
          </label>
          <textarea
            name="codeSnippet"
            placeholder="<script>...</script> or other header codes"
            value={values?.codeSnippet || ""}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-brand-primary focus:ring-brand-primary h-32 font-mono text-xs"
          />
          <p className="mt-1 text-xs text-gray-500">
            Injects into &lt;head&gt; or top of &lt;body&gt; for this page.
          </p>
        </div>
      </div>
    </div>
  );
}
