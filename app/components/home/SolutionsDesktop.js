import Link from "next/link";

export default function SolutionsDesktop({ data = [] }) {
  if (!data || data.length === 0) return null;
  return (
    <div className="service-section d-lg-block d-none d-md-block">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12 pb-4 pt-4 ">
            <span className="section-title-span" style={{ paddingLeft: 0 }}>
              Solutions
            </span>
          </div>
        </div>
        <div className="row">
          {data.map((solution, idx) => (
            <div className="col-lg-4 co-md-6 col-sm-6 mb-4" key={idx}>
              <div className="service-card relative">
                <div className="service-img">
                  <img
                    src={
                      solution.image ||
                      "/assets/bannerimage/1747035219_home-banner.jpg"
                    }
                    alt={`${solution.name} – SpringHouse coworking office view`}
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
                          height: "1.4rem",
                          stroke: "#f5f3f3",
                        }}
                      >
                        <path
                          d="M11 1.54972e-06L0 0L2.38419e-07 11C1.65973e-07 4.92487 4.92487 1.62217e-06 11 1.54972e-06Z"
                          fill="#f5f3f3"
                        ></path>
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
                          stroke: "#f5f3f3",
                        }}
                      >
                        <path
                          d="M11 1.54972e-06L0 0L2.38419e-07 11C1.65973e-07 4.92487 4.92487 1.62217e-06 11 1.54972e-06Z"
                          fill="#0e0f11"
                          style={{ fill: "#f5f3f3" }}
                        ></path>
                      </svg>
                    </div>
                  </div>
                  <div className="service-head">
                    <h4
                      className="font24"
                      dangerouslySetInnerHTML={{
                        __html: solution.name
                          ? solution.name.replace(" ", " <br /> ")
                          : "Managed <br /> Office",
                      }}
                    />
                  </div>
                </div>

                <div className="service-content">
                  <div className="service-para s-p mb-3">
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          solution.description?.substring(0, 150) + "..." || "",
                      }}
                    />
                  </div>
                  <div className="service-btn mt-2">
                    <Link
                      href={`/${solution.slug || "#"}`}
                      className="textright morebtn font17"
                    >
                      More Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .service-img .shape-bottom {
            position: absolute;
            bottom: 0;
            left: 0;
            background: #f5f3f3;
            width: 148px;
            height: 85px;
            border-radius: 0 20px 0 0;
        }
        .service-para { margin-top: -30px; }
        .s-p { margin-top: 0px; }
        .service-card { position: relative; overflow: hidden; border-radius: 10px; }
      `,
        }}
      />
    </div>
  );
}
