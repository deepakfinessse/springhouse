import React from "react";

export default function AboutWhyUs({ data = [] }) {
  const whyUsData = data?.length > 0 ? data : [
      "A Space for Every Professional – Whether you're a freelancer, startup, or enterprise, our tailored workspace solutions—from hot desks to private offices—cater to all.",
      "Prime Locations, Maximum Convenience – Situated in city centers and business districts, our workspaces keep you close to clients, partners, and opportunities.",
      "Collaboration at the Core – We foster a thriving community where networking isn’t forced—it happens naturally in an environment built for synergy.",
      "Flexible Workspaces, Scalable Solutions – Choose from dedicated desks, private cabins, and virtual offices, designed to grow with your ambitions.",
  ];

  return (
    <section className="why-us ptb30">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-6">
            <span className="section-title-span">Why Us</span>
          </div>
        </div>
        <div className="row pe-3 ps-lg-3 ps-md-3 ps-0">
          {whyUsData.map((text, index) => (
            <div className="col-md-3" key={index}>
              <div className="get-image-bottom4 mt20 relative">
                <div className="get-image">
                  <svg
                    width="99%"
                    height="46vh"
                    viewBox="0 0 272 290"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M10 0
                      H262
                      Q272 0 272 10
                      V280
                      Q272 290 262 290
                      H61
                      Q51 290 51 280
                      V260
                      Q51 250 41 250
                      H10
                      Q0 250 0 240
                      V10
                      Q0 0 10 0
                      Z"
                      fill="none"
                      stroke="#A0A0A0"
                      strokeWidth={1}
                    />
                  </svg>
                  <div className="p-4 para-p">
                    <p>{text}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
