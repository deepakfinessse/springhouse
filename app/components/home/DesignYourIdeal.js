"use client";

import { useEffect } from "react";

export default function DesignYourIdeal() {
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
    <>
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
              <div className="item">
                <div className="design-your-card">
                  <div className="design-image">
                    <img
                      src="/assets/designyourideals/1750405855_Open Word Desks.png"
                      alt="coworking spaces – SpringHouse coworking office view"
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
                      Open Works Desks
                    </p>
                  </div>
                </div>
              </div>

              <div className="item">
                <div className="design-your-card">
                  <div className="design-image">
                    <img
                      src="/assets/designyourideals/1750405846_Private Focus Pods.png"
                      alt="coworking spaces – SpringHouse coworking office view"
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
                      Private Focus Pods
                    </p>
                  </div>
                </div>
              </div>

              <div className="item">
                <div className="design-your-card">
                  <div className="design-image">
                    <img
                      src="/assets/designyourideals/1750405766_Client Lounge.png"
                      alt="coworking spaces – SpringHouse coworking office view"
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
                      Client Lounge & Reception
                    </p>
                  </div>
                </div>
              </div>

              <div className="item">
                <div className="design-your-card">
                  <div className="design-image">
                    <img
                      src="/assets/designyourideals/1750405864_Leisure Zones.png"
                      alt="coworking spaces – SpringHouse coworking office view"
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
                      Leisure Zones
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="managed-office-section ptb60">
        <div className="container-fluid">
          <div className="managed-office-bg">
            <div className="row">
              <div className="bb">
                <img
                  src="/assets/locationimage/1747049237_about.png"
                  alt="rent a coworking space – SpringHouse coworking office view"
                />
              </div>
              <div className="col-lg-6">
                <div className="managed-para relative">
                  <div className="svg-container">
                    <svg
                      className="svg-box"
                      width="580"
                      height="450"
                      viewBox="0 0 615 491"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20 0H595C607.15 0 617 9.85 617 22V397C617 409.15 607.15 419 595 419H430C421.716 419 415 425.716 415 434V471C415 482.046 406.046 491 395 491H22C9.85 491 0 481.15 0 469V22C0 9.85 9.85 0 22 0H20Z"
                        fill="#ffffffc4"
                      ></path>
                    </svg>

                    <div className="svg-text">
                      <h3 className="section-title">Life at Spring House</h3>
                      <p>
                        Imagine work, but with better coffee, brighter spaces,
                        and a vibe that makes Mondays bearable. Whether
                        you&apos;re taking a client call in a quiet pod,
                        grabbing lunch in the pantry, or catching a break in our
                        chill-out zones—there&apos;s room for focus, flow, and a
                        little fun.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
