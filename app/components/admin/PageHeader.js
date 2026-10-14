import React from "react";

export default function PageHeader({ title, actions, children }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
      <h1 className="font-heading text-2xl font-bold uppercase text-brand-dark">
        {title}
      </h1>
      <div className="flex gap-2">
        {actions}
        {children}
      </div>
    </div>
  );
}
