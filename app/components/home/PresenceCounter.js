"use client";

import { useEffect } from "react";

export default function PresenceCounter({ data = [] }) {
  useEffect(() => {
    const counters = document.querySelectorAll(".counter");

    const startCounting = (el) => {
      const targetStr =
        el.getAttribute("data-target") || el.innerText || el.textContent;
      const targetNum = parseInt(targetStr.replace(/[^0-9]/g, "")) || 0;
      let count = 0;
      const duration = 2000; // 2 seconds
      const increment = targetNum / (duration / 16); // 60fps

      const updateCount = () => {
        count += increment;
        if (count < targetNum) {
          el.innerText = Math.ceil(count);
          requestAnimationFrame(updateCount);
        } else {
          el.innerText = targetNum;
        }
      };

      updateCount();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!entry.target.classList.contains("counter-loaded")) {
              entry.target.classList.add("counter-loaded");
              startCounting(entry.target);
            }
          }
        });
      },
      { threshold: 0.5 },
    );

    counters.forEach((counter) => {
      observer.observe(counter);
    });

    return () => {
      counters.forEach((counter) => observer.unobserve(counter));
    };
  }, [data]);

  if (!data || data.length === 0) return null;

  return (
    <div className="presence ptb60 pt-lg-5 pt-md-5">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-6">
            <span className="section-title-span">presence</span>
          </div>
        </div>
        <div className="row pt30">
          {data.map((item, idx) => {
            // Check if title is Members and number is like 4, then we append K
            // Actually, best to just render a hardcoded plus or use afterNumber if present
            const isK =
              item.title?.toLowerCase() === "members" &&
              String(item.number) === "4";
            const isSquareFeet =
              item.title?.toLowerCase().includes("square feet") &&
              String(item.number) === "328";

            return (
              <div key={idx} className="col-lg-3 col-md-3 col-6">
                <div className="counter-box">
                  <div className="counter-number">
                    {item.beforeNumber && (
                      <span className="plus font46">{item.beforeNumber}</span>
                    )}
                    <span className="counter font46" data-target={item.number}>
                      {item.number}
                    </span>
                    {item.afterNumber ? (
                      <span className="plus font46">{item.afterNumber}</span>
                    ) : (
                      <span className="plus font46">
                        {isK ? "K+" : isSquareFeet ? "K+" : "+"}
                      </span>
                    )}
                  </div>
                  <p className="font20">{item.title}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
