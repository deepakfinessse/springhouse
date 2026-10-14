import React from "react";

export default function AboutHero({ data = {} }) {
  const { heading, mainBanner } = data;

  // Function to process headings containing \n safely
  const renderHeading = (text, defaultValues) => {
    if (!text) return defaultValues;
    return text.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index !== text.split("\n").length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className="loctions specific-location about">
      <div className="container-fluid">
        <div className="row pt30">
          <div className="col-lg-12 mb-4">
            <div className="locationscard relative">
              <div className="locations-image about">
                <img
                  src={mainBanner || "/assets/aboutus/banner/1750683580_Hero Banner 2.png"}
                  alt="coworking spaces - SpringHouse coworking office view"
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
                        stroke: "#ffffff",
                      }}
                    >
                      <path
                        d="M11 1.54972e-06L0 0L2.38419e-07 11C1.65973e-07 4.92487 4.92487 1.62217e-06 11 1.54972e-06Z"
                        fill="#fff"
                      />
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
                        stroke: "#ffffff",
                      }}
                    >
                      <path
                        d="M11 1.54972e-06L0 0L2.38419e-07 11C1.65973e-07 4.92487 4.92487 1.62217e-06 11 1.54972e-06Z"
                        fill="#0e0f11"
                        style={{ fill: "#ffffff" }}
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="location-content about">
                <h1 className="section-title">
                  {renderHeading(heading)}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
