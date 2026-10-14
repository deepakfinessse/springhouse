import React from "react";

const DUMMY_WHO_WE_ARE_DATA = [
  {
    title: "Mission",
    description:
      "To build a workspace ecosystem where ambition meets opportunity, making it easier for entrepreneurs, freelancers, and businesses to grow.",
    frontImg: "/assets/aboutus/banner/1748348734_Mission 2.png",
    backImg: "/assets/aboutus/banner/1748348734_m1-1 (1).png",
    isReverse: false,
  },
  {
    title: "Vision",
    description:
      "We envision a future where work isn’t confined to cubicles but fueled by connections, creativity, and convenience.",
    frontImg: "/assets/aboutus/banner/1748348943_Values 2.png",
    backImg: "/assets/aboutus/banner/1748348943_vv1-1.png",
    isReverse: false,
  },
  {
    title: "Culture",
    description:
      "We’re a hub of thinkers and innovators who believe that success thrives in a space where you can be yourself.",
    frontImg: "/assets/aboutus/banner/1748348961_Culture 2.png",
    backImg: "/assets/aboutus/banner/1748348961_c1-1.png",
    isReverse: true, // Swaps order classes
  },
  {
    title: "Values",
    description:
      "We champion innovation, flexibility, and a growth-first mindset—shaping workspaces that adapt, inspire, and empower.",
    frontImg: "/assets/aboutus/banner/1748348981_Vision 2.png",
    backImg: "/assets/aboutus/banner/1748348981_v1-2.png",
    isReverse: true,
  },
];

export default function AboutWhoWeAre({ data = [] }) {
  const whoWeAreData = data?.length > 0 ? data : DUMMY_WHO_WE_ARE_DATA;

  return (
    <section className="hover-sec ptb30 pt-5">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-6">
            <span className="section-title-span">WHO ARE WE</span>
          </div>
        </div>
        <div className="row">
          {whoWeAreData.map((item, index) => {
            const isReverse = item.isReverse || index >= 2;
            return (
            <div
              className={`col-md-6 ${
                isReverse ? "mb-lg-0 mb-md-0 mb-5" : "mb-lg-4 mb-md-4 mb-5"
              }`}
              key={item._id || index}
            >
              <div className="row hover-s align-items-center">
                {/* Text Block - Render first if isReverse */}
                <div
                  className={`col-md-6 col-8 ${
                    isReverse
                      ? "order-1 order-lg-1 order-md-1"
                      : "order-2 order-lg-2 order-md-2"
                  }`}
                >
                  <div className="get-image-bottom4 mt20 relative">
                    <div className="get-image">
                      <svg
                        width="99%"
                        height="46vh"
                        viewBox="0 0 272 290"
                        xmlns="http://www.w3.org/2000/svg"
                        preserveAspectRatio="none"
                      >
                        {isReverse ? (
                          <path
                            d="M10 0 H210 Q220 0 220 10 V30 Q220 40 230 40 H262 Q272 40 272 50 V280 Q272 290 262 290 H10 Q0 290 0 280 V10 Q0 0 10 0 Z"
                            fill="none"
                            stroke="#A0A0A0"
                            strokeWidth={1}
                          />
                        ) : (
                          <path
                            d="M10 0 H262 Q272 0 272 10 V280 Q272 290 262 290 H61 Q51 290 51 280 V260 Q51 250 41 250 H10 Q0 250 0 240 V10 Q0 0 10 0 Z"
                            fill="none"
                            stroke="#A0A0A0"
                            strokeWidth={1}
                          />
                        )}
                      </svg>
                      <div className="p-2 p-lg-4 p-md-4 para-p">
                        <p className="mb-0">{item.title}:</p>
                        <p>{item.description}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Image Block */}
                <div
                  className={`col-md-6 col-4 ${
                    isReverse
                      ? "order-2 order-lg-2 order-md-2"
                      : "order-1 order-lg-1 order-md-1"
                  }`}
                >
                  <div className="image-container relative">
                    <img
                      src={item.frontImg}
                      className="image image-front"
                      alt={item.title || "Who we are front image"}
                    />
                    <img
                      src={item.backImg}
                      className="image image-back"
                      alt={item.title || "Who we are back image"}
                    />
                  </div>
                </div>
              </div>
            </div>
          )})}
        </div>
      </div>
    </section>
  );
}
