import React from "react";
import Image from "next/image";

export default function GlobalBanner({ title, imageSrc }) {
  // Common fallback image or styling
  const imageUrl = imageSrc?.startsWith("http")
    ? imageSrc
    : `/${imageSrc?.replace(/^\//, "")}`;

  return (
    <div className="loctions specific-location virtual" data-aos="fade-up">
      <div className="container-fluid">
        <div className="row pt30">
          <div className="col-lg-12 mb-4">
            <div className="locationscard relative group cursor-pointer">
              <div className="locations-image">
                <img alt={title || "SpringHouse Banner"} src={imageUrl} />

                <div className="shape-bottom">
                  <div className="shape-left-top">
                    <svg
                      className="w-11 h-11"
                      fill="none"
                      style={{
                        width: "1.0rem",
                        height: "1.0rem",
                        stroke: "#ffffff",
                      }}
                      viewBox="0 0 11 11"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11 1.54972e-06L0 0L2.38419e-07 11C1.65973e-07 4.92487 4.92487 1.62217e-06 11 1.54972e-06Z"
                        fill="#fff"
                      ></path>
                    </svg>
                  </div>

                  <div className="shape-right-bottom">
                    <svg
                      className="w-11 h-11"
                      fill="none"
                      style={{
                        width: "1.0rem",
                        height: "1.0rem",
                        stroke: "#ffffff",
                      }}
                      viewBox="0 0 11 11"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11 1.54972e-06L0 0L2.38419e-07 11C1.65973e-07 4.92487 4.92487 1.62217e-06 11 1.54972e-06Z"
                        fill="#0e0f11"
                        style={{ fill: "#ffffff" }}
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="location-content">
                <h1 className="section-title">
                  {title?.toLowerCase() || ""}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
