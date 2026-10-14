"use client";

import { useEffect } from "react";
import Link from "next/link";
import "../blogs/blogs.css";

export default function Blogs({ data = [] }) {
  useEffect(() => {
    let intervalId;
    const initSlider = () => {
      if (
        typeof window !== "undefined" &&
        window.$ &&
        window.$.fn.owlCarousel
      ) {
        if (!window.$(".blog-carousel").hasClass("owl-loaded")) {
          window.$(".blog-carousel").owlCarousel({
            loop: true,
            margin: 30,
            nav: false,
            dots: true,
            autoplay: false,
            autoplayTimeout: 4000,
            responsive: {
              0: {
                items: 1,
                autoplay: true,
              },
              768: {
                items: 2,
              },
              992: {
                items: 3,
              },
            },
          });
        }
        clearInterval(intervalId);
      }
    };
    intervalId = setInterval(initSlider, 100);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="blogs">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-6">
            <span className="section-title-span">blogs</span>
          </div>
        </div>
        <div className="owl-carousel blog-carousel owl-theme pt30">
          {data.map((blog, idx) => (
            <div className="item" key={idx}>
              <div className="col-lg-12">
                <Link href={`/blogs/${blog.slug || "#"}`}>
                  <div className="blog-card">
                    <div className="blog-image relative">
                      <img
                        src={blog.imageURL || "/assets/blogs/1748253643_1.png"}
                        alt={blog.title}
                      />
                    </div>
                    <div className="blog-content text-shape relative">
                      <div className="blog-para">
                        <p>{blog.title}</p>
                      </div>
                      <div className="blog-date textright">
                        <span className="font17 textright">
                          {(blog.publishDate || blog.createdAt)
                            ? new Date(blog.publishDate || blog.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )
                            : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
