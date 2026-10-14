import ImageSlider from "./ImageSlider";
import "./property.css";

export default function PropertyHero({ property }) {
  if (!property) return null;

  return (
    <div className="loctions pt-4">
      <div className="container-fluid">
        <div className="row ">
          <div className="col-lg-12 mb-4 position-relative">
            <ImageSlider
              images={property.images}
              className="image-slider"
              propertyName={property.name}
            />
            <span
              className="property-hero-overlay"
              style={{
                position: "absolute",
                bottom: "0",
                left: "0",
                zIndex: 10,
              }}
            >
              <div className="shape-bottom">
                <div className="shape-left-top-gs">
                  <svg
                    viewBox="0 0 11 11"
                    fill="none"
                    className="w-11 h-11"
                    style={{
                      width: "1.0rem",
                      height: "1.0rem",
                      stroke: "none",
                    }}
                  >
                    <path
                      d="M11 1.54972e-06L0 0L2.38419e-07 11C1.65973e-07 4.92487 4.92487 1.62217e-06 11 1.54972e-06Z"
                      fill="#fff"
                    />
                  </svg>
                </div>
                <div className="shape-right-bottom-property">
                  <svg
                    viewBox="0 0 11 11"
                    fill="none"
                    className="w-11 h-11"
                    style={{
                      width: "1.8rem",
                      height: "1.8rem",
                      stroke: "none",
                    }}
                  >
                    <path
                      d="M11 1.54972e-06L0 0L2.38419e-07 11C1.65973e-07 4.92487 4.92487 1.62217e-06 11 1.54972e-06Z"
                      fill="#fff"
                    />
                  </svg>
                </div>
              </div>
              <div
                className="location-content"
                style={{
                  background: "#fff",
                  color: "#000",
                  padding: "15px 25px 5px 15px",
                  borderTopRightRadius: "20px",
                  position: "relative",
                  zIndex: 20,
                  display: "block"
                }}
              >
                <span
                  className="section-span d-block"
                  style={{
                    fontSize: "14px",
                    color: "#333",
                    marginBottom: "4px",
                  }}
                >
                  {property.propertyCode}
                </span>
                <h4
                  className="section-title text-uppercase m-0"
                  style={{ fontSize: "26px", fontWeight: "900", color: "#000" }}
                >
                  {property.area?.name || property.location?.name}
                </h4>
              </div>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
