"use client";

import React from "react";

export default function LifeAtSpringHouse({ data = {} }) {
  return (
    <div className="managed-office-section ptb60">
      <div className="container-fluid">
        <div className="managed-office-bg">
          <div className="row">
            <div className="bb">
              <img
                src={data.image || "/assets/locationimage/1747049237_about.png"}
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
                    {data.content ? (
                      <div
                        dangerouslySetInnerHTML={{ __html: data.content }}
                        className="content-container mt-3"
                      />
                    ) : (
                      <p>
                        Imagine work, but with better coffee, brighter spaces,
                        and a vibe that makes Mondays bearable. Whether
                        you&apos;re taking a client call in a quiet pod,
                        grabbing lunch in the pantry, or catching a break in our
                        chill-out zones—there&apos;s room for focus, flow, and a
                        little fun.
                      </p>
                    )}
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
