"use client";

import { useEffect } from "react";

export default function DesignYourIdealWorkNest({ data = [] }) {
  useEffect(() => {
    let intervalId;
    const initSlider = () => {
      if (
        typeof window !== "undefined" &&
        window.$ &&
        window.$.fn.owlCarousel
      ) {
        if (!window.$(".owl-sec1").hasClass("owl-loaded")) {
          window.$(".owl-sec1").owlCarousel({
            loop: true,
            animateOut: "fadeOut",
            animateIn: "fadeIn",
            margin: 20,
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

        if (!window.$(".ideal-carousel").hasClass("owl-loaded")) {
          window.$(".ideal-carousel").owlCarousel({
            loop: false,
            margin: 30,
            nav: false,
            dots: true,
            autoplay: false,
            autoplayTimeout: 3000,
            responsive: {
              0: { items: 1 },
              576: { items: 2, autoplay: true, dots: true },
              768: { items: 2 },
              992: { items: 3 },
              1200: { items: 4 },
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
    <div className="design-ideal">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-6">
            <span className="section-title-span">
              Design Your Ideal Work Nest
            </span>
          </div>
        </div>
        <div className="row pt30">
          <div className="owl-carousel ideal-carousel owl-theme w-100">
            {data.map((feature, index) => (
              <div className="item" key={index}>
                <div className="design-your-card">
                  <div className="design-image">
                    <img
                      src={
                        feature.image ||
                        "/assets/designyourideals/placeholder.png"
                      }
                      alt={
                        feature.content ||
                        "coworking spaces – SpringHouse coworking office view"
                      }
                    />
                    <div className="shape-bottom">
                      <div className="shape-left-top">
                        <svg
                          viewBox="0 0 11 11"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-11 h-11"
                          style={{
                            width: "1.5rem",
                            height: "1.5rem",
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
                            width: "1.5rem",
                            height: "1.5rem",
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
                  <div className="design-para mt-lg-3 mt-2">
                    <p className="font24 text-center capitalize textblack">
                      {feature.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
