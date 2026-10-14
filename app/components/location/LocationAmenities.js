import React from "react";

export default function LocationAmenities({ amenities }) {
  if (!amenities || amenities.length === 0) {
    return null;
  }

  return (
    <section className=" amenities pt6">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12  pb30">
            <span className="section-title-span d-block ">AMENITIES</span>
          </div>
        </div>
        <div className="row line justify-content-center px-3">
          {amenities.map((amenity, index) => {
             // Handle potential missing file paths gracefully
             const imgSrc = amenity.featuredIcon?.startsWith("http") 
               ? amenity.featuredIcon
               : `/${amenity.featuredIcon?.replace(/^\//, '') || "assets/amenities/wifi.png"}`;

             return (
               <div key={amenity._id || index} className="col-md-3 col-6 mb-5 d-flex justify-content-center">
                 <div className="icon-amen text-center w-100">
                   <img
                     src={imgSrc}
                     alt={amenity.name}
                     width={50}
                     height={50}
                   />
                   <a href="#" className="mt-2 d-inline-block" style={{ textDecoration: 'none' }}>{amenity.name}</a>
                 </div>
               </div>
             );
          })}
        </div>
      </div>
    </section>
  );
}
