"use client";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Removed remote ASSET_BASE specifically for static data loads

function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#fff",
        color: "#000",
        borderRadius: "50%",
        width: "30px",
        height: "30px",
        zIndex: 1,
        bottom: "10px",
        left: "calc(50% + 5px)",
        right: "auto",
        top: "auto",
        transform: "none",
        fontSize: "14px",
        boxShadow: "0px 0px 5px rgba(0,0,0,0.3)",
      }}
      onClick={onClick}
    >
      <i className="fa-solid fa-chevron-right"></i>
    </div>
  );
}

function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#fff",
        color: "#000",
        borderRadius: "50%",
        width: "30px",
        height: "30px",
        zIndex: 1,
        bottom: "10px",
        left: "calc(50% - 35px)",
        right: "auto",
        top: "auto",
        transform: "none",
        fontSize: "14px",
        boxShadow: "0px 0px 5px rgba(0,0,0,0.3)",
      }}
      onClick={onClick}
    >
      <i className="fa-solid fa-chevron-left"></i>
    </div>
  );
}

export default function ImageSlider({ images, className, propertyName }) {
  if (!images || images.length === 0) {
    return (
      <div
        className="img-fluid w-100 responsive-slider-container"
        style={{
          background: "#f0f0f0",
          height: "550px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        No images available
      </div>
    );
  }

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className={`${className} position-relative`}>
      <Slider {...settings}>
        {images.map((img, idx) => (
          <div key={idx} className="responsive-slider-container" style={{ height: "550px" }}>
            <img
              src={img}
              alt={propertyName}
              className="img-fluid w-100 responsive-slider-img"
              style={{
                height: "550px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}
