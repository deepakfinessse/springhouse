import React from "react";

export default function SolutionIntro({ description, fourPoints }) {
  if (!description || !fourPoints) return null;

  return (
    <section className="virtual-guru cowork pt30">
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-lg-5 mb-4">
            <h3 className="mb-3">{description[0]}</h3>
            <p>{description.slice(1).join(" ")}</p>
          </div>

          <div className="col-md-7 ps-lg-5 ps-md-5 ps-3 pe-lg-4 pe-md-4 pe-3">
            <div className="row grid">
              {fourPoints.map((point, index) => (
                <div
                  key={index}
                  className={`cell ${
                    index === 0 || index === 3 ? "black" : "grey"
                  }`}
                >
                  <h2>{point}</h2>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
