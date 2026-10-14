import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function WorkspaceSolutions() {
  return (
    <div className="service-section">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="service-card relative">
              <div className="service-img">
                <img src="/assets/officedetails/1747049596_j1.png" alt="" />
              </div>
              <div className="service-content">
                <div className="service-head">
                  <h4 className="font24">
                    Managed
                    <br />
                    Offices
                  </h4>
                </div>
                <div className="service-para s-p mb-3">
                  <p>
                    Custom-built workspaces ready for rapid deployment without
                    upfront capital.
                  </p>
                </div>
                <div className="service-btn mt-2">
                  <Link
                    href="/managed-offices"
                    className="textright morebtn font17"
                  >
                    More Details
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 mb-4">
            <div className="service-card relative">
              <div className="service-img">
                <img src="/assets/officedetails/1747049618_j2.png" alt="" />
              </div>
              <div className="service-content">
                <div className="service-head">
                  <h4 className="font24">
                    Coworking
                    <br />
                    Spaces
                  </h4>
                </div>
                <div className="service-para s-p mb-3">
                  <p>
                    Flexible desks and private cabins customized for startups
                    and freelancers.
                  </p>
                </div>
                <div className="service-btn mt-2">
                  <Link href="/coworking" className="textright morebtn font17">
                    More Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
