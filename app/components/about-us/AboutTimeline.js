"use client";

import React, { useState } from "react";

export default function AboutTimeline({ data = [] }) {
  const [activeSlide, setActiveSlide] = useState(0);

  // Fallback to static data if no CMS data exists
  const timelineData = data?.length > 0 ? data : [
    {
      year: "2015",
      content: "Spring House Coworking was founded, launching its first 60-seater coworking space in Gurugram. The first centre came to life inside a 5,000 sq. ft. villa — built out with refurbished materials, second-hand furniture, and a lot of late nights! There was no blueprint, just a big idea and a team willing to figure things out as they went.",
    },
    {
      year: "2017-19",
      content: "We moved into our first corporate-style space at Well Done Tech Park — 5,300+ sq. ft. with 110+ workstations, proper meeting rooms, actual desks, and a coffee machine that never rested. P.S. We were brewing 350+ cups a day. Mostly strong. By April 2019, Spring House had 2,00,000 sq. ft. of workspace across NCR. In August, we launched our 30,000 sq. ft. flagship at Grand Mall, MG Road — a 500+ seater buzzing with freelancers, startups, teams… and a few dogs.That’s when it really started to feel big.",
    },
    {
      year: "2020",
      content: "A black swan year for the world. The COVID outbreak and lockdowns hit hard — vacancy notices came in, membership dipped, and revenues fell by 50%. But we got to work:- Strengthening our backend processes and building operational infrastructure from the ground. - Keeping the team close, motivated, and better skilled for whatever was coming next Tough year. Big lessons.",
    },
    {
      year: "2021-23",
      content: "We hit reset. Focused on sustainable growth and made a quiet commitment to open one centre every quarter. Each space designed with more intention, less noise. In 2023, we grew faster than we expected — a 161.16% jump in revenue and a 125.27% rise in profit over the previous year. Still the same team spirit. Just a little more spreadsheet-savvy.",
    },
    {
      year: "2024",
      content: "Closed the financial year ending March 31, 2024, with ₹53.6 crore in annual revenue. That’s 70% YoY growth — driven by stronger demand, sharper operations, and (finally) a smooth internal SOP system.",
    },
    {
      year: "2025",
      content: "We’re on track to hit ₹100 crore ARR by August. Our total footprint across Delhi NCR is set to cross 1 million sq. ft., and we’re now serving over 15,000 cups of coffee every day!",
    },
    {
      year: "2026",
      content: "We step into 2026 with gratitude and clarity. This year is about intentional growth - depth over speed, people over numbers. Our focus is to strengthen our spaces and the community that defines and drives Spring House toward success.",
    }
  ];

  return (
    <div className="get-touch get-touch-about pt-lg-5 pt-md-5 pt-2 pb-5">
      <div className="container-fluid">
        <div className="row d-flex align-items-center justify-content-center">
          <div className="col-lg-12 mt-3 mt-lg-0 mt-md-0">
            <div className="timeline-p">
              <div className="timeline-wrapper">
                <div className="timeline-nav" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "10px" }}>
                  {timelineData.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveSlide(index)}
                      className={activeSlide === index ? "active" : ""}
                    >
                      {item.year}
                    </button>
                  ))}
                </div>
                <div className="timeline-content">
                  <div className="timeline-content">
                    {timelineData.map((item, index) => (
                      activeSlide === index && (
                        <div className="timeline-slide" key={index}>
                          <h2>{item.year}</h2>
                          <p>{item.content}</p>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
