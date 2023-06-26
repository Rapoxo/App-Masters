import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import { A11y, Autoplay, Navigation, Pagination, Scrollbar } from "swiper";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

const Carousel = ({ games }: { games: Game[] }) => {
  const [isMobile, setMobile] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 640) setMobile(true);

    function handleResize() {
      setMobile(window.innerWidth < 640);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <Swiper
        modules={[Navigation, Autoplay, Pagination, Scrollbar, A11y]}
        spaceBetween={50}
        slidesPerView={isMobile ? 1 : 3} // 1 when on mobile
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        scrollbar={{ draggable: true }}
      >
        {games.map((game, i) => {
          return (
            <SwiperSlide key={i}>
              <a target="_blank" href={game.game_url}>
                <img
                  className="hover:brightness-90  w-full max-h-[40vh] rounded-lg"
                  src={game.thumbnail}
                  alt={game.title}
                />
              </a>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </>
  );
};

export default Carousel;
