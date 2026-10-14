/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { UploadCloud, X } from "lucide-react";

export function FormInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  className = "",
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-brand-primary focus:ring-brand-primary disabled:bg-gray-50 disabled:text-gray-500"
      />
    </div>
  );
}

export function FormTextarea({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  rows = 4,
  className = "",
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-brand-primary focus:ring-brand-primary"
      />
    </div>
  );
}

export function FormSelect({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  placeholder = "Select...",
  className = "",
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-brand-primary focus:ring-brand-primary"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function FormCheckboxGrid({
  label,
  options,
  selectedValues,
  onChange,
  name,
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-heading font-bold text-gray-800 mb-4 border-b pb-2">
        {label}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {options.map((opt) => (
          <label
            key={opt.value}
            className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-gray-50 border border-transparent hover:border-gray-100"
          >
            <input
              type="checkbox"
              checked={selectedValues.includes(opt.value)}
              onChange={() => onChange(name, opt.value)}
              className="rounded text-brand-primary focus:ring-brand-primary h-4 w-4 border-gray-300"
            />
            <span className="text-sm text-gray-700">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export function ImageUploader({ label, images, onImageChange, onRemoveImage }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">{label}</h3>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {images.map((src, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group"
          >
            <img
              src={src}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => onRemoveImage(index)}
              className="absolute top-1 right-1 bg-white/80 p-1 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        <label className="flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed border-brand-primary/30 bg-brand-primary/5 hover:bg-brand-primary/10 cursor-pointer transition-colors text-brand-primary">
          <UploadCloud size={24} />
          <span className="text-xs font-semibold mt-1">Add</span>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={onImageChange}
            className="hidden"
          />
        </label>
      </div>
      <p className="text-xs text-gray-400">
        First image will be the main thumbnail.
      </p>
    </div>
  );
}

export function SingleImageUploader({
  label,
  image,
  onImageChange,
  onRemoveImage,
  maxSizeMB = 2,
  allowedTypes = ["image/jpeg", "image/png", "image/webp"],
  helperText = "Upload a PNG, JPG, or WEBP image (max 2MB)",
}) {
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      alert(`Invalid file type. Allowed types are: PNG, JPG, WEBP.`);
      e.target.value = "";
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`File size exceeds the ${maxSizeMB}MB limit.`);
      e.target.value = "";
      return;
    }

    if (onImageChange) onImageChange(e);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">{label}</h3>

      <div className="flex gap-4 mb-4">
        {image ? (
          <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-200 group">
            <img
              src={image}
              alt="Preview"
              className="w-full h-full object-contain"
            />
            <button
              type="button"
              onClick={onRemoveImage}
              className="absolute top-1 right-1 bg-white/80 p-1 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-32 h-32 rounded-lg border-2 border-dashed border-brand-primary/30 bg-brand-primary/5 hover:bg-brand-primary/10 cursor-pointer transition-colors text-brand-primary">
            <UploadCloud size={24} />
            <span className="text-xs font-semibold mt-1">Add Logo</span>
            <input
              type="file"
              accept={allowedTypes.join(",")}
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}
      </div>
      <p className="text-xs text-gray-400">{helperText}</p>
    </div>
  );
}
