"use client";

import React from "react";

export default function FullHouse({ images }) {
  if (!images || images.length === 0) return null;

  return (
    <section className="flex-sec ptb60">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12 mb-4">
            <span className="section-title-span mb-3">Full House</span>
          </div>
        </div>
        <div className="row">
          <div className="d-flex">
            {images.map((entry, index) => {
              // Support both old string format and new object format
              const isString = typeof entry === "string";
              const bgImage = isString ? entry : entry.backgroundImage;
              const logo = isString ? null : entry.logo;
              const link = isString ? bgImage : entry.link;

              const imgSrc = bgImage?.startsWith("http")
                ? bgImage
                : `/${bgImage?.replace(/^\//, "") || ""}`;

              const logoSrc = logo
                ? logo.startsWith("http")
                  ? logo
                  : `/${logo.replace(/^\//, "")}`
                : null;

              const content = (
                <>
                  <img
                    src={imgSrc}
                    className="img-grow"
                    alt={`Full House ${index + 1}`}
                  />
                  {logoSrc && (
                    <div className="img-box">
                      <img src={logoSrc} alt={`Logo ${index + 1}`} />
                    </div>
                  )}
                </>
              );

              return (
                <div className="inner-box" key={index}>
                  {link ? (
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cc-f"
                    >
                      {content}
                    </a>
                  ) : (
                    <div className="cc-f">{content}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
