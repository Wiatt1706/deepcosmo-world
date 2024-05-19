import React, {  useState } from "react";
import styles from "./PhotoGallery.module.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, zIndex: 9999, right: 5, display: "block" }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, zIndex: 9999, left: 5, display: "block" }}
      onClick={onClick}
    />
  );
}

const PhotoSlider = ({ photos }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const settings = {
    className: "",
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    beforeChange: (oldIndex, newIndex) => {
      setCurrentSlide(newIndex);
    },
    appendDots: dots => (
      <div
        style={{
          bottom: "5px"
        }}
      >
        <ul style={{ margin: "0px" }}> {dots} </ul>
      </div>
    ),
    customPaging: (i) => (
      <div
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          backgroundColor: currentSlide === i ? "#98f576" : "rgba(100,100,100,0.5)", // 设置激活状态和非激活状态的颜色
          display: "inline-block",
        }}
      ></div>
    ),
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />
  };

  return (
    <div className={styles["gallery-div"]}>
      <Slider {...settings}>
        {photos.map((photo) => (
          <div key={photo.id}>
            <img
              key={photo.id}
              src={photo.url}
              alt={photo.alt || ""}
              className={styles["gallery-photo"]}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default PhotoSlider;
