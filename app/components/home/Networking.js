"use client";

import { useEffect } from "react";

export default function Networking({ data = {} }) {
  useEffect(() => {
    // Initialize Bootstrap tooltips if available
    if (typeof window !== "undefined" && window.bootstrap) {
      const tooltipTriggerList = [].slice.call(
        document.querySelectorAll('[data-bs-toggle="tooltip"]'),
      );
      tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new window.bootstrap.Tooltip(tooltipTriggerEl);
      });
    }
  }, []);

  return (
    <div className="networking ptb60 position-relative pb-lg-5">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-6">
            <span className="section-title-span">Networking</span>
          </div>
        </div>
        <div className="row pt30 d-flex align-items-center justify-content-center">
          <div className="col-lg-4">
            <div className="networking-rightside">
              <div className="networking-para">
                <p 
                  className="font51" 
                  dangerouslySetInnerHTML={{ 
                    __html: data?.content || `&quot;Alone we can do so little; <span>together we can do so much.</span> &quot;` 
                  }} 
                />
              </div>
              <div className="networking-name">
                <p className="textright font24">~ {data?.title || "Helen Keller"}</p>
              </div>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="networking-rightside">
              <div className="networking-image-ss relative">
                <img
                  src={
                    data.image ||
                    "/assets/homenetworking/1747050387_network.png"
                  }
                  className="networking-img"
                  alt="rent a coworking space – SpringHouse coworking office view"
                />

                {/* Tooltip 1 */}
                {data?.tooltips?.[0] && (
                  <div
                    type="button"
                    className="btn btn-secondary tool tooltip"
                    data-bs-toggle="tooltip"
                    data-bs-placement="bottom"
                  >
                    <div className="image-box tooltiptext">
                      <div className="spring">
                        <img
                          className="spring-img"
                          src="/frontend_assets/img/spring1.svg"
                          alt="spring"
                        />
                      </div>
                      <span>{data.tooltips[0]}</span>
                    </div>
                  </div>
                )}

                {/* Tooltip 2 */}
                {data?.tooltips?.[1] && (
                  <div
                    type="button"
                    className="btn btn-secondary tool tooltip1"
                    data-bs-toggle="tooltip"
                    data-bs-placement="bottom"
                  >
                    <div className="image-box tooltiptext">
                      <div className="spring">
                        <img
                          className="spring-img"
                          src="/frontend_assets/img/spring1.svg"
                          alt="spring"
                        />
                      </div>
                      <span>{data.tooltips[1]}</span>
                      <span></span>
                    </div>
                  </div>
                )}

                {/* Tooltip 3 */}
                {data?.tooltips?.[2] && (
                  <div
                    type="button"
                    className="btn btn-secondary tool tooltip2"
                    data-bs-toggle="tooltip"
                    data-bs-placement="bottom"
                  >
                    <div className="image-box tooltiptext">
                      <div className="spring">
                        <img
                          className="spring-img"
                          src="/frontend_assets/img/spring1.svg"
                          alt="spring"
                        />
                      </div>
                      <span>{data.tooltips[2]}</span>
                      <span></span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .tool:hover::before { display: none; }
        .tool:hover::after { display: none; }
        .tooltip .tooltiptext span { text-align: left; font-size: 18px; font-family: 'Montserrat'; }
        .tooltip:hover .tooltiptext { visibility: visible; }
        .image-box { width: 255px; height: 150px; background-color: #ddd; border-radius: 16px; position: relative; }
        
        .tool::after {
            opacity: 0; display: flex; flex-direction: row; justify-content: center; align-items: center;
            position: absolute; top: 0px; left: 0px; right: 0; bottom: 0; content: "";
            height: 100%; width: 100%; border: 1px solid #fff; border-radius: 100%;
            -webkit-animation: ripple 3s infinite cubic-bezier(0.65, 0, 0.34, 1);
            animation: ripple 3s infinite cubic-bezier(0.65, 0, 0.34, 1);
            z-index: -1;
        }
        
        .tool::before {
            opacity: 0; display: flex; flex-direction: row; justify-content: center; align-items: center;
            position: absolute; top: 0px; left: 0px; right: 0; bottom: 0; content: "";
            height: 100%; width: 100%; border: 1px solid #fff; border-radius: 100%;
            -webkit-animation: ripple 3s infinite 0.5s cubic-bezier(0.65, 0, 0.34, 1);
            animation: ripple 3s infinite 0.5s cubic-bezier(0.65, 0, 0.34, 1);
            z-index: -1;
        }

        @-webkit-keyframes ripple {
            from { opacity: 1; transform: scale3d(0.80, 0.80, 1); }
            to { opacity: 0; transform: scale3d(3, 3, 1); }
        }
        @keyframes ripple {
            from { opacity: 1; transform: scale3d(0.80, 0.80, 1); }
            to { opacity: 0; transform: scale3d(3, 3, 1); }
        }

        .tooltip1 .tooltiptext span { text-align: left; font-size: 18px; font-family: 'Montserrat'; }
        .tooltip1:hover .tooltiptext { visibility: visible; }
        
        .tool:hover { color: #fff; background-color: #04aba7; border-color: #04aba7; }
        .tooltip2 .tooltiptext span { text-align: left; font-size: 18px; font-family: 'Montserrat'; }
        .tooltip2:hover .tooltiptext { visibility: visible; }

        .networking-image {
            background-image: url(/frontend_assets/img/networking.png); /* Updated path */
            height: 100vh;
            background-repeat: no-repeat;
            position: relative;
        }
      `,
        }}
      />
    </div>
  );
}
