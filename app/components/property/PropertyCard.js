"use client";
import { useState } from "react";

export default function PropertyCard({ property }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    if (property.images?.length) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property.images?.length) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? property.images.length - 1 : prev - 1,
      );
    }
  };

  const images = property.images || [];
  const currentImage = images[currentImageIndex] || "";

  // Fix Broken Hardcoded Hostinger Image URLs
  const imageUrl = currentImage?.startsWith("http")
    ? currentImage
    : `/${currentImage?.replace(/^\//, "")}`;

  return (
    <div className="col-md-6 back pe-4 mb-4">
      <div className="row">
        {/* Image Slider */}
        <div className="image-size-property col-md-4 col-lg-5 col-12 position-relative p-0">
          <div className="image-slider1" style={{ position: "relative" }}>
            {images.length > 0 ? (
              <>
                <button
                  className="slick-prev slick-arrow"
                  aria-label="Previous"
                  type="button"
                  onClick={prevImage}
                  style={{
                    display: images.length > 1 ? "block" : "none",
                    position: "absolute",
                    left: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 1,
                    background: "rgba(0,0,0,0.5)",
                    border: "none",
                    color: "white",
                    borderRadius: "50%",
                    width: "30px",
                    height: "30px",
                  }}
                >
                  {"<"}
                </button>
                <div className="slick-list draggable">
                  <div className="slick-track">
                    <img
                      src={imageUrl}
                      alt={property.name}
                      className="img-fluid w-100"
                    />
                  </div>
                </div>
                <button
                  className="slick-next slick-arrow"
                  aria-label="Next"
                  type="button"
                  onClick={nextImage}
                  style={{
                    display: images.length > 1 ? "block" : "none",
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 1,
                    background: "rgba(0,0,0,0.5)",
                    border: "none",
                    color: "white",
                    borderRadius: "50%",
                    width: "30px",
                    height: "30px",
                  }}
                >
                  {">"}
                </button>
              </>
            ) : (
              <div
                className="img-fluid w-100"
                style={{
                  background: "#f0f0f0",
                  height: "200px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                No images available
              </div>
            )}
          </div>
          <div className="service-img1 service-img2">
            <div className="shape-bottom-right">
              <div className="shape-right-top">
                <svg
                  viewBox="0 0 11 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ width: 5, height: 5, stroke: "#f6f4f4" }}
                >
                  <path
                    d="M11 1.54972e-06L0 0L2.38419e-07 11C1.65973e-07 4.92487 4.92487 1.62217e-06 11 1.54972e-06Z"
                    fill="#f6f4f4"
                  />
                </svg>
              </div>
              <div className="shape-left-bottom">
                <svg
                  viewBox="0 0 11 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ width: 5, height: 5, stroke: "#f6f4f4" }}
                >
                  <path
                    d="M11 1.54972e-06L0 0L2.38419e-07 11C1.65973e-07 4.92487 4.92487 1.62217e-06 11 1.54972e-06Z"
                    fill="#ffffff"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="image-size-propertydetail col-md-8 col-12 padding-t pt-3 pb-md-0 pb-lg-0 ps-lg-3 ps-md-4 ps-3 pb-3 d-flex flex-column justify-content-start">
          <div className="ps-lg-4 ps-md-4 ps-0">
            <div className="text-small mb-2">{property.propertyCode}</div>
            <div className="h5 mb-0">{property.name}</div>
            <div className="text-small mb-2">{property.fullAddress}</div>
            {property.size && (
              <div className="text-small mb-2">
                <strong>Size:</strong> {property.size.toLocaleString()} sq. ft.
              </div>
            )}
          </div>
          <div className="bottom-right">
            <a
              href={`/coworking-space/${property.city?.slug}/${property.slug}`}
              className="details-link"
            >
              DETAILS
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
