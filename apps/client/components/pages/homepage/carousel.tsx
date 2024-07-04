/* eslint-disable @next/next/no-img-element */
import { MUI } from "@shopifize/ui";
import React from "react";
import Slider, { Settings } from "react-slick";
const Carousel = () => {
  const settings: Settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const salesImages = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpMQ1jRkLw8OAi8vKgv5USAFFdBQvA-ddRsg&s",
    "https://images2.alphacoders.com/128/1289214.jpg",
    "https://sm.ign.com/ign_in/screenshot/default/sumeru-preview-teaser-02-of-rain-and-sand-genshin-impact-0-2_wejv.png",
  ];

  return (
    <MUI.Box
      sx={{
        padding: "30px 0",
      }}
    >
      <MUI.Container>
        <MUI.Grid container spacing={"12px"}>
          <MUI.Grid item xs={8}>
            <Slider {...settings}>
              {salesImages.map((src) => {
                return (
                  <MUI.Box key={src}>
                    <img
                      src={src}
                      alt="sale"
                      style={{
                        width: "100%",
                        height: "235px",
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                    />
                  </MUI.Box>
                );
              })}
            </Slider>
          </MUI.Grid>
          <MUI.Grid item xs={4}>
            <img
              src="https://wallpapercave.com/wp/wp11396530.png"
              alt="sale"
              style={{
                width: "100%",
                height: "235px",
                objectFit: "cover",
                borderRadius: "4px",
              }}
            />
          </MUI.Grid>
        </MUI.Grid>
      </MUI.Container>
    </MUI.Box>
  );
};

export default Carousel;
