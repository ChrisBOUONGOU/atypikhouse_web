import React from "react";
import { Carousel } from "react-bootstrap";
import styles from "../../styles/widgets/AhCaroussel.module.css";
import Image from "next/image";

export default function AhCaroussel({ images }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <div>
      <Carousel>
        {images.map((image, index) => {
          return (
            <Carousel.Item key={index} interval={100000}>
              <div className={`${styles.imageWrapper}`}>
                <Image
                  src={image.url}
                  alt={image.alt}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            </Carousel.Item>
          );
        })}
      </Carousel>
    </div>
  );
}
