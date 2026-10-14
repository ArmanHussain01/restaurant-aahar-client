import React, { useEffect } from "react";
// import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { topMeal } from "./topMeal";
import Carousel from "./Carousel";

import SlickSliderModule from "react-slick";

const Slider = SlickSliderModule.default;

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2000,
  pauseOnHover: true,
  arrows: false,

  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};


const MultiItemCarousel = () => {


  return (
    <div>
      <Slider {...settings}>
        {topMeal.map((item, index) => (
          <Carousel
            key={index}
            image={item.image}
            title={item.title}
          />
        ))}
      </Slider>
    </div>
  );
};

export default MultiItemCarousel;