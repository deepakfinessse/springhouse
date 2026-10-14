"use client";

import React from "react";

export default function SpacesAvailable({ spaces }) {
  if (!spaces || spaces.length === 0) return null;

  // Display spaces in pairs (2-column alternating layout)
  const pairs = [];
  for (let i = 0; i < spaces.length; i += 2) {
    pairs.push(spaces.slice(i, i + 2));
  }

  return (
    <div className="loctions manage-space pt-5 pb30">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12 mb-4">
            <span className="section-title-span mb-3">
              Spaces available in
            </span>
          </div>
        </div>

        {pairs.map((pair, pairIndex) => (
          <React.Fragment key={pairIndex}>
            {/* First item in pair: image left, text right */}
            {pair[0] && (
              <div className="row gx-0 align-items-top justify-content-center">
                <div className="col-lg-6">
                  <div className="mimg fit-img fit-img1">
                    <div className="shaps1 top1">
                      <div className="shap-right-top">
                        <svg
                          viewBox="0 0 11 11"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-11 h-11"
                        >
                          <path
                            d="M11 1.54972e-06L0 0L2.38419e-07 11C1.65973e-07 4.92487 4.92487 1.62217e-06 11 1.54972e-06Z"
                            fill="#fff"
                          />
                        </svg>
                      </div>
                      <div className="shap-left-bottom">
                        <svg
                          viewBox="0 0 11 11"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-11 h-11"
                        >
                          <path
                            d="M11 1.54972e-06L0 0L2.38419e-07 11C1.65973e-07 4.92487 4.92487 1.62217e-06 11 1.54972e-06Z"
                            fill="#0e0f11"
                            style={{ fill: "#ffffff" }}
                          />
                        </svg>
                      </div>
                    </div>
                    {pair[0].image && (
                      <img
                        src={pair[0].image}
                        alt={pair[0].name || "Space"}
                      />
                    )}
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="text-heading text-center pt-lg-5 pt-md-5 pt-2">
                    <h2>{pair[0].name}</h2>
                  </div>
                </div>
              </div>
            )}

            {/* Second item in pair: text left, image right */}
            {pair[1] && (
              <div className="row gx-0 mt-n-4 align-items-end justify-content-center">
                <div className="col-lg-6 order-2 order-lg-1 order-md-1">
                  <div className="text-heading text-center pt-lg-0 pt-md-0 pt-2 pb-lg-5 pb-md-5 pb-0 manage-content">
                    <h2>{pair[1].name}</h2>
                  </div>
                </div>
                <div className="col-lg-6 order-1 order-lg-2 order-md-2">
                  <div className="mimg fit-img mimg1">
                    <div className="shaps top">
                      <div className="shap-right-top">
                        <svg
                          viewBox="0 0 11 11"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-11 h-11"
                        >
                          <path
                            d="M11 1.54972e-06L0 0L2.38419e-07 11C1.65973e-07 4.92487 4.92487 1.62217e-06 11 1.54972e-06Z"
                            fill="#fff"
                          />
                        </svg>
                      </div>
                      <div className="shap-left-bottom">
                        <svg
                          viewBox="0 0 11 11"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-11 h-11"
                        >
                          <path
                            d="M11 1.54972e-06L0 0L2.38419e-07 11C1.65973e-07 4.92487 4.92487 1.62217e-06 11 1.54972e-06Z"
                            fill="#fff"
                          />
                        </svg>
                      </div>
                    </div>
                    {pair[1].image && (
                      <img
                        src={pair[1].image}
                        alt={pair[1].name || "Space"}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
