"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function LocationCards({ data = [] }) {
  useEffect(() => {
    // Only initialize if lightGallery is loaded globally
    if (typeof window !== "undefined" && window.lightGallery) {
      const el = document.getElementById("galleryGroup1");
      if (el) {
        window.lightGallery(el, {
          plugins: [window.lgVideo, window.lgZoom, window.lgThumbnail],
          zoom: true,
          thumbnail: false,
          speed: 500,
          isMobile: true,
          mobileSettings: {
            controls: true,
          },
        });
      }
    }
  }, []);

  if (!data || data.length === 0) return null;

  // The first city gets a large layout
  const firstCity = data[0];
  // The rest get a smaller half-width layout
  const remainingCities = data.slice(1);

  return (
    <div className="loctions home-l pb30">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-6">
            <span className="section-title-span">Locations</span>
          </div>
        </div>

        {firstCity && (
          <div className="row pt30 location-home-box1 pb-lg-4 mb-md-4">
            <div className="col-lg-12 pb-3 pb-lg-0 pb-md-0">
              <Link
                href={`/coworking-space/${firstCity.slug}`}
                className="locationscard relative"
              >
                <div className="locations-image">
                  <img
                    src={
                      firstCity.image || "/assets/locationimage/placeholder.jpg"
                    }
                    alt={firstCity.name}
                  />
                  <div className="shape-bottom">
                    <div className="shape-left-top">
                      <svg
                        viewBox="0 0 11 11"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-11 h-11"
                        style={{
                          width: "1.8rem",
                          height: "1.8rem",
                          stroke: "#ffffff",
                        }}
                      >
                        <path
                          d="M11 1.54972e-06L0 0L2.38419e-07 11C1.65973e-07 4.92487 4.92487 1.62217e-06 11 1.54972e-06Z"
                          fill="#fff"
                        ></path>
                      </svg>
                    </div>
                    <div className="shape-right-bottom">
                      <svg
                        viewBox="0 0 11 11"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-11 h-11"
                        style={{
                          width: "1.8rem",
                          height: "1.8rem",
                          stroke: "#ffffff",
                        }}
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
                  <span className="section-span">
                    <span className="wavy-line">{firstCity.propertyCount}</span>{" "}
                    centers
                  </span>
                  <h1 className="section-title mt-2">{firstCity.name}</h1>
                </div>
              </Link>
            </div>
          </div>
        )}

        {remainingCities.length > 0 && (
          <div className="row gx-lg-5 location-home-box2">
            {remainingCities.map((city, index) => (
              <div className="col-lg-6 pb-lg-5 pb-3" key={city._id || index}>
                <Link
                  href={`/coworking-space/${city.slug}`}
                  className="locationscard relative"
                >
                  <div className="locations-image location-img1">
                    <img
                      src={city.image || "/frontend_assets/img/delhi1.png"}
                      alt={city.name}
                    />
                    <div className="shape-bottom">
                      <div className="shape-left-top">
                        <svg
                          viewBox="0 0 11 11"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-11 h-11"
                          style={{
                            width: "1.8rem",
                            height: "1.8rem",
                            stroke: "#ffffff",
                          }}
                        >
                          <path
                            d="M11 1.54972e-06L0 0L2.38419e-07 11C1.65973e-07 4.92487 4.92487 1.62217e-06 11 1.54972e-06Z"
                            fill="#fff"
                          ></path>
                        </svg>
                      </div>
                      <div className="shape-right-bottom">
                        <svg
                          viewBox="0 0 11 11"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-11 h-11"
                          style={{
                            width: "1.8rem",
                            height: "1.8rem",
                            stroke: "#ffffff",
                          }}
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
                  <div className="location-content1 absolute">
                    <span className="section-span">
                      <span className="wavy-line">{city.propertyCount}</span>{" "}
                      centers
                    </span>
                    <h1 className="section-title mt-2">{city.name}</h1>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .locations-image {
            position: relative;
            overflow: hidden;
            border-top-left-radius: 20px;
            border-top-right-radius: 20px;
            border-bottom-right-radius: 20px;
        }
        .locations-image .shape-left-top {
            position: absolute;
            top: -27px;
            left: -1px;
            transform: rotate(270deg);
        }
        .locations-image .shape-right-bottom {
            position: absolute;
            right: -28px;
            bottom: -2px;
            -webkit-transform: rotate(270deg);
            -ms-transform: rotate(270deg);
            transform: rotate(270deg);
        }
        .location-img1 img { height: auto; }
        .location-img1 .shape-right-bottom { bottom: -4px; }
        .locations-image.location-img1 {
            border-top-left-radius: 20px;
            border-top-right-radius: 20px;
            border-bottom-right-radius: 20px;
        }
        .locations-image:hover img { transform: scale(1.1); }
      `,
        }}
      />
    </div>
  );
}
