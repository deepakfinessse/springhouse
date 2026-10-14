"use client";

import { useEffect, useRef } from "react";

export default function Testimonials({ data = [] }) {
  const sliderRef = useRef(null);

  useEffect(() => {
    let intervalId;
    const initSlider = () => {
      if (typeof window !== "undefined" && window.$ && window.$.fn.slick) {
        const $slider = window.$(".testimonial-slider-init");

        if (!$slider.hasClass("slick-initialized")) {
          $slider.slick({
            arrows: true,
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            adaptiveHeight: true,
            prevArrow: "<i class='fa fa-chevron-left'></i>",
            nextArrow: "<i class='fa fa-chevron-right'></i>",
          });
        }
        clearInterval(intervalId);
      }
    };
    intervalId = setInterval(initSlider, 100);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="testimonials ptb60">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-6">
            <span className="section-title-span">testimonials</span>
          </div>
        </div>
        <div className="testimonial-slider-init pt30">
          {data && data.length > 0 ? (
            data.map((testimonial) => (
              <div key={testimonial._id}>
                <div className="testimonial-card">
                  <div className="row d-flex align-items-center justify-content-center">
                    <div className="col-lg-3">
                      <div className="testimonial-img relative">
                        <div className="testimonial-client-img">
                          <img
                            src={
                              testimonial.featuredImage ||
                              "/frontend_assets/img/placeholder.png"
                            }
                            alt={testimonial.clientName}
                          />
                        </div>
                        <div className="testimonial-spring absolute">
                          <img
                            src="/frontend_assets/img/spring.png"
                            alt="SpringHouse"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-9">
                      <div className="testimonial-content relative">
                        <div className="testimonial-quote absolute">
                          <img
                            src="/frontend_assets/img/quote.png"
                            alt="Quote"
                          />
                        </div>
                        <div className="testimonial-para pe-lg-5 pe-0">
                          <div className="font32">
                            <p
                              dangerouslySetInnerHTML={{
                                __html: testimonial.review,
                              }}
                            ></p>
                          </div>
                        </div>
                        <div className="testimonial-name">
                          <p className="font19 textright">
                            ~ {testimonial.clientName} <br />
                            {testimonial.companyName}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div>
              <div className="testimonial-card">
                <div className="row d-flex align-items-center justify-content-center">
                  <div className="col-lg-12 text-center">
                    <p>No testimonials available at this time.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .testimonials .fa.fa-chevron-right {
            font-size: 26px;
            color: #6c6c6c;
            position: absolute;
            right: 30px;
            top: 50%;
            cursor: pointer;
            z-index: 9;
            transform: translateY(-50%);
        }
        .testimonials .fa.fa-chevron-left {
            font-size: 26px;
            color: #fff;
            position: absolute;
            z-index: 9;
            left: 30px;
            top: 50%;
            cursor: pointer;
            transform: translateY(-50%);
        }
        .testimonials .slick-dots li {
            position: relative;
            display: inline-block;
            margin: 0 4px;
            padding: 0;
            cursor: pointer;
            background: #000000;
            border-radius: 50px;
            width: 8px;
            height: 8px;
        }
        .testimonials .slick-dots .slick-active {
            background: transparent;
            border: 1px solid #161616;
            width: 8px;
            height: 8px;
        }
        .testimonials .slick-dots {
            display: flex;
            justify-content: center;
            list-style: none;
            padding-top: 20px;
        }
        .testimonials .slick-dots button {
            display: none;
        }
      `,
        }}
      />
    </div>
  );
}
