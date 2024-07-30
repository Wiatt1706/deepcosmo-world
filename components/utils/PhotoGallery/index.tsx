import React, { useState } from "react";
import styles from "./PhotoGallery.module.css";
import Slider, { Settings } from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface ArrowProps {
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

function SampleNextArrow(props: ArrowProps) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, zIndex: 9999, right: 5, display: "block" }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props: ArrowProps) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, zIndex: 9999, left: 5, display: "block" }}
      onClick={onClick}
    />
  );
}

export interface Photo {
  id: string;
  src: string;
  alt?: string;
  type?: string;
}

interface PhotoSliderProps {
  iframeSrc?: string;
  photos: Photo[];
}

const PhotoSlider: React.FC<PhotoSliderProps> = ({ iframeSrc, photos }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const settings: Settings = {
    className: "w-full h-full",
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    beforeChange: (_oldIndex: number, newIndex: number) => {
      setCurrentSlide(newIndex);
    },
    appendDots: (dots: React.ReactNode) => (
      <div
        style={{
          bottom: "5px",
        }}
      >
        <ul style={{ margin: "0px" }}> {dots} </ul>
      </div>
    ),
    customPaging: (i: number) => (
      <div
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          backgroundColor:
            currentSlide === i ? "#98f576" : "rgba(200,200,200,0.5)", // 设置激活状态和非激活状态的颜色
          display: "inline-block",
        }}
      ></div>
    ),
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <div className={styles["gallery-div"]}>
      <Slider {...settings}>
        {iframeSrc && (
          <iframe className={styles["gallery-iframe"]} src={iframeSrc} />
        )}
        {photos.map((photo) => (
          <img
            src={photo.src}
            alt={photo.alt || ""}
            className={styles["gallery-item"]}
          />
        ))}
      </Slider>
    </div>
  );
};

export default PhotoSlider;
