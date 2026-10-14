"use client";
import "./Solution.css";
import Slider from "react-slick";

export default function PropertyCardSlider({ property }) {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  return (
    <div className="col-md-6 col-12 back pe-4 mb-4">
      <div className="row card-bg-colour">
        {/* Slider */}
        <div className="col-lg-5 col-md-4 col-12 position-relative p-0 ">
          <Slider {...settings} className="image-slider1">
            {property.images?.map((img, index) => (
              <div className="extra-bottom-space" key={index}>
                <img
                  src={
                    img.startsWith("http") ? img : `/${img.replace(/^\//, "")}`
                  }
                  alt={property.name}
                />
              </div>
            ))}
          </Slider>

          <div className="service-img1 service-img2">
            <div className="shape-bottom-right">
              <div className="shape-right-top">
                <svg viewBox="0 0 11 11" width="5" height="5">
                  <path d="M11 0L0 0L0 11C0 4.92 4.92 0 11 0Z" fill="#f6f4f4" />
                </svg>
              </div>

              <div className="shape-left-bottom">
                <svg viewBox="0 0 11 11" width="5" height="5">
                  <path d="M11 0L0 0L0 11C0 4.92 4.92 0 11 0Z" fill="#ffffff" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="col-md-7 position-relative padding-b pt-3 pb-md-0 pb-lg-0 ps-lg-4 ps-md-4 ps-3 pb-3 d-flex flex-column justify-content-start">
          <div className="ps-lg-4 ps-md-4 ps-0">
            <div className="text-small mb-lg-3 mb-md-3 mb-1">
              {property.propertyCode}
            </div>

            <div className="h5 mb-0">{property.name}</div>

            <div className="text-small mb-2">{property.fullAddress}</div>
          </div>

          <div className="bottom-right">
            <a
              href={`/coworking-space/${property.city?.slug}/${property.slug}`}
              className="details-link detail"
            >
              DETAILS
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
