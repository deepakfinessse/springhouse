"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function SolutionsMobile({ data = [] }) {
  useEffect(() => {
    let intervalId;
    const initSlider = () => {
      if (
        typeof window !== "undefined" &&
        window.$ &&
        window.$.fn.owlCarousel
      ) {
        if (!window.$(".owl-sec").hasClass("owl-loaded")) {
          window.$(".owl-sec").owlCarousel({
            loop: true,
            animateOut: "fadeOut",
            animateIn: "fadeIn",
            margin: 20,
            nav: false,
            dots: true,
            autoplay: true,
            autoplayTimeout: 4000,
            responsive: {
              0: { items: 1 },
              576: { items: 1 },
              768: { items: 2 },
              992: { items: 3 },
            },
          });
        }
        clearInterval(intervalId);
      }
    };
    intervalId = setInterval(initSlider, 100);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="service-section d-lg-none d-md-none d-block">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12 pb-3 pt-4">
            <span className="section-title-span">Solutions</span>
          </div>
        </div>
        <div className="owl-carousel owl-sec owl-theme">
          {data.map((solution, idx) => (
            <div className="col-lg-4 co-md-6 col-sm-6 mb-2" key={idx}>
              <div className="service-card relative">
                <div className="service-img">
                  <img
                    src={
                      solution.image ||
                      "/assets/bannerimage/1747035219_home-banner.jpg"
                    }
                    alt={`${solution.name} – SpringHouse coworking office view`}
                  />
                  <div className="shape-bottom">
                    <div className="shape-left-top">
                      <svg
                        viewBox="0 0 11 11"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-11 h-11"
                        style={{
                          width: "1.0rem",
                          height: "1.0rem",
                          stroke: "#f5f3f3",
                        }}
                      >
                        <path
                          d="M11 1.54972e-06L0 0L2.38419e-07 11C1.65973e-07 4.92487 4.92487 1.62217e-06 11 1.54972e-06Z"
                          fill="#f5f3f3"
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
                          width: "1.0rem",
                          height: "1.0rem",
                          stroke: "#f5f3f3",
                        }}
                      >
                        <path
                          d="M11 1.54972e-06L0 0L2.38419e-07 11C1.65973e-07 4.92487 4.92487 1.62217e-06 11 1.54972e-06Z"
                          fill="#0e0f11"
                          style={{ fill: "#f5f3f3" }}
                        ></path>
                      </svg>
                    </div>
                  </div>
                  <div className="service-head">
                    <h4
                      className="font24"
                      dangerouslySetInnerHTML={{
                        __html: solution.name
                          ? solution.name.replace(" ", " <br /> ")
                          : "Managed <br /> Office",
                      }}
                    />
                  </div>
                </div>

                <div className="service-content">
                  <div className="service-para s-p mb-3">
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          solution.description?.substring(0, 150) + "..." || "",
                      }}
                    />
                  </div>
                  <div className="service-btn mt-2">
                    <Link
                      href={`/${solution.slug || "#"}`}
                      className="textright morebtn font17"
                    >
                      More Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
