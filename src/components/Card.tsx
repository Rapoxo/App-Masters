import React, { useEffect, useRef, useState } from "react";

import PlatformIcon from "./PlatformIcon";
import GenreIcon from "./GenreIcon";

const Card = ({
  id,
  thumbnail,
  title,
  genre,
  short_description,
  platform,
  game_url,
  developer,
  release_date,
}: Game) => {
  const [loading, setLoading] = useState(true);
  const [hover, setHover] = useState(false);
  const [open, setOpen] = useState(false);

  const liRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (liRef.current && !liRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [liRef]);

  const ratingHandler = (rating: number) => {
    console.log(`${rating} stars`)
  }

  return (
    <li
      ref={liRef}
      id={`${id}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => setOpen(!open)}
      className="flex flex-col justify-between   rounded-t-lg rounded-b-lg h-full "
    >
      <div className="flex flex-col relative h-full">
        <img
          className={`w-full rounded-t-lg relative
          transition duration-100 ease-in ${loading ? "hidden" : ""}
          `}
          onLoad={(e) => {
            setLoading(false);
          }}
          src={thumbnail}
          alt={title}
        />

        <div className="backdrop backdrop-blur-md absolute bottom-0 z-10 bg-blue-950/80 w-full flex flex-col  min-h-1/2 px-4 py-2 ">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold m-0">
              {title} •{" "}
              <span className="text-sm text-indigo-300">{developer}</span>
            </h3>
            <div className="flex gap-1 text-indigo-20">
              <GenreIcon genre={genre} />
              <div className="flex">
                {platform.split(", ").map((plat) => {
                  return (
                    <PlatformIcon
                      platform={plat as Platform}
                      key={`${id}-${plat}`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
          <div className={`${!open && !hover && "hidden"} text mb-1`}>
            <p>{short_description}</p>
            <span>Lançamento: {release_date}</span>
          </div>
        </div>
      </div>
      <a
        className="flex justify-center font-bold items-center p-4 bg-gradient-to-t bg-indigo-700 hover:bg-indigo-600 text-xl no-underline rounded-b-lg transition-all duration-200 ease-in-out "
        href={game_url}
        target="_blank"
      >
        Jogar
      </a>
    </li>
  );
};

export default Card;
