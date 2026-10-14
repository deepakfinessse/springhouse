"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function OtherSolutions() {
  const pathname = usePathname();

  const solutions = [
    { name: "managed office", slug: "managed-office" },
    { name: "coworking", slug: "coworking" },
    { name: "virtual office", slug: "virtual-office" },
    { name: "day pass", slug: "day-pass" },
    { name: "meeting rooms", slug: "meeting-room" },
    { name: "event spaces", slug: "event-space" },
  ];

  return (
    <section className="specfic-guru">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-6 col-12">
            <span className="section-title-span">other solutions</span>
          </div>
        </div>

        <div className="row">
          {solutions.map((item, index) => {
            const isActive = pathname === `/${item.slug}`;

            return (
              <div key={index} className="col-md-2 col-6 mt-lg-4 mt-md-4 mt-3">
                <div className="other-solution">
                  <Link
                    href={`/${item.slug}`}
                    className={isActive ? "active" : ""}
                  >
                    {item.name}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
