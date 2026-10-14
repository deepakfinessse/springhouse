import React from "react";
import Link from "next/link";

export default function OtherLocations({ cities = [] }) {
  if (!cities || cities.length === 0) return null;

  return (
    <section className=" pt60">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-6">
            <span className="section-title-span">Other locations</span>
          </div>
        </div>
        <div className="row pt30">
          {cities.map((cityObj) => (
            <div className="col-md-6 col-6" key={cityObj._id || cityObj.slug}>
              <div className="box-loc mb-lg-0 mb-md-0 mb-3">
                <Link href={`/coworking-space/${cityObj.slug}`}>{cityObj.name}</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
