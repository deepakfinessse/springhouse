"use client";
import React from "react";

export default function AboutLocation({ 
  city, 
  activeSolutions, 
  selectedSolution, 
  onSolutionChange,
  areas,
  selectedArea,
  onAreaChange
}) {
  if (!city) return null;

  return (
    <section className="specfic-guru pt30" data-aos="fade-up">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 mb-4">

            {city.description ? (
              <div 
                className="rich-text-content ql-content"
                dangerouslySetInnerHTML={{ 
                  __html: city.description.replace(/&nbsp;/g, ' ').replace(/\u00A0/g, ' ') 
                }} 
              />
            ) : (
              <p>No description available for {city.name}.</p>
            )}
          </div>
          <div className="col-12 col-md-8 mt-4">
            <div className="loaction-tab flex gap-2 flex-wrap">
              {areas?.map((area) => {
                const areaIdentity = area.slug || area._id || area.name;
                return (
                  <a 
                    key={areaIdentity}
                    href={`#area-${areaIdentity}`} 
                    onClick={(e) => { 
                      e.preventDefault(); 
                      onAreaChange?.(areaIdentity); 
                      const targetId = `area-${areaIdentity}`;
                      const element = document.getElementById(targetId);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className={selectedArea === areaIdentity ? "active" : ""}
                    style={{ cursor: "pointer", ...(selectedArea === areaIdentity ? { color: "#fff", background: "#0e0f11" } : {}) }}
                  >
                    {area.name}
                  </a>
                );
              })}
            </div>
          </div>
          <div className="col-12 col-md-4 mt-4">
            <div className="loaction-drop">
              <form action="#" id="filterForm" method="POST" onSubmit={(e) => e.preventDefault()}>
                <select
                  className="form-select"
                  name="solution_id"
                  value={selectedSolution}
                  onChange={(e) => onSolutionChange?.(e.target.value)}
                >
                  <option value="">Select a Solution</option>
                  {activeSolutions?.map((sol) => {
                    const name = sol.name || sol.title || sol.slug || "";
                    const formattedName = name ? name.charAt(0).toUpperCase() + name.slice(1).toLowerCase() : "";
                    return (
                      <option key={sol._id || sol.slug} value={sol.slug || sol._id}>
                        {formattedName}
                      </option>
                    );
                  })}
                </select>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
